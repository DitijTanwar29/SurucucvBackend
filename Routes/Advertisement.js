const express = require("express");
const router = express.Router();
const { auth, isCompany, isAdmin } = require("../middleware/auth");

const {
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    showAllAds,
    getAdById,
    approveAnAdPost,
    getActiveAds
} = require("../controllers/Advertisement");

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//                       Advertisement Routes
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

router.post("/createAdvertisement", auth, createAdvertisement)
router.put("/updateAdvertisement", auth, isCompany, updateAdvertisement);
router.post("/deleteAdvertisement", auth, deleteAdvertisement);
router.post("/getAdDetails",getAdById)
router.get("/getActiveAds",getActiveAds);
router.get("/showAllAds", showAllAds);
router.post("/approveAnAdPost", auth, isAdmin, approveAnAdPost);

//todo testing of delete api is pending
module.exports = router;
