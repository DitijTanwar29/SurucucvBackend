const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    mobileNumber: { type: String, required: true, unique: true },
    otp: { type: String },
  });
  
  module.exports = mongoose.model('OTP', otpSchema);
  
 