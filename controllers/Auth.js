const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const otpGenerator = require("otp-generator")

const User = require("../models/User");
const CandidateProfile = require("../models/CandidateProfile");
const CompanyProfile = require("../models/CompanyProfile");
const AdminProfile = require("../models/AdminProfile");

const OTP = require('../models/OTP');
const { sendSMS } = require('../models/Twilio');
const twilio = require('twilio');
exports.sendSms = async ( req, res) => {
   const { mobileNumber } = req.body;

  // Generate a random OTP (you may want to use a library for this)
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    // Save the OTP to the user in the database
    await OTP.findOneAndUpdate(
      { mobileNumber },
      { $set: { otp } },
      { new: true, upsert: true }
    );

    // Send the OTP to the user's mobile number via Twilio
    await sendSMS(`+${mobileNumber}`, `Your OTP is: ${otp}`);

    res.json({ success: true, message: 'OTP generated and sent successfully'
               ,otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// exports.sendotp = async (req, res) => {
//    try {
//      const { email, contactNumber } = req.body;
 
//      // Check if user is already present for Company account type
//      const checkCompanyUserPresent = await User.findOne({ email, accountType: "Company" });
//      if (checkCompanyUserPresent) {
//        return res.status(401).json({
//          success: false,
//          message: `Company user is Already Registered`,
//        });
//      }
 
//      // Check if user is already present for Candidate account type
//      const checkCandidateUserPresent = await User.findOne({ contactNumber, accountType: "Candidate" });
//      if (checkCandidateUserPresent) {
//        return res.status(401).json({
//          success: false,
//          message: `Candidate user is Already Registered`,
//        });
//      }
 
//      // Generate OTP
//      const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
 
//      // Save OTP for Company user
//      if (checkCompanyUserPresent) {
//        await OTP.create({ email, otp });
//      }
 
//      // Save OTP for Candidate user
//      if (checkCandidateUserPresent) {
//        await OTP.create({ mobileNumber: contactNumber, otp });
//      }
 
//      res.status(200).json({
//        success: true,
//        message: `OTP Sent Successfully`,
//        otp,
//      });
//    } catch (error) {
//      console.log(error.message);
//      return res.status(500).json({ success: false, error: error.message });
//    }
//  };
 
// signup controller
// exports.signup = async (req, res) => {
//    try {
//      const { name, email, password, confirmPassword, contactNumber, date, city, accountType, otp } = req.body;
 
//      // Validate data
//      if (!name || !email || !contactNumber || !date || !city || !password || !confirmPassword || !accountType || !otp) {
//        return res.status(403).json({
//          success: false,
//          message: "All fields are required",
//        });
//      }
 
//      // Match passwords
//      if (password !== confirmPassword) {
//        return res.status(400).json({
//          success: false,
//          message: "Password and ConfirmPassword value does not match, please try again",
//        });
//      }
 
//      // Check if user is already registered for Company account type
//      const checkCompanyUserPresent = await User.findOne({ email, accountType: "Company" });
//      if (checkCompanyUserPresent) {
//        return res.status(401).json({
//          success: false,
//          message: `Company user is Already Registered`,
//        });
//      }
 
//      // Check if user is already registered for Candidate account type
//      const checkCandidateUserPresent = await User.findOne({ contactNumber, accountType: "Candidate" });
//      if (checkCandidateUserPresent) {
//        return res.status(401).json({
//          success: false,
//          message: `Candidate user is Already Registered`,
//        });
//      }
 
//      // Verify OTP
//      const verifiedOTP = await OTP.findOne({ mobileNumber: contactNumber, otp });
//      if (!verifiedOTP) {
//        return res.status(401).json({
//          success: false,
//          message: `Invalid OTP. Please enter the correct OTP.`,
//        });
//      }
 
//      // Hash Password
//      const hashedPassword = await bcrypt.hash(password, 10);
 
//      // Create additional profile for User
//      let companyProfileDetails = {};
//      let candidateProfileDetails = {};
 
//      switch(accountType) {
//        case 'Company':
//          companyProfileDetails = await CompanyProfile.findOne({ email: null });
//          if (!companyProfileDetails) {
//            companyProfileDetails = await CompanyProfile.create({
//              email: null, name: null, contactNumber: null, position: null,
//              dateOfBirth: null, companyTitle: null, industryName: null,
//              taxAdministration: null, taxNumber: null, companyAddress: null,
//              companyIcon: null, companyBackgroundIcon: null,
//            });
//          }
//          break;
//        case 'Candidate':
//          candidateProfileDetails = await CandidateProfile.findOne({ email: null });
//          if (!candidateProfileDetails) {
//            candidateProfileDetails = await CandidateProfile.create({
//              name: null, email: null, about: null, contactNumber: null,
//              skill: null, city: null, PreferJobLocation: null, degree: null,
//            });
//          }
//          break;
//        default:
//          // Handle other account types if needed
//          break;
//      }
 
//      // Create the user
//      const user = await User.create({
//        name,
//        email,
//        date,
//        contactNumber,
//        password: hashedPassword,
//        accountType,
//        adminDetails: null,
//        candidateDetails: candidateProfileDetails._id,
//        companyDetails: companyProfileDetails._id,
//        image: "",
//      });
 
//      // Return response
//      return res.status(200).json({
//        success: true,
//        user,
//        message: 'User is registered Successfully',
//      });
//    } catch(error) {
//      console.log(error);
//      return res.status(500).json({
//        success: false,
//        message: "User cannot be registered. Please try again.",
//      });
//    }
//  };
 
 // sendotp controller
//  exports.sendotp = async (req, res) => {
//    try {
//      const { email, contactNumber } = req.body;
 
//      // Check if user is already present for Company account type
//      const checkCompanyUserPresent = await User.findOne({ email, accountType: "Company" });
//      if (checkCompanyUserPresent) {
//        return res.status(401).json({
//          success: false,
//          message: `Company user is Already Registered`,
//        });
//      }
 
//      // Check if user is already present for Candidate account type
//      const checkCandidateUserPresent = await User.findOne({ contactNumber, accountType: "Candidate" });
//      if (checkCandidateUserPresent) {
//        return res.status(401).json({
//          success: false,
//          message: `Candidate user is Already Registered`,
//        });
//      }
 
//      // Generate OTP
//      const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
 
//      // Save OTP for Company user
//      if (checkCompanyUserPresent) {
//        await OTP.create({ email, otp });
//      }
 
//      // Save OTP for Candidate user
//      if (checkCandidateUserPresent) {
//        await OTP.create({ mobileNumber: contactNumber, otp });
//      }
 
//      res.status(200).json({
//        success: true,
//        message: `OTP Sent Successfully`,
//        otp,
//      });
//    } catch (error) {
//      console.log(error.message);
//      return res.status(500).json({ success: false, error: error.message });
//    }
//  };
//  const accountSid = process.env.TWILIO_ACCOUNT_SID;
//  const authToken = process.env.TWILIO_AUTH_TOKEN;
//  const client = twilio(accountSid, authToken);

 exports.testotp = async (req,res) => {

  const accountSid = 'AC00abbd8f74734ee9164062d909eb4de1';
const authToken = 'e2929348cbc83182e7b5363ceda055dc';
const client = require('twilio')(accountSid, authToken);

client.verify.v2.services("VA39379feb8ab2c04845dc3082e34a9f6a")
      .verifications
      .create({to: '+905323047271', channel: 'sms', body:"Hello how are you"})
      .then(verification => console.log(verification.status));

}

// original signup code is here 
exports.signup = async(req, res)=>{
   try{
         //fetching data
        const {name,
               email,
               password,
               confirmPassword,
               contactNumber,
               date,
               city,
               accountType,
               otp,
            } = req.body.email;

            console.log("request", req);
            console.log("req.body : ",req.body)

            console.log("Reqyest.body.email: ",req.body.email);
         //validate data
         if(!name || !email || !contactNumber || !date || !city || !password || !confirmPassword || !accountType || !otp){
            return res.status(403).json({
               success:false,
               message:"All fields are required",
            })
         }

         //match 2 passwords
         if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and ConfirmPassword value does not match, please try again",
            })
        }

        //check user already exists or not
        const existingUser = await User.findOne({email});
        if(existingUser){
         return res.status(400).json({
            success:false,
            message:"User already registered",
         })
        }

        //ToDo: otp model and further code below
        //find most recent  OTP stored for the user 
        const response = await OTP.find({email}).sort({ createdAt: -1 }).limit(1);
        console.log(response);
        // validate OTP
        if(recentOtp.length === 0) {
          //OTP not found
          return res.status(400).json({
              success:false,
              message:"OTP Not Found",
          })
      }
      else if(otp !== recentOtp[0].otp) {
          //Invalid Otp
          return res.status(400).json({
              success:false,
              message:"Invalid OTP",
          });
      }
    
      

        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create the additional profile for User
        let companyProfileDetails = {};
        let candidateProfileDetails = {};
        let adminProfileDetails = {};

        switch(accountType) {
         case 'Company':
            companyProfileDetails = await CompanyProfile.findOne({ email: null });
            if(!companyProfileDetails){
               companyProfileDetails = await CompanyProfile.create({
               email:null,name:null,contactNumber:null,position:null,
               dateOfBirth:null,companyTitle:null,industryName:null,
               taxAdministration:null,taxNumber:null,companyAddress:null,
               companyIcon:null,companyBackgroundIcon:null,
            });
         }
            break;

         case 'Candidate':
            candidateProfileDetails = await CandidateProfile.findOne({email: null});
            if(!candidateProfileDetails){
               candidateProfileDetails = await CandidateProfile.create({
               name:null,email:null,about:null,contactNumber:null,
               skill:null,city:null,PreferJobLocation:null,degree:null,   
            });
         }
            break;
         default:
            adminProfileDetails = await AdminProfile.findOne({email: null});
            if(!adminProfileDetails){
               adminProfileDetails = await AdminProfile.create({
               firstName:null,middleName:null,lastName:null,
               profileImage:null,backgroundImage:null,post:null,bio:null,
            });
         }
        }

        //create the user
        const user =  await User.create({
         name,
         email,
         date,
         contactNumber,
         password: hashedPassword,
         accountType: accountType,
         // additionalDetails: profileDetails._id,
         adminDetails: adminProfileDetails._id,
         candidateDetails: candidateProfileDetails._id,
         companyDetails: companyProfileDetails._id,
         image: "",
        })

      // const popu = await User.findById(user_id).populate('adminDetails').populate('companyDetails').populate('candidateDetails').exec();
        //return response
         return res.status(200).json({
         success : true,
         user,
         message:'User is registered Successfully',
      });

   } catch(error){
      console.log(error);
      return res.status(500).json({
         success:false,
         message:"User cannot be registered. Please try again."
      });
   }

}

exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email })
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await OTP.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}



//Login
exports.login = async (req, res) => {
   try{

      // get data from req body
      const {email, password} = req.body;
      
      //data validation
      if(!email || !password){
         return res.status(403).json({
            success:false,
            message:"All fields are required"
         });
      }

      //check user - exists or not
      const user = await User.findOne({email}).populate("adminDetails").populate("companyDetails").populate("candidateDetails");
      if(!user){
         return res.status(401).json({
            success: false,
            message:"User is not registered, please signupn first."
         });
      }

      //generate JWT, After password matching
      if(await bcrypt.compare(password, user.password)) {
         const payload  = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
         }
         const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn:"5h",
         });
         user.token = token;
         user.password = undefined;

         //create cookies and send response
         const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
         }
         console.log("token", token);
         console.log("user.token", user.token);
         console.log("loggedinn");
         res.cookie("token", token, options).status(200).json({
            success:true,
            token,
            user,
            message: "Logged in successfully",
         })
      }
      else{
         return res.status(401).json({
            success:false,
            message: "Password is incorrect",
         });
      }
   } catch(error){
      console.log(error);
      return res.status(500).json({
         success:false,
         message:"Login failure, please try again",
      });
   }
};

exports.changePassword = async (req, res) => {

   try{

      //get data from req body
      //get old password, new password, confirm password
      const {id, password, newPassword, confirmPassword} = req.body;

      //validation
      if(!id || !password || !newPassword || !confirmPassword){
         return res.status(403).json({
            success:false,
            message:"All fields are required, please try again.",
         });
      }

      //check user is present or not
      const user = await User.findOne({id});
      if(!user){
         return res.status(401).json({
            success:false,
            message:"User is not registered, please Signup first."
         });
      }

      //comparing both passwords
      else if(password !== confirmPassword){
         return res.status(400).json({
            success:false,
            message:"Password and Confirm Password does not match, please try again."
         });
      }

      //update password in database
      const updatedPassword = await User.findByIdAndUpdate({id}, {
         password : updatedPassword,
      })
      
      //return response
      return res.status(200).json({
         success:true,
         message:"Password Updated Successfully.",
      });

   }catch(error){

      console.log(error);
      return res.status(500).json({
         success:false,
         message:"Password cannot be changed, please try again."
      });
   }
}

//      exports.signin =async(req, res)=> {

//      }
//         try{
//         const { email, password}= req.body;
//         // validation part 
//         if (!email){
//             return next(new ErrorResponse("Please add an email ", 403));

//         }
//         if(!password){
//             return next(new ErrorResponse("please add a password", 403));
//         }

//         // Cheack user mail 
//         const user= await User.findOne({email});
//         if(!user){
//             return next(new ErrorResponse("invalid Id , Identity not found",400));


//         }

//         // check password
//          const isMatched = await user.comparePassword(password);
//          if(!isMatched){
//             return next (new ErrorResponse("Invalid Password", 400))
//          }

// sendTokenResponse(user, 200 , res);

//         } catch(error){
//          next (error);
//         }


 const sendTokenResponse= async(user,codeStatus, res)=>{
    const token= await user.getJwtToken();
    res
    .status(codeStatus)
    .cokkie('token', token, {maxAge: 60*60*1000, httpOnly:true})
    .json({success:true, token, user})
 }


 // Logout

 exports.logout = (req, res, next)=>{
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message : "Logged out"
    })
 }

 // User profile

 exports.userProfile = async(req, res, next)=>{
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
        success:true,
         user
    })
 }
