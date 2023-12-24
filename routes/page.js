// 페이지 라우터 설정
// 라우터의 기능은 [GET /profile, GET /join, GET / ]으로 총 3가지 입니다.

const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middleware');
const { Post, User, Hashtag } = require('../models');

const router = express.Router();

// 모든 라우터에서 사용되는 미들웨어 설정
// 아래의 변수들은 모든 템플릿 엔진에서 공통으로 사용됩니다.
router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0; // 팔로워 유저수
  res.locals.followingCount = req.user ? req.user.Followings.length : 0; // 팔로우 중인 유저수
  res.locals.followerIdList = req.user ? req.user.Followings.map((f) => f.id) : []; // map을 이용하여 모든 user의 id값 return
  next();
});

// 프로필 페이지를 렌더링
// 로그인 상태일때만 프로필 페이지 렌더링
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});

// 회원가입 페이지를 렌더링
// 로그인 상태가 아닐시에만 회원가입 페이지 렌더링
router.get('/join', isNotLoggedIn, (req, res, next) => {
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

// ...
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.render('main', {
      title: 'NodeBird',
      twits: posts,
    });
  } catch (error) {
    console.error(err);
    next(err);
  }
});

// ...
router.get('./hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPost({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
