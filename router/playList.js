const express = require("express");
const router = express.Router();
const trackController = require("../controller/trackCtrl");
const { needLogin } = require("../middleware/auth-middleware");

const { ROUTE } = require("../config/constants");

router.post(ROUTE.PLAYLIST, needLogin, trackController.listUpdate);
router.get(ROUTE.PLAYLIST, needLogin, trackController.listGet);

module.exports = router;
