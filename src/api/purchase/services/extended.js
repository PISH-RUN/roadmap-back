"use strict";

const addDays = require("date-fns/addDays");
const addMonths = require("date-fns/addMonths");
const isPast = require("date-fns/isPast");

const {
  userExtendedService,
  purchaseService,
  userService,
} = require("../../../utils/services");

module.exports = ({ strapi }) => ({
  async succeed(purchase) {
    const role = await userExtendedService().subscribedRole();

    purchase = await purchaseService().findOne(purchase.id, {
      populate: ["user", "subscription"],
    });

    const { user, subscription, coupon } = purchase;
    const now = new Date();

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

    return purchase;
  },
});
