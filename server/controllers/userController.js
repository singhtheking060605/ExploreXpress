const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Trip = require("../models/Trip"); // Import Trip model
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//@desc Register a user
//@route POST /api/users/signup
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    console.log(`User created ${user}`);
    if (user) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.name,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );
        res.status(201).json({ accessToken, _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

//@desc Login user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({ email });
    //compare password with hashedpassword
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.name,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("email or password is not valid");
    }
});

//@desc Google Login
//@route POST /api/users/google
//@access Public
const googleLogin = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            googleId: sub,
            picture,
        });
    }

    const accessToken = jwt.sign(
        {
            user: {
                username: user.name,
                email: user.email,
                id: user.id,
            },
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    res.status(200).json({ accessToken, user });
});

//@desc Current user info
//@route GET /api/users/current
//@access Private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

//@desc Save a trip
//@route POST /api/users/saved-trips/:id
//@access Private
const saveTrip = asyncHandler(async (req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id; // From validateToken middleware

    // Check if trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
        res.status(404);
        throw new Error("Trip not found");
    }

    // Add to user's savedTrips if not already there
    const user = await User.findById(userId);
    if (!user.savedTrips.includes(tripId)) {
        user.savedTrips.push(tripId);
        await user.save();
    }

    res.status(200).json({ message: "Trip saved successfully", savedTrips: user.savedTrips });
});

//@desc Unsave a trip
//@route DELETE /api/users/saved-trips/:id
//@access Private
const unsaveTrip = asyncHandler(async (req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id;

    const user = await User.findById(userId);
    user.savedTrips = user.savedTrips.filter(id => id.toString() !== tripId);
    await user.save();

    res.status(200).json({ message: "Trip removed from saved", savedTrips: user.savedTrips });
});

//@desc Get saved trips
//@route GET /api/users/saved-trips
//@access Private
const getSavedTrips = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("savedTrips");

    // Sort by createdAt desc (most recent first) - though Trip doesn't have it by default unless timestamps: true is on Trip schema (which it is)
    // We can sort the array if needed, but population returns in order of insertion usually. 
    // Let's reverse to show newest saved first? Or rely on UI.
    // Actually, populate just fills the array.

    res.status(200).json(user.savedTrips);
});

module.exports = { registerUser, loginUser, currentUser, googleLogin, saveTrip, unsaveTrip, getSavedTrips };
