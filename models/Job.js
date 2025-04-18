const mongoose = require("mongoose");


const jobSchema = new mongoose.Schema({
    
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
    },
    company: {  
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    companyImage: {
        type: String,
    },
    companyName: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        required:true,
    },
    appliedCandidates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    jobDescription: {
        type: String,
        required:true,
    },
    requiredExperience: {
        type: Number,
    },
    rangeOfSalary: {
        type: String,
        required: true,
    },
    jobLocation: {
        type: String,
    },
    numberOfVacancy: {
        type: Number,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    jobType: {
        type: String,
        enum: ["Full Time","Part Time","Internship","Temporary Job"],
    },
    status: {
        type: String,
        enum: ["Active","Inactive"],
        default: "Inactive",
    },
    salaryType: {
        type: String,
        enum: ["Daily","Weekly","Monthly","Yearly"],
    },
    publishedDate: {
        type: Date,
    },
    isInternationalJob: {
        type: Boolean,
        default: false,
    },
    //requirements for job creation 
    // Main Certificates
    licenseType: {
        type: [String], // Array of strings
        required: true,
        default: []
      },
    // srcBox:{
    //     type: String,
    //     enum:["SRC1","SRC2","SRC3","SRC4"],
    // },
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

    psikoteknik: {
        type: Number,
        
    },
    adrDrivingLicence:{
        type: Number,
        
    },
    isCode95Document: {
        type: Boolean,
        default: false,
    },
    // Abilities
    passport: {
        type: String,
        enum:["Type 1","Type 2","Type 3"], 
    },
    visa: {
        type: String,
        enum: ["Type 1","Type 2","Type 3"],
    },
    abroadExperience: {
        type: Number,
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
    // appliedCandidates: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       required: true,
    //       ref: "User",
    //     },
    //   ],

});

module.exports = new mongoose.model("Job",jobSchema);