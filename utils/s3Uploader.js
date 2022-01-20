const aws = require("aws-sdk");
const customizedError = require("./error");
const { S3_BUCKET_NAME } = process.env;
const IMAGES = "images";
const TRACKS = "tracks";
const CHATTRACKS = "chatTracks";
const { s3 } = require("../middleware/uploader");
// const CHATIMAGES = "chatImages";

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

const s3UploadForImage = (file, filename) => s3UploadFor(IMAGES, file, filename); //유저 프로필이미지
const s3UploadForVoice = (file, filename) => s3UploadFor(TRACKS, file, filename); //업로드한 track
const s3UploadForChatVoice = (file, filename) => s3UploadFor(CHATTRACKS, file, filename); //채팅 음성메세지
// const s3UploadForChatImage = (file, filename) => s3UploadFor(CHATIMAGES, file, filename); //채팅 이미지메세지

module.exports = { s3UploadForImage, s3UploadForVoice, s3UploadForChatVoice };
