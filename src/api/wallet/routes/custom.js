"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/custom/wallets/funds/request",
      handler: "fund.request",
    },
    {
      method: "POST",
      path: "/custom/wallets/funds/answer",
      handler: "fund.answer",
    },
  ],
};
