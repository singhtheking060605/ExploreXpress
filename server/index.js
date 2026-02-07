const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

dbConnect();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/explore", require("./routes/exploreRoutes"));
app.use("/api/events", require("./routes/eventsRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
