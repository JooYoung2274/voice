"use strict";

// up:npx sequelize-cli db:seed:all seeders전부 적용
// down:npx sequelize-cli db:seed:undo:all seeders 전부 삭제

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Categories", [
      {
        category: "전체",
        categoryUrl: "http://54.180.82.210/thumbnail.png",
      },
      {
        category: "일상 언어",
        categoryUrl: "http://54.180.82.210/thumbnail.png",
      },
      {
        category: "ASMR",
        categoryUrl: "http://54.180.82.210/thumbnail.png",
      },
      {
        category: "연기",
        categoryUrl: "http://54.180.82.210/thumbnail.png",
      },
      {
        category: "노래",
        categoryUrl: "http://54.180.82.210/thumbnail.png",
      },
      {
        category: "나레이션",
        categoryUrl: "http://54.180.82.210/thumbnail.png",
      },
      {
        category: "효과음",
        categoryUrl: "http://54.180.82.210/thumbnail.png",
      },
      {
        category: "성대모사",
        categoryUrl: "http://54.180.82.210/thumbnail.png",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Categories", null, {});
  },
};
