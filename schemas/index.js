const UserSchema = require('./user');
const TokenSchema = require('./token');
const PostSchema = require('./post');

module.exports = {
    User: UserSchema,
    Token: TokenSchema,
    Post: PostSchema
}


