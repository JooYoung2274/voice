const express = require("express");
const AuthRouter = require("./auth");
const router = express.Router();

router.use("/auth", AuthRouter);
module.exports = router;
