const express = require("express");
const trackRouter = require("./track");
const commonRouter = require("./common");
const commentRouter = require("./comment.js");
const likeRouter = require("./like.js");
const AuthRouter = require("./auth");
const listInfoRouter = require("./listinfo");
const searchRouter = require("./search");
const playListRouter = require("./playList");
const router = express.Router();

router.use("/tracks", trackRouter);
router.use("/common", commonRouter);
router.use("/tracks", commentRouter);
router.use("/tracks", likeRouter);
router.use("/auth", AuthRouter);
router.use("/listinfo", listInfoRouter);
router.use("/search", searchRouter);
router.use("/playlist", playListRouter);

module.exports = router;
