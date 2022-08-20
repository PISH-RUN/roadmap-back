"use strict";

const {
  purchaseService,
  couponExtendedService,
} = require("../../../utils/services");

module.exports = {
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
};
