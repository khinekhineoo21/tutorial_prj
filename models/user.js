'use strict';

const uuidv4 = require('uuid/v4');
const moment = require('moment');
const Schema = require('../schemas');
const CustomUtils = require('../utils/CustomUtils').CustomUtils;
const CustomError = require("../utils/customErrors").CustomError;
const AbstractModel = require('./abstract');
const CustomValidator = require("../utils/customValidator").CustomValidator;

class UserModel extends AbstractModel {
    constructor(params = {}) {
      super();
      this.id = params.id;
      this.userId = params.userId;
      this.email = params.email;
      this.password = params.password;
      this.username = params.username;
      this.authStatus = params.authStatus;
      this.suspendStatus = params.suspendStatus;
      this.role = params.role;
      this.createdAt = params.createdAt;
      this.updatedAt = params.updatedAt;
    }

    
    /**
     * Get user by userId 
     * @param {String} userId
     */
    static async getUserById(userId) {
      const user = await Schema.User.findOne({userId});
      return this.toModel(user);
    }

  
    /**
     * Get all users 
     */
    static async getAllUsers() {
      const users = await Schema.User.find();
      const results = users.map(user => {
        return this.toModel(user);
      });
      return results;
    }


    /**
     * Get user by email 
     * @param {String} email
     */
    static async getByEmail(email) {
        const user = await Schema.User.findOne({ email });
        return this.toModel(user);
    }


    /**
     * Compare login password
     * @param {String} paramsPassword
     */
    async compareLoginPassword(paramsPassword) {
      const isMatch = await CustomUtils.comparePassword(
        paramsPassword,
        this.password
      );
      return isMatch;
    }


    /**
     * Build user
     */
    static async build(params) {
      const users = await this.getAllUsers();
      this.id = uuidv4();
      const errors = await this.validatePassword(params.user.password);
      if(errors.length > 0) {
        throw new CustomError(errors);
      }
      this.password = await CustomUtils.hashPassword(params.user.password);
      const user = new UserModel({
        id: this.id,
        userId: this.id,
        email: params.user.email,
        password: this.password,
        username: params.user.username,
        authStatus: this.authStatus.noAuth,
        role: users.length === 0 ? this.role.admin : this.role.normalUser,
        suspendStatus: this.suspendStatus.active,
        createdAt: moment().format('YYYY-M-D HH:mm A'),
        updatedAt: moment().format('YYYY-M-D HH:mm A'),
      });
      return user;
    }


    /**
     * Create user
     */
    async create() {
      const user = new Schema.User(this);
      await user.save();
      return this.constructor.toModel(user);
    }


    /**
     * Merge user
     */
    async merge(params) {
      if(params.user.username !== undefined) {
        this.username = params.user.username;
      }
      if(params.user.password !== undefined) {
       if(params.user.password.length < 8) {
        throw new CustomError("Password must be at least 8 characters.");
       }
        this.password = await CustomUtils.hashPassword(params.user.password);
      }
      this.updatedAt = moment().format('YYYY-M-D HH:mm A');
    }

  
    /**
     * Update user by userId
     */
    async update(operation, params) {
      this.operate(operation, params);
      const user = await Schema.User.findOneAndUpdate(
        { userId: this.userId },
        {
          email: this.email,
          username: this.username,
          password: this.password,
          authStatus: this.authStatus,
          role: this.role,
          suspendStatus: this.suspendStatus,
          updatedAt: this.updatedAt
        }
      );
      return this.constructor.toModel(user);
    }

      
    /**
     * Delete user by userId
     */
    async delete() {
      const user = await Schema.User.findOneAndDelete({userId: this.userId});
      return this.constructor.toModel(user);
    }
    

    operate(processs, params) {
      switch (processs) {
        case "sign_up_athenticate":
          this.authStatus = UserModel.authStatus.authed;
          break;
        case "suspend":
          this.suspendStatus = UserModel.suspendStatus.suspended;
          break;
        case "unsuspend":
          this.suspendStatus = UserModel.suspendStatus.active;
          break;
        case "normal":
          this.role = UserModel.role.normalUser;
          break;
        case "createUser":
          this.authStatus = UserModel.authStatus.authed;
          this.role = UserModel.role[params.role];
        default:
          break;
      }
    }


