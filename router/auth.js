const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { needLogin, notNeedLogin } = require("../middleware/auth-middleware");
const { updateNickCon, findUserCon, updateProfileCon } = require("../controller/auth");
const uploader = require("../middleware/uploader");
const router = express.Router();

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    const { userId, nickname } = req.user;
    const token = jwt.sign({ userId: userId }, "secret-secret-key");
    res.send({ token: token, nickname: nickname });
  },
);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    const { userId, nickname } = req.user;
    const token = jwt.sign({ userId: userId }, "secret-secret-key");
    res.send({ token: token, nickname: nickname });
  },
);

router.get("/naver", passport.authenticate("naver"));

router.get(
  "/naver/callback",
  passport.authenticate("naver", {
    failureRedirect: "/",
  }),
  (req, res) => {
    const { userId, nickname } = req.user;
    const token = jwt.sign({ userId: userId }, "secret-secret-key");
    res.send({ token: token, nickname: nickname });
  },
);

router.post("/nickname", needLogin, updateNickCon);
router.get("/me", needLogin, findUserCon);
router.post("/me/:userId", needLogin, uploader.single("img"), updateProfileCon);
module.exports = router;
