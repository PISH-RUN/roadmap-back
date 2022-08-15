// TODO: extract to related file
const getService = (name) => () => strapi.service(name);

// plugin:otp
const optExtendedService = getService("plugin::otp.extended");


// plugin::users-permissions
const userExtendedService = getService("plugin::users-permissions.extended");
const userJwtService = getService("plugin::users-permissions.jwt");
const userService = getService("plugin::users-permissions.user");

// api::user-setting
const userSettingService = getService("api::user-setting.user-setting");

module.exports = {
  optExtendedService,
  userExtendedService,
  userJwtService,
  userService,
  userSettingService,
};
