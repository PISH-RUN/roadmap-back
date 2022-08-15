"use strict";

const otp = {
  ghasedak: (provider) => async (user, token) => {
    try {
      return await provider.verification({
        receptor: user,
        template: "pishrun",
        params: { param1: token },
      });
    } catch (e) {
      console.error(
        `something went wrong in sending ghasedak verification`,
        e.message
      );

      return null;
    }
  },
};

module.exports = async (strapi) => {
  strapi.service("plugin::sms.messenger").register("otp", otp);
};
