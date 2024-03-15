const express = require("express");
const router = express.Router();

// importing the required controllers and middlewares
const {login, signup, changePassword, sendSms} = require("../controllers/Auth");
 

//routes for login signup changePassword

//route for user signup
router.post('/signup',signup);

//route for user login
router.post("/login", login);

router.post("/sendotp", sendSms);

module.exports = router;