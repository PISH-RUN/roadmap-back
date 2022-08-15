"use strict";

const { yup, validateYupSchema } = require("@strapi/utils");

const createUserBodySchema = yup.object().shape({
  identifier: yup
    .string()
    .matches(/^(\+98|0)?9\d{9}$/)
    .required(),
});

const validateRequestOTP = validateYupSchema(createUserBodySchema);

module.exports = {
  validateRequestOTP,
};
