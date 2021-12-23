const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;

const { Users } = require("../models");
const randomstring = require("randomstring");
const newNickname = randomstring.generate({ length: 15 });

module.exports = () => {
  passport.use(
    new kakaoStrategy(
      {
        clientID: "f1e0d9ea23cc43e8717f86da6573a3a1",
        callbackURL: "/api/auth/kakao/callback",
      },
      async (acessToken, refreshToken, profile, done) => {
        console.log("*********kakao profile*********", profile);
        const providerId = profile?.id;
        try {
          const exUser = await Users.findOne({
            where: { snsId: profile.id, flatformType: profile.provider },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await Users.create({
              email: profile._json.kakao_account.email,
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
