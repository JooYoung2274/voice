const express = require("express");
const trackRouter = require("./track");
const commonRouter = require("./common");
const router = express.Router();

router.use("/tracks", trackRouter);
router.use("/common", commonRouter);

module.exports = router;
