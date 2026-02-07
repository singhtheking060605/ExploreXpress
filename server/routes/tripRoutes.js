const express = require("express");
const router = express.Router();
const { createTripPlan } = require("../controllers/tripController");

router.post("/", createTripPlan);

module.exports = router;
