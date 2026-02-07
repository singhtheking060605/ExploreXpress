const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ExploreTrip = require('./models/ExploreTrip');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const baseDestinations = [
    // --- CULTURE ---
    {
        destination: "Kyoto",
        region: "World",
        location: "Kyoto, Japan",
        category: "Culture",
        month: "February 2026",
        trending_reason: "Plum blossoms & early spring preparations",
        famous_for: "Temples + Geisha districts + Blossoms",
        weather: { temp: "10°C", condition: "Cool", icon: "cloud" },
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
        events: [
            { name: "Baikasai (Plum Blossom Festival)", date: "Feb 25, 2026", type: "Cultural", bookingLink: "#", source: "Local" },
            { name: "Kyoto Marathon", date: "Feb 15, 2026", type: "Sports", bookingLink: "#", source: "Local" },
            { name: "Higashiyama Hanatouro", date: "Mar 06, 2026", type: "Illumination", bookingLink: "#", source: "Local" }
        ]
    },
    {
        destination: "Jaipur",
        region: "India",
        location: "Rajasthan, India",
        category: "Culture",
        month: "February 2026",
        trending_reason: "Royal weddings season & perfect weather",
        famous_for: "Palaces + Forts + History",
        weather: { temp: "25°C", condition: "Sunny", icon: "sun" },
        imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000&auto=format&fit=crop",
        events: [
            { name: "Jaipur Literature Festival Wrap", date: "Feb 10, 2026", type: "Cultural", bookingLink: "#", source: "Global" },
            { name: "Elephant Festival Prep", date: "Feb 20, 2026", type: "Cultural", bookingLink: "#", source: "Local" },
            { name: "Holi Celebration", date: "Mar 04, 2026", type: "Festival", bookingLink: "#", source: "National" }
        ]
    },
    {
        destination: "Paris",
        region: "World",
        location: "Île-de-France, France",
        category: "Culture",
        month: "February 2026",
        trending_reason: "Romantic getaways & Fashion Week",
        famous_for: "Eiffel Tower + Museums + Fashion",
        weather: { temp: "8°C", condition: "Mist", icon: "rain" },
        imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
        events: [
            { name: "Valentine's Cruise", date: "Feb 14, 2026", type: "Romantic", bookingLink: "#", source: "Local" },
            { name: "Paris Fashion Week", date: "Feb 23, 2026", type: "Fashion", bookingLink: "#", source: "Global" },
            { name: "Paris Half Marathon", date: "Mar 08, 2026", type: "Sports", bookingLink: "#", source: "Global" }
        ]
    },
    {
        destination: "Rome",
        region: "World",
        location: "Lazio, Italy",
        category: "Culture",
        month: "February 2026",
        trending_reason: "Quiet charm before Easter crowds",
        famous_for: "Colosseum + Vatican + Pasta",
        weather: { temp: "12°C", condition: "Partly Cloudy", icon: "cloud" },
        imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop",
        events: [
            { name: "Rome Carnival", date: "Feb 12, 2026", type: "Festival", bookingLink: "#", source: "Local" },
            { name: "Vatican Museum Night", date: "Feb 20, 2026", type: "Art", bookingLink: "#", source: "Local" },
            { name: "Rome Marathon", date: "Mar 15, 2026", type: "Sports", bookingLink: "#", source: "Global" }
        ]
    },

    // --- BEACH ---
    {
        destination: "Goa",
        region: "India",
        location: "Goa, India",
        category: "Beach",
        month: "February 2026",
        trending_reason: "Goa Carnival & sunny days",
        famous_for: "Beaches + Nightlife + Heritage",
        weather: { temp: "30°C", condition: "Sunny", icon: "sun" },
        imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop",
        events: [
            { name: "Goa Carnival", date: "Feb 14, 2026", type: "Festival", bookingLink: "#", source: "Local" },
            { name: "Grape Escapade", date: "Feb 25, 2026", type: "Food & Wine", bookingLink: "#", source: "Local" },
            { name: "Shigmo Festival", date: "Mar 08, 2026", type: "Festival", bookingLink: "#", source: "Local" }
        ]
    },
    {
        destination: "Varkala",
        region: "India",
        location: "Kerala, India",
        category: "Beach",
        month: "February 2026",
        trending_reason: "Cliffside sunsets & surfing",
        famous_for: "Cliffs + Surfing + Ayurveda",
        weather: { temp: "29°C", condition: "Sunny", icon: "sun" },
        imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop",
        events: [
            { name: "Surfing Workshop", date: "Feb 10, 2026", type: "Adventure", bookingLink: "#", source: "Local" },
            { name: "Varkala Beach Fest", date: "Feb 20, 2026", type: "Festival", bookingLink: "#", source: "Local" },
            { name: "Arattu Festival", date: "Mar 15, 2026", type: "Cultural", bookingLink: "#", source: "Local" }
        ]
    },
    {
        destination: "Maldives",
        region: "World",
        location: "Maldives",
        category: "Beach",
        month: "February 2026",
        trending_reason: "Crystal clear waters & romance",
        famous_for: "Luxury + Diving + Bungalows",
        weather: { temp: "29°C", condition: "Sunny", icon: "sun" },
        imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop",
        events: [
            { name: "Underwater Music Fest", date: "Feb 18, 2026", type: "Music", bookingLink: "#", source: "Unique" },
            { name: "Wellness Retreat", date: "Feb 22, 2026", type: "Wellness", bookingLink: "#", source: "Local" },
            { name: "Spring Equinox Dinner", date: "Mar 21, 2026", type: "Culinary", bookingLink: "#", source: "Local" }
        ]
    },
    {
        destination: "Phuket",
        region: "World",
        location: "Phuket, Thailand",
        category: "Beach",
        month: "February 2026",
        trending_reason: "Perfect beach weather & Chinese New Year",
        famous_for: "Islands + Nightlife + Temples",
        weather: { temp: "31°C", condition: "Sunny", icon: "sun" },
        // Local Asset: phuket.jpg
        imageUrl: "/assets/phuket.jpg",
        events: [
            { name: "Phuket Old Town Fest", date: "Feb 12, 2026", type: "Culture", bookingLink: "#", source: "Local" },
            { name: "CNY Celebrations", date: "Feb 17, 2026", type: "Festival", bookingLink: "#", source: "Local" },
            { name: "Phuket Bike Week", date: "Mar 20, 2026", type: "Sports", bookingLink: "#", source: "Global" }
        ]
    },

    // --- MOUNTAINS ---
    {
        destination: "Manali",
        region: "India",
        location: "Himachal Pradesh, India",
        category: "Mountains",
        month: "February 2026",
        trending_reason: "Snow adventures & winter carnival vibes",
        famous_for: "Snow + Trekking + Valley",
        weather: { temp: "-2°C", condition: "Snow", icon: "snow" },
        imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop",
        events: [
            { name: "Winter Carnival", date: "Feb 10, 2026", type: "Cultural", bookingLink: "#", source: "Local" },
            { name: "Skiing Championship", date: "Feb 15, 2026", type: "Sports", bookingLink: "#", source: "National" },
            { name: "Spring Festival", date: "Mar 15, 2026", type: "Cultural", bookingLink: "#", source: "Local" }
        ]
    },
    {
        destination: "Swiss Alps",
        region: "World",
        location: "Graubünden, Switzerland",
        category: "Mountains",
        month: "February 2026",
        trending_reason: "Peak ski season & St. Moritz glam",
        famous_for: "Skiing + Scenery + Chocolate",
        weather: { temp: "-5°C", condition: "Snow", icon: "snow" },
        // Wikimedia - Matterhorn/Zermatt
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Matterhorn_from_Domh%C3%BCtte_-_2.jpg/800px-Matterhorn_from_Domh%C3%BCtte_-_2.jpg",
        events: [
            { name: "White Turf St. Moritz", date: "Feb 15, 2026", type: "Sports", bookingLink: "#", source: "Global" },
            { name: "Engadin Ski Marathon", date: "Mar 08, 2026", type: "Sports", bookingLink: "#", source: "Global" },
            { name: "Easter Ski Special", date: "Mar 29, 2026", type: "Sports", bookingLink: "#", source: "Local" }
        ]
    },
    {
        destination: "Banff",
        region: "World",
        location: "Alberta, Canada",
        category: "Mountains",
        month: "February 2026",
        trending_reason: "Ice magic & snowy peaks",
        famous_for: "Lakes + Hiking + Wildlife",
        weather: { temp: "-10°C", condition: "Snow", icon: "snow" },
        // Local Asset: banff.webp
        imageUrl: "/assets/banff.webp",
        events: [
            { name: "Banff Film Festival", date: "Feb 12, 2026", type: "Cinema", bookingLink: "#", source: "Global" },
            { name: "Ice Magic Festival", date: "Feb 20, 2026", type: "Art", bookingLink: "#", source: "Local" },
            { name: "Spring Skiing Splash", date: "Mar 20, 2026", type: "Fun", bookingLink: "#", source: "Local" }
        ]
    },

    // --- ADVENTURE ---
    {
        destination: "Rishikesh",
        region: "India",
        location: "Uttarakhand, India",
        category: "Adventure",
        month: "February 2026",
        trending_reason: "Early rafting season & pleasant camping",
        famous_for: "Rafting + Bungee + Yoga",
        weather: { temp: "18°C", condition: "Clear", icon: "sun" },
        imageUrl: "https://images.unsplash.com/photo-1591389803164-331004b77d61?q=80&w=1000&auto=format&fit=crop",
        events: [
            { name: "Bungee Contest", date: "Feb 18, 2026", type: "Competition", bookingLink: "#", source: "Local" },
            { name: "Holi on the Ganges", date: "Mar 04, 2026", type: "Festival", bookingLink: "#", source: "Local" },
            { name: "Intl Yoga Festival", date: "Mar 08, 2026", type: "Global", bookingLink: "#", source: "International" }
        ]
    },
    {
        destination: "Queenstown",
        region: "World",
        location: "Otago, New Zealand",
        category: "Adventure",
        month: "February 2026",
        trending_reason: "Summer thrills & marathon madness",
        famous_for: "Bungee + Skydiving + Jet Boats",
        weather: { temp: "22°C", condition: "Sunny", icon: "sun" },
        // Unsplash ID for Queenstown
        imageUrl: "https://images.unsplash.com/photo-1507024823812-32b02319c5b2?q=80&w=1000&auto=format&fit=crop",
        events: [
            { name: "Queenstown Marathon", date: "Feb 14, 2026", type: "Sports", bookingLink: "#", source: "Global" },
            { name: "Shotover Jet Race", date: "Feb 20, 2026", type: "Competition", bookingLink: "#", source: "Local" },
            { name: "Bike Festival", date: "Mar 14, 2026", type: "Sports", bookingLink: "#", source: "Local" }
        ]
    },
    {
        destination: "Interlaken",
        region: "World",
        location: "Bern, Switzerland",
        category: "Adventure",
        month: "February 2026",
        trending_reason: "Winter paragliding & snowy landscapes",
        famous_for: "Paragliding + Skydiving + Lakes",
        weather: { temp: "-1°C", condition: "Snow", icon: "cloud" },
        imageUrl: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=1000&auto=format&fit=crop",
        events: [
            { name: "Ice Magic Interlaken", date: "Feb 10, 2026", type: "Festival", bookingLink: "#", source: "Local" },
            { name: "Winter Paragliding Cup", date: "Feb 25, 2026", type: "Competition", bookingLink: "#", source: "Local" },
            { name: "Adventure Summit", date: "Mar 15, 2026", type: "Conference", bookingLink: "#", source: "Global" }
        ]
    },

    // --- SPIRITUAL ---
    {
        destination: "Varanasi",
        region: "India",
        location: "Uttar Pradesh, India",
        category: "Spiritual",
        month: "February 2026",
        trending_reason: "Mahashivratri devotions & spiritual aura",
        famous_for: "Ghats + Temples + Aarti",
        weather: { temp: "24°C", condition: "Sunny", icon: "sun" },
        // Local Asset: kashivishwanath.jpg
        imageUrl: "/assets/kashivishwanath.jpg",
        events: [
            { name: "Mahashivratri", date: "Feb 17, 2026", type: "Religious", bookingLink: "#", source: "Global" },
            { name: "Dhrupad Mela", date: "Feb 21, 2026", type: "Music", bookingLink: "#", source: "Local" },
            { name: "Holi in Varanasi", date: "Mar 04, 2026", type: "Festival", bookingLink: "#", source: "Iconic" }
        ]
    },
    {
        destination: "Ubud",
        region: "World",
        location: "Bali, Indonesia",
        category: "Spiritual",
        month: "February 2026",
        trending_reason: "Pre-Nyepi calm & yoga retreats",
        famous_for: "Yoga + Temples + Nature",
        weather: { temp: "27°C", condition: "Humid", icon: "cloud" },
        imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop",
        events: [
            { name: "Full Moon Ceremony", date: "Feb 24, 2026", type: "Ritual", bookingLink: "#", source: "Local" },
            { name: "Spirit Fest (Warmup)", date: "Feb 28, 2026", type: "Wellness", bookingLink: "#", source: "Global" },
            { name: "Nyepi (Day of Silence)", date: "Mar 19, 2026", type: "Cultural", bookingLink: "#", source: "National" }
        ]
    },
    {
        destination: "Amritsar",
        region: "India",
        location: "Punjab, India",
        category: "Spiritual",
        month: "February 2026",
        trending_reason: "Golden Temple serenity & food trails",
        famous_for: "Golden Temple + Food + History",
        weather: { temp: "20°C", condition: "Clear", icon: "sun" },
        // Local Asset: amristar.jpg
        imageUrl: "/assets/amristar.jpg",
        events: [
            { name: "Food Festival", date: "Feb 18, 2026", type: "Culinary", bookingLink: "#", source: "Local" },
            { name: "Hola Mohalla (Nearby)", date: "Mar 06, 2026", type: "Festival", bookingLink: "#", source: "Nearby" },
            { name: "Baisakhi Prep", date: "Apr 01, 2026", type: "Cultural", bookingLink: "#", source: "Local" }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING || process.env.MONGO_URI);
        console.log('MongoDB Connected');

        await ExploreTrip.deleteMany({}); // Clear existing
        console.log('Cleared existing data');

        await ExploreTrip.insertMany(baseDestinations);
        console.log('Seeded rich sample data successfully!');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDB();
