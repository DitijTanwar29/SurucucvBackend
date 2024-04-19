const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");
const CandidateProfile = require("../models/CandidateProfile");
const CompanyProfile = require("../models/CompanyProfile");
const AdminProfile = require("../models/AdminProfile");

const OTP = require('../models/OTP');
const { sendSMS } = require('../models/Twilio');

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
               accountType
            } = req.body.email;

            console.log("request", req);
            console.log("req.body : ",req.body)

            console.log("Reqyest.body.email: ",req.body.email);
         //validate data
         if(!name || !email || !contactNumber || !date || !city || !password || !confirmPassword || !accountType){
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
      //   const recentOtp = await OTP.find({phone}).sort({ createdAt: -1 }).limit(1);
      //   console.log(recentOtp);

      //validate OTP
      

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
