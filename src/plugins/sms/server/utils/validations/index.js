const { object, string, lazy, array } = require("yup");

const sendSchema = object({
  receptor: string().required(),
  body: string().required(),
});

const sendBulkSchema = object({
  receptors: array().of(string()).required(),
  body: lazy((val) =>
    Array.isArray(val) ? array().of(string()).required() : string().required()
  ),
});

module.exports = {
  sendSchema,
  sendBulkSchema,
};
