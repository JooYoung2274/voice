const express = require("express");
// const tracksController = require("../controller/tracks");
const commentsController = require("../controller/comments");
// const uploader = require("../middleware/uploader");
// const auth = require("../middleware/auth");
const router = express.Router();

// router.post("/:trackId/comment", auth, commentsController.commentPost);
// router.put("/:trackId/comment", auth, commentsController.commentPost);
// router.delete("/:trackId/comment/:commentId", auth, commentsController.commentDelete);
router.post("/comment", commentsController.commentPost);
router.put("/comment/:commentId", commentsController.commentPut);
router.delete("/comment/:commentId", commentsController.commentDelete);

module.exports = router;
