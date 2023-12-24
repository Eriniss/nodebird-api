// 유저의 정보를 담는 데이터 테이블 모델
const Sequelize = require('sequelize');

// 일반 적인 경우 필수 정보일 경우 allowNull을 false로 설정하고
// 선택적 정보일 경우 allowNull을 true로 설정합니다.
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          // 이메일
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
        },
        nick: {
          // 닉네임(필수)
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          // 패스워드
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        provider: {
          // 로그인을 지원하는 형식. '로컬', '카카오' 지원 예정
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: 'local', // 기본 값으로 local 설정
        },
        snsId: {
          // sns 아이디
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  // User 모델 (User.associate(db))
  static associate(db) {
    // User 모델과 Post 모델 간의 일대다(One-to-Many) 관계를 설정합니다.
    // User는 여러 개의 Post를 가질 수 있습니다.
    db.User.hasMany(db.Post);

    // User 모델과 자기 자신(User) 간의 다대다(Many-to-Many) 관계를 설정합니다.
    // Follow라는 모델을 통해 User와 User 간의 관계를 설정합니다.
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow',
    });

    // User는 여러 명의 다른 User를 팔로우할 수 있습니다. (followingId)
    // User는 여러 명의 다른 User에게 팔로워될 수 있습니다. (followerId)
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    });
  }
};
