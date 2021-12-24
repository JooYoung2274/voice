"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("tags", [
      {
        tag: "여성적인",
      },
      {
        tag: "남성적인",
      },
      {
        tag: "깔끔한",
      },
      {
        tag: "부드러운",
      },
      {
        tag: "유쾌한",
      },
      {
        tag: "젠틀한",
      },
      {
        tag: "귀여운",
      },
      {
        tag: "중후한",
      },
      {
        tag: "아이같은",
      },
      {
        tag: "어른스러운",
      },
      {
        tag: "잔잔한",
      },
      {
        tag: "독특한",
      },
      {
        tag: "친근한",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("tags", null, {});
  },
};
