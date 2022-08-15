"use strict";

const { sendSchema, sendBulkSchema } = require("./../utils/validations");

const messenger = (strapi) => ({
  provider: strapi.plugin("sms").provider,
  actions: {},
  async send(data) {
    if (!this.provider.send) {
      throw new Error(
        `method send hasn't been defined for ${this.provider.name} provider`
      );
    }

    await sendSchema.validate(data);
    return await this.provider.send(data);
  },

  async sendBulk(data) {
    if (!this.provider.sendBulk) {
      throw new Error(
        `method sendBulk hasn't been defined for ${this.provider.name} provider`
      );
    }

    await sendBulkSchema.validate(data);
    return await this.provider.sendBulk(data);
  },

  register(name, action) {
    this.actions[name] = action;
  },
});

const messengerHandler = {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    }

    return target.actions[prop][target.provider.name](target.provider);
  },
};

module.exports = ({ strapi }) => new Proxy(messenger(strapi), messengerHandler);
