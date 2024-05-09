const express = require("express");
const router = express.Router();


//importing the controllers

//Job controllers Import
const { createJob, showAllJobs, updateJob, deleteJob, getJobDetails, approveAJobPost, 
    getAllApprovedJobPosts, applyForJob, showAppliedJobs, showAppliedCandidates,
    getTopJobPostings, searchJobs, getRecentlyPublishedJobs,
    getFullTimeJobs, getPartTimeJobs } = require("../controllers/Job");

//Import middlewares
const { auth, isCompany, isCandidate, isAdmin} = require("../middleware/auth");

//************************************************************************************************
//                                   Job routes
// *************************************************************************************************


//Service can only be created by Admin
router.post("/createJob", auth , isCompany, createJob);
router.get("/showAllJobs", showAllJobs);
router.post("/getJobDetails", getJobDetails);
router.post("/editJob", auth, isCompany, updateJob);
router.delete("/deleteJob", auth, isCompany, deleteJob);
router.post("/approveAJobPost", auth, isAdmin, approveAJobPost);
router.get("/getAllApprovedJobPosts",getAllApprovedJobPosts);
router.post("/applyForJob", auth, isCandidate, applyForJob)
router.get("/showAppliedJobs", auth, showAppliedJobs);
router.get("/showAppliedCandidates", showAppliedCandidates);
router.get("/getTopJobPostings", getTopJobPostings);
router.get('/searchJobs', searchJobs);
router.get('/recentlyPublishedJobs', getRecentlyPublishedJobs);
router.get('/fullTimeJobs', getFullTimeJobs);
router.get('/partTimeJobs', getPartTimeJobs);
module.exports = router;