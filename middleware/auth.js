const ErrorResponse = require('../utils/errResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Check is User is authenticated
// exports.isAuthenticated =  async (req, res, next)=>{
//     const { token} = req.cookies;

//     // Make sure token exists
//     if (!token){
//         return next (new ErrorResponse('Not authorised to access this route', 401));
//     }
//     try{
//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id);
//         next();
//     }catch(error){
//           return next(new ErrorResponse('Not authorished to accesss this routes', 401));    
//     }
    
// }
exports.auth = async (req, res, next) => {
    try{
        //extract the token
        console.log("Request: ", req.cookies);
        // console.log("req : ",req);
        // console.log("req. cookies",req.cookies);
        const token = req.cookies.token
                        || req.body.token
                        || req.header("Authorization").replace("Bearer ","");

        //if token missing. then return response
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        //verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(error){
            //verification issue
            return res.status(401).json({
                success:false,
                message: "Invalid token",
            });
        }
        next();
 
    }catch(error) {
        console.error(error);
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}
//isCandidate
exports.isCandidate =  async (req, res, next) => {
    try{

        if(req.user.accountType !== "Candidate") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Candidate Only."
            });
        }
        next();
    }catch(error) {
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified, please try again.",
        });
    }
}

//isCompany
exports.isCompany = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Company") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Company Only."
            });
        }
        next();
    }catch(error) {
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified, please try again.",
        });
    }
}

//isAdmin 
exports.isAdmin = (req, res, next)=>{
    try{
        // console.log("req",req);
        // const user = req.user;
        // console.log("user",user);
        // const accountType = req.body?.accountType;
        // console.log("accountType",accountType);
        if(req.user.accountType !== "Admin") {
            // console.log(req.body.accounType)
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin Only."
            });
        }
        next();
    }catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified, please try again.",
        });
    }
}