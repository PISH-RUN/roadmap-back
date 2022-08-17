// TODO: extract to related file
const getService = (name) => () => strapi.service(name);

const metaService = getService("api::meta.meta");

//plugin::sms
const messengerService = getService("plugin::sms.messenger");

// plugin::otp
const optExtendedService = getService("plugin::otp.extended");
const otpRandomService = getService("plugin::otp.random");

// api::payment
const paymentService = getService("api::payment.payment");
const paymentZarinpalService = getService("api::payment.zarinpal");

// api::purchase
const purchaseExtendedService = getService("api::purchase.extended");
const purchaseService = getService("api::purchase.purchase");

// api::subscription
const subscriptionService = getService("api::subscription.subscription");

// plugin::users-permissions
const userExtendedService = getService("plugin::users-permissions.extended");
const userJwtService = getService("plugin::users-permissions.jwt");
const userRoleService = getService("plugin::users-permissions.role");
const userService = getService("plugin::users-permissions.user");

// api::user-setting
const userSettingService = getService("api::user-setting.user-setting");

module.exports = {
  metaService,
  messengerService,
  optExtendedService,
  otpRandomService,
  paymentService,
  purchaseExtendedService,
  purchaseService,
  paymentZarinpalService,
  subscriptionService,
  userExtendedService,
  userJwtService,
  userRoleService,
  userService,
  userSettingService,
};
