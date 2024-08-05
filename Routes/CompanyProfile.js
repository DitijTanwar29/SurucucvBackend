const express = require("express");
const router = express.Router();
const { auth, isCompany } = require("../middleware/auth");

const {
    updateCompanyProfile,
    updateDisplayPicture,
    deleteAccount,
} = require("../controllers/CompanyProfile");

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//                       Company Profile Routes
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

router.put("/updateCompanyProfile", auth, isCompany, updateCompanyProfile);
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.delete("/deleteAccount", auth, deleteAccount)
module.exports = router;
