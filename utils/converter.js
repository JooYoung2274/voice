const fs = require("fs");
const path = require("path");
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

const deleteMp3 = (ranFileName) => {
  const filePath = path.join(`/home/ubuntu/voice/${ranFileName}`);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) return console.log("삭제할 수 없는 파일입니다");
    fs.unlink(filePath, (err) =>
      err ? console.log(err) : console.log(`${filePath} 를 정상적으로 삭제했습니다`),
    );
  });
};

const convertAndSaveS3 = (ranFileName, location) => {
  const key = location.split(".com/")[1];
  let params = { Bucket: S3_BUCKET_NAME, Key: key };
  return new Promise((resolve, reject) => {
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
        deleteMp3(ranFileName);
        console.log("업로드!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        resolve();
      })

      .run();
  });
};

module.exports = { convertAndSaveS3 };
