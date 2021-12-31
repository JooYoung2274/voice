const userService = require("../services/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const updateUser = async (req, res, next) => {
  try {
    const { userId: userId } = res.locals.user;
    const { nickname, contact, introduce } = req.body;
    let filename = "";
    const userOne = await userService.getUser({ nickname, userId });
    if (!req.file) {
      filename = userOne.profileImage.replace("http://13.125.215.6/", "");
    } else {
      filename = req.file.filename;
    }
    await userService.updateUser({ userId, filename, nickname, contact, introduce });
    res.sendStatus(200);
    return;
  } catch (error) {
    next(error);
  }
};

const kakaoCallback = (req, res, next) => {
  passport.authenticate("kakao", { failureRedirect: "/" }, (err, user) => {
    if (err) return next(err);
    const { userId, nickname, contact, profileImage, introduce } = user;
    const jwtToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET);
    result = {
      jwtToken: jwtToken,
      nickname: nickname,
      contact: contact,
      profileImage: profileImage,
      introduce,
    };
    res.send({ user: result });
  })(req, res, next);
};

const googleCallback = (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/" }, (err, user) => {
    if (err) return next(err);
    const { userId, nickname, contact, profileImage, introduce } = user;
    const jwtToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET);
    result = {
      jwtToken: jwtToken,
      nickname: nickname,
      contact: contact,
      profileImage: profileImage,
      introduce,
    };
    res.send({ user: result });
  })(req, res, next);
};

const naverCallback = (req, res, next) => {
  passport.authenticate("naver", { failureRedirect: "/" }, (err, user) => {
    if (err) return next(err);
    const { userId, nickname, contact, profileImage, introduce } = user;
    const jwtToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET);
    result = {
      jwtToken: jwtToken,
      nickname: nickname,
      contact: contact,
      profileImage: profileImage,
      introduce,
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
module.exports = {
  updateUser,
  kakaoCallback,
  googleCallback,
  naverCallback,
  getUser,
};
