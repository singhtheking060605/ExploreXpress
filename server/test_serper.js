const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.SERPER_API_KEY;

if (!apiKey) {
    console.error("Error: SERPER_API_KEY not found in .env");
    process.exit(1);
}

console.log(`Testing Serper API with key: ${apiKey.substring(0, 5)}...`);

async function testSerper() {
    try {
        const response = await axios.post("https://google.serper.dev/images", {
            q: "Manali hotel",
            num: 1
        }, {
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json'
            }
        });

        console.log("Response Status:", response.status);
        if (response.data.images && response.data.images.length > 0) {
            console.log("Success! Image URL:", response.data.images[0].imageUrl);
        } else {
            console.log("Success, but no images found.");
            console.log("Full Response:", JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("API Error Data:", error.response.data);
        }
    }
}

testSerper();
