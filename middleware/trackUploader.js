const multer = require("multer");
const path = require("path");

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

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "audio/mp4") {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error(" 정해진 확장자 파일만 업로드 가능합니다."));
  }
};

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, //20메가 제한
  },
});
