const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const aws = require("aws-sdk");
const { S3_ACCESS_KEY_ID, S3_SECRET_ACEESS_KEY, S3_REGION, S3_BUCKET_NAME } = process.env;
const s3 = new aws.S3({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACEESS_KEY,
  region: S3_REGION,
});
const convertAndSaveS3 = (ranFileName, location) => {
  const key = location.split(".com/")[1];
  let params = { Bucket: S3_BUCKET_NAME, Key: key };
  ffmpeg()
    .input(location)
    .toFormat("mp3")
    .output(ranFileName)
    .on("error", (err) => {
      console.log("An error occurred: " + err.message);
    })
    .on("progress", (progress) => {
      console.log("Processing: " + progress.targetSize + " KB converted");
    })
    .on("end", () => {
      console.log("Processing finished !");
      const fileContent = fs.readFileSync(ranFileName);
      params.Key = `tracks/${ranFileName}`;
      params.Body = fileContent;
      s3.putObject(params, function (err, data) {
        console.log(err, data);
      });
    })
    .run();
};
module.exports = { convertAndSaveS3 };
