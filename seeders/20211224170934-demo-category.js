"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Categories", [
      {
        category: "나레이션",
      },
      {
        category: "라디오",
      },
      {
        category: "오디오북",
      },
      {
        category: "더빙",
      },
      {
        category: "효과음",
      },
      {
        category: "TV",
      },
      {
        category: "성대모사",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Categories", null, {});
  },
};
