const { object, string } = require("yup");

const ghasedakOptionsSchema = object({
  apiKey: string().required(),
});

module.exports = {
  ghasedakOptionsSchema,
};
