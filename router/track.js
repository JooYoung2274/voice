const express = require("express");
const router = express.Router();
const trackController = require("../controller/trackCtrl");
const { needLogin } = require("../middleware/auth-middleware");
const { voiceMulter } = require("../middleware/uploader");
const trackUploader = voiceMulter.single("trackFile");

const { ROUTE } = require("../config/constants");

router.get(ROUTE.TRACK.LIST, trackController.listInfoGet);
router.post(ROUTE.TRACK.TRACK, needLogin, trackUploader, trackController.trackUploads);
router.get(ROUTE.TRACK.TRACKPAGE, trackController.trackPage);
router.delete(ROUTE.TRACK.TRACKPAGE, needLogin, trackController.trackDelete);
router.put(ROUTE.TRACK.TRACKPAGE, needLogin, trackController.trackUpdate);
router.post(ROUTE.TRACK.PLAYLIST, needLogin, trackController.listUpdate);
router.get(ROUTE.TRACK.PLAYLIST, needLogin, trackController.listGet);

module.exports = router;
