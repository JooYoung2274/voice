const express = require("express");
const chatController = require("../controller/chatCtrl");
const { needLogin } = require("../middleware/auth-middleware");
const { voiceMulter, imageMulter } = require("../middleware/uploader");
const trackUploader = voiceMulter.single("trackFile");
const imageUploader = imageMulter.single("image");
const router = express.Router();

router.post("/", chatController.getChatByIds);
router.post("/list", chatController.getChatListByUserId);
router.post("/new", chatController.checkNewChat);
router.post("/track", trackUploader, chatController.postTrack);
router.post("/image", imageUploader, chatController.postImage);

module.exports = router;
