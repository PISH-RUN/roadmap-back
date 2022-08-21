"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "extended/test/buy",
      handler: "extended.buy",
    },
    {
      method: "POST",
      path: "extended/fund-request",
      handler: "extended.fundReq",
    },
  ],
};
