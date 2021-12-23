const passport = require("passport");
const naverStrategy = require("passport-naver").Strategy;
const { Users } = require("../models");

const randomstring = require("randomstring");
const newNickname = randomstring.generate({ length: 15 });

module.exports = () => {
  passport.use(
    new naverStrategy(
      {
        clientID: "vNamYzNai5L1YAnpDWjU",
        clientSecret: "uvlqNozWDw",
        callbackURL: "/api/auth/naver/callback",
      },
      async (acessToken, refreshToken, profile, done) => {
        console.log("*********naver profile*********", profile);
        try {
          const exUser = await Users.findOne({
            where: { snsId: profile.id, flatformType: profile.provider },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await Users.create({
              email: profile._json.email,
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
