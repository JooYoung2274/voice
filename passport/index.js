const passport = require("passport");
const naverStrategy = require("passport-naver").Strategy;
const kakaoStrategy = require("passport-kakao").Strategy;
const googleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models");
const userService = require("../services/auth");
const randomstring = require("randomstring");
let newNickname = "";

module.exports = (app) => {
  app.use(passport.initialize());
  passport.use(
    new naverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: process.env.DOMAIN + "/api/auth/naver/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("*********naver profile*********", profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, flatformType: profile.provider },
          });
          if (exUser) {
            let firstLogin = false;
            done(null, exUser, { firstLogin });
          } else {
            newNickname = randomstring.generate({ length: 15 });
            const newUser = await User.create({
              nickname: newNickname,
              flatformType: profile.provider,
              snsId: profile.id,
              profileImage: "http://13.125.215.6/etc/profile.png",
            });
            let firstLogin = true;
            done(null, newUser, { firstLogin });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
    ),
  );
  passport.use(
    new kakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: process.env.DOMAIN + "/api/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("*********kakao profile*********", profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, flatformType: profile.provider },
          });
          if (exUser) {
            let firstLogin = false;
            done(null, exUser, { firstLogin });
          } else {
            newNickname = randomstring.generate({ length: 15 });
            const newUser = await User.create({
              nickname: newNickname,
              flatformType: profile.provider,
              snsId: profile.id,
              profileImage: "http://13.125.215.6/etc/profile.png",
            });
            let firstLogin = true;
            done(null, newUser, { firstLogin });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
    ),
  );
  passport.use(
    new googleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.DOMAIN + "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("*********google profile*********", profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, flatformType: profile.provider },
          });
          if (exUser) {
            let firstLogin = false;
            done(null, exUser, { firstLogin });
          } else {
            newNickname = randomstring.generate({ length: 15 });
            const newUser = await User.create({
              nickname: newNickname,
              flatformType: profile.provider,
              snsId: profile.id,
              profileImage: "http://13.125.215.6/etc/profile.png",
            });
            let firstLogin = true;
            done(null, newUser, { firstLogin });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
    ),
  );
};
