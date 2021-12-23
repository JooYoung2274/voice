const express = require("express");
const likesController = require("../controller/likes");
// middleware auth 경로바꾸기
const { needLogin } = require("../middleware/auth-middleware");

const router = express.Router();

router.post("/:trackId/like", needLogin, likesController.likePost);

module.exports = router;
