const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { needLogin, notNeedLogin } = require("../middleware/auth-middleware");
const {
  updateUser,
  updateProfileCon,
  kakaoCallback,
  googleCallback,
  naverCallback,
} = require("../controller/authCtrl");
const { imageMulter } = require("../middleware/uploader");
const imageUploader = imageMulter.single("profileImage");
const router = express.Router();

router.get("/kakao", passport.authenticate("kakao"));

router.get("/kakao/callback", kakaoCallback);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/google/callback", googleCallback);

router.get("/naver", passport.authenticate("naver"));

router.get("/naver/callback", naverCallback);

router.post("/profile", imageUploader, needLogin, updateUser);
module.exports = router;
