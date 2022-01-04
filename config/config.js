require("dotenv").config();

const development = {
  username: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_USE,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT,
};
const test = {
  username: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_USE,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT,
};
const production = {
  username: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_USE,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT,
};

module.exports = { development, test, production };
