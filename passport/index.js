const passport = require("passport");
const kakao = require("./kakaoStrategy");
const google = require("./googleStrategy");
const naver = require("./naverStrategy");
const { Users } = require("../models");

module.exports = () => {
  //req.session에 뭘 저장할지 정한다.
  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });
  //세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴
  passport.deserializeUser((id, done) => {
    Users.findOne({ where: { userId: userId } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });
  kakao();
  google();
  naver();
};
