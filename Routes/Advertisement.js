const express = require("express");
const router = express.Router();
const { auth, isCompany, isAdmin } = require("../middleware/auth");
const {checkUserStatus} = require("../middleware/checkUserStatus")

const {
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    showAllAds,
    getAdById,
    approveAnAdPost,
    getActiveAds,
    getAdvertisementsByCompany
} = require("../controllers/Advertisement");
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//                       Advertisement Routes
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

router.post("/createAdvertisement", auth,isCompany,checkUserStatus, createAdvertisement)
router.put("/updateAdvertisement", auth, isCompany,checkUserStatus, updateAdvertisement);
router.post("/deleteAdvertisement", auth, isCompany, checkUserStatus,deleteAdvertisement);
router.post("/getAdDetails",getAdById)
router.get("/getActiveAds",getActiveAds);
router.get("/showAllAds", showAllAds);
router.post("/approveAnAdPost", auth, isAdmin, approveAnAdPost);
router.post("/getAdvertisementsByCompany", getAdvertisementsByCompany);

//todo testing of delete api is pending
module.exports = router;
