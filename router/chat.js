const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatCtrl");
const { voiceMulter, imageMulter } = require("../middleware/uploader");
const trackUploader = voiceMulter.single("trackFile");
const imageUploader = imageMulter.single("image");

const { ROUTE } = require("../config/constants");

router.post(ROUTE.CHAT.CHAT, chatController.getChatByIds);
router.post(ROUTE.CHAT.LIST, chatController.getChatListByUserId);
router.post(ROUTE.CHAT.NEW, chatController.checkNewChat);
router.post(ROUTE.CHAT.TRACK, trackUploader, chatController.postTrack);
router.post(ROUTE.CHAT.IMAGE, imageUploader, chatController.postImage);

module.exports = router;
