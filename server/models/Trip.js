const mongoose = require("mongoose");

const tripSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: false, // Optional for now, supports guest searches
            ref: "User",
        },
        searchHash: {
            type: String,
            required: true,
            index: true, // Crucial for fast cache lookups
        },
        destination: {
            type: String,
            required: true,
        },
        origin: {
            type: String,
            required: true, // Now required as per frontend/AI changes
        },
        duration: {
            type: Number,
            required: true,
        },
        budget: {
            type: String,
            required: true,
        },
        tripData: {
            type: Object, // Stores the full JSON itinerary from AI
            required: true,
        },
        source: {
            type: String,
            enum: ["ai", "cache"],
            default: "ai",
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

module.exports = mongoose.model("Trip", tripSchema);
