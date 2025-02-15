const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const { sendSmsOtp } = require("../utils/smsSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: function () {
      return this.accountType === "Company";
    },
  },
  contactNumber: {
    type: String,
    required: function () {
      return this.accountType === "Candidate";
    },
    unique: function () {
      return this.accountType === "Candidate" && this.contactNumber != null;
    },
  },
  otp: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
    enum: ["Candidate", "Company"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
  },
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
  console.log(" otp inside sendVerificationEmail  : ",otp)
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      emailTemplate(otp)
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

// Define a post-save hook to send email or SMS after the document has been saved
OTPSchema.pre("save", async function (next) {
  console.log("New document saved to database");

  if (this.isNew) {
    try {
      if (this.accountType === "Company") {
        await sendVerificationEmail(this.email, this.otp);
      } else if (this.accountType === "Candidate") {
        await sendSmsOtp(this.contactNumber, this.otp);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  }
  next();
});


const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
