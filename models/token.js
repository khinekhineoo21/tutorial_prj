"use strict";

const moment = require("moment");
const uuidv4 = require("uuid/v4");
const crypto = require("crypto");
const Schema = require("../schemas");
const CustomUtils = require("../utils/customUtils").CustomUtils;
const AbstractModel = require("./abstract");

class TokenModel extends AbstractModel {
    constructor(params = {}) {
      super();

      this.id = params.id;
      this.tokenId = params.tokenId;
      this.type = params.type;
      this.token = params.token;
      this.expired = params.expired;
      this.author = params.author;
      this.update = params.update;
      this.createdAt = params.createdAt;
      this.updatedAt = params.updatedAt;
    }

    
    /**
     * Build token
     */
    static build(params, operation) {
      this.operate(operation);
      this.id = uuidv4();
      const token = new TokenModel({
        id: this.id,
        tokenId: this.id,
        type: this.type,
        token: this.token,
        expired: this.expired,
        author: params.userId,
        update: {
          email: params.email,
          password: params.password
        },
        createdAt: moment().format('YYYY-M-D HH:mm A'),
        updatedAt: moment().format('YYYY-M-D HH:mm A'),
      });
      return token;
    }


    /**
     * Create token
     */
    async create() {
      const token = new Schema.Token(this);
      token.save();
      return this.constructor.toModel(token);
    }


    /**
     * Delete token
     */
    async delete() {
      const token = await Schema.Token.remove({
        token: this.token,
        type: this.type
      });

      return this.constructor.toModel(token);
    }


    /**
     * Delete many token
     */
    async deleteMany() {
      const token = await Schema.Token.deleteMany({
        author: this.author,
        type: this.type
      });

      return this.constructor.toModel(token);
    }


    /**
     * to get token by tokenId
     * @param {String} tokenId
     */
    static async getByToken(token) {
      const item = await Schema.Token.findOne({ token });
      return this.toModel(item);
    }


    static operate(processs) {
      let randomStringToken = CustomUtils.randomString(50);
      let cryptoToken = crypto.randomBytes(16).toString("hex");
      switch (processs) {
        case TokenModel.operation.signup:
          this.type = TokenModel.tokenType.signup_token;
          this.token = cryptoToken;
          this.expired = moment(new Date()).add(1, "hours").format('YYYY-M-D HH:mm A');
          break;
        case TokenModel.operation.login:
          this.type = TokenModel.tokenType.authed_token;
          this.token = randomStringToken;
          this.expired = moment(new Date()).add(5, "hours").format('YYYY-M-D HH:mm A');
          break;
        case TokenModel.operation.password_change:
          this.type = TokenModel.tokenType.password_change_token;
          this.token = cryptoToken;
          this.expired = moment(new Date()).add(2, "hours").format('YYYY-M-D HH:mm A');
          break;
        case TokenModel.operation.email_change:
          this.type = TokenModel.tokenType.email_change_token;
          this.token = cryptoToken;
          this.expired = moment(new Date()).add(2, "hours").format('YYYY-M-D HH:mm A');
          break;
        case TokenModel.operation.password_reset:
          this.type = TokenModel.tokenType.password_reset_token;
          this.token = cryptoToken;
          this.expired = moment(new Date()).add(2, "hours").format('YYYY-M-D HH:mm A');
          break;
      }
  }
  

  /**
   * generate an instance from MongoDB item
   * @param {Object} params
   * @return {TokenModel|null}
   */
  static toModel(params) {
    if (!params) return null;

    const token = {
      id: params.tokenId !== undefined ? params.tokenId : null,
      type: params.type !== undefined ? params.type : null,
      tokenId: params.tokenId !== undefined ? params.tokenId : null,
      token: params.token !== undefined ? params.token : null,
      expired: params.expired !== undefined ? params.expired : null,
      author: params.author !== undefined ? params.author : null,
      update: params.update !== undefined ? params.update : null,
      createdAt: params.createdAt !== undefined ? params.createdAt : null,
      updatedAt: params.updatedAt !== undefined ? params.updatedAt : null
    };
    return new TokenModel(token);
  }
}

TokenModel.operation = {
  signup: "signup",
  login: "login",
  password_change: "password_change",
  email_change: "email_change",
  password_reset: "password_reset"
};

TokenModel.tokenType = {
  signup_token: "signup_token",
  authed_token: "authed_token",
  password_change_token: "password_change_token",
  email_change_token: "email_change_token",
  password_reset_token: "password_reset_token"
};

module.exports.TokenModel = TokenModel;
