const express = require("express");
const router = express.Router();
const commonController = require("../controller/commonCtrl");
const { notNeedLogin } = require("../middleware/auth-middleware");

const { ROUTE } = require("../config/constants");

router.get("/", commonController.mainTracksGet);
router.get(ROUTE.COMMON.MYPAGE, notNeedLogin, commonController.myTracksGet);
router.get(ROUTE.COMMON.SEARCH, commonController.categorySelect);

module.exports = router;
