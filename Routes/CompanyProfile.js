const express = require("express");
const router = express.Router();
const { auth, isCompany } = require("../middleware/auth");

const {
    updateCompanyProfile,
    updateDisplayPicture
} = require("../controllers/CompanyProfile");

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//                       Company Profile Routes
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

router.put("/updateCompanyProfile", auth, isCompany, updateCompanyProfile);
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router;
