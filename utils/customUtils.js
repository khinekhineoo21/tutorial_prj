'use strict';

const bcrypt = require('bcrypt-nodejs');

class CustomUtils {

    constructor() {}

    static randomString(len) {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const cl = chars.length;
      let str = '';
      for(let i = 0; i < len; i++) {
          str += chars[Math.floor(Math.random()*cl)]
      }
      return str;
    }

    static async hashPassword(password) {
      const saltRounds = bcrypt.genSaltSync(10);    
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, null, (error, hash) => {
          if (error) reject(error);
          resolve(hash);
        });
      })    
      return hashedPassword;
    }

    /**
     * to compare exist password and input password
     * @param {String} password
     * @param {String} existPassword
     */
    static async comparePassword(paramOldPassword, existPassword) {
      const isMatch = await new Promise((resolve, reject) => {
        bcrypt.compare(paramOldPassword, existPassword, (error, isMatch) => {
          if (error) reject(error);
          resolve(isMatch);
        });
      });
      
      return isMatch;
    }

}

module.exports.CustomUtils = CustomUtils;



