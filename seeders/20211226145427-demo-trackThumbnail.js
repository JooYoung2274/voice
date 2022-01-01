"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("TrackThumbnails", [
      {
        trackThumbnailUrlFace: "http://" + process.env.HOST + "/trackThumbnail/OAO1_face.png",
        trackThumbnailUrlFull: "http://" + process.env.HOST + "/trackThumbnail/OAO1_full.png",
      },
      {
        trackThumbnailUrlFace: "http://" + process.env.HOST + "/trackThumbnail/OAO2_face.png",
        trackThumbnailUrlFull: "http://" + process.env.HOST + "/trackThumbnail/OAO2_full.png",
      },
      {
        trackThumbnailUrlFace: "http://" + process.env.HOST + "/trackThumbnail/OAO3_face.png",
        trackThumbnailUrlFull: "http://" + process.env.HOST + "/trackThumbnail/OAO3_full.png",
      },
      {
        trackThumbnailUrlFace: "http://" + process.env.HOST + "/trackThumbnail/OAO4_face.png",
        trackThumbnailUrlFull: "http://" + process.env.HOST + "/trackThumbnail/OAO4_full.png",
      },
      {
        trackThumbnailUrlFace: "http://" + process.env.HOST + "/trackThumbnail/OAO5_face.png",
        trackThumbnailUrlFull: "http://" + process.env.HOST + "/trackThumbnail/OAO5_full.png",
      },
      {
        trackThumbnailUrlFace: "http://" + process.env.HOST + "/trackThumbnail/OAO6_face.png",
        trackThumbnailUrlFull: "http://" + process.env.HOST + "/trackThumbnail/OAO6_full.png",
      },
      {
        trackThumbnailUrlFace: "http://" + process.env.HOST + "/trackThumbnail/OAO7_face.png",
        trackThumbnailUrlFull: "http://" + process.env.HOST + "/trackThumbnail/OAO7_full.png",
      },
      {
        trackThumbnailUrlFace: "http://" + process.env.HOST + "/trackThumbnail/OAO8_face.png",
        trackThumbnailUrlFull: "http://" + process.env.HOST + "/trackThumbnail/OAO8_full.png",
      },
      {
        trackThumbnailUrlFace: "http://" + process.env.HOST + "/trackThumbnail/OAO9_face.png",
        trackThumbnailUrlFull: "http://" + process.env.HOST + "/trackThumbnail/OAO9_full.png",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("TrackThumbnails", null, {});
  },
};
