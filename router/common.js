const express = require("express");
const router = express.Router();
const commonController = require("../controller/commonController");

router.get("/", commonController.mainPageTracksGet);
router.get("/user/:userId", commonController.myPagetTracksGet);
router.get("/track/:trackId", commonController.detailTrackGet);

module.exports = router;
