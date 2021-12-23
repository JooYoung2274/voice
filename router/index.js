const express = require("express");
const trackRouter = require("./track");
const commonRouter = require("./common");
const commentRouter = require("./comments.js");
const likeRouter = require("./likes.js");
const router = express.Router();

router.use("/tracks", trackRouter);
router.use("/common", commonRouter);
router.use("/tracks", commentRouter);
router.use("/tracks", likeRouter);


module.exports = router;
