const mongoose = require('mongoose');

const AdsPackageSchema = new mongoose.Schema({
    packageName: {
        type: String,
        required: true
    },
    packagePrice: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        default: 0
    },
    features: {
        type: [String],
        required: true
    },
    jobPostLimit: {
        type: Number,
        required: true
    },
    advertisingLimit: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Inactive'
    },
    //add user obj id so that it gets enrolled when company purchased a pack
}, { timestamps: true });

module.exports = mongoose.model('Package', AdsPackageSchema);
