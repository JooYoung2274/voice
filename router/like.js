const express = require("express");
const likeController = require("../controller/likeCtrl");
// middleware auth 경로바꾸기
const { needLogin } = require("../middleware/auth-middleware");

const router = express.Router();

router.post("/:trackId/like", needLogin, likeController.likePost);

module.exports = router;
