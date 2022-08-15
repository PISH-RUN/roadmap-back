"use strict";

module.exports = {
  default: {
    requestInterval: 180,
    tokenDuration: 3600,
    token: {
      type: "alphanumeric",
      length: 4,
    },
  },
  validator(config) {
    if (typeof config.requestInterval !== "number") {
      throw new Error(`requestInterval should be a number`);
    }

    if (
      typeof config.tokenDuration !== "number" ||
      config.tokenDuration < config.requestInterval
    ) {
      throw new Error(
        `tokenDuration should be a number and greater than requestInterval`
      );
    }

    return true;
  },
};
