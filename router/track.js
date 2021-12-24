const express = require("express");
const router = express.Router();
const trackController = require("../controller/trackController");
const { needLogin } = require("../middleware/auth-middleware");

const uploader = require("../middleware/uploader");
const imageUploader = uploader.fields([{ name: "thumbnailUrl" }, { name: "trackUrl" }]);

router.post("/", needLogin, imageUploader, trackController.trackUploads);
router.get("/:trackId", needLogin, trackController.trackPage);
router.delete("/:trackId", needLogin, trackController.trackDelete);

module.exports = router;
