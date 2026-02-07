const mongoose = require('mongoose');

const exploreTripSchema = new mongoose.Schema({
    destination: { type: String, required: true },
    region: { type: String, enum: ['India', 'World'], required: true },
    month: { type: String, required: true }, // e.g., "October 2023"
    trending_reason: { type: String, required: true },
    famous_for: { type: String, required: true },
    category: {
        type: String,
        enum: ['Mountains', 'Beach', 'Adventure', 'Spiritual', 'Culture', 'Other'],
        default: 'Other'
    },
    weather: {
        temp: String,
        condition: String,
        icon: String
    },
    imageUrl: { type: String, required: true },
    events: [{
        name: String,
        date: String,
        type: { type: String }, // Fix for reserved keyword
        bookingLink: String,
        source: String
    }],
    location: { type: String }, // Specific location e.g., "Uttar Pradesh, India"
    createdAt: { type: Date, default: Date.now, expires: '30d' } // Auto-delete after 30 days
});

// Enforce Uniqueness: 1 Destination per Category per Region
// This prevents "Goa" from appearing 5 times in "Beach"
exploreTripSchema.index({ destination: 1, category: 1, region: 1 }, { unique: true });

module.exports = mongoose.model('ExploreTrip', exploreTripSchema);
