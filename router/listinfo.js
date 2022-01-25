const express = require("express");
const router = express.Router();
const trackController = require("../controller/trackCtrl");

const { ROUTE } = require("../config/constants");

router.get(ROUTE.LIST, trackController.listInfoGet);

module.exports = router;
