const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

// 회원가입 시
exports.join = async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } }); // 이메일 중 중복되는 로직이 있는지 확인
    if (exUser) {
      return res.redirect('/join?error=exist'); // 중복 시 에러 메시지 출력
    }
    const hash = await bcrypt.hash(password, 12); // 비밀번호 해시함수 처리
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/'); // 성공 시 메인페이지로 리다이렉트
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// 로그인 시
exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

// 로그아웃 시
exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};
