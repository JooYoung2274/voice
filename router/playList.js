const express = require("express");
const router = express.Router();
const trackController = require("../controller/trackCtrl");
const { needLogin } = require("../middleware/auth-middleware");

router.post("/", needLogin, trackController.listUpdate);
router.get("/", needLogin, trackController.listGet);

module.exports = router;
