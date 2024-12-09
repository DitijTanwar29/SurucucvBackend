const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const otpGenerator = require("otp-generator")
const User = require("../models/User");
const CandidateProfile = require("../models/CandidateProfile");
const CompanyProfile = require("../models/CompanyProfile");
const AdminProfile = require("../models/AdminProfile");
const OTP = require('../models/OTP');
const axios = require('axios');
const xmlbuilder = require('xmlbuilder');
const { sendSmsOtp } = require('../utils/smsSender');





// // original signup code is here 
// exports.signup = async(req, res)=>{
//    try{
//          //fetching data
//         const {name,
//                email,
//                password,
//                confirmPassword,
//                contactNumber,
//                date,
//                city,
//                accountType,
//                otp,
//             } = req.body;

//             // console.log("request", req);
//             console.log("req.body : ",req.body)

//             console.log("Reqyest.body.email: ",req.body.email);
//          //validate data
//          if(!name || !email || !contactNumber || !date 
//             || !city || !password || !confirmPassword ||
//              !accountType || !otp){
//             return res.status(403).json({
//                success:false,
//                message:"All fields are required",
//             })
//          }

//          //match 2 passwords
//          if(password !== confirmPassword){
//             return res.status(400).json({
//                 success:false,
//                 message:"Password and ConfirmPassword value does not match, please try again",
//             })
//         }

//         //check user already exists or not
//         const existingUser = await User.findOne({email});
//         if(existingUser){
//          return res.status(400).json({
//             success:false,
//             message:"User already registered",
//          })
//         }

//         //ToDo: otp model and further code below
//         //find most recent  OTP stored for the user 
//         const response = await OTP.find({email}).sort({ createdAt: -1 }).limit(1);
//         console.log(response);
//         // validate OTP
//         if(recentOtp.length === 0) {
//           //OTP not found
//           return res.status(400).json({
//               success:false,
//               message:"OTP Not Found",
//           })
//       }
//       else if(otp !== recentOtp[0].otp) {
//           //Invalid Otp
//           return res.status(400).json({
//               success:false,
//               message:"Invalid OTP",
//           });
//       }
    
      

//         //Hash Password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         //create the additional profile for User
//         let companyProfileDetails = {};
//         let candidateProfileDetails = {};
//         let adminProfileDetails = {};

//         switch(accountType) {
//          case 'Company':
//             companyProfileDetails = await CompanyProfile.findOne({ email: null });
//             if(!companyProfileDetails){
//                companyProfileDetails = await CompanyProfile.create({
//                email:null,name:null,contactNumber:null,position:null,
//                dateOfBirth:null,companyTitle:null,industryName:null,
//                taxAdministration:null,taxNumber:null,companyAddress:null,
//                companyIcon:null,companyBackgroundIcon:null,
//             });
//          }
//             break;

//          case 'Candidate':
//             candidateProfileDetails = await CandidateProfile.findOne({email: null});
//             if(!candidateProfileDetails){
//                candidateProfileDetails = await CandidateProfile.create({
//                name:null,email:null,about:null,contactNumber:null,
//                skill:null,city:null,PreferJobLocation:null,degree:null,   
//             });
//          }
//             break;
//          default:
//             adminProfileDetails = await AdminProfile.findOne({email: null});
//             if(!adminProfileDetails){
//                adminProfileDetails = await AdminProfile.create({
//                firstName:null,middleName:null,lastName:null,
//                profileImage:null,backgroundImage:null,post:null,bio:null,
//             });
//          }
//         }

//         //create the user
//         const user =  await User.create({
//          name,
//          email,
//          date,
//          contactNumber,
//          password: hashedPassword,
//          accountType: accountType,
//          // additionalDetails: profileDetails._id,
//          adminDetails: adminProfileDetails._id,
//          candidateDetails: candidateProfileDetails._id,
//          companyDetails: companyProfileDetails._id,
//          image: "",
//         })

//       // const popu = await User.findById(user_id).populate('adminDetails').populate('companyDetails').populate('candidateDetails').exec();
//         //return response
//          return res.status(200).json({
//          success : true,
//          user,
//          message:'User is registered Successfully',
//       });

//    } catch(error){
//       console.log(error);
//       return res.status(500).json({
//          success:false,
//          message:"User cannot be registered. Please try again."
//       });
//    }

