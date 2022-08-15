"use strict";

const otpService = (strapi) => strapi.service("plugin::otp.otp");
const optExtendedService = () => strapi.service("plugin::otp.extended");
const optUserService = () => strapi.service("plugin::otp.user");
const userService = () => strapi.plugin("users-permissions").service("user");
const jwtService = () => strapi.plugin("users-permissions").service("jwt");

module.exports = {
  otpService,
  optExtendedService,
  optUserService,
  userService,
  jwtService,
};
