"use strict";

const _ = require("lodash");

// services
const {
  optExtendedService,
  optUserService,
  jwtService,
} = require("../utils/services");

// utils
const sanitizeUser = require("../utils/sanitize-user");

// errors
const {
  ApplicationError,
  ValidationError,
  TooFastError,
} = require("../errors");

// validations
const { validateCallbackBody } = require("./validations/auth.validation");

// options
const REQUEST_DEFAULT_OPTIONS = { force: false };

module.exports = {
  async request(ctx) {
    const { body } = ctx.request;
    const options = { ...REQUEST_DEFAULT_OPTIONS, ...body.options };

    const user = await optUserService().otpUser(body.identifier.toLowerCase());

    if (!user) {
      return ctx.notFound(`User not found`);
    }

    try {
      await optExtendedService().generate(user, {
        ignoreStaticPassword: options.force,
      });

      return { ok: true, otpGenerated: true };
    } catch (e) {
      return this.handleError(ctx, e);
    }
  },

  async handleError(ctx, e) {
    if (e instanceof TooFastError) {
      return ctx.tooManyRequests(e.message, e.details);
    }

    return ctx.badRequest(`Something went wrong`);
  },

  async callback(ctx) {
    const store = strapi.store({ type: "plugin", name: "users-permissions" });

    if (!_.get(await store.get({ key: "grant" }), "email.enabled")) {
      throw new ApplicationError("This provider is disabled");
    }

    const { body } = ctx.request;
    await validateCallbackBody(body);

    const user = await optUserService().callbackUser(
      body.identifier.toLowerCase()
    );

    if (!user) {
      throw new ValidationError("Invalid identifier or password");
    }

    if (
      _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
      user.confirmed !== true
    ) {
      throw new ApplicationError("Your account email is not confirmed");
    }

    if (user.blocked === true) {
      throw new ApplicationError(
        "Your account has been blocked by an administrator"
      );
    }

    if (!(await optExtendedService().validatePassword(user, body.password))) {
      throw new ValidationError("Invalid identifier or password");
    }

    ctx.send({
      jwt: jwtService().issue({
        id: user.id,
      }),
      user: await sanitizeUser(user, ctx),
    });
  },
};
