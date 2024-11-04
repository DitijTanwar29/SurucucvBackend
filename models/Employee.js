const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    position: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    isContactPerson: {
        type: Boolean,
        default: false
    },
    
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
