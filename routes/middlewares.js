// 로그인을 하지 않을 시 로그인을 요구하는 기능과
// 로그인 시 회원가입 페이지의 접근을 막는 기능을 가진
// 미들웨어 입니다.

exports.isLoggedIn = (req, res, next) => {
  // 로그인 시 true
  if (req.isAuthenticated()) {
    next(); // 로그인 상태일 시 next()
  } else {
    res.status(403).send('Sign in is required.'); // 로그아웃 상태일 시 출력되는 에러메시지
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next(); // 로그아웃 상태일 시 next()
  } else {
    // 로그인 상태일 시 출력되는 에러메시지
    const message = encodeURIComponent("You're already logged in.");
    res.redirect(`/?error=${message}`);
  }
};
