const UserService = require('./user').UserService;
const PostService = require('./post').PostService;

module.exports = {
    User: UserService,
    Post: PostService
}