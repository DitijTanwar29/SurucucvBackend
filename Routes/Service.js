const express = require("express");
const router = express.Router();


//importing the controllers

//Service controllers Import
const { createService, editService, showAllServices, getServiceDetails, deleteService, getInactiveServices } = require("../controllers/Service");

//Import middlewares
const { auth, isCompany, isCandidate, isAdmin} = require("../middleware/auth");

//************************************************************************************************
//                                   Service routes
// *************************************************************************************************


//Service can only be created by Admin
router.post("/createService", auth , isAdmin, createService);
router.post("/editService", auth, isAdmin, editService);
router.delete("/deleteService", auth, isAdmin, deleteService);
router.get("/showAllServices", showAllServices);
router.post("/getServiceDetails", getServiceDetails);
router.get("/getInactiveServices",getInactiveServices);
module.exports = router;