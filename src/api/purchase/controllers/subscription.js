"use strict";

const _ = require("lodash");
const crypto = require("crypto");

const {
  subscriptionService,
  purchaseService,
  paymentZarinpalService,
  paymentService,
  couponService,
  couponExtendedService,
  purchaseExtendedService,
} = require("../../../utils/services");

// const {} = require("../../../utils/queries")

const isSubscriptionValid = (subscriptions, sub) => {
  return (
    subscriptions.length === 0 || !!subscriptions.find((s) => s.id === sub.id)
  );
};

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

    let purchase = await purchaseService().findOneBy(
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

    const [amount, payment] = await paymentZarinpalService().createPayment(
      purchase
    );

    if (amount !== undefined && !payment) {
      await purchaseExtendedService().succeed(purchase);
      const successRedirect = strapi.config.get(
        "payment.success",
        "https://pishrunroadmap.com"
      );

      return {
        data: {
          url: successRedirect + `?purchase=${purchase.uuid}`,
          payment: false,
        },
      };
    }

    if (!payment) {
      return ctx.badRequest(`Something went wrong, please try again later`);
    }

    await purchaseService().update(purchase.id, {
      data: { status: "waitingForPayment" },
    });

    return {
      data: {
        url: `https://zarinpal.com/pg/StartPay/${payment.authority}`,
        payment: true,
      },
    };
  },

  async coupon(ctx) {
    const { user: authUser } = ctx.state;
    const { body } = ctx.request;
    const { purchase: purchaseUUID, coupon: couponCode } = body.data;

    let purchase = await purchaseService().findOneBy(
      { uuid: purchaseUUID },
      { populate: ["subscription", "user"] }
    );
    if (!purchase || purchase.user.id !== authUser.id) {
      return ctx.badRequest();
    }

    const coupon = await couponService().findOneBy(
      { code: couponCode },
      { populate: ["user", "onlySubscriptions"] }
    );

    const { onlySubscriptions } = coupon;

    if (
      !(await couponExtendedService().isValid(coupon, authUser)) ||
      !isSubscriptionValid(onlySubscriptions, purchase.subscription)
    ) {
      return ctx.badRequest("Coupon is invalid");
    }

    purchase = await purchaseService().update(purchase.id, {
      data: {
        coupon: coupon.id,
        price: couponExtendedService().offAmount(purchase.subscription, coupon),
        populate: ["subscription", "coupon"],
      },
    });

    return { data: purchase };
  },
};
