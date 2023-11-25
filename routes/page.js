// 페이지 라우터 설정
// 라우터의 기능은 [GET /profile, GET /join, GET / ]으로 총 3가지 입니다.

const express = require('express');

const router = express.Router();

// 모든 라우터에서 사용되는 미들웨어 설정
// 아래의 변수들은 모든 템플릿 엔진에서 공통으로 사용됩니다.
router.use((req, res, next) => {
  res.locals.user = null;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

// 프로필 페이지를 렌더링
router.get('/profile', (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});

// 회원가입 페이지를 렌더링
router.get('/join', (req, res, next) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

// 메인 페이지를 렌더링
router.get('/', (req, res, next) => {
  const twits = [];
  res.render('main', {
    title: 'NodeBird',
    twits,
  });
});

module.exports = router;
ㄴ;
