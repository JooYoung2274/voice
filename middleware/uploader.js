const multer = require("multer");
const path = require("path");

const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        Math.random().toString(36).substr(2, 11) + Date.now() + "." + file.mimetype.split("/")[1],
      ); // 생성한 난수 + 현재 시각 + . + 파일 확장자명
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024, //20메가 제한
  },
});

module.exports = uploader;
