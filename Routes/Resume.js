const express = require("express");
const router = express.Router();


//importing the controllers

//Job controllers Import
const { createResume, getResumeDetails } = require("../controllers/Resume");

//Import middlewares
const { auth, isCompany, isCandidate, isAdmin} = require("../middleware/auth");
const {checkUserStatus} = require("../middleware/checkUserStatus")
//************************************************************************************************
//                                   Resume routes
// *************************************************************************************************


router.post("/createResume", auth , isCandidate,checkUserStatus, createResume);
router.get("/getResumeDetails",auth, checkUserStatus,getResumeDetails);
module.exports = router;