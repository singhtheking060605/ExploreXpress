const express = require("express");
const {
    registerUser,
    loginUser,
    currentUser,
    googleLogin,
    saveTrip,
    unsaveTrip,
    getSavedTrips
} = require("../controllers/userController");
const validateToken = require("../middleware/auth");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/current", validateToken, currentUser);

router.post("/saved-trips/:id", validateToken, saveTrip);
router.delete("/saved-trips/:id", validateToken, unsaveTrip);
router.get("/saved-trips", validateToken, getSavedTrips);

module.exports = router;
