const express = require("express");
const router = express.Router();


//importing the controllers

//Job controllers Import
const { createJob, showAllJobs, updateJob, deleteJob, getJobDetails, approveAJobPost, 
    getAllApprovedJobPosts, applyForJob, showAppliedJobs, showAppliedCandidates,
    getTopJobPostings, searchJobs, getRecentlyPublishedJobs,
    getFullTimeJobs, getPartTimeJobs, getTopJobLocations,
    filterJobs, getInternationalJobs,
    getJobsBySector , getJobsByProvince, getJobsByService, showJobsByUserOrCompany,
    withdrawJobApplication } = require("../controllers/Job");

//Import middlewares
const { auth, isCompany, isCandidate, isAdmin} = require("../middleware/auth");
const {checkUserStatus} =require("../middleware/checkUserStatus")

//************************************************************************************************
//                                   Job routes
// *************************************************************************************************


//Service can only be created by Admin
router.post("/createJob", auth , isCompany, checkUserStatus, createJob);
router.get("/showAllJobs", showAllJobs);
router.post("/showAllJobsByCompany", showJobsByUserOrCompany);
router.post("/getJobDetails", getJobDetails);
router.post("/editJob", auth, isCompany, checkUserStatus, updateJob);
router.delete("/deleteJob", auth, isCompany,checkUserStatus, deleteJob);
router.post("/approveAJobPost", auth, isAdmin, approveAJobPost);
router.get("/getAllApprovedJobPosts",getAllApprovedJobPosts);
router.post("/applyForJob", auth, isCandidate, checkUserStatus,applyForJob)
router.get("/showAppliedJobs", auth,checkUserStatus, showAppliedJobs);
router.get("/showAppliedCandidates", checkUserStatus,showAppliedCandidates);
router.get("/getTopJobPostings", getTopJobPostings);
router.get('/searchJobs', searchJobs);
router.get('/recentlyPublishedJobs', getRecentlyPublishedJobs);
router.get('/fullTimeJobs', getFullTimeJobs);
router.get('/partTimeJobs', getPartTimeJobs);
router.get('/topJobLocations',getTopJobLocations)
router.get('/filterJobs', filterJobs)
router.get('/internationalJobs', getInternationalJobs)
router.get('/by-province', getJobsByProvince);
router.get('/by-sector', getJobsBySector);
router.get('/by-service', getJobsByService);
//candidate route 
router.post("/withdrawJobApplication",checkUserStatus, withdrawJobApplication);
module.exports = router;