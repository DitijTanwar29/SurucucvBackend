const mongoose = require("mongoose");
const User = require("./User");

const advertisementSchema = new mongoose.Schema({

    advertisementName: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        
    },
    endDate: {
        type: Date,
        
    },
    status: {
        type: String,
        enum:["Active", "Inactive"],
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    }
})

module.exports = mongoose.model("Advertisement",advertisementSchema);