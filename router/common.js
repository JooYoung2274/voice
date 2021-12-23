const express = require("express");
const router = express.Router();
const commonController = require("../controller/commonController");

router.get("/", commonController.mainTracksGet);
router.get("/user/:userId", commonController.myTracksGet);
router.get("/track/:trackId", commonController.detailTrackGet);

router.get("/search", commonController.categorySelect);

module.exports = router;
