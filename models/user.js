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

  // 다른 모델 간의 관계 설정 시 필요
  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Follwers',
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Follwings',
      through: 'Follow',
    });
  }
};
