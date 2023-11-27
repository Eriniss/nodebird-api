// 포스트 글의 데이터 테이블 모델
const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Post',
        tableName: 'posts',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    //Post 모델과 User 모델 간의 다대일(Many-to-One) 관계를 설정합니다.
    // 다수의 Post는 하나의 User에 속합니다.
    db.Post.belongsTo(db.User);

    // Post 모델과 Hashtag 모델 간의 다대다(Many-to-Many) 관계를 설정합니다.
    // PostHashtag라는 모델을 통해 Post와 Hashtag 간의 관계를 설정합니다.
    // Post는 여러 개의 Hashtag를 가질 수 있습니다.
    // Hashtag는 여러 개의 Post에 속할 수 있습니다.
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
  }
};
