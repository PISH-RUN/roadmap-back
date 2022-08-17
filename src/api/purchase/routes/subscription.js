"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/purchase-subscription",
      handler: "subscription.purchase",
    },
    {
      method: "POST",
      path: "/purchase-payment",
      handler: "subscription.payment",
    },
  ],
};
