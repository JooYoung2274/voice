"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("TrackThumbnails", [
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail.png",
      },
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail1.png",
      },
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail2.png",
      },
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail3.png",
      },
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail4.png",
      },
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail5.png",
      },
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail6.png",
      },
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail7.png",
      },
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail8.png",
      },
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail9.png",
      },
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail10.png",
      },
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail11.png",
      },
      {
        trackThumbnailUrl: "http://54.180.82.210/thumbnail.png",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("TrackThumbnails", null, {});
  },
};
