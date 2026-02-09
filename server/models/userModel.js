const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add the user name"],
        },
        email: {
            type: String,
            required: [true, "Please add the user email address"],
            unique: [true, "Email address already taken"],
        },
        password: {
            type: String,
            required: false, // Optional because Google Auth users won't have a password initially
        },
        googleId: {
            type: String,
            required: false,
        },
        picture: {
            type: String,
            required: false,
        },
        savedTrips: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip"
        }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
