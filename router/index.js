const express = require("express");
const commentRouter = require("./comments.js");
const router = express.Router();

// router.use("/tracks");
router.use("/", commentRouter);

module.exports = router;