// }
//working for company 
// exports.sendotp = async (req, res) => {
//   try {
//     const { email } = req.body

//     // Check if user is already present
//     // Find user with provided email
//     const checkUserPresent = await User.findOne({ email })
//     // to be used in case of signup

//     // If user found with provided email
//     if (checkUserPresent) {
//       // Return 401 Unauthorized status code with error message
//       return res.status(401).json({
//         success: false,
//         message: `User is Already Registered`,
//       })
//     }

//     var otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     })
//     const result = await OTP.findOne({ otp: otp })
//     console.log("Result in Generate OTP Func")
//     console.log("OTP", otp)
//     console.log("Result", result)
//     while (result) {
//       otp = otpGenerator.generate(6, {
//         upperCaseAlphabets: false,
//         lowerCaseAlphabets: false,
//         specialChars: false,
//       })
//     }
//     const otpPayload = { email, otp }
//     const otpBody = await OTP.create(otpPayload)
//     console.log("OTP Body", otpBody)
//     res.status(200).json({
//       success: true,
//       message: `OTP Sent Successfully`,
//       otp,
//     })
//   } catch (error) {
//     console.log(error.message)
//     return res.status(500).json({ success: false, error: error.message })
//   }
// }


//for both 
// const User = require('../models/User');
// const OTP = require('../models/OTP');
// const mailSender = require('../utils/mailSender');
// const emailTemplate = require('../mail/templates/emailVerificationTemplate');

exports.sendotp = async (req, res) => {
   try {
     const { email, contactNumber, accountType } = req.body;
 
     // Check if user is already present
     const checkUserPresent = await User.findOne({ email });
 
     // If user found with provided email
     if (checkUserPresent) {
       return res.status(401).json({
         success: false,
         message: `User is Already Registered`,
       });
     }
 
     const otp = otpGenerator.generate(6, {
       upperCaseAlphabets: false,
       lowerCaseAlphabets: false,
       specialChars: false,
     });
 
     // Save OTP to the database
     const otpPayload = { email, otp, accountType, contactNumber };
     await OTP.create(otpPayload);

 
     res.status(200).json({
       success: true,
       message: `OTP Sent Successfully`,
       otp,
     });
   } catch (error) {
     console.error("Error occurred while sending OTP: ", error.message);
     return res.status(500).json({ success: false, error: error.message });
   }
 };
 





exports.sendSmsOtp = async (req, res) => {
   const { phoneNumber, otp } = req.body;
 
   // Generate the XML data
   const xml = xmlbuilder.create('mainbody')
     .ele('header')
       .ele('usercode', '2166066134').up()
       .ele('password', 'W5-1vhsX').up()
       .ele('msgheader', 'ADRTURKLTD.').up()
       .ele('appkey', '01007a72af089606218e04d553a740f5').up()
     .up()
     .ele('body')
       .ele('msg')
         .dat(`Your OTP is ${otp}`)  // Correctly placed CDATA text
       .up()
       .ele('no', phoneNumber).up()
     .up()
   .end({ pretty: true });
 
   try {
     const response = await axios.post('https://api.netgsm.com.tr/sms/send/otp', xml, {
       headers: {
         'Content-Type': 'application/xml'
       }
     });
 
     if (response.data.result !== '00') {
      //  console.log(response.data.result)
       return res.status(500).json({ success: false, message: 'Failed to send OTP' });
       
     }
 
     res.status(200).json({ success: true, message: 'OTP sent successfully' });
   } catch (error) {
     console.error('Error sending OTP:', error);
     res.status(500).json({ success: false, message: 'Failed to send OTP' });
   }
 };

// exports.signup = async (req, res) => {
   
//     try {
//       console.log("signup request body :", req.body)
//         const { name, email, password, confirmPassword, date, city, contactNumber, accountType, otp} = req.body;

//         if (password !== confirmPassword) {
//             return res.status(400).json({ success: false, message: 'Passwords do not match' });
//         }

//         // Check if the user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(401).json({ success: false, message: 'User is already registered' });
//         }
//  // Generate OTP
//  const smsOtp = generateOtp();

