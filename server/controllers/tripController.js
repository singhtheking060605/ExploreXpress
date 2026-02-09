const Trip = require("../models/Trip");
const axios = require("axios");
const crypto = require("crypto");

// Helper to generate hash
const generateSearchHash = (destination, days, budget, travelStyle) => {
    // Normalize inputs to ensure consistent hashing
    const normDest = destination.toLowerCase().trim();
    const normDays = days.toString();
    const normBudget = budget.toString(); // Or budget tier if implemented
    const normStyle = travelStyle ? travelStyle.toLowerCase().trim() : "leisure";

    const data = `${normDest}|${normDays}|${normBudget}|${normStyle}`;
    return crypto.createHash("md5").update(data).digest("hex");
};

// @desc    Generate or Retrieve Trip Plan
// @route   POST /api/trips
// @access  Public (or Private if using auth)
const createTripPlan = async (req, res) => {
    try {
        const { destination, origin, days, budget, travelers, travel_style, user_id, forceRefresh } = req.body;

        if (!destination || !origin || !days || !budget) {
            return res.status(400).json({ error: "Missing required fields: destination, origin, days, budget" });
        }

        // 1. Generate Hash
        // Include travelers in hash to distinguish differently sized groups
        const searchHash = generateSearchHash(destination + origin + (travelers || 1), days, budget, travel_style);

        // 2. Check Cache (if not forced refresh)
        if (!forceRefresh) {
            // Find a trip with this hash created in the last 24 hours
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const cachedTrip = await Trip.findOne({
                searchHash: searchHash,
                createdAt: { $gt: twentyFourHoursAgo }
            }).sort({ createdAt: -1 }); // Get the latest one

            if (cachedTrip) {
                console.log(`[CACHE HIT] Retrieving trip for ${destination} from ${origin} (${days} days)`);
                // Return cached data
                return res.json({
                    ...cachedTrip.tripData,
                    source: "cache",
                    _id: cachedTrip._id
                });
            }
        }

        console.log(`[CACHE MISS] Calling AI Engine for ${destination} from ${origin} (${days} days, ${travelers} travelers)...`);

        // 3. Call AI Engine
        const aiPayload = {
            destination,
            origin,
            days: days.toString(),
            budget: budget.toString(),
            travelers: (travelers || 1).toString(),
            travel_style: travel_style || "Leisure",
            current_date: new Date().toISOString().split('T')[0]
        };

        // --- DETERMINISTIC FEASIBILITY CHECK ---
        const { checkFeasibility } = require("../utils/feasibilityCalculator");
        console.log(`[FEASIBILITY] Checking feasibility for ${destination} from ${origin}...`);

        const feasibilityResult = await checkFeasibility(origin, destination, parseInt(days), parseInt(travelers || 1), parseInt(budget));

        if (feasibilityResult && feasibilityResult.allowed === false) {
            console.log(`[FEASIBILITY CHECK] Trip rejected by Math Logic: ${feasibilityResult.message}`);
            return res.status(400).json({
                error: `Budget too low! ${feasibilityResult.message}`,
                min_needed: feasibilityResult.min_needed,
                details: feasibilityResult
            });
        }
        // ---------------------------------------

        console.log(`[CACHE MISS] Calling AI Engine for ${destination} from ${origin} (${days} days, ${travelers} travelers)...`);

        // 3. Call AI Engine
        // aiPayload is already defined above

        const aiResponse = await axios.post("http://localhost:8000/plan-trip", aiPayload);
        let tripData = aiResponse.data;

        // Fallback for previous error method (Backwards compatibility)
        if (tripData.error === "BudgetInsufficient") {
            console.log(`[FEASIBILITY CHECK] Trip rejected by AI: ${tripData.message}`);
            return res.status(400).json({ error: tripData.message });
        }

        // --- ENRICHMENT STEP (Images & Coordinates) ---
        console.log(`[ENRICHMENT] Fetching images for ${destination}...`);

        // Helper to fetch image from Serper
        const fetchImage = async (query) => {
            try {
                const apiKey = process.env.SERPER_API_KEY;
                if (!apiKey) return "";

                const response = await axios.post("https://google.serper.dev/images", {
                    q: query,
                    num: 1
                }, {
                    headers: {
                        'X-API-KEY': apiKey,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.images && response.data.images.length > 0) {
                    return response.data.images[0].imageUrl;
                }
                return "";
            } catch (err) {
                console.warn(`[ENRICHMENT] Failed to fetch image for ${query}:`, err.message);
                return "";
            }
        };

        // Collect all promises for parallel execution
        const enrichmentPromises = [];

        // 1. Hotels
        if (tripData.hotels && Array.isArray(tripData.hotels)) {
            tripData.hotels.forEach(hotel => {
                if (!hotel.image_url || hotel.image_url === "" || hotel.image_url === "LEAVE_EMPTY_FOR_BACKEND") {
                    const query = `${hotel.name} ${destination} hotel typical room`;
                    enrichmentPromises.push(
                        fetchImage(query).then(url => { hotel.image_url = url; })
                    );
                }
            });
        }

        // 2. Itinerary Activities
        if (tripData.itinerary && Array.isArray(tripData.itinerary)) {
            tripData.itinerary.forEach(dayPlan => {
                if (dayPlan.activities && Array.isArray(dayPlan.activities)) {
                    dayPlan.activities.forEach(activity => {
                        if (!activity.image_url || activity.image_url === "" || activity.image_url === "LEAVE_EMPTY_FOR_BACKEND") {
                            const query = `${activity.activity} ${destination}`;
                            enrichmentPromises.push(
                                fetchImage(query).then(url => { activity.image_url = url; })
                            );
                        }
                    });
                }
            });
        }

        // Wait for all images to be fetched
        await Promise.all(enrichmentPromises);
        console.log(`[ENRICHMENT] Completed. ${enrichmentPromises.length} images fetched.`);

        // 4. Save to Database
        const newTrip = await Trip.create({
            user_id: user_id || null,
            searchHash,
            destination,
            origin,
            duration: days,
            budget: budget.toString(),
            tripData: tripData,
            source: "ai"
        });

        console.log(`[DB SAVE] Saved new trip ${newTrip._id}`);

        // 5. Return Response
        res.status(201).json({
            ...tripData,
            source: "ai",
            _id: newTrip._id
        });

    } catch (error) {
        console.error("Error in createTripPlan:", error.message);
        if (error.response) {
            console.error("AI Engine Error Data:", error.response.data);
            console.error("AI Engine Status:", error.response.status);
            return res.status(error.response.status).json({
                error: "AI Engine Error",
                message: error.response.data.detail || "Error from AI Engine",
                details: error.response.data
            });
        } else if (error.request) {
            console.error("AI Engine Unreachable - Is it running on port 8000?");
            return res.status(503).json({
                error: "AI Engine Offline",
                message: "The AI generation service is currently unavailable. Please ensure it's running."
            });
        }
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

module.exports = { createTripPlan };
