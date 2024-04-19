const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema({
    
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
        trim: true,
    },
    skills: {
        type: [String],
    },
    province: {
        type: String,
    },
    district: {
        type: String,
    },
    preferJobLocation : {
        type: [String],
    },
    degree: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    backgroundImage: {
        type: String,
    },
    
    
    // {user?.candidateDetails?.skill && "Enter you skill"}
});

module.exports = mongoose.model("CandidateProfile", candidateProfileSchema);
