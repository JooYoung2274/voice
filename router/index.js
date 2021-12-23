const express = require("express");
const commentRouter = require("./comments.js");
const likeRouter = require("./likes.js");
const router = express.Router();

router.use("/tracks", commentRouter);
router.use("/tracks", likeRouter);

module.exports = router;
