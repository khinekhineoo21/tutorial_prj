const Service = require('./services');

class Resolver {

    static Query() {
        return {
            getUser: async (root, args, context, info) => {
                args.currentUser = await Service.User.authenticate(context);
                return Service.User.getUser(args);
            },
            getAllUsers: async (root, args, context, info) => {
                args.currentUser = await Service.User.adminUser(context);
                return Service.User.getAllUsers(args);
            },
            getPostByUser: async (root, args, context, info) => {
                args.currentUser = await Service.User.normalUser(context);
                return Service.Post.getPostByUser(args);
            },
            getAllPosts: async (root, args, context, info) => {
                args.currentUser = await Service.User.authenticate(context);
                return Service.Post.getAllPosts(args);
            },
        }
    }

    static Mutation() {
        return {
            signUp: async (root, args, context, info) => {
                return Service.User.signUp(args);
            },
            signUpAuthenticate: async(root, args, context, info) => {
                return Service.User.signUpAuthenticate(args);
            },
            login: async(root, args, context, info) => {
                return Service.User.login(args);
            },
            authenticate: async(root, args, context, info) => {
                return Service.User.authenticate(args);
            },
            logout: async(root, args, context, info) => {
                args.currentUser = await Service.User.authenticate(context);
                return Service.User.logout(context);
            },
            logoutAllDevice: async(root, args, context, info) => {
                args.currentUser = await Service.User.authenticate(context);
                return Service.User.logoutAllDevice(context);
            },
            changePassword: async (root, args, context, info) => {
                args.currentUser = await Service.User.authenticate(context);
                return Service.User.changePassword(args);
            },
            changePasswordAuthenticate: async (root, args, context, info) => {
                args.currentUser = await Service.User.authenticate(context);
                return Service.User.changePasswordAuthenticate(args);
            },
            changeEmail: async (root, args, context, info) => {
                args.currentUser = await Service.User.authenticate(context);
                return Service.User.changeEmail(args);
            },
            changeEmailAuthentication: async (root, args, context, info) => {
                args.currentUser = await Service.User.authenticate(context);
                return Service.User.changeEmailAuthentication(args);
            },
            passwordReset: async (root, args, context, info) => {
                return Service.User.passwordReset(args);
            },
            passwordResetAuthenticate: async (root, args, context, info) => {
                return Service.User.passwordResetAuthenticate(args);
            },
            createUser: async (root, args, context, info) => {
                args.currentUser = await Service.User.adminUser(context);
                return Service.User.createUser(args);
            },
            operateUser: async (root, args, context, info) => {
                args.currentUser = await Service.User.adminUser(context);
                return Service.User.operateUser(args);
            },
            deleteUser: async (root, args, context, info) => {
                args.currentUser = await Service.User.adminUser(context);
                return Service.User.deleteUser(args);
            },
            createPost: async (root, args, context, info) => {
                args.currentUser = await Service.User.normalUser(context);
                return Service.Post.createPost(args);
            },
            updatePost: async (root, args, context, info) => {
                args.currentUser = await Service.User.normalUser(context);
                return Service.Post.updatePost(args);
            },
            deletePost: async (root, args, context, info) => {
                args.currentUser = await Service.User.normalUser(context);
                return Service.Post.deletePost(args);
            }
        }
    }

    static Post() {
        return {
          author: async (root, args, context, info) => {
            root.userId = root.author;
            return Service.User.getUser(root);
          },
        };
      }
}

module.exports = {
    Query: Resolver.Query(),
    Mutation: Resolver.Mutation(),
    Post: Resolver.Post()
}