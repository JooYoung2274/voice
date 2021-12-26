const { sequelize } = require("../models");

const connectDB = () =>
  sequelize
    .sync({ force: false })
    .then(() => {
      console.log("DB성공");
    })
    .catch((error) => {
      console.error("DB실패");
    });

module.exports = { connectDB };
