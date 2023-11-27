const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID, // 카카오에서 발급하는 ID
        callbackURL: '/auth/kakao/callback', // 카카오로부터 인증 결과를 받을 라우터 주소
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: 'kakao' }, // 먼저 snsId와 provider가 일치하는 User가 존재하는지 확인
          });
          if (exUser) {
            done(null, exUser); // 일치하는 snsId와 provider가 존재할 시 done 함수를 호출하고 전략 종료
          } else {
            const newUser = await User.create({
              // 일치하는 snsId와 provider가 없을 시 회원가입 진행
              email: profile._json && profile._json.kakao_account_email, // 카카오 email
              nick: profile.displayName, // 카카오 이름
              snsId: profile.id, // 카카오 id
              provider: 'kakao', // 제공자 'kakao'
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
