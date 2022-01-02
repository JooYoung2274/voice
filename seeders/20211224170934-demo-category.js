"use strict";

// up:npx sequelize-cli db:seed:all seeders전부 적용
// down:npx sequelize-cli db:seed:undo:all seeders 전부 삭제

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Categories", [
      {
        category: "전체",
        categoryUrl: "http://" + process.env.HOST + "/categoryUrl/전체.png",
        categoryText: "전체",
      },
      {
        category: "자유주제",
        categoryUrl: "http://" + process.env.HOST + "/categoryUrl/자유주제.png",
        categoryText: "인기있는 자유주제",
      },
      {
        category: "ASMR",
        categoryUrl: "http://" + process.env.HOST + "/categoryUrl/ASMR.png",
        categoryText: "인기있는 ASMR",
      },
      {
        category: "힐링응원",
        categoryUrl: "http://" + process.env.HOST + "/categoryUrl/힐링응원.png",
        categoryText: "인기있는 힐링/응원",
      },
      {
        category: "노래",
        categoryUrl: "http://" + process.env.HOST + "/categoryUrl/노래.png",
        categoryText: "인기있는 노래",
      },
      {
        category: "외국어",
        categoryUrl: "http://" + process.env.HOST + "/categoryUrl/외국어.png",
        categoryText: "인기있는 외국어",
      },
      {
        category: "나레이션",
        categoryUrl: "http://" + process.env.HOST + "/categoryUrl/나레이션.png",
        categoryText: "인기있는 나레이션",
      },
      {
        category: "성대모사",
        categoryUrl: "http://" + process.env.HOST + "/categoryUrl/성대모사.png",
        categoryText: "인기있는 성대모사",
      },
      {
        category: "유행어",
        categoryUrl: "http://" + process.env.HOST + "/categoryUrl/유행어.png",
        categoryText: "인기있는 유행어",
      },
      {
        category: "효과음",
        categoryUrl: "http://" + process.env.HOST + "/categoryUrl/효과음.png",
        categoryText: "인기있는 효과음",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Categories", null, {});
  },
};
