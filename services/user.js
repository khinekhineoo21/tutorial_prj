'use strict';
const Model = require("../models");
const moment = require('moment');
const AbstractService = require("./abstract").AbstractService;
const customUtils = require("../utils/customUtils").CustomUtils;

class UserService extends AbstractService {
    /**
     * Authentication with token
     * @param {Object} context
     */
    static async authenticate(context) {
        try{
            const token = await Model.Token.getByToken(context.headers.authorization);
            if(!token) {
                super.throwCustomError(token, "Unauthorized Access");
            }else if(token && (moment(token.expired).unix() < moment().unix())) {      
                super.throwCustomError(token, "Token expired.");
            }else if(token && token.type !== Model.Token.tokenType.authed_token) {
                super.throwCustomError(token, "Invalid Token!");
            }

            const user = await Model.User.getUserById(token.author);
            if(!user || user.authStatus !== Model.User.authStatus.authed) {
                super.throwCustomError(user, "User not found!");
            }else if(user && user.suspendStatus !== Model.User.suspendStatus.active) {
                super.throwCustomError(user, "This user had been suspended!");
            }

        return user;

        } catch(error) {
            super.throwCustomError(error, "Authencation failed!");
        }
    }


    /**
     * Check whether admin or not
     * @param {Object} context
     */
    static async adminUser(context) {
        try{
            const user = await this.authenticate(context);
            if(user.role !== Model.User.role.admin) {
                super.throwCustomError(user, "Access Denied!Please login with admin account.");
            }

        return user;

        } catch(error) {
            super.throwCustomError(error, "The error occured during process.");
        }
    }


    /**
     * Check whether normalUser or not
     * @param {Object} context
     */
    static async normalUser(context) {
        try{
            const user = await this.authenticate(context);
            if(user.role === Model.User.role.admin) {
                super.throwCustomError(user, "Access Denied!Please login with user account.");
            }

        return user;

        } catch(error) {
            super.throwCustomError(error, "The error occured during process.");
        }
    }

    
    /**
     * Signup
     * @param {Object} params
     */
    static async signUp(params) {
        try {
            let user = await Model.User.getByEmail(params.user.email);
            if(!user) {
                user = await Model.User.build(params);
                user.create();
            } else {
                if(user && user.authStatus === Model.User.authStatus.authed) {
                    super.throwCustomError('user', 'Email is already registered!')
                }else if (user && user.authStatus !== Model.User.authStatus.authed) {                    
                    await user.merge(params);
                    user.update();
                }
            }

            const token = await Model.Token.build(user, Model.Token.operation.signup);
            
            await token.create();

            const result = {
                user,
                token: token.token
            }

        return result;

        } catch(error) {
            super.throwCustomError(error, "The error occured during signup process!");
        }
    }


    /**
     * Authenticate the signup process
     * @param {Object} params
     */
    static async signUpAuthenticate(params) {
        try{
            const token = await Model.Token.getByToken(params.token);
            if(!token) {
                super.throwCustomError(token, "Token doesn't exit!");
            }else if(token && (moment(token.expired).unix() < moment().unix())) {      
                super.throwCustomError(token, "Token expired.");
            }else if(token && token.type !== Model.Token.tokenType.signup_token) {
                super.throwCustomError(token, "Invalid Token")
            }

            const user = await Model.User.getUserById(token.author);
            if(!user) {
                super.throwCustomError(token, "User not found!")
            }

            user.update(Model.User.operation.signUpAuthenticate);

            token.delete();

        return user;

        } catch(error) {
            super.throwCustomError(error, "An error occured in signUp Authenticate!");
        }
    }


    /**
     * Login
     * @param {Object} params
     */
    static async login(params) {
        try{
            const user = await Model.User.getByEmail(params.email);
            if(!user) {
                super.throwCustomError(user, "User not found!");
            }else if(user && user.authStatus !== Model.User.authStatus.authed) {
                super.throwCustomError(user, "This user need to authenticate");
            }else if(user && user.suspendStatus !== Model.User.suspendStatus.active) {
                super.throwCustomError(user, "This user had been suspended!");
            }

            const matchPassword = await user.compareLoginPassword(params.password);
            if(!matchPassword) {
                super.throwCustomError(user, "Password is incorrect!");
            }

            const token = await Model.Token.build(user, Model.Token.operation.login);

            await token.create();

            const result = {
                user,
                token: token.token
            }

        return result;

        }
        catch(error) {
            super.throwCustomError(error, "An error occured in login process!");
        }
    }

    
    /**
     * Create new user
     * @param {Object} params
     */
    static async createUser(params) {
        try {
          let user = await Model.User.getByEmail(params.user.email);
          if (!user) {
            user = await Model.User.build(params);
            user.authStatus = Model.User.authStatus.authed;
            user.role = Model.User.role[params.user.role];
            user.create();
          } else {
            await user.merge(params);
            user.update(Model.User.operation.createUser, params.user);            
          }
    
        return user;

        } catch (error) {
          super.throwCustomError(
            error,
            "The error occured during creating user process."
          );
        }
    }


    /**
     * Operate user by userId
     * @param {Object} params
     */
    static async operateUser(params) {
        try {
          const user = await Model.User.getUserById(params.userId);
          if(!user) {
              super.throwCustomError(user, "User not found!")
          }

          user.update(params.operation);

        return user;

        } catch (error) {
          super.throwCustomError(
            error,
            "The error occured during creating user process."
          );
        }
    }

    
    /**
     * Delete user by userId
     * @param {Object} params
     */
    static async deleteUser(params) {
        try {
          const user = await Model.User.getUserById(params.userId);
          if(!user) {
              super.throwCustomError(user, "User not found!")
          }

          user.delete();
          
        return user;

        } catch (error) {
          super.throwCustomError(
            error,
            "The error occured during deleting user process."
          );
        }
    }


