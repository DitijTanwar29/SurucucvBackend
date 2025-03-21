const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({

    // Basic Details
    tcNumber :{
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    age: {
        type: String,
    },
    gsm: {
        type: Number,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    email: {
        type: String,
    },

    // Main Certificates
    // licenseType: {
    //     type: Array,
    //     // enum: [
    //     //     'M', 'A1', 'A2', 'A', 'B1', 'B', 'C1', 'C', 'D1', 'D', 'BE', 'C1E', 'CE', 'D1E', 'DE', 'F', 'G'
    //     // ],
    // },
    licenseType: {
        type: [String], // Array of strings
        required: true, // Set to true if it's mandatory
        default: [], // Default empty array
      },
    isSrc1: {
        type: Boolean,
        default: false,
    },
    isSrc2: {
        type: Boolean,
        default: false,
    },
    isSrc3: {
        type: Boolean,
        default: false,
    },
    isSrc4: {
        type: Boolean,
        default: false,
    },
    psikoteknik: { //need boolean variable
        type: Date,
        default: Date.now(),
    },
    adrDrivingLicense:{ //need boolean variable
        type: Date,
        default: Date.now(),
    },
    adrExpiryDate: {
        type : Date,
        default: null,
    },
    psikoteknikExpiryDate: {
        type: Date,
        default: null,
    },
    mykCertificate: { //need boolean variable
        type : Date,
        default: null,
    },
    mykExpiryDate: {
        type : Date,
        default: null,
    },
    // Abilities
    passport: {
        type: String,
        enum:["Type 1","Type 2","Type 3"], 
    },
    dateOfReceipt : {
        type: Date,
        default: Date.now(),
    },
    duration: {
        type: Number,
    },
    visa: {
        type: String,
        enum: ["Type 1","Type 2","Type 3"],
    },
    abroadExperience: {
        type: String,
    },
    isCode95Document: {
        type: Boolean,
        default: false,
    },
    isBlindSpotTraining: {
        type: Boolean,
        default: false,
    },
    isSafeDrivingTraining: {
        type: Boolean,
        default: false,
    },
    isFuelEconomyTraining: {
        type: Boolean,
        default: false,
    },
    //Experience
    europeanExperiencePeriod: {
        type: Number,
    },
    russiaExperiencePeriod: {
        type: Number,        
    },
    turkicRepublicsExperiencePeriod: {
        type: Number,
    },
    southExperienceTime: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

    
})

module.exports = mongoose.model("Resume",resumeSchema);