"use strict";

const { castToIranFormat } = require("../../../utils/mobile");

module.exports = async function findUser(identifier) {
  const mobile = castToIranFormat(identifier);

  return await strapi
    .query("plugin::users-permissions.user")
    .findOne({ where: { mobile } });
};
