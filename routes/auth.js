const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

// 회원가입 시
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body; // req에 담긴 정보를 비구조 할당 처리
  try {
    const exUser = await User.findOne({ where: { email } }); // email 중복검사
    if (exUser) {
      return res.redirect('/join?error=exist'); // 만약 이메일 중복 시 에러를 반환하며 회원가입 페이지를 리다이렉팅 합니다.
    }
    const hash = await bcrypt.hash(password, 12); // 비밀번호 해시함수 처리
    // User에 담긴 model에 따라 계정을 생성합니다.
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/'); // 회원가입 성공 시 메인화면으로 리다이렉팅
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 로그인 시
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`?loginError=${info.message}`); // 로그인 실패 시 로그인 에러를 반환하고 메인페이지로 이동합니다.
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/'); // 로그인 성공 시 메인화면으로 리다이렉팅
    });
  })(req, res, next);
});

// 로그아웃 시
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout(); // 로그아웃
  req.session.destroy(); // destroy 메서드를 사용해 세션 삭제
  res.redirect('/'); // 이후 메인페이지
});

module.exports = router;