    /**
     * Change password
     * @param {Object} params
     */
    async passChange(params) {   
      const errors = await this.validateChangePassword(params);
      if(errors.length > 0) {
        throw new CustomError(errors[0]);
      }    
      this.password = await CustomUtils.hashPassword(params.newPassword);
      return this.constructor.toModel(this);
    }

    async passwordReset(params) {
      const errors = await this.validateResetPassword(params);
      if(errors.length > 0) {
        throw new CustomError(errors[0]);
      }
      this.password = await CustomUtils.hashPassword(params.newPassword);
      return this.constructor.toModel(this);
    }

    static async validatePassword(password) {
      const messages = [];
      messages.push(
        ...CustomValidator.validateString("Password", password, {
          min: 8
        })
      );
      return messages;
    }


    /**
     * Validate password
     * @param {Object} params
     */
    async validateChangePassword(params) {
      const messages = [];
      const isMatch = await CustomUtils.comparePassword(params.oldPassword, this.password)
      if(!isMatch) {
        messages.push("Old password is not match!");
      }
      if (params.newPassword !== params.confirmPassword) {
        messages.push("newPassword and confirmPassword are not match");
      }    
      messages.push(
        ...CustomValidator.validateString("oldPassword", params.oldPassword, {
          min: 8
        })
      );    
      messages.push(
        ...CustomValidator.validateString("newPassword", params.newPassword, {
          min: 8
        })
      );    
      messages.push(
        ...CustomValidator.validateString("confirmPassword", params.confirmPassword, { 
          min: 8
        })
      );
      return messages;
    }


    /**
     * Validate password
     * @param {Object} params
     */
    async validateResetPassword(params) {
      const messages = [];
      if(params.newPassword !== params.confirmPassword) {
        messages.push("newpassword and confirmPassword are not match!");
      }
      messages.push(...CustomValidator.validateString("newPassword", params.newPassword, { min: 8 }));
      return messages;
    }


    /**
     * Change email
     * @param {String} newEmail
     */
    async changeEmail(newEmail) {
      const errors = await this.validateChangeEmail(newEmail);
      if(errors.length > 0) {
        super.throwCustomError(errors,errors[0]);
      }
      this.email = newEmail;
      return this.constructor.toModel(this);
    }


    /**
     * Validate Email
     * @param {String} email
     */
    async validateChangeEmail(email) {
      const messages = [];
      messages.push(...CustomValidator.validateString("email", email, {}));
      return messages;
    }
    
    
    /**
     * Create instances 
     * @param {Object} params
     * @return {UserModel|null}
     */
    static async toModel(params) {
      if(!params) return null;
      const user = {
        id: params.userId !== undefined ? params.userId: null,
        userId: params.userId !== undefined ? params.userId: null,
        email: params.email !== undefined ? params.email: null,
        username: params.username !== undefined ? params.username: null,
        password: params.password !== undefined ? params.password: null,
        authStatus: params.authStatus !== undefined ? params.authStatus: null,
        suspendStatus: params.suspendStatus !== undefined ? params.suspendStatus: null,
        role: params.role !== undefined ? params.role: null,
        createdAt: params.createdAt !== undefined ? params.createdAt: null,
        updatedAt: params.updatedAt !== undefined ? params.updatedAt: null
      }
      return new UserModel(user);
    }
}


UserModel.operation = {
  signUpAuthenticate: 'sign_up_athenticate',
  changePasswordAuthenticate: 'change_password_authenticate',
  changeEmailAuthenticate: 'change_email_authenticate',
  passwordResetAuthenticate: 'password_reset_authenticate',
  suspendUser: 'suspend',
  unsuspendUser: 'unsuspend',
  normalUser: 'normal',
  createUser: "createuser"
}

UserModel.authStatus = {
  authed: 1,
  noAuth: 0    
}
  
UserModel.role = {
  admin: 1,
  normalUser: 0
}
  
UserModel.suspendStatus = {
  active: 1,
  suspended: 0
}

module.exports.UserModel = UserModel