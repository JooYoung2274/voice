const aws = require("aws-sdk");
const customizedError = require("./error");
const { S3_ACCESS_KEY_ID, S3_SECRET_ACEESS_KEY, S3_REGION, S3_BUCKET_NAME } = process.env;
const IMAGES = "images";
const TRACKS = "tracks";
const CHATTRACKS = "chatTracks";
// const CHATIMAGES = "chatImages";

const s3 = new aws.S3({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACEESS_KEY,
  region: S3_REGION,
});

const s3UploadFor = (dir) =>
  s3.upload(
    {
      Bucket: S3_BUCKET_NAME,
      Key: `${dir}`,
    },
    function (err, data) {
      if (err) {
        throw customizedError(err, 400);
      }
      console.log(data);
    },
  );

const s3UploadForImage = s3UploadFor(IMAGES); //유저 프로필이미지
const s3UploadForVoice = s3UploadFor(TRACKS); //업로드한 track
const s3UploadForChatVoice = s3UploadFor(CHATTRACKS); //채팅 음성메세지
// const s3UploadForChatImage = s3UploadFor(CHATIMAGES); //채팅 이미지메세지

module.exports = { s3UploadForImage, s3UploadForVoice, s3UploadForChatVoice };
