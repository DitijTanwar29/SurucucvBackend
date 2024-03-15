

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require ("jsonwebtoken");


const userSchema = new mongoose.Schema({

    name: {
        type:String,
        required:true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required:true
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    city: {
        type: String,
        // required: true
    },
    accountType: {
        type: String,
        enum: ["Admin","Candidate","Company"],
        required: true
    },
    adminDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdminProfile",
    },
    candidateDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CandidateProfile",
    }
    ,
    companyDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanyProfile",
    }
    ,
    token: {
        type: String,
    },
    image: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    jobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        }
    ],
    resume:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Resume",
    },
    
})

// Encrypting pasword before saving
// userSchema.pre('save', async function(next){
//     if (!this.isModified('password')){
//         next();
//     }
//     this.password = await bcrypt.hash(this.password, 10)
// })

// // Compare user password

// userSchema.method.comparePassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password)
// }

// // return JWT token
// userSchema.method.getJwtToken = function(){
//     return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
//         expiresIn:3600
//     });
// } 


module.exports = mongoose.model("User", userSchema);