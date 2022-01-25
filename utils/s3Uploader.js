const { customizedError } = require("./error");
const { S3_BUCKET_NAME } = process.env;

const { DIRECTORY } = require("../config/constants");

const { s3 } = require("../middleware/uploader");

const s3UploadFor = (dir, file, filename) =>
  s3.upload(
    {
      Bucket: S3_BUCKET_NAME,
      Key: `${dir}/${filename}`,
      Body: file,
    },
    function (err, data) {
      if (err) {
        throw customizedError(err, 400);
      }
    },
  );

const s3UploadForImage = (file, filename) => s3UploadFor(DIRECTORY.IMAGES, file, filename); //유저 프로필이미지
const s3UploadForVoice = (file, filename) => s3UploadFor(DIRECTORY.TRACKS, file, filename); //업로드한 track
const s3UploadForChatVoice = (file, filename) => s3UploadFor(DIRECTORY.CHAT_TRACKS, file, filename); //채팅 음성메세지

module.exports = { s3UploadForImage, s3UploadForVoice, s3UploadForChatVoice };
