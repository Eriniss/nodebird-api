// 해시태크 데이터 테이블 모델
const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Hashtag',
        tableName: 'hashtags',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    // Hashtag 모델과 Post 모델 간의 다대다(Many-to-Many) 관계를 설정합니다.
    // Hashtag는 여러 다른 Post에게 태그할 수 있습니다.
    // Post는 여러개의 Hashtag를 가질 수 있습니다.
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
  }
};
