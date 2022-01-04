const passport = require("passport");
const naverStrategy = require("passport-naver").Strategy;
const kakaoStrategy = require("passport-kakao").Strategy;
const googleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models");
const randomstring = require("randomstring");
const naver_client_id = process.env.NAVER_CLIENT_ID;
const naver_client_secret = process.env.NAVER_CLIENT_SECRET;
const domain = process.env.DOMAIN;
const s3Host = process.env.S3_HOST;
const kakao_client_id = process.env.KAKAO_CLIENT_ID;
const google_client_id = process.env.GOOGLE_CLIENT_ID;
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
const DIRECTORY = "etc";
const BASIC_PROFILE = "profile.png";
const profileImage = `${s3Host}/${DIRECTORY}/${BASIC_PROFILE}`;
const KAKAO = "kakao";
const NAVER = "naver";
const GOOGLE = "google";
const callbackURL = (company) => `${domain}/api/auth/${company}/callback`;

let newNickname = "";

module.exports = (app) => {
  app.use(passport.initialize());
  passport.use(
    new naverStrategy(
      {
        clientID: naver_client_id,
        clientSecret: naver_client_secret,
        callbackURL: callbackURL(NAVER),
      },
      async (accessToken, refreshToken, profile, done) => {
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
              profileImage: profileImage,
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
        clientID: kakao_client_id,
        callbackURL: callbackURL(KAKAO),
      },
      async (accessToken, refreshToken, profile, done) => {
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
              profileImage: profileImage,
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
        clientID: google_client_id,
        clientSecret: google_client_secret,
        callbackURL: callbackURL(GOOGLE),
      },
      async (accessToken, refreshToken, profile, done) => {
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
              profileImage: profileImage,
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
