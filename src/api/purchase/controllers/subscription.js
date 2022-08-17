"use strict";

const _ = require("lodash");
const crypto = require("crypto");

const {
  subscriptionService,
  purchaseService,
  paymentZarinpalService,
  paymentService,
} = require("../../../utils/services");

module.exports = {
  async purchase(ctx) {
    const { user: authUser } = ctx.state;
    const { body } = ctx.request;
    const { subscription: subscriptionId } = body;

    const subscription = await subscriptionService().findOne(subscriptionId);
    if (!subscription) return ctx.badRequest();

    const purchase = await purchaseService().create({
      data: {
        subscription: subscription.id,
        user: authUser.id,
        price: subscription.currentPrice,
        uuid: crypto.randomUUID(),
      },
      populate: ["subscription"],
    });

    // TODO - use resource
    return { data: purchase };
  },

  async payment(ctx) {
    const { user: authUser } = ctx.state;
    const { body } = ctx.request;
    const { purchase: purchaseUUID } = body.data;

    const purchase = await purchaseService().findOneBy(
      { uuid: purchaseUUID },
      { populate: ["subscription", "user", "payment"] }
    );

    if (
      !purchase ||
      purchase.status === "completed" ||
      purchase.user.id !== authUser.id ||
      purchase.payment?.refId
    ) {
      return ctx.badRequest();
    }

    if (purchase.payment) await paymentService().delete(purchase.payment.id);

    const payment = await paymentZarinpalService().createPayment(purchase);

    if (!payment) {
      return ctx.badRequest(`Something went wrong, please try again later`);
    }

    await purchaseService().update(purchase.id, {
      data: { status: "waitingForPayment" },
    });

    return {
      data: {
        url: `https://zarinpal.com/pg/StartPay/${payment.authority}`,
      },
    };
  },
};
