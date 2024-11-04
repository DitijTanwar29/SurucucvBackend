const express = require("express");
const router = express.Router();
const { auth, isCompany } = require("../middleware/auth");

const {
    updateCompanyProfile,
    updateDisplayPicture,
    deleteAccount,
    getCompanyDetails,
    getCompanyById,
} = require("../controllers/CompanyProfile");

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//                       Company Profile Routes
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

router.put("/updateCompanyProfile", auth, isCompany, updateCompanyProfile);
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/getCompanyDetails", auth, getCompanyDetails)
router.post("/getCompanyById", getCompanyById)
router.delete("/deleteAccount", auth, deleteAccount)
module.exports = router;
