const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { customizedError } = require("../utils/error");
//로그인 필수
const needLogin = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw customizedError("토큰이 유효하지 않습니다.", 401);
    }
    const [tokenType, tokenValue] = authorization.split(" ");
    if (tokenType !== "Bearer") {
      throw customizedError("토큰이 유효하지 않습니다.", 401);
    }

    const result = jwt.verify(tokenValue, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        throw customizedError("토큰이 유효하지 않습니다.", 401);
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
    const [tokenType, tokenValue] = authorization.split(" ");

    if (tokenType !== "Bearer") {
      throw customizedError("토큰이 유효하지 않습니다.", 401);
    }
    const { userId } = jwt.verify(tokenValue, process.env.JWT_SECRET);
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
