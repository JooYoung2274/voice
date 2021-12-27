const express = require("express");
const searchController = require("../controller/searchCtrl");
// middleware auth 경로바꾸기

const router = express.Router();

router.get("/", searchController.searchGet);

module.exports = router;
