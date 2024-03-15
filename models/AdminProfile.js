const mongoose = require("mongoose");

const adminProfileSchema = new mongoose.Schema({
    firstName: {
        type: String,
        // required: true,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        // required: true,
    },
    profileImage: {
        type: String,
    },
    backgroundImage: {
        type:String,
    },
    post: {
        type: String,
    },
    bio: {
        type: String,
    },
});

module.exports = mongoose.model("AdminProfile", adminProfileSchema);