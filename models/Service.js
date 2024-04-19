const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({

    serviceName: {
        type: String,
        required: true,
    },
    serviceDescription: {
        type: String,
    },
    icon: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum:["Active", "Inactive"],
    },
    jobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        }
    ]
    
})

module.exports = mongoose.model("Service",serviceSchema);