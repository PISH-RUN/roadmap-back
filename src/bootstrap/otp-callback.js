"use strict";

const messengerService = require("../utils/services");

module.exports = (strapi) => {
  strapi.plugin("otp").setCallback((user, token) => {
    if (process.env.NODE_ENV === "production") {
      messengerService().otp(user.mobile, token);
      return;
    }

    console.log({ context: "otp token generated", user: user.id, token });
  });
};
