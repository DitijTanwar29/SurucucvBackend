const express = require("express");
const router = express.Router();

//importing the controllers

//Service controllers Import
const { createSector, editSector, deleteSector, showAllSectors, updateSectorStatus } = require("../controllers/Sector");



const { auth, isAdmin} = require("../middleware/auth");




router.post("/createSector", auth , isAdmin, createSector);
router.post("/editSector", auth, isAdmin, editSector);
router.delete("/deleteSector", auth, isAdmin, deleteSector);
router.get("/showAllSectors", showAllSectors);
router.post("/updateSectorStatus", updateSectorStatus);

module.exports = router;
