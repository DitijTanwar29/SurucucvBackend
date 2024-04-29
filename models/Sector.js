const mongoose = require("mongoose");
const Service = require("./Service");

const sectorSchema = new mongoose.Schema({

    sectorName: {
        type: String,
        required: true,
    },
    services: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
        }
    ],
    status: {
        type: String,
        enum:["Active", "Inactive"],
    },
})

module.exports = mongoose.model("Sector",sectorSchema);