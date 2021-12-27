const express = require("express");
const router = express.Router();
const commonController = require("../controller/commonController");
const { notNeedLogin } = require("../middleware/auth-middleware");

router.get("/", commonController.mainTracksGet);
router.get("/user/:userId", notNeedLogin, commonController.myTracksGet);
router.get("/track/:trackId", commonController.detailTrackGet);
router.get("/search", commonController.categorySelect);

module.exports = router;
