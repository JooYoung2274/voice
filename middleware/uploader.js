const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const { customizedError } = require("../utils/error");
const { S3_ACCESS_KEY_ID, S3_SECRET_ACEESS_KEY, S3_REGION, S3_BUCKET_NAME } = process.env;
const { DIRECTORY, MESSAGE, IMAGE_TYPE, AUDIO_TYPE } = require("../config/constants");

const s3 = new aws.S3({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACEESS_KEY,
  region: S3_REGION,
});

// 저장 가능한 IMAGE_TYPE
const passImageTypes = IMAGE_TYPE;
// 저장 가능함 AUDIO_TYPE
const passvoiceTypes = AUDIO_TYPE;

// 파일이름 정하는 함수
const randomFilename = () => Math.random().toString(36).substr(2, 11) + Date.now();

// 파일 type 얻는 함수
const getfileType = (file) => file.mimetype.split("/")[1];

// 파일 타입 vaildate
const fileTypeValidate = (fileType, passTypes) => {
  return passTypes.some((passType) => passType === fileType);
};

// 파일 넣을 디렉토리 정하기
const storageFor = (dir) =>
  multerS3({
    s3,
    bucket: S3_BUCKET_NAME,
    key: function (req, file, cb) {
      const fileType = getfileType(file);
      const directory = dir;
      cb(null, `${directory}/${randomFilename()}.${fileType}`);
    },
  });

// 파일 타입 필터링
const fileFilterFor = (passTypes) => (req, file, cb) => {
  const fileType = getfileType(file);
  if (fileTypeValidate(fileType, passTypes)) {
    cb(null, true);
  } else {
    cb(customizedError(MESSAGE.NOT_TYPE, 400));
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
const imageStorage = storageFor(DIRECTORY.IMAGES);
const voiceStorage = storageFor(DIRECTORY.UNTRACKS);
const imageFileFilter = fileFilterFor(passImageTypes);
const voiceFileFilter = fileFilterFor(passvoiceTypes);

// multer 미들웨어 --1
const imageMulter = uploader(imageStorage, imageFileFilter);
const voiceMulter = uploader(voiceStorage, voiceFileFilter);

// local uploads에 파일 저장하고 싶을때--3 방법: 1 주석처리하고 2,3주석 풀면됨
// const imageMulter = uploader(storage, imageFileFilter);
// const voiceMulter = uploader(storage, voiceFileFilter);

module.exports = { imageMulter, voiceMulter, s3, randomFilename };
