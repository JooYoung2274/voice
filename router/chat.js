const express = require("express");
const chatController = require("../controller/chatCtrl");
const { needLogin } = require("../middleware/auth-middleware");

const router = express.Router();

router.get("/", chatController.getChatByIds);
router.get("/list", chatController.getChatListByUserId);
router.get("/new", chatController.checkNewChat);

module.exports = router;
