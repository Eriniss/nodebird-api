const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(
    new LocalStrategy( // 로컬 전략의 첫번째 인자는 사용자의 정보를 담습니다.
      {
        usernameField: 'email',
        passwordField: 'password',
      },

      // 실제 전략을 수행하는 함수
      // 로컬 전략의 두번째 인자는 해당 전략이 실행되었을 때 호출되는 콜백함수 입니다.
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } }); // User에 찾는 이메일이 있는지 확인
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password); // 찾는 이메일 존재 시 패스워드 대입
            if (result) {
              done(null, false, { message: "The passwords don't match." }); // 비밀번호가 일치하지 않을 시 에러메시지 출력
            }
          } else {
            done(null, false, { message: 'The account is not signed up.' }); // 찾는 이메일 미존재 시 에러메시지 출력
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
