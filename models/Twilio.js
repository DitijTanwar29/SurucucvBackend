// models/twilio.js

const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

const sendSMS = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log("inside twilio")

    
    console.log(`Message sent: ${message.sid}`);
  } catch (error) {
    console.error(`Error sending SMS: ${error.message}`);
    throw error;
  }
};

// client.verify.v2
//     .services(accountSid)
//     .verifications.create({ to: "+919911553407", channel: "sms" })
//     .then((verification) => console.log(verification.status))
//     .then(() => {
//       const readline = require("readline").createInterface({
//         input: process.stdin,
//         output: process.stdout,
//       });
//       readline.question("Please enter the OTP:", (otpCode) => {
//         client.verify.v2
//           .services(accountSid)
//           .verificationChecks.create({ to: "+919911553407", code: otpCode })
//           .then((verification_check) => console.log(verification_check.status))
//           .then(() => readline.close());
//       });
//     });

module.exports = { sendSMS };




// const accountSid = "AC369c4f3e222eb26ec8fd7760a457a7a9";
//   const authToken = "5b96040db1d2ef642bdfe700cab322c7";
//   const verifySid = "VAd3e9917781de06266429970bc2e8f0c7";
//   const client = require("twilio")(accountSid, authToken);

 
