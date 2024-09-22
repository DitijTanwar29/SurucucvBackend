const express = require("express");
const router = express.Router();

//Job controllers Import
const { createPackage, updateAdvertisingPackage, deleteAdvertisingPackage,
showAllPackages, getPackageDetails, getActivePackages,updatePackageStatus,
confirmPayment } = require("../controllers/Package")

//Import middlewares
const { auth, isCompany, isCandidate, isAdmin} = require("../middleware/auth");

//package routes 
router.post("/createPackage", auth, isAdmin, createPackage);
router.post("/updatePackage", auth, isAdmin, updateAdvertisingPackage);
router.delete("/deletePackage",auth, isAdmin, deleteAdvertisingPackage);
router.get("/showAllPackages", showAllPackages);
router.post("/getPackageDetails", getPackageDetails);
router.get("/getActivPackages",getActivePackages);
router.post("/updatePackageStatus", updatePackageStatus);
router.post("/confirm-payment", confirmPayment);
module.exports = router;