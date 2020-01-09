const UserModel = require('./user').UserModel;
const TokenModel = require('./token').TokenModel;
const PostModel = require('./post').PostModel;

module.exports = {
    User: UserModel,
    Token: TokenModel,
    Post: PostModel
}