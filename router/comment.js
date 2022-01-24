const express = require("express");
const commentController = require("../controller/commentCtrl");
// middleware auth 경로바꾸기
const authMiddleware = require("../middleware/auth-middleware");
const { COMMENT_ROUTE: ROUTE } = require("../config/constants2");

const router = express.Router();

router.post(ROUTE.CREATE_COMMENT, authMiddleware.needLogin, commentController.commentPost);
// router.put("/:trackId/comment/:commentId", needLogin, commentController.commentPut);
router.delete(ROUTE.DELETE_COMMENT, authMiddleware.needLogin, commentController.commentDelete);

module.exports = router;
