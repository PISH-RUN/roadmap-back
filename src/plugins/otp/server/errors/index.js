"use strict";

const utils = require("@strapi/utils");
const { ApplicationError, ValidationError } = utils.errors;

class TooFastError extends ApplicationError {
  constructor(message, details) {
    super(message, details);
    this.name = "TooFastError";
  }
}

module.exports = {
  ApplicationError,
  ValidationError,
  TooFastError,
};