//  if (accountType === 'CANDIDATE') {
//    // Send OTP via SMS using Netgsm API
//    const xmlData = xmlbuilder.create('mainbody')
//      .ele('header')
//        .ele('usercode', '2166066134').up()
//        .ele('password', 'W5-1vhsX').up()
//        .ele('msgheader', 'ADRTURKLTD.').up()
//        .ele('appkey', '01007a72af089606218e04d553a740f5').up()
//      .up()
//      .ele('body')
//        .ele('msg')
//          .dat(`Your OTP is ${smsOtp}`)  // Correctly placed CDATA text
//        .up()
//        .ele('no', contactNumber).up()
//      .up()
//    .end({ pretty: true });

//    const response = await axios.post('https://api.netgsm.com.tr/sms/send/otp', xmlData, {
//      headers: {
//        'Content-Type': 'application/xml'
//      }
//    });

//    if (response.data.result !== '00') {
//      return res.status(500).json({ success: false, message: 'Failed to send OTP' });
//    }

//       // Save OTP to the database
//       await OTP.create({ email, otp: smsOtp });

//         } else if (accountType === 'COMPANY') {
//             // Send OTP via email (assuming you have a sendOtp function)
//             // Find the most recent OTP for the email
//     const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
//     console.log(response)
//     if (response.length === 0) {
//       // OTP not found for the email
//       return res.status(400).json({
//         success: false,
//         message: "OTP length could not be 0.",
//       })
//     } else if (otp !== response[0].otp) {
//       // Invalid OTP
//       return res.status(400).json({
//         success: false,
//         message: "Incorrect OTP.",
//       })
//     }
//         }


//          //Hash Password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         //create the additional profile for User
//         let companyProfileDetails = {};
//         let candidateProfileDetails = {};
//         let adminProfileDetails = {};

//         switch(accountType) {
//          case 'Company':
//             companyProfileDetails = await CompanyProfile.findOne({ email: null });
//             if(!companyProfileDetails){
//                companyProfileDetails = await CompanyProfile.create({
//                email:null,name:null,contactNumber:null,position:null,
//                dateOfBirth:null,companyTitle:null,industryName:null,
//                taxAdministration:null,taxNumber:null,companyAddress:null,
//                companyIcon:null,companyBackgroundIcon:null,
//             });
//          }
//             break;

//          case 'Candidate':
//             candidateProfileDetails = await CandidateProfile.findOne({email: null});
//             if(!candidateProfileDetails){
//                candidateProfileDetails = await CandidateProfile.create({
//                name:null,email:null,about:null,contactNumber:null,
//                skill:null,city:null,PreferJobLocation:null,degree:null,   
//             });
//          }
//             break;
//          default:
//             adminProfileDetails = await AdminProfile.findOne({email: null});
//             if(!adminProfileDetails){
//                adminProfileDetails = await AdminProfile.create({
//                firstName:null,middleName:null,lastName:null,
//                profileImage:null,backgroundImage:null,post:null,bio:null,
//             });
//          }
//         }

//         //create the user
//         const user =  await User.create({
//          name,
//          email,
//          date,
//          contactNumber,
//          password: hashedPassword,
//          accountType: accountType,
//          // additionalDetails: profileDetails._id,
//          adminDetails: adminProfileDetails._id,
//          candidateDetails: candidateProfileDetails._id,
//          companyDetails: companyProfileDetails._id,
//          image: "",
//         })

//       // const popu = await User.findById(user_id).populate('adminDetails').populate('companyDetails').populate('candidateDetails').exec();
//         //return response
//          return res.status(200).json({
//          success : true,
//          user,
//          message:'User is registered Successfully',
//       });
//     } catch (error) {
//         console.error('Signup error:', error);
//         res.status(500).json({ success: false, message: 'Signup failed' });
//     }
// };

// exports.signup = async (req, res) => {
//    try {
//      console.log("signup request body:", req.body);
//      const { name, email, password, confirmPassword, date, city, contactNumber, accountType, otp } = req.body;
 
//      if (password !== confirmPassword) {
//        return res.status(400).json({ success: false, message: 'Passwords do not match' });
//      }
 
//      const existingUser = await User.findOne({ email });
//      if (existingUser) {
//        return res.status(401).json({ success: false, message: 'User is already registered' });
//      }
 
