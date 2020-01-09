"use strict";

const CustomErrors = require("../utils/customErrors");
const CustomError = CustomErrors.CustomError;

class AbstractService {
  /**
   * If a CustomError object is passed, it will just throw. Otherwise, create a CustomError object and throw.
   * @param {CustomError|Error} error error object
   * @param {string} message error message
   * @throws {CustomError} CustomError
   */
  static throwCustomError(error, message) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(message);    
  }
}

module.exports.AbstractService = AbstractService;
