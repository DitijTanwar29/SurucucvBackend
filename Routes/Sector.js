const express = require("express");
const router = express.Router();

//importing the controllers

//Service controllers Import
const { createSector, editSector, deleteSector, showAllSectors,
     updateSectorStatus, getActiveSectors, getSectorDetails } = require("../controllers/Sector");



const { auth, isAdmin} = require("../middleware/auth");




router.post("/createSector", auth , isAdmin, createSector);
router.post("/editSector", auth, isAdmin, editSector);
router.delete("/deleteSector", auth, isAdmin, deleteSector);
router.get("/showAllSectors", showAllSectors);
router.post("/updateSectorStatus", updateSectorStatus);
router.post("/getSectorDetails", getSectorDetails);
router.get("/getActiveSectors",getActiveSectors);

module.exports = router;
