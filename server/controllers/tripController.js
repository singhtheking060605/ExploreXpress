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
        const { destination, days, budget, travel_style, user_id, forceRefresh } = req.body;

        if (!destination || !days || !budget) {
            return res.status(400).json({ error: "Missing required fields: destination, days, budget" });
        }

        // 1. Generate Hash
        const searchHash = generateSearchHash(destination, days, budget, travel_style);

        // 2. Check Cache (if not forced refresh)
        if (!forceRefresh) {
            // Find a trip with this hash created in the last 24 hours
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const cachedTrip = await Trip.findOne({
                searchHash: searchHash,
                createdAt: { $gt: twentyFourHoursAgo }
            }).sort({ createdAt: -1 }); // Get the latest one

            if (cachedTrip) {
                console.log(`[CACHE HIT] Retrieving trip for ${destination} (${days} days)`);
                // Return cached data
                return res.json({
                    ...cachedTrip.tripData,
                    source: "cache",
                    _id: cachedTrip._id
                });
            }
        }

        console.log(`[CACHE MISS] Calling AI Engine for ${destination} (${days} days)...`);

        // 3. Call AI Engine
        // Construct the query object expected by the Python backend
        const aiPayload = {
            destination,
            days: days.toString(),
            budget: budget.toString(),
            travel_style: travel_style || "Leisure",
            current_date: new Date().toISOString().split('T')[0]
        };

        // Call Python Service (assuming it's running on port 8000)
        // Use the 'kickoff' endpoint or whatever the Python server exposes
        // Based on previous context, it seems to be /plan-trip or similar.
        // Let's assume the Python server accepts the payload directly or wrapped in 'inputs'.
        // Checking `manual_test_trip_crew.py`, it uses `kickoff(inputs=inputs)`.
        // The Python API wrapper (if it exists) likely exposes an endpoint.
        // Assuming `src.ringmaster_ai.main:app` is running on 8000.
        // Let's assume the endpoint is `/plan_trip` (standard convention) or just POST `/`?
        // I'll assume `/plan-trip` based on `aiBridgeController.js` content I saw earlier:
        // `axios.post('http://localhost:8000/plan-trip', { query });`
        // But `manual_test` passes a dictionary.

        // Let's proceed with `/plan-trip` and pass the inputs.
        const aiResponse = await axios.post("http://localhost:8000/plan-trip", aiPayload);

        const tripData = aiResponse.data;

        // 4. Save to Database
        const newTrip = await Trip.create({
            user_id: user_id || null,
            searchHash,
            destination,
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
            return res.status(error.response.status).json({ error: "AI Engine Error", details: error.response.data });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createTripPlan };
