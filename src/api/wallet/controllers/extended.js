"use strict";

const { walletExtendedService } = require("../../../utils/services");
const { userQuery } = require("../../../utils/queries");

module.exports = {
  async buy(ctx) {
    const { user: authUser } = ctx.state;
    const { body } = ctx.request;
    const { amount, targetUserUUID } = body;

    const targetUser = await userQuery().findOne({
      where: {
        uuid: targetUserUUID,
      },
    });
    if (!targetUser) return ctx.notFound();

    // check balance
    const canBuy = await walletExtendedService().checkBalance(
      authUser.id,
      amount
    );
    if (!canBuy) {
      return ctx.badRequest("Can not buy");
    }

    // purchaseDeposit
    return await walletExtendedService().purchaseDeposit(
      authUser.id,
      targetUser.id,
      amount
    );
  },
};
