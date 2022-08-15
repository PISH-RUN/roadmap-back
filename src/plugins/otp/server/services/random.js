"use strict";

const random = require("../utils/random");

module.exports = ({ strapi }) => ({
  generate(options) {
    return random(options);
  },
});
