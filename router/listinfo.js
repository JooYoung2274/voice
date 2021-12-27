const express = require("express");
const router = express.Router();
const trackController = require("../controller/trackController");

router.get("/", trackController.listInfoGet);

module.exports = router;
