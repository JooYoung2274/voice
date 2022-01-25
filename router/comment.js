const express = require("express");
const router = express.Router();
const commentController = require("../controller/commentCtrl");
const authMiddleware = require("../middleware/auth-middleware");

const { ROUTE } = require("../config/constants");

router.post(ROUTE.COMMENT.CREATE_COMMENT, authMiddleware.needLogin, commentController.commentPost);
router.delete(ROUTE.COMMENT.COMMENT, authMiddleware.needLogin, commentController.commentDelete);

module.exports = router;
