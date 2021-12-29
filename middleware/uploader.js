const multer = require("multer");
const { customizedError } = require("../utils/error");
const path = require("path");
const { nextTick } = require("process");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Math.random().toString(36).substr(2, 11) + Date.now() + "." + file.mimetype.split("/")[1],
    ); // 생성한 난수 + 현재 시각 + . + 파일 확장자명
  },
});

const imageFileFilter = (req, file, cb) => {
  let typeArray = file.mimetype.split("/");
  let fileType = typeArray[1];
  if (fileType === "jpg" || fileType === "png" || fileType == "jpeg") {
    cb(null, true);
  } else {
    cb(customizedError("정해진 확장자 파일만 업로드 가능합니다.", 400));
  }
};
const voiceFileFilter = (req, file, cb) => {
  let typeArray = file.mimetype.split("/");
  let fileType = typeArray[1];
  if (
    fileType === "mp4" ||
    fileType === "mp3" ||
    fileType === "flac" ||
    fileType === "wav" ||
    fileType === "ogg" ||
    fileType === "mpeg" ||
    fileType === "x-m4a" ||
    fileType === "webm"
  ) {
    cb(null, true);
  } else {
    cb(customizedError("정해진 확장자 파일만 업로드 가능합니다.", 400));
  }
};

const uploader = (fileFilter) =>
  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 20 * 1024 * 1024, //20메가 제한
    },
  });
const imageMulter = uploader(imageFileFilter);
const voiceMulter = uploader(voiceFileFilter);

module.exports = { imageMulter, voiceMulter };
