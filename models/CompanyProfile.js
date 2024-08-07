const mongoose = require("mongoose");

const companyProfileSchema = new mongoose.Schema({

    name: {
        type: String,
    },
    email: {
        type: String,
    },
    position: {
        type: String,
    },
    contactNumber: {
        type: Number,
    },
    dateOfBirth: {
        type: String,
    },
    companyTitle: {
        type:String,
    },
    sector: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Sector"
    },
    taxAdministration: {
        type: String,
    },
    taxNumber: {
        type: String,
    },
    companyAddress: {
        type: String,
    },
    companyIcon: {
        type: String,
    },
    companyBackgroundIcon: {
        type: String,
    },
    
});
module.exports = mongoose.model("CompanyProfile", companyProfileSchema);