"use strict";
const express = require("express");
const app = express();

class CustomError extends Error {
  /**
   * @param {string} message error message
   */
  constructor(message) {
    super(message);
  }
}

module.exports.CustomError = CustomError;
