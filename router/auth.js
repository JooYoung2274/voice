const express = require("express");
const passport = require("passport");
const authMiddleware = require("../middleware/auth-middleware");
const authController = require("../controller/authCtrl");
const {
  AUTH_PLATFORM: PLATFORM,
  AUTH_ROUTE: ROUTE,
  GOOGLE_SCOPE: SCOPE,
  PROFILE_UPLOAD: UPLOAD,
} = require("../config/constants2");
const uploader = require("../middleware/uploader");
const imageUploader = uploader.imageMulter.single(UPLOAD.UPLOAD_KEY);
const router = express.Router();

router.get(ROUTE.KAKAO_LOGIN, passport.authenticate(PLATFORM.KAKAO));

router.get(ROUTE.KAKAO_CALLBACK, authController.kakaoCallback);

router.get(ROUTE.GOOGLE_LOGIN, passport.authenticate(PLATFORM.GOOGLE, { scope: [SCOPE.PROFILE] }));

router.get(ROUTE.GOOGLE_CALLBACK, authController.googleCallback);

router.get(ROUTE.NAVER_LOGIN, passport.authenticate(PLATFORM.NAVER));

router.get(ROUTE.NAVER_CALLBACK, authController.naverCallback);

router.post(
  ROUTE.UPDATE_PROFILE,
  imageUploader,
  authMiddleware.needLogin,
  authController.updateUser,
);
router.get(ROUTE.GET_MY_USERINFO, authMiddleware.needLogin, authController.getUser);
router.get(ROUTE.GET_USERINFO, authController.getUserInfo);
module.exports = router;
