"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/extended/wallets/test/buy",
      handler: "extended.buy",
    },
    {
      method: "POST",
      path: "/extended/wallets/fund-request",
      handler: "extended.fundReq",
    },
  ],
};
