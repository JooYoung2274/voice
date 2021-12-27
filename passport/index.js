const passport = require("passport");
const naverStrategy = require("passport-naver").Strategy;
const kakaoStrategy = require("passport-kakao").Strategy;
const googleStrategy = require("passport-google-oauth20").Strategy;
const { Users } = require("../models");
const userService = require("../services/auth");
const randomstring = require("randomstring");
const newNickname = randomstring.generate({ length: 15 });

module.exports = (app) => {
  app.use(passport.initialize());
  passport.use(
    new naverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/auth/naver/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("*********naver profile*********", profile);
        try {
          const exUser = await Users.findOne({
            where: { snsId: profile.id, flatformType: profile.provider },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await Users.create({
              nickname: newNickname,
              flatformType: profile.provider,
              snsId: profile.id,
            });
            done(null, newUser, {
              accessToken,
            });
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
        callbackURL: "http://localhost:3000/api/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("*********kakao profile*********", profile);
        try {
          const exUser = await Users.findOne({
            where: { snsId: profile.id, flatformType: profile.provider },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await Users.create({
              nickname: newNickname,
              flatformType: profile.provider,
              snsId: profile.id,
            });
            done(null, newUser);
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
        callbackURL: "http://localhost:3000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("*********google profile*********", profile);
        try {
          const exUser = await Users.findOne({
            where: { snsId: profile.id, flatformType: profile.provider },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await Users.create({
              nickname: newNickname,
              flatformType: profile.provider,
              snsId: profile.id,
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
    ),
  );
};
