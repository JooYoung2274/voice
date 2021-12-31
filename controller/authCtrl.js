const userService = require("../services/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const updateUser = async (req, res, next) => {
  try {
    const { userId: userId } = res.locals.user;
    const { nickname, contact, introduce } = req.body;
    const { filename } = req.file;
    await userService.getUser({ nickname, userId });
    const result = await userService.updateUser({ userId, filename, nickname, contact, introduce });
    res.status(200).send({ user: result });
    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const kakaoCallback = (req, res, next) => {
  passport.authenticate("kakao", { failureRedirect: "/" }, (err, user, info) => {
    if (err) return next(err);
    const { userId, nickname, contact, profileImage, introduce } = user;
    const { firstLogin } = info;
    const jwtToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET);
    result = {
      firstLogin: firstLogin,
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
  passport.authenticate("google", { failureRedirect: "/" }, (err, user, info) => {
    if (err) return next(err);
    const { userId, nickname, contact, profileImage, introduce } = user;
    const { firstLogin } = info;
    const jwtToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET);
    result = {
      firstLogin: firstLogin,
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
  passport.authenticate("naver", { failureRedirect: "/" }, (err, user, info) => {
    if (err) return next(err);
    const { userId, nickname, contact, profileImage, introduce } = user;
    const { firstLogin } = info;
    const jwtToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET);
    result = {
      firstLogin: firstLogin,
      jwtToken: jwtToken,
      nickname: nickname,
      contact: contact,
      profileImage: profileImage,
      introduce,
    };
    res.send({ user: result });
  })(req, res, next);
};

module.exports = {
  updateUser,
  kakaoCallback,
  googleCallback,
  naverCallback,
};
