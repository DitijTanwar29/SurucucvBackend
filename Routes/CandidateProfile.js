const express = require("express");
const router = express.Router();
const { auth, isCandidate } = require("../middleware/auth");

const {
    updateCandidateProfile,
    updateDisplayPicture
} = require("../controllers/CandidateProfile");

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//                       Candidate Profile Routes
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

router.put("/updateCandidateProfile", auth, isCandidate, updateCandidateProfile);
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router;
