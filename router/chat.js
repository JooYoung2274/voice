const express = require("express");
const chatController = require("../controller/chatCtrl");
const { needLogin } = require("../middleware/auth-middleware");
const { voiceMulter } = require("../middleware/uploader");
const trackPass = voiceMulter.single("trackFile");
const router = express.Router();

router.post("/", chatController.getChatByIds);
router.post("/list", chatController.getChatListByUserId);
router.post("/new", chatController.checkNewChat);
router.post("/track", trackPass, chatController.postTrack);

module.exports = router;