//      const otpQuery = { accountType, otp };
//      if (accountType === 'COMPANY') {
//        otpQuery.email = email;
//      } else if (accountType === 'CANDIDATE') {
//        otpQuery.contactNumber = contactNumber;
//      } else {
//        return res.status(400).json({ success: false, message: 'Invalid account type' });
//      }
 
//      const otpRecord = await OTP.findOne(otpQuery).sort({ createdAt: -1 }).limit(1);
//      if (!otpRecord) {
//        return res.status(400).json({ success: false, message: "OTP not found or expired." });
//      }
 
//      const hashedPassword = await bcrypt.hash(password, 10);
 
//      let companyProfileDetails = {};
//      let candidateProfileDetails = {};
//      let adminProfileDetails = {};
 
//      switch (accountType) {
//        case 'COMPANY':
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
 
//        case 'CANDIDATE':
//          candidateProfileDetails = await CandidateProfile.findOne({ email: null });
//          if (!candidateProfileDetails) {
//            candidateProfileDetails = await CandidateProfile.create({
//              name: null, email: null, about: null, contactNumber: null,
//              skill: null, city: null, PreferJobLocation: null, degree: null,
//            });
//          }
//          break;
 
//        default:
//          adminProfileDetails = await AdminProfile.findOne({ email: null });
//          if (!adminProfileDetails) {
//            adminProfileDetails = await AdminProfile.create({
//              firstName: null, middleName: null, lastName: null,
//              profileImage: null, backgroundImage: null, post: null, bio: null,
//            });
//          }
//      }
 
//      const user = await User.create({
//        name,
//        email,
//        date,
//        contactNumber,
//        password: hashedPassword,
//        accountType,
//        adminDetails: adminProfileDetails._id,
//        candidateDetails: candidateProfileDetails._id,
//        companyDetails: companyProfileDetails._id,
//        image: "",
//      });
 
//      return res.status(200).json({
//        success: true,
//        user,
//        message: 'User is registered Successfully',
//      });
//    } catch (error) {
//      console.error('Signup error:', error);
//      res.status(500).json({ success: false, message: 'Signup failed' });
//    }
//  };

// exports.signup = async (req, res) => {
//    try {
//      const { name, email, password, confirmPassword, date, city, contactNumber, accountType, otp } = req.body;
 
//      if (password !== confirmPassword) {
//        return res.status(400).json({ success: false, message: 'Passwords do not match' });
//      }
 
//      const existingUser = await User.findOne({ email });
//      if (existingUser) {
//        return res.status(401).json({ success: false, message: 'User is already registered' });
//      }
 
//      const otpCriteria = accountType === 'Candidate' ? { contactNumber } : { email };
//      const otpDoc = await OTP.findOne(otpCriteria).sort({ createdAt: -1 });
 
//      if (!otpDoc || otp !== otpDoc.otp) {
//        return res.status(400).json({ success: false, message: 'Incorrect OTP' });
//      }
 
//      const hashedPassword = await bcrypt.hash(password, 10);
 
//      let companyProfileDetails = {};
//      let candidateProfileDetails = {};
//      let adminProfileDetails = {};
 
//      switch (accountType) {
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
//          adminProfileDetails = await AdminProfile.findOne({ email: null });
//          if (!adminProfileDetails) {
//            adminProfileDetails = await AdminProfile.create({
//              firstName: null, middleName: null, lastName: null,
//              profileImage: null, backgroundImage: null, post: null, bio: null,
//            });
//          }
//      }
 
//      const user = await User.create({
//        name, email, date, contactNumber, password: hashedPassword, accountType,
//        adminDetails: adminProfileDetails._id,
//        candidateDetails: candidateProfileDetails._id,
//        companyDetails: companyProfileDetails._id,
//        image: "",
//      });
 
//      return res.status(200).json({
//        success: true,
//        user,
//        message: 'User is registered Successfully',
//      });
//    } catch (error) {
//      console.error('Signup error:', error);
//      res.status(500).json({ success: false, message: 'Signup failed' });
//    }
//  };
 
// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword, date, city, contactNumber, accountType, otp } = req.body;

//     // 1. Check if passwords match
//     if (password !== confirmPassword) {
//       return res.status(400).json({ success: false, message: 'Passwords do not match' });
//     }

