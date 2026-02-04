const axios = require('axios');

exports.planTrip = async (req, res) => {
    try {
        const { query } = req.body;
        // Call Python AI Service
        const aiResponse = await axios.post('http://localhost:8000/plan-trip', { query });
        res.json(aiResponse.data);
    } catch (error) {
        console.error('AI Service Error:', error);
        res.status(500).json({ error: 'Failed to communicate with AI Engine' });
    }
};