    /**
     * Get user by userId
     * @param {Object} params
     */
    static async getUser(params) {
        try {
            const user = await Model.User.getUserById(params.userId);
            if (!user) {
                super.throwCustomError(user, "User not found.");
            }

        return user;

        } catch (error) {
            super.throwCustomError(
                error,
                "The error occured during user retrieving."
            );
        }
    }

    
    /**
     * Get all users
     * @param {Object} params
     */
    static async getAllUsers(params) {
        try{
            const users = await Model.User.getAllUsers();
            if(!users) {
                super.throwCustomError(user, "There are no users!");
            }

        return users;

        }catch(error) {
            super.throwCustomError(error, "An error occured during retrieve all users");
        }
    }


    /**
     * Logout process
     * @param {Object} context
     */
    static async logout(context) {
        try {
            const token = await Model.Token.getByToken(context.headers.authorization);

            const user = await Model.User.getUserById(token.author);

            await token.delete();

        return user;

        } catch (error) {
            super.throwCustomError(error, "The error occured during logout process.");
        }
    }

    
    /**
     * Logout from all devices
     * @param {Object} context
     */
    static async logoutAllDevice(context) {
        try {
            const token = await Model.Token.getByToken(context.headers.authorization);

            const user = await Model.User.getUserById(token.author);

            await token.deleteMany();

        return user;

        } catch (error) {
            super.throwCustomError(error, "The error occured during logout process.");
        }
    }


    /**
     * Change password
     * @param {Object} params
     */
    static async changePassword(params) {
        try{
            const currentUser = params.currentUser;

            const updateUser = await currentUser.passChange(params.password);

            const token = await Model.Token.build(updateUser, Model.Token.operation.password_change);

            await token.create();

            const result = {
                user: currentUser,
                token: token.token
            }

        return result;

        }catch(error) {
            super.throwCustomError(error, "An error occured in password changing process!");
        }
    }

    
    /**
     * Authenticate the password changing process
     * @param {Object} params
     */
    static async changePasswordAuthenticate(params) {
        try {
            const token = await Model.Token.getByToken(params.token);
            if(!token) {
                super.throwCustomError(token, "Token not found!");
            }else if(token && (moment(token.expired).unix() < moment().unix())) {      
                super.throwCustomError(token, "Token expired.");
            }else if(token && token.type !== Model.Token.tokenType.password_change_token) {
                super.throwCustomError(token, "Invalid Token!");
            }

            const user = await Model.User.getUserById(token.author);

            user.password = token.update.password;

            user.update(Model.User.operation.changePasswordAuthenticate);

            await token.delete();

        return user;

        }catch(error) {
            super.throwCustomError(error, "An Error occured in change password authenticate!")
        }
    }
     
    
    /**
     * Change email
     * @param {Object} params
     */
    static async changeEmail(params) {
        try {
            const user = await Model.User.getByEmail(params.email);
            if(user) {
                super.throwCustomError(user, "This email is already registered!");
            }

            const currentUser = params.currentUser;

            const updateUser = await currentUser.changeEmail(params.email);

            const token = await Model.Token.build(updateUser, Model.Token.operation.email_change);

            await token.create();

            const result = {
                user: currentUser,
                token: token.token
            }

        return result;

        }catch(error) {
            super.throwCustomError(error, "An error occured in email change process!");
        }
    }

    
    /**
     * Authenticate the mail changing process
     * @param {Object} params
     */
    static async changeEmailAuthentication(params) {
        try {
            const token = await Model.Token.getByToken(params.token);
            if(!token) {
                super.throwCustomError(token, "Token not found!");
            }else if(token && (moment(token.expired).unix() < moment().unix())) {      
                super.throwCustomError(token, "Token expired.");
            }else if(token && token.type !== Model.Token.tokenType.email_change_token) {
                super.throwCustomError(token, "Invalid Token Type!")
            }

            const user = await Model.User.getUserById(token.author);

            user.email = token.update.email;

            user.update(Model.User.operation.changeEmailAuthenticate);

            token.delete();

        return user;

        }catch(error) {
            super.throwCustomError(error, "An error occured in changeEmailAuthentication!");
        }
    }

    
    /**
     * Reset passeord
     * @param {Object} params
     */
    static async passwordReset(params) {
        try{
            const user = await Model.User.getByEmail(params.email);
            if(!user || user.authStatus !== Model.User.authStatus.authed) {
                super.throwCustomError(user, "User not found");
            }else if( user && user.suspendStatus !== Model.User.suspendStatus.active) {
                super.throwCustomError(user, "Suspended User!")
            }

            const token = Model.Token.build(user, Model.Token.operation.password_reset);

            token.create();

            const result = {
                reset: true,
                token: token.token
            }

        return result;

        }catch(error) {
            super.throwCustomError(error, "An error occured in password reset!")
        }
    }

    
    /**
     * Authenticate the password reset process
     * @param {Object} params
     */
    static async passwordResetAuthenticate(params) {
        try {
            const token = await Model.Token.getByToken(params.passwordReset.token);
            if(!token) {
                super.throwCustomError(token, "Token not found!");
            }else if(token && (moment(token.expired).unix() < moment().unix())) {      
                super.throwCustomError(token, "Token expired.");
            }else if(token && token.type !== Model.Token.tokenType.password_reset_token) {
                super.throwCustomError(token, "Invalid Token!");
            }
            const user = await Model.User.getUserById(token.author);

            await user.passwordReset(params.passwordReset);

            user.update();

            token.delete();

        return true;

        }catch(error) {
            super.throwCustomError(error, "An error occured in password reset authentication process!");
        }

        
    }   

}

module.exports.UserService = UserService;
