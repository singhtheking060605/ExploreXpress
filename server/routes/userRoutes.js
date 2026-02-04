const express = require("express");
const {
    registerUser,
    loginUser,
    currentUser,
    googleLogin,
} = require("../controllers/userController");
const validateToken = require("../middleware/auth");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/current", validateToken, currentUser);

module.exports = router;
