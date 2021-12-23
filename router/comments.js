const express = require("express");
const commentsController = require("../controller/comments");
// middleware auth 경로바꾸기
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/:trackId/comment", auth, commentsController.commentPost);
router.put("/:trackId/comment", auth, commentsController.commentPost);
router.delete("/:trackId/comment/:commentId", auth, commentsController.commentDelete);

module.exports = router;
