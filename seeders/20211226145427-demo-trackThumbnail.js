"use strict";

const s3Host = process.env.S3_HOST;
const DIRECTORY = "trackThumbnail";
const trackThumbnailUrl = `${s3Host}/${DIRECTORY}/`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("TrackThumbnails", [
      {
        trackThumbnailUrlFace: trackThumbnailUrl + "OAO1_face.png",
        trackThumbnailUrlFull: trackThumbnailUrl + "OAO1_full.png",
      },
      {
        trackThumbnailUrlFace: trackThumbnailUrl + "OAO2_face.png",
        trackThumbnailUrlFull: trackThumbnailUrl + "OAO2_full.png",
      },
      {
        trackThumbnailUrlFace: trackThumbnailUrl + "OAO3_face.png",
        trackThumbnailUrlFull: trackThumbnailUrl + "OAO3_full.png",
      },
      {
        trackThumbnailUrlFace: trackThumbnailUrl + "OAO4_face.png",
        trackThumbnailUrlFull: trackThumbnailUrl + "OAO4_full.png",
      },
      {
        trackThumbnailUrlFace: trackThumbnailUrl + "OAO5_face.png",
        trackThumbnailUrlFull: trackThumbnailUrl + "OAO5_full.png",
      },
      {
        trackThumbnailUrlFace: trackThumbnailUrl + "OAO6_face.png",
        trackThumbnailUrlFull: trackThumbnailUrl + "OAO6_full.png",
      },
      {
        trackThumbnailUrlFace: trackThumbnailUrl + "OAO7_face.png",
        trackThumbnailUrlFull: trackThumbnailUrl + "OAO7_full.png",
      },
      {
        trackThumbnailUrlFace: trackThumbnailUrl + "OAO8_face.png",
        trackThumbnailUrlFull: trackThumbnailUrl + "OAO8_full.png",
      },
      {
        trackThumbnailUrlFace: trackThumbnailUrl + "OAO9_face.png",
        trackThumbnailUrlFull: trackThumbnailUrl + "OAO9_full.png",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("TrackThumbnails", null, {});
  },
};
