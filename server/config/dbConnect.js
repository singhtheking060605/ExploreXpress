const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        const connectionString = process.env.CONNECTION_STRING;
        if (!connectionString) {
            throw new Error("CONNECTION_STRING is missing in .env file");
        }
        const connect = await mongoose.connect(connectionString);
        console.log("Database connected");
    } catch (err) {
        console.error("Database connection error:", err.message);
        process.exit(1);
    }
};

module.exports = dbConnect;
