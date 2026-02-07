const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        console.log('Attempting to connect to:', process.env.CONNECTION_STRING);
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log('MongoDB Connected Successfully');
        process.exit(0);
    } catch (error) {
        console.error('Connection Error:', error);
        process.exit(1);
    }
};

connectDB();
