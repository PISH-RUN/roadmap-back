"use strict";

const { yup, validateYupSchema } = require("@strapi/utils");

const base = {
  amount: yup.number().min(0),
  userUUID: yup.string().uuid(),
};

const fundReqtestValidation = yup
  .object()
  .noUnknown()
  .shape({
    ...base,
    amount: base.amount.required(),
  });

const fundAnswerValidation = yup
  .object()
  .noUnknown()
  .shape({
    ...base,
    amount: base.amount.required(),
    userUUID: base.userUUID.required(),
  })
  .nullable();

module.exports = {
  validateFundRequest: validateYupSchema(fundReqtestValidation),
  validateFundAnswer: validateYupSchema(fundAnswerValidation),
};
