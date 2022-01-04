const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const { customizedError } = require("../utils/error");
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACEESS_KEY;
const region = process.env.S3_REGION;
const bucket = process.env.S3_BUCKET_NAME;
const IMAGES = "images";
const TRACKS = "tracks";
const s3 = new aws.S3({
  accessKeyId,
  secretAccessKey,
  region,
});

// 통과되는 image타입들
const passImageTypes = ["jpg", "png", "jpeg"];
// 통과되는 track타입들
const passvoiceTypes = ["mp4", "mp3", "flac", "wav", "ogg", "mpeg", "x-m4a", "webm"];

// 파일이름 정하는 함수
const randomFilename = Math.random().toString(36).substr(2, 11) + Date.now();

// 파일 type 얻는 함수
const getfileType = (file) => file.mimetype.split("/")[1];

// 파일 타입 vaildate
const fileTypeValidate = (filetype, passTypes) => {
  passTypes.some((passType) => passType === filetype);
};

// 파일 넣을 디렉토리 정하기
const storageFor = (dir) =>
  multerS3({
    s3,
    bucket,
    key: function (req, file, cb) {
      const fileType = getfileType(file);
      const directory = dir;
      cb(null, `${directory}/${randomFilename}.${fileType}`);
    },
  });

// 파일 타입 필터링
const fileFilterFor = (passTypes) => (req, file, cb) => {
  const fileType = getfileType(file);
  if (fileTypeValidate(fileType, passTypes)) {
    cb(null, true);
  } else {
    cb(customizedError("정해진 확장자 파일만 업로드 가능합니다.", 400));
  }
};

// local에 저장 --2
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       Math.random().toString(36).substr(2, 11) + Date.now() + "." + file.mimetype.split("/")[1],
//     ); // 생성한 난수 + 현재 시각 + . + 파일 확장자명
//   },
// });

// 업로드 하기
const uploader = (storage, fileFilter) =>
  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 20 * 1024 * 1024, //20메가 제한
    },
  });

// 이름 짓는게 더 직관적이여서 바로 대입하지 않고 변수 한 번더 선언
const imageStorage = storageFor(IMAGES);
const voiceStorage = storageFor(TRACKS);
const imageFileFilter = fileFilterFor(passImageTypes);
const voiceFileFilter = fileFilterFor(passvoiceTypes);

// multer 미들웨어 --1
const imageMulter = uploader(imageStorage, imageFileFilter);
const voiceMulter = uploader(voiceStorage, voiceFileFilter);

// local uploads에 파일 저장하고 싶을때--3 방법: 1 주석처리하고 2,3주석 풀면됨
// const imageMulter = uploader(storage, imageFileFilter);
// const voiceMulter = uploader(storage, voiceFileFilter);

module.exports = { imageMulter, voiceMulter };
