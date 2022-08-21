// TODO: extract to related file
const getService = (name) => () => strapi.service(name);

// api::coupon
const couponExtendedService = getService("api::coupon.extended");
const couponService = getService("api::coupon.coupon");

// api::meta
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
const purchaseCustomService = getService("api::purchase.custom");
const purchaseExtendedService = getService("api::purchase.extended");
const purchaseService = getService("api::purchase.purchase");

// api::subscription
const subscriptionService = getService("api::subscription.subscription");

// api::transaction-history
const transactionHistoryService = getService(
  "api::transaction-history.transaction-history"
);

// plugin::users-permissions
const userExtendedService = getService("plugin::users-permissions.extended");
const userJwtService = getService("plugin::users-permissions.jwt");
const userRoleService = getService("plugin::users-permissions.role");
const userService = getService("plugin::users-permissions.user");

// api::user-setting
const userSettingService = getService("api::user-setting.user-setting");

// api::wallet
const walletExtendedService = getService("api::wallet.extended");
const walletService = getService("api::wallet.wallet");

module.exports = {
  couponExtendedService,
  couponService,
  metaService,
  messengerService,
  optExtendedService,
  otpRandomService,
  paymentService,
  purchaseCustomService,
  purchaseExtendedService,
  purchaseService,
  paymentZarinpalService,
  subscriptionService,
  transactionHistoryService,
  userExtendedService,
  userJwtService,
  userRoleService,
  userService,
  userSettingService,
  walletExtendedService,
  walletService,
};
