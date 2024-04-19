const express = require("express");
const router = express.Router();


//importing the controllers

//Job controllers Import
const { createResume, getResumeDetails } = require("../controllers/Resume");

//Import middlewares
const { auth, isCompany, isCandidate, isAdmin} = require("../middleware/auth");

//************************************************************************************************
//                                   Job routes
// *************************************************************************************************


//Service can only be created by Admin
router.post("/createResume", auth , isCandidate, createResume);
router.get("/getResumeDetails", getResumeDetails);
module.exports = router;