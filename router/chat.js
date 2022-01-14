const express = require("express");
const chatController = require("../controller/chatCtrl");

const router = express.Router();

router.get("/", chatController.getChatByIds);

module.exports = router;
