"use strict";

const validator = require("validator");

// const Enum = require('../enums');

class CustomValidator {
  constructor() {}

  /********************************************************
   * Validation
   ********************************************************/

  /**
   * String
   * @param {string} name name to include error message
   * @param {string} str
   * @param {Object} option
   * @return {Array.<string>}
   */
  static validateString(name, str, option = {}) {
    const messages = [];

    // type
    if (typeof str !== "string") {
      messages.push(`${name} must be character.`);
      return messages;
    }

    // Validate '/' in the string
    if (str.match(/^__empty__#/)) {
      str = "";
    }

    // String length
    if (typeof option.length === "number") {
      if (str.length !== option.length) {
        messages.push(`${name} must be exactly ${option.length} characters.`);
      }
    } else if (!validator.isLength(str + "", option)) {
      if (typeof option.min === "number" && typeof option.max === "number") {
        messages.push(`${name} must be ${option.min}~${option.max} length.`);
      } else if (typeof option.min === "number") {
        messages.push(`${name} must be at least ${option.min} characters.`);
      } else if (typeof option.max === "number") {
        messages.push(`${name} must be at most ${option.max} characters.`);
      } else {
        messages.push(`${name} must be valide value.`);
      }
    }

    return messages;
  }

  /**
   * 整数
   * @param {string} name エラーメッセージに含める呼称
   * @param {string} num
   * @param {Object} option
   * @return {Array.<string>}
   */
  static validateInt(name, num, option = {}) {
    const messages = [];

    // type
    if (typeof num !== "number") {
      messages.push(`${name}must be number.`);
      return messages;
    }

    // number in digit
    if (typeof option.digits === "number") {
      if (
        !validator.isLength(num + "", {
          min: option.digits,
          max: option.digits
        })
      ) {
        messages.push(`${name} must be ${option.digits} digits`);
      }
    }

    // 数値範囲
    if (!validator.isInt(num + "", option)) {
      if (typeof option.min === "number" && typeof option.max === "number") {
        messages.push(`${name} must be betweeen ${option.min}~${option.max}.`);
      } else if (typeof option.min === "number") {
        messages.push(`${name} must be ${option.min} or greater.`);
      } else if (typeof option.max === "number") {
        messages.push(`${name} must be ${option.max} or below`);
      } else {
        messages.push(`${name} must be valid number.`);
      }
    }

    return messages;
  }

}

module.exports.CustomValidator = CustomValidator;
