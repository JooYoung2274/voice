const passport = require("passport");
const naverStrategy = require("passport-naver").Strategy;
const kakaoStrategy = require("passport-kakao").Strategy;
const googleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models");
const randomstring = require("randomstring");
const {
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  DOMAIN,
  S3_HOST,
  KAKAO_CLIENT_ID,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;
const { AUTH_PLATFORM: PLATFORM, IMAGE, DIRECTORY } = require("../config/constants");

const profileImage = `${S3_HOST}/${DIRECTORY.ETC}/${IMAGE.PROFILE}`;
const callbackURL = (company) => `${DOMAIN}/api/auth/${company}/callback`;

let newNickname = "";

module.exports = (app) => {
  app.use(passport.initialize());
  passport.use(
    new naverStrategy(
      {
        clientID: NAVER_CLIENT_ID,
        clientSecret: NAVER_CLIENT_SECRET,
        callbackURL: callbackURL(PLATFORM.NAVER),
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
        clientID: KAKAO_CLIENT_ID,
        callbackURL: callbackURL(PLATFORM.KAKAO),
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, flatformType: profile.provider },
          });
          if (exUser) {
            console.log(exUser);
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
            console.log(newUser);
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
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL(PLATFORM.GOOGLE),
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
