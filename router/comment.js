const express = require("express");
const commentController = require("../controller/commentCtrl");
// middleware auth 경로바꾸기
const { needLogin } = require("../middleware/auth-middleware");

const router = express.Router();

router.post("/:trackId/comment", needLogin, commentController.commentPost);
// router.put("/:trackId/comment/:commentId", needLogin, commentController.commentPut);
router.delete("/:trackId/comment/:commentId", needLogin, commentController.commentDelete);

module.exports = router;
