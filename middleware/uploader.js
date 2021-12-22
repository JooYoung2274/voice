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
        file.originalname.split(".")[0] + "-" + Date.now() + path.extname(file.originalname),
      );
    },
  }),
});

module.exports = uploader;
