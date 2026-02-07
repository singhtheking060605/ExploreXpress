const express = require('express');
const router = express.Router();
const ExploreTrip = require('../models/ExploreTrip');

/**
 * @route   GET /api/explore/trending
 * @desc    Get trending destinations from the last 15 days
 * @access  Public
 */
router.get('/trending', async (req, res) => {
    try {
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        // Aggregation Pipeline for Unique Destinations
        const trips = await ExploreTrip.aggregate([
            // 1. Filter recent documents
            { $match: { createdAt: { $gte: fifteenDaysAgo } } },

            // 2. Sort by newest first (so we keep the latest version)
            { $sort: { createdAt: -1 } },

            // 3. Group by destination + category (or just destination if stricter)
            // Grouping by dest+cat allows "Goa" in Beach AND "Goa" in Culture if desired.
            // But user said "No repeated Goa/Manali ever". So group by destination only?
            // "Only 1 destination per category per 15-day window" -> implies strict Category uniqueness.
            // Let's group by { destination, category } to be safe, but then filter frontend?
            // Wait, user said: "No repeated Goa/Manali ever" AND "5 unique destinations per category".
            // If Goa is in Beach, it shouldn't be in Culture? 
            // Let's stick to { destination, category } as the key uniqueness factor requested in point 3.
            {
                $group: {
                    _id: "$destination", // Group by destination only
                    doc: { $first: "$$ROOT" }
                }
            },

            // 4. Replace root to return original document structure
            { $replaceRoot: { newRoot: "$doc" } },

            // 5. Final Sort (optional, maybe by date or name)
            { $sort: { createdAt: -1 } }
        ]);

        res.json(trips);
    } catch (error) {
        console.error('Error fetching trending trips:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route   GET /api/explore/:destination/events
 * @desc    Get detailed events for a specific destination
 * @access  Public
 */
router.get('/:destination/events', async (req, res) => {
    try {
        const { destination } = req.params;

        // precise case-insensitive match
        const trip = await ExploreTrip.findOne({
            destination: { $regex: new RegExp(`^${destination}$`, 'i') }
        }).sort({ createdAt: -1 });

        if (!trip) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        res.json(trip.events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route   POST /api/explore/save-trip
 * @desc    Upsert trip data from AI Agent
 * @access  Private (Internal Utility)
 */
router.post('/save-trip', async (req, res) => {
    try {
        const { destination, region, category, trending_reason, famous_for, events, imageUrl } = req.body;

        // Validation - Basic check
        if (!destination || !region || !category) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Upsert Logic: specific to { destination, category, region }
        // This preserves the library and just updates content if it exists.
        const filter = { destination, category, region };
        const update = {
            $set: {
                destination,
                region,
                category,
                trending_reason,
                famous_for,
                events,
                imageUrl,
                createdAt: new Date() // Refresh the TTL
            }
        };

        const result = await ExploreTrip.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });

        console.log(`Saved/Updated trip: ${destination} (${category})`);
        res.json(result);

    } catch (error) {
        console.error('Error saving trip:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
