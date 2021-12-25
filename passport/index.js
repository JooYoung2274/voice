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
        clientID: "vNamYzNai5L1YAnpDWjU",
        clientSecret: "uvlqNozWDw",
        callbackURL: "/api/auth/naver/callback",
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
        clientID: "f1e0d9ea23cc43e8717f86da6573a3a1",
        callbackURL: "/api/auth/kakao/callback",
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
        clientID: "283372056185-4d683ifd0ec8u3un2lmtmrq94qh0cgc8.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "/api/auth/google/callback",
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
