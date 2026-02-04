const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const dbConnect = require("./config/dbConnect");

dbConnect();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/users", require("./routes/userRoutes"));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
