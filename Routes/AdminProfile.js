const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");

const {
    getAdminDetails,
    updateAdminProfile,
    deleteAccount,
    updateDisplayPicture
} = require("../controllers/AdminProfile");

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//                       Admin Profile Routes
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

router.get("/getAdminDetails", auth, getAdminDetails)
router.put("/updateAdminProfile", auth, isAdmin, updateAdminProfile);
router.post("/deleteAccount", auth, deleteAccount);
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

//todo testing of delete api is pending
module.exports = router;
