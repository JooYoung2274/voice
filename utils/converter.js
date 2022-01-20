const { createReadStream } = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const { s3UploadForVoice } = require("./s3Uploader");

const convertAndSaveS3 = (ranFileName) =>
  new Promise((res, rej) => {
    ffmpeg(location)
      .toFormat("mp3")
      .on("error", (err) => {
        throw customizedError(err.message, 400);
      })
      .output(ranFileName)
      .on("end", () => {
        s3UploadForVoice(createReadStream(ranFileName), ranFileName);
        console.log("Processing finished !");
      });
  });

module.exports = { convertAndSaveS3 };
