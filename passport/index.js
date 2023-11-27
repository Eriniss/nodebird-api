const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

// 세션에 불필요한 정보들을 담지 않기 위해
// 로그인 id 정보만 저장합니다.
module.exports = () => {
  // 로그인 시 실행
  // user는 로그인 사용자 정보입니다.
  passport.serializeUser((user, done) => {
    done(null, user.id); // 로그인 실패 시 null이 반환되며 로그인 성공 시 user.id가 반환됩니다.
  });

  // 매 요청 시 실행
  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } }) // 위의 serializeUser에서 저장한 id값을 불러옵니다.
      .then((user) => done(null, user)) // id 값이 존재하지 않는다면 null을, 존재한다면 user를 req.user에 저장합니다.
      .catch((err) => done(err)); // 에러 처리 메서드
  });

  local();
  kakao();
};
