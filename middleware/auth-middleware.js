const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { customizedError } = require("../utils/error");
const { JWT_SECRET } = process.env;
const { MESSAGE } = require("../config/constants");
//로그인 필수
const needLogin = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw customizedError(MESSAGE.TOKEN, 401);
    }
    let [tokenType, tokenValue] = authorization.split(" ");
    console.log(tokenType, tokenValue);

    if (tokenValue[tokenValue.length - 1] === ";") {
      tokenValue = tokenValue.split(";")[0];
    }
    if (tokenType !== "Bearer") {
      throw customizedError(MESSAGE.TOKEN, 401);
    }
    console.log(tokenType, tokenValue);
    const result = jwt.verify(tokenValue, JWT_SECRET, (error, decoded) => {
      if (error) {
        throw customizedError(MESSAGE.TOKEN, 401);
      }
      return decoded;
    });
    const { userId } = result;
    User.findOne({ where: { userId: userId } }).then((user) => {
      // async가 없으므로 await은 안됨. sequelize는 기본적으로 promise이므로  then
      res.locals.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

//로그인 불필요
const notNeedLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    let [tokenType, tokenValue] = authorization.split(" ");

    if (tokenValue[tokenValue.length - 1] === ";") {
      tokenValue = tokenValue.split(";")[0];
    }

    if (tokenType !== "Bearer") {
      throw customizedError(MESSAGE.TOKEN, 401);
    }
    const { userId } = jwt.verify(tokenValue, JWT_SECRET);
    User.findOne({ where: { userId: userId } }).then((user) => {
      // async가 없으므로 await은 안됨. sequelize는 기본적으로 promise이므로  then
      res.locals.user = user;
      next();
    });
  } else {
    res.locals.user = "";
    next();
  }
};

module.exports = { needLogin, notNeedLogin };
