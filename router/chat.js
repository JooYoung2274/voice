const express = require("express");
const chatController = require("../controller/chatCtrl");
const { needLogin } = require("../middleware/auth-middleware");
const { voiceMulter } = require("../middleware/uploader");
const trackUploader = voiceMulter.single("trackFile");
const router = express.Router();

router.get("/", chatController.getChatByIds);
router.get("/list", chatController.getChatListByUserId);
router.get("/new", chatController.checkNewChat);
router.post("/track", trackUploader, chatController.postTrack);

module.exports = router;
