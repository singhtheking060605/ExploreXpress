const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get Upcoming Holidays
// GET /api/events/holidays
router.get('/holidays', async (req, res) => {
    try {
        const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY;
        const CALENDAR_ID = 'en.indian#holiday@group.v.calendar.google.com';

        // Get events starting from today
        const now = new Date().toISOString();

        // Build URL
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&orderBy=startTime&singleEvents=true&timeMin=${now}&maxResults=10`;

        const response = await axios.get(url);

        const holidays = response.data.items.map(item => ({
            id: item.id,
            name: item.summary,
            date: item.start.date || item.start.dateTime, // Google Calendar returns date for all-day events
            description: item.description,
            type: 'Public Holiday'
        }));

        res.json(holidays);
    } catch (error) {
        console.error('Error fetching calendar events:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to fetch holidays' });
    }
});

module.exports = router;
