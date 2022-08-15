"use strict";

module.exports = (key = undefined) => {
  return strapi.config.get(["plugin.otp", key].filter((i) => i).join("."));
};
