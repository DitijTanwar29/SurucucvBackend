const express = require("express");
const router = express.Router();

// importing the required controllers and middlewares
const {login, signup, sendotp, changePassword, sendSmsOtp} = require("../controllers/Auth");
 

//routes for login signup changePassword

//route for user signup
router.post('/signup',signup);

//route for user login
router.post("/login", login);

router.post("/sendotp", sendotp);
// router.get("/testotp", testotp );
// router.post('/send-sms-otp', sendSmsOtp);
module.exports = router;