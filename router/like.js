const express = require("express");
const router = express.Router();
const likeController = require("../controller/likeCtrl");
const { needLogin } = require("../middleware/auth-middleware");

const { ROUTE } = require("../config/constants");

router.post(ROUTE.LIKE, needLogin, likeController.likePost);

module.exports = router;
