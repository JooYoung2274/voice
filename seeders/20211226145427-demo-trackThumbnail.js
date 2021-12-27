"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("TrackThumbnails", [
      {
        trackThumbnailUrl: "thumbnail.png",
      },
      {
        trackThumbnailUrl: "thumbnail1.png",
      },
      {
        trackThumbnailUrl: "thumbnail2.png",
      },
      {
        trackThumbnailUrl: "thumbnail3.png",
      },
      {
        trackThumbnailUrl: "thumbnail4.png",
      },
      {
        trackThumbnailUrl: "thumbnail5.png",
      },
      {
        trackThumbnailUrl: "thumbnail6.png",
      },
      {
        trackThumbnailUrl: "thumbnail7.png",
      },
      {
        trackThumbnailUrl: "thumbnail8.png",
      },
      {
        trackThumbnailUrl: "thumbnail9.png",
      },
      {
        trackThumbnailUrl: "thumbnail10.png",
      },
      {
        trackThumbnailUrl: "thumbnail12.png",
      },
      {
        trackThumbnailUrl: "thumbnail11.png",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("TrackThumbnails", null, {});
  },
};
