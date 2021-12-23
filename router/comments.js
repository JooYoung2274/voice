const express = require("express");
const commentsController = require("../controller/comments");
// middleware auth 경로바꾸기
const { needLogin } = require("../middleware/auth-middleware");

const router = express.Router();

router.post("/:trackId/comment", needLogin, commentsController.commentPost);
router.put("/:trackId/comment", needLogin, commentsController.commentPost);
router.delete("/:trackId/comment/:commentId", needLogin, commentsController.commentDelete);

module.exports = router;
