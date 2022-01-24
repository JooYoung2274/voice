const express = require("express");
const passport = require("passport");
const authMiddleware = require("../middleware/auth-middleware");
const authController = require("../controller/authCtrl");
const { AUTH_PLATFORM: PLATFORM, ROUTE, ETC } = require("../config/constants2");
const uploader = require("../middleware/uploader");
const imageUploader = uploader.imageMulter.single(ETC.UPLOAD_KEY);
const router = express.Router();

router.get(ROUTE.AUTH.KAKAO, passport.authenticate(PLATFORM.KAKAO));

router.get(ROUTE.AUTH.KAKAO_CALLBACK, authController.kakaoCallback);

router.get(ROUTE.AUTH.GOOGLE, passport.authenticate(PLATFORM.GOOGLE, { scope: [ETC.PROFILE] }));

router.get(ROUTE.AUTH.GOOGLE_CALLBACK, authController.googleCallback);

router.get(ROUTE.AUTH.NAVER, passport.authenticate(PLATFORM.NAVER));

router.get(ROUTE.AUTH.NAVER_CALLBACK, authController.naverCallback);

router.post(ROUTE.AUTH.PROFILE, imageUploader, authMiddleware.needLogin, authController.updateUser);
router.get(ROUTE.AUTH.MY_INFO, authMiddleware.needLogin, authController.getUser);
router.get(ROUTE.AUTH.USER_INFO, authController.getUserInfo);
module.exports = router;
