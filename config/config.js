require("dotenv").config();
const { DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USE, DATABASE_HOST, DATABASE_DIALECT } =
  process.env;

const development = {
  username: DATABASE_NAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_USE,
  host: DATABASE_HOST,
  dialect: DATABASE_DIALECT,
};
const test = {
  username: DATABASE_NAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_USE,
  host: DATABASE_HOST,
  dialect: DATABASE_DIALECT,
};
const production = {
  username: DATABASE_NAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_USE,
  host: DATABASE_HOST,
  dialect: DATABASE_DIALECT,
};

module.exports = { development, test, production };
