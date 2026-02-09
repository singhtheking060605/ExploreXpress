const NodeGeocoder = require('node-geocoder');
const geolib = require('geolib');

const options = {
    provider: 'openstreetmap',
    // Optional depending on your needs
    // httpAdapter: 'https', // Default
    // apiKey: 'YOUR_API_KEY', // Check if openstreetmap needs one (it usually doesn't for low volume)
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

// Cache for coordinates to avoid rate limits
const coordCache = {};

const getCoordinates = async (city) => {
    // Normalize city name
    const key = city.toLowerCase().trim();
    if (coordCache[key]) return coordCache[key];

    try {
        const res = await geocoder.geocode(city);
        if (res && res.length > 0) {
            const coords = { latitude: res[0].latitude, longitude: res[0].longitude };
            coordCache[key] = coords;
            return coords;
        }
        return null;
    } catch (err) {
        console.error("Geocoder error:", err);
        return null; // Return null if geocoding fails
    }
};

const checkFeasibility = async (source, destination, days, travelers, budget) => {
    try {
        // 1. Get Coordinates
        const sourceCoords = await getCoordinates(source);
        const destCoords = await getCoordinates(destination);

        if (!sourceCoords || !destCoords) {
            console.log("Could not geocode cities, skipping feasibility check.");
            // Default to feasible if we can't calculate (or handle strictly)
            // Let's allow it to pass to AI if we can't determine distance
            return { allowed: true };
        }

        // 2. Calculate Distance
        const distanceMeters = geolib.getDistance(sourceCoords, destCoords);
        const distanceKm = distanceMeters / 1000;
        console.log(`Distance between ${source} and ${destination}: ${distanceKm.toFixed(2)} km`);

        // 3. Estimate Transport Cost (Per Person)
        // Flight: 3500 + (DistanceKm * 4.5)
        const flightCost = 3500 + (distanceKm * 4.5);
        // Train: 500 + (DistanceKm * 1.8) (AC Tier 2)
        const trainCost = 500 + (distanceKm * 1.8);

        // Min Transport Cost (One Way)
        const oneWayTransport = Math.min(flightCost, trainCost);
        // Round Trip
        const totalTransportPerPerson = oneWayTransport * 2;
        const totalTransportCost = totalTransportPerPerson * travelers;

        // 4. Estimate Stay Cost
        // Rooms Needed = Ceil(travelers / 2)
        const roomsNeeded = Math.ceil(travelers / 2);
        // Hotel Cost = Rooms * 3000 * (days - 1) (Nights = days - 1)
        // Ensure at least 1 night if days > 0
        const nights = Math.max(1, days - 1);
        const totalHotelCost = roomsNeeded * 3000 * nights;

        // 5. Estimate Food/Misc Cost
        // 1000 * travelers * days
        const totalFoodCost = 1000 * travelers * days;

        // 6. Total Minimum Budget
        const minNeeded = Math.round(totalTransportCost + totalHotelCost + totalFoodCost);

        console.log(`[FEASIBILITY] Calc: Trans=${totalTransportCost.toFixed(0)}, Hotel=${totalHotelCost}, Food=${totalFoodCost}, TotalMin=${minNeeded}, UserBudget=${budget}`);

        if (parseInt(budget) >= minNeeded) {
            return { allowed: true };
        } else {
            return {
                allowed: false,
                min_needed: minNeeded,
                breakdown: {
                    transport: Math.round(totalTransportCost),
                    stay: totalHotelCost,
                    food: totalFoodCost
                },
                message: `Calculated minimum budget is ₹${minNeeded.toLocaleString('en-IN')} (Transport: ₹${Math.round(totalTransportCost).toLocaleString('en-IN')}, Stay: ₹${totalHotelCost.toLocaleString('en-IN')}, Food: ₹${totalFoodCost.toLocaleString('en-IN')})`
            };
        }

    } catch (error) {
        console.error("Feasibility check error:", error);
        return { allowed: true }; // Allow on error
    }
};

module.exports = { checkFeasibility };
