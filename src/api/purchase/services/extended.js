"use strict";

const addDays = require("date-fns/addDays");
const addMonths = require("date-fns/addMonths");
const isPast = require("date-fns/isPast");

const {
  userExtendedService,
  purchaseService,
  userService,
  couponExtendedService,
  couponService,
} = require("../../../utils/services");

module.exports = ({ strapi }) => ({
  async succeed(purchase) {
    const role = await userExtendedService().subscribedRole();

    purchase = await purchaseService().findOne(purchase.id, {
      populate: ["user", "subscription", "coupon"],
    });

    const { user, subscription, coupon } = purchase;
    const now = new Date();

    console.log(coupon);

    let subscribeTime = user.subscribedUntil
      ? new Date(user.subscribedUntil)
      : now;

    if (isPast(subscribeTime)) {
      subscribeTime = now;
    }

    if (subscription.days) {
      subscribeTime = addDays(subscribeTime, subscription.days);
    }

    if (subscription.months) {
      subscribeTime = addMonths(subscribeTime, subscription.months);
    }

    await purchaseService().update(purchase.id, {
      data: { status: "completed" },
    });

    await userService().edit(user.id, {
      subscribedUntil: subscribeTime,
      role: role.id,
    });

    if (coupon) {
      await couponService().update(coupon.id, {
        data: { used: coupon.used + 1 },
      });
    }

    return purchase;
  },

  async update(purchaseId) {
    let purchase = await purchaseService().findOne(purchaseId, {
      populate: "*",
    });

    const { coupon, user, subscription } = purchase;

    if (await couponExtendedService().isValid(coupon, user)) {
      const price = couponExtendedService().offAmount(subscription, coupon);

      if (price !== purchase.price) {
        purchase = await purchaseService().update(purchase.id, {
          data: { price },
          populate: "*",
        });
      }

      return purchase;
    }

    purchase = await purchaseService().update(purchase.id, {
      data: { coupon: null, price: subscription.currentPrice },
      populate: "*",
    });

    return purchase;
  },
});
