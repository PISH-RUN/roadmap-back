"use strict";

const IO = require("./socket/IO");
const config = require("./utils/config");

module.exports = async ({ strapi }) => {
  const options = await config("options");

  strapi.$io = new IO(options);
};
