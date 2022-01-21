const userService = require("../services/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const KAKAO = "kakao";
const NAVER = "naver";
const GOOGLE = "google";

const updateUser = async (req, res, next) => {
  try {
    const { userId } = res.locals.user;
    const { nickname, contact, introduce } = req.body;
    const reqFile = req.file;
    await userService.updateUser({ userId, reqFile, nickname, contact, introduce });
    res.sendStatus(200);
    return;
  } catch (error) {
    next(error);
  }
};

const kakaoCallback = (req, res, next) => {
  passport.authenticate(KAKAO, { failureRedirect: "/" }, (err, user, info) => {
    if (err) return next(err);
    const { userId, nickname, contact, profileImage, introduce } = user;
    const { firstLogin } = info;
    const jwtToken = jwt.sign({ userId: userId }, JWT_SECRET);
    result = {
      firstLogin: firstLogin,
      jwtToken: jwtToken,
      nickname: nickname,
      contact: contact,
      profileImage: profileImage,
      introduce,
      userId,
    };
    res.send({ user: result });
  })(req, res, next);
};

const googleCallback = (req, res, next) => {
  passport.authenticate(GOOGLE, { failureRedirect: "/" }, (err, user, info) => {
    if (err) return next(err);
    const { userId, nickname, contact, profileImage, introduce } = user;
    const { firstLogin } = info;
    const jwtToken = jwt.sign({ userId: userId }, JWT_SECRET);
    result = {
      firstLogin: firstLogin,
      jwtToken: jwtToken,
      nickname: nickname,
      contact: contact,
      profileImage: profileImage,
      introduce,
      userId,
    };
    res.send({ user: result });
  })(req, res, next);
};

const naverCallback = (req, res, next) => {
  passport.authenticate(NAVER, { failureRedirect: "/" }, (err, user, info) => {
    if (err) return next(err);
    const { userId, nickname, contact, profileImage, introduce } = user;
    const { firstLogin } = info;
    const jwtToken = jwt.sign({ userId: userId }, JWT_SECRET);
    result = {
      firstLogin: firstLogin,
      jwtToken: jwtToken,
      nickname: nickname,
      contact: contact,
      profileImage: profileImage,
      introduce,
      userId,
    };
    res.send({ user: result });
  })(req, res, next);
};

const getUser = async (req, res, next) => {
  try {
    const { userId: userId } = res.locals.user;
    const result = await userService.getUserByUserId({ userId });
    res.status(200).send({ user: result });
  } catch (error) {
    next(error);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const result = await userService.getUserByUserId({ userId });
    res.status(200).send({ result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUser,
  kakaoCallback,
  googleCallback,
  naverCallback,
  getUser,
  getUserInfo,
};
