require("dotenv").config();

const development = {
  username: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  host: process.env.HOST,
  dialect: "mysql",
};
const test = {
  username: "root",
  password: null,
  database: "database_test",
  host: "127.0.0.1",
  dialect: "mysql",
};
const production = {
  username: "root",
  password: null,
  database: "database_test",
  host: "127.0.0.1",
  dialect: "mysql",
};

module.exports = { development, test, production };
