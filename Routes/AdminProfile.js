const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");

const {
    getAdminDetails,
    updateAdminProfile,
    deleteAccount,
    updateDisplayPicture,
    uploadHeroImage,
    getHeroImage,
    getAllCompanies,
    getAllCandidates,
    toggleCompanyProfileStatus,
    toggleCandidateProfileStatus,
} = require("../controllers/AdminProfile");

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//                       Admin Profile Routes
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

router.get("/getAdminDetails", auth, getAdminDetails)
router.put("/updateAdminProfile", auth, isAdmin, updateAdminProfile);
router.post("/deleteAccount", auth, deleteAccount);
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.post("/upload-hero-image", auth, uploadHeroImage);
router.get("/get-hero-image", getHeroImage);
router.get("/companies", getAllCompanies);
router.get("/candidates", getAllCandidates);
router.patch("/company-status", toggleCompanyProfileStatus);
router.patch("/candidate-status", toggleCandidateProfileStatus);
//todo testing of delete api is pending
module.exports = router;
