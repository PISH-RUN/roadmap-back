"use strict";

const otpController = require("./controllers/otp");

module.exports = (plugin) => {
  plugin.controllers.auth.request = otpController.request;

  return plugin;
};
