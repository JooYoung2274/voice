const express = require("express");
const router = express.Router();
const trackController = require("../controller/trackCtrl");
const { needLogin } = require("../middleware/auth-middleware");
const { voiceMulter } = require("../middleware/uploader");
const trackUploader = voiceMulter.single("trackFile");

router.get("/listinfo", trackController.listInfoGet);
router.post("/", needLogin, trackUploader, trackController.trackUploads);
router.get("/:trackId", trackController.trackPage);
router.delete("/:trackId", needLogin, trackController.trackDelete);
router.put("/:trackId", needLogin, trackController.trackUpdate);

module.exports = router;
