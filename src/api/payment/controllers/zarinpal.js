"use strict";

const { paymentZarinpalService } = require("../../../utils/services");

module.exports = {
  async callback(ctx) {
    const { query } = ctx.request;
    const { Authority, Status } = query;

    const failedRedirect = strapi.config.get(
      "payment.failed",
      "www.pihrunroadmap.com"
    );

    const successRedirect = strapi.config.get(
      "payment.success",
      "www.pihrunroadmap.com"
    );

    if (Status === "OK") {
      try {
        const purchase = await paymentZarinpalService().verify(Authority);

        return ctx.redirect(successRedirect + `?purchase=${purchase.uuid}`);
      } catch (e) {
        console.log(e);
        console.error(e.message);
      }
    }

    return ctx.redirect(failedRedirect);
  },
};
