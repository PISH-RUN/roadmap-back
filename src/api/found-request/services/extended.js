"use strict";

const {
  walletService,
  foundRequestService,
} = require("../../../utils/services");

module.exports = {
  async fundWithdrawReq(userId, amount) {
    // get user's wallet
    const wallet = await walletService().findOneBy({ user: userId });

    // update or create found request
    const foundReq = await foundRequestService().updateOrCreate(
      { wallet: wallet.id },
      { amount, status: "request" }
    );

    return foundReq;
  },
};
