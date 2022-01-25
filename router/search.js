const express = require("express");
const router = express.Router();
const searchController = require("../controller/searchCtrl");

const { ROUTE } = require("../config/constants");

router.get(ROUTE.SEARCH, searchController.searchGet);

module.exports = router;
