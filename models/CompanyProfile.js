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
    paymentStatus: {
        type: String,
        enum: ["Unpurchased", "Requested", "Approved", "Rejected"],
        default: "Unpurchased",
    },
    // New field to store the ObjectId of the package they are paying for
    package: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Package",
                }
    ],
});
module.exports = mongoose.model("CompanyProfile", companyProfileSchema);