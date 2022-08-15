module.exports = {
  otp: {
    type: "relation",
    relation: "oneToOne",
    target: "plugin::otp.otp",
    inversedBy: "user",
    configurable: false,
  },
};
