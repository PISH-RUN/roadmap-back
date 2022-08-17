"use strict";

require("./init");


const _ = require("lodash");

const zarinpal = require("./lib/zarinpal");

// register
const callbackUser = require("./extensions/otp/modifiers/callback-user");

// lifecycles
const registerUserLifecycle = require("./extensions/users-permissions/lifecycles");

// otp
const registerMessengerMethods = require("./bootstrap/register-messenger-methods");
const otpCallback = require("./bootstrap/otp-callback");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  async register({ strapi }) {
    strapi.services["plugin::otp.user"].callbackUser = callbackUser;

    strapi.zarinpal = zarinpal({ strapi });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    registerUserLifecycle(strapi);

    await registerMessengerMethods(strapi);
    await otpCallback(strapi);
  },
};
