const express = require("express");
const router = express.Router();
const trackRouter = require("./track");
const commonRouter = require("./common");
const commentRouter = require("./comment.js");
const likeRouter = require("./like.js");
const AuthRouter = require("./auth");
const listInfoRouter = require("./listinfo");
const searchRouter = require("./search");
const playListRouter = require("./playList");
const chatRouter = require("./chat");

const { ROUTE } = require("../config/constants");

router.use(ROUTE.INDEX.TRACKS, trackRouter);
router.use(ROUTE.INDEX.COMMON, commonRouter);
router.use(ROUTE.INDEX.TRACKS, commentRouter);
router.use(ROUTE.INDEX.TRACKS, likeRouter);
router.use(ROUTE.INDEX.AUTH, AuthRouter);
router.use(ROUTE.INDEX.LIST, listInfoRouter);
router.use(ROUTE.INDEX.SEARCH, searchRouter);
router.use(ROUTE.INDEX.PLAYLIST, playListRouter);
router.use(ROUTE.INDEX.CHAT, chatRouter);

module.exports = router;
