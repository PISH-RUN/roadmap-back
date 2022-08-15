"use strict";

const { yup } = require("@strapi/utils");

function castToIranFormat(mobile) {
  return yup
    .string()
    .transform((value) => {
      if (/^09\d{9}$/.test(value)) {
        return `+98${value.slice(-10)}`;
      }
      return value;
    })
    .cast(mobile);
}

module.exports = {
  castToIranFormat,
};
