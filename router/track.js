const express = require("express");
const router = express.Router();
const trackController = require("../controller/trackController");

const uploader = require("../middleware/uploader");
const imageUploader = uploader.fields([
  { name: "thumbnailUrl" },
  { name: "trackUrl" },
]);

router.post("/", imageUploader, trackController.trackUploads);
// router.delete("/:trackId", trackController.trackDelete);

module.exports = router;
