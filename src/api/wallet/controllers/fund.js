"use strict";

"use strict";

const {
  walletExtendedService,
  fundRequestExtendedService,
} = require("../../../utils/services");

const { userQuery } = require("../../../utils/queries");

module.exports = {
  async request(ctx) {
    const { user: authUser } = ctx.state;
    const { body } = ctx.request;
    const { data } = body;
    const { amount } = data;

    const canRequsetFund = await walletExtendedService().checkBalance(
      authUser.id,
      amount
    );
    if (!canRequsetFund) {
      return ctx.badRequest("Excessive amount");
    }

    const foundReq = await fundRequestExtendedService().withdrawRequest(
      authUser.id,
      amount
    );

    return { data: foundReq };
  },

  async answer(ctx) {
    const { body } = ctx.request;
    const { data } = body;
    const { amount, userUUID } = data;

    const targetUser = await userQuery().findOne({
      where: { uuid: userUUID },
    });
    if (!targetUser) return ctx.badRequest("User not found");

    // check amount
    const canWithdraw = await walletExtendedService().checkBalance(
      targetUser.id,
      amount
    );
    if (!canWithdraw) return ctx.badRequest("Excessive amount");

    const fundRequest = await fundRequestExtendedService().withdrawAnswer(
      targetUser.id,
      amount
    );

    if (!fundRequest) return ctx.serviceUnavailable();

    return { data: fundRequest };
  },
};
