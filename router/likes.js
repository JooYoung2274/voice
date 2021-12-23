const express = require("express");
const likesController = require("../controller/likes");
// middleware auth 경로바꾸기
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/:trackId/like", auth, likesController.likePost);

module.exports = router;
