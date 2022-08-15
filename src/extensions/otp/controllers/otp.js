"use strict";

const crypto = require("crypto");
const { castToIranFormat } = require("../../../utils/mobile");

const { validateRequestOTP } = require("./validations");

const { userQuery } = require("../../../utils/queries");
const {
  optExtendedService,
  userExtendedService,
} = require("../../../utils/services");

async function createUser(params) {
  const advanced = await strapi
    .store({
      type: "plugin",
      name: "users-permissions",
      key: "advanced",
    })
    .get();

  const defaultRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: advanced.default_role } });

  return await strapi
    .service("plugin::users-permissions.user")
    .add({ ...params, role: defaultRole });
}

module.exports = {
  async request(ctx) {
    const { body } = ctx.request;
    const { options } = body;

    await validateRequestOTP(body);
    const mobile = castToIranFormat(body.identifier);

    let user = await userQuery().findOne({ where: { mobile } });

    if (!user) {
      const params = {
        mobile,
        confirmed: true,
        uuid: crypto.randomUUID(),
      };

      user = await createUser(params);
      user.wasRecentlyCreated = true;
    } else {
      user.wasRecentlyCreated = false;
    }

    const { referral } = body;

    if (referral) {
      await userExtendedService(strapi).createReferral(user, referral);
    }

    try {
      const result = await optExtendedService().generate(user, {
        ignoreStaticPassword: options.force,
      });

      return {
        ok: true,
        otpGenerated: !!result,
        wasRecentlyCreated: user.wasRecentlyCreated,
      };
    } catch (e) {
      console.log({ e: e.message });
      return await strapi.plugin("otp").controller("auth").handleError(ctx, e);
    }
  },
};