//     // 2. Check if the user already exists using email
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(401).json({ success: false, message: 'User is already registered' });
//     }

//     // 3. OTP verification based on accountType
//     let otpDoc;

//     if (accountType === 'Candidate') {
//       // Fetch OTP sent to the contactNumber for Candidates
//       otpDoc = await OTP.findOne({ contactNumber }).sort({ createdAt: -1 });
//     } else if (accountType === 'Company') {
//       // Fetch OTP sent to the email for Companies
//       otpDoc = await OTP.findOne({ email }).sort({ createdAt: -1 });
//     } else {
//       return res.status(400).json({ success: false, message: 'Invalid account type' });
//     }

//     // 4. Check if the OTP is valid
//     if (!otpDoc || otp !== otpDoc.otp) {
//       return res.status(400).json({ success: false, message: 'Incorrect OTP' });
//     }

//     // 5. Hash the password before storing it
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 6. Create profile details based on accountType
//     let companyProfileDetails = {};
//     let candidateProfileDetails = {};
//     let adminProfileDetails = {};

//     switch (accountType) {
//       case 'Company':
//         // Create or find an existing CompanyProfile
//         companyProfileDetails = await CompanyProfile.findOne({ email: null });
//         if (!companyProfileDetails) {
//           companyProfileDetails = await CompanyProfile.create({
//             email: null, name: null, contactNumber: null, position: null,
//             dateOfBirth: null, companyTitle: null, industryName: null,
//             taxAdministration: null, taxNumber: null, companyAddress: null,
//             companyIcon: null, companyBackgroundIcon: null,
//           });
//         }
//         break;

//       case 'Candidate':
//         // Create or find an existing CandidateProfile
//         candidateProfileDetails = await CandidateProfile.findOne({ email: null });
//         if (!candidateProfileDetails) {
//           candidateProfileDetails = await CandidateProfile.create({
//             name: null, email: null, about: null, contactNumber: null,
//             skill: null, city: null, PreferJobLocation: null, degree: null,
//           });
//         }
//         break;

//       default:
//         // Create or find an existing AdminProfile
//         adminProfileDetails = await AdminProfile.findOne({ email: null });
//         if (!adminProfileDetails) {
//           adminProfileDetails = await AdminProfile.create({
//             firstName: null, middleName: null, lastName: null,
//             profileImage: null, backgroundImage: null, post: null, bio: null,
//           });
//         }
//     }

//     // 7. Create the user in the database
//     const user = await User.create({
//       name,
//       email,
//       date,
//       contactNumber,
//       password: hashedPassword,
//       accountType,
//       adminDetails: adminProfileDetails._id,
//       candidateDetails: candidateProfileDetails._id,
//       companyDetails: companyProfileDetails._id,
//       image: "",
//     });

//     // 8. Return success response
//     return res.status(200).json({
//       success: true,
//       user,
//       message: 'User is registered successfully',
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ success: false, message: 'Signup failed' });
//   }
// };

exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      city,
      contactNumber,
      accountType,
      otp,
    } = req.body;

    // 1. Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // 2. Check if the user already exists using email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ success: false, message: 'User is already registered' });
    }

    // 3. OTP Verification
    let otpDoc;
    if (accountType === 'Candidate') {
      otpDoc = await OTP.findOne({ contactNumber }).sort({ createdAt: -1 });
    } else if (accountType === 'Company') {
      otpDoc = await OTP.findOne({ email }).sort({ createdAt: -1 });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid account type' });
    }

    if (!otpDoc || otp !== otpDoc.otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }

    // 4. Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create profile details based on accountType
    let companyProfileDetails = null;
    let candidateProfileDetails = null;
    let adminProfileDetails = null;

    if (accountType === 'Company') {
      companyProfileDetails = await CompanyProfile.create({});
    } else if (accountType === 'Candidate') {
      candidateProfileDetails = await CandidateProfile.create({});
    } else {
      adminProfileDetails = await AdminProfile.create({});
    }

    // 6. Create the user in the database
    const user = await User.create({
      name,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      adminDetails: adminProfileDetails?._id,
      candidateDetails: candidateProfileDetails?._id,
      companyDetails: companyProfileDetails?._id,
      image: '',
    });

    return res.status(200).json({
      success: true,
      user,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
};

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
