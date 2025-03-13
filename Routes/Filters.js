const router = require("express").Router();
const { getFilters, applyFilters } = require("../controllers/Filters.controller");

router.get("/", getFilters);
router.post("/job",applyFilters )


module.exports = router;
