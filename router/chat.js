const express = require("express");
const chatController = require("../controller/chatCtrl");
const { needLogin } = require("../middleware/auth-middleware");
const { voiceMulter, imageMulter } = require("../middleware/uploader");
const trackUploader = voiceMulter.single("trackFile");
const imageUploader = imageMulter.single("image");
const router = express.Router();

const { ROUTE } = require("../config/constants");

router.post(ROUTE.CHAT.CHAT, chatController.getChatByIds);
router.post(ROUTE.CHAT.LIST, chatController.getChatListByUserId);
router.post(ROUTE.CHAT.NEW, chatController.checkNewChat);
router.post(ROUTE.CHAT.TRACK, trackUploader, chatController.postTrack);
router.post(ROUTE.CHAT.IMAGE, imageUploader, chatController.postImage);

module.exports = router;
