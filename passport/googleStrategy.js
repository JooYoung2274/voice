const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;

const { Users } = require("../models");
const randomstring = require("randomstring");
const newNickname = randomstring.generate({ length: 15 });

module.exports = () => {
  passport.use(
    new googleStrategy(
      {
        clientID: "283372056185-4d683ifd0ec8u3un2lmtmrq94qh0cgc8.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "/api/auth/google/callback",
      },
      async (acessToken, refreshToken, profile, done) => {
        console.log("*********google profile*********", profile);
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
