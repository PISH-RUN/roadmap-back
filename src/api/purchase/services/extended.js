"use strict";

const addDays = require("date-fns/addDays");
const addMonths = require("date-fns/addMonths");
const isPast = require("date-fns/isPast");

const {
  userExtendedService,
  purchaseService,
  userService,
  couponService,
  walletExtendedService,
} = require("../../../utils/services");

module.exports = ({ strapi }) => ({
  async succeed(purchase) {
    const role = await userExtendedService().subscribedRole();

    purchase = await purchaseService().findOne(purchase.id, {
      populate: ["user", "subscription", "coupon"],
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

    let oldUser = await userService().fetch(user.id, { populate: ["role"] });

    let oldCoupon;
    if (coupon) {
      oldCoupon = await couponService().findOne(coupon.id);
    }

    let updatedPurchase;
    try {
      updatedPurchase = await purchaseService().update(purchase.id, {
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

      const updatedWallet = await walletExtendedService().chargeDeposit(
        user.id,
        subscription.currentPrice
      );
      if (!updatedWallet) throw new Error("Cannot charge wallet");

      return updatedPurchase;
    } catch (e) {
      console.log(e);
      // handle rollback
      await purchaseService().update(purchase.id, {
        data: { status: "waitingForPayment" },
      });

      await userService().edit(user.id, {
        subscribedUntil: oldUser.subscribedUntil,
        role: oldUser.role.id,
      });

      if (coupon) {
        await couponService().update(coupon.id, {
          data: { used: oldCoupon.used },
        });
      }
    }
  },
});
