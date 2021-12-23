const jwt = require("jsonwebtoken");
const { Users } = require("../models");
//로그인 필수
const needLogin = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(" ");
  console.log(authorization);
  if (tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요.",
    });
    return;
  }

  try {
    const { userId } = jwt.verify(tokenValue, "secret-secret-key");
    Users.findOne({ where: { userId: userId } }).then((user) => {
      // async가 없으므로 await은 안됨. sequelize는 기본적으로 promise이므로  then
      res.locals.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요.",
    });
    return;
  }
};

//로그인 불필요
const notNeedLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    const [tokenType, tokenValue] = authorization.split(" ");

    const { userId } = jwt.verify(tokenValue, "secret-secret-key");
    Users.findByPk(userId).then((user) => {
      // async가 없으므로 await은 안됨. sequelize는 기본적으로 promise이므로  then
      res.locals.user = user;
    });
  }
  next();
};

module.exports = { needLogin, notNeedLogin };
