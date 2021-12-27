"use strict";

// up:npx sequelize-cli db:seed:all seeders전부 적용
// down:npx sequelize-cli db:seed:undo:all seeders 전부 삭제

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Categories", [
      {
        category: "전체",
        categoryUrl: "thumbnail.png",
      },
      {
        category: "일상 언어",
        categoryUrl: "thumbnail.png",
      },
      {
        category: "ASMR",
        categoryUrl: "thumbnail.png",
      },
      {
        category: "연기",
        categoryUrl: "thumbnail.png",
      },
      {
        category: "노래",
        categoryUrl: "thumbnail.png",
      },
      {
        category: "나레이션",
        categoryUrl: "thumbnail.png",
      },
      {
        category: "효과음",
        categoryUrl: "thumbnail.png",
      },
      {
        category: "성대모사",
        categoryUrl: "thumbnail.png",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Categories", null, {});
  },
};
