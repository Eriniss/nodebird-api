const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 각각의 모델을 객체에 연결
db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports = db;

// * 정리 *

// 한 명의 User는 다수의 Post를 가질 수 있습니다.(1 to many) -> 다수의 Post는 하나의 User에 속합니다.(many to 1)
// 한 명의 User는 다수의 Follower를 가질 수 있습니다.(1 to many)
// 한 명의 User는 다수의 Following을 가질 수 있습니다.(1 to many)
// 여러 Post는 여러 Hashtag를 가질 수 있습니다.(many to many) -> 다수의 Hashtag는 다수의 Post에 속합니다.(many to many)
