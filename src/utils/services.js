// TODO: extract to related file
const getService = (name) => () => strapi.service(name);

const metaService = getService("api::meta.meta");

//plugin::sms
const messengerService = getService("plugin::sms.messenger");

// plugin:otp
const optExtendedService = getService("plugin::otp.extended");
const otpRandomService = getService("plugin::otp.random");


// plugin::users-permissions
const userExtendedService = getService("plugin::users-permissions.extended");
const userJwtService = getService("plugin::users-permissions.jwt");
const userService = getService("plugin::users-permissions.user");

// api::user-setting
const userSettingService = getService("api::user-setting.user-setting");

module.exports = {
  metaService,
  messengerService,
  optExtendedService,
  otpRandomService,
  userExtendedService,
  userJwtService,
  userService,
  userSettingService,
};
