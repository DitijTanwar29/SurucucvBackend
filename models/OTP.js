// const mongoose = require("mongoose");
// const mailSender = require("../utils/mailSender");
// const emailTemplate = require("../mail/templates/emailVerificationTemplate")
// const otpSchema = new mongoose.Schema({
//     mobileNumber: { type: String, required: true, unique: true },
//     otp: { type: String },
//   });

// // a function -> to send emails
// async function sendVerificationEmail(email, otp) {
//   try{
//       const mailResponse = await mailSender(email, "Verification Email from Study Notion", emailTemplate(otp));
//       console.log("Email Sent Successfully: ", mailResponse);
//   }
//   catch(error){
//       console.log("Error Occured While Sending Mails: ", error);
//       throw error;
//   }
// }

// otpSchema.pre("save", async function(next) {
//   await sendVerificationEmail(this.email, this.otp);
//   next();
// })

//   module.exports = mongoose.model('OTP', otpSchema);
  


// const mongoose = require("mongoose");
// const mailSender = require("../utils/mailSender");
// const { sendSMS } = require("../models/Twilio");
// const emailTemplate = require("../mail/templates/emailVerificationTemplate");

// const OTPSchema = new mongoose.Schema({
//     mobileNumber: { type: String },
//     email: { type: String },
//     otp: { type: String },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//       expires: 60 * 10, 
//     },
// });
// async function sendVerificationEmail (email, otp) {
//   try {
//     const mailResponse = await mailSender(email, "Verification Email from SurucuCV", emailTemplate(otp));
//     console.log("Email Sent Successfully: ", mailResponse);
//   } catch (error) {
//     console.log("Error Occurred While Sending Email: ", error);
//     throw error;
//   }
// };

// async function sendVerificationSMS  (contactNumber, otp) {
//   try {
//     console.log("inside send verification sms ")
//     const smsResponse = await sendSMS(contactNumber, `Your OTP for account verification is: ${otp}`);
//     console.log("SMS Sent Successfully: ", smsResponse);
//   } catch (error) {
//     console.log("Error Occurred While Sending SMS: ", error);
//     throw error;
//   }
// };

// OTPSchema.pre("save", async function(next) {
//   console.log("inside pre save hook ");
//   if (this.isNew) {
//     await this.sendVerificationEmail(this.email, this.otp);
//   }
//   if (this.isNew) {
//     await this.sendVerificationSMS(this.mobileNumber, this.otp);
//   }
//   next();
// });




// const OTP = mongoose.model('OTP', OTPSchema);
// module.exports = OTP;

// const mongoose = require("mongoose");
// const mailSender = require("../utils/mailSender");
// const emailTemplate = require("../mail/templates/emailVerificationTemplate");
// const OTPSchema = new mongoose.Schema({
// 	email: {
// 		type: String,
// 		required: true,
// 	},
// 	otp: {
// 		type: String,
// 		required: true,
// 	},
// 	createdAt: {
// 		type: Date,
// 		default: Date.now,
// 		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
// 	},
// });

// // Define a function to send emails
// async function sendVerificationEmail(email, otp) {
// 	// Create a transporter to send emails

// 	// Define the email options

// 	// Send the email
// 	try {
// 		const mailResponse = await mailSender(
// 			email,
// 			"Verification Email",
// 			emailTemplate(otp)
// 		);
// 		console.log("Email sent successfully: ", mailResponse.response);
// 	} catch (error) {
// 		console.log("Error occurred while sending email: ", error);
// 		throw error;
// 	}
// }

// // Define a post-save hook to send email after the document has been saved
// OTPSchema.pre("save", async function (next) {
// 	console.log("New document saved to database");

// 	// Only send an email when a new document is created
// 	if (this.isNew) {
// 		await sendVerificationEmail(this.email, this.otp);
// 	}
// 	next();
// });

// const OTP = mongoose.model("OTP", OTPSchema);

// module.exports = OTP;




// const mongoose = require("mongoose");
// const mailSender = require("../utils/mailSender");
// const emailTemplate = require("../mail/templates/emailVerificationTemplate");
// const OTPSchema = new mongoose.Schema({
// 	email: {
// 		type: String,
// 		required: true,
// 	},
// 	otp: {
// 		type: String,
// 		required: true,
// 	},
// 	createdAt: {
// 		type: Date,
// 		default: Date.now,
// 		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
// 	},
// });

// // Define a function to send emails
// async function sendVerificationEmail(email, otp) {
// 	// Create a transporter to send emails

// 	// Define the email options

// 	// Send the email
// 	try {
// 		const mailResponse = await mailSender(
// 			email,
// 			"Verification Email",
// 			emailTemplate(otp)
// 		);
// 		console.log("Email sent successfully: ", mailResponse.response);
// 	} catch (error) {
// 		console.log("Error occurred while sending email: ", error);
// 		throw error;
// 	}
// }

// // Define a post-save hook to send email after the document has been saved
// OTPSchema.pre("save", async function (next) {
// 	console.log("New document saved to database");

// 	// Only send an email when a new document is created
// 	if (this.isNew) {
// 		await sendVerificationEmail(this.email, this.otp);
// 	}
// 	next();
// });

// const OTP = mongoose.model("OTP", OTPSchema);

// module.exports = OTP;


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
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      emailTemplate(otp)
    );
    console.log("Email sent successfully: ", mailResponse.response);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

// Define a post-save hook to send email or SMS after the document has been saved
OTPSchema.pre("save", async function (next) {
  console.log("New document saved to database");

  if (this.isNew) {
    if (this.accountType === "Company") {
      await sendVerificationEmail(this.email, this.otp);
    } else if (this.accountType === "Candidate") {
      await sendSmsOtp(this.contactNumber, this.otp);
    }
  }
  next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
