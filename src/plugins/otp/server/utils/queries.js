"use strict";

const otpQuery = () => strapi.query("plugin::otp.otp");

module.exports = {
  otpQuery,
};
