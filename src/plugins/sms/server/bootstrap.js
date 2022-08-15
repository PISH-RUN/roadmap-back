"use strict";

module.exports = async ({ strapi }) => {
  const provider = strapi.config.get("plugin.sms.provider");
  await init({ strapi, provider });

  await initProviderMethods({ strapi });
};

async function initProviderMethods({ strapi }) {
  strapi.plugin("sms").getProvider = (provider) =>
    initProvider({ strapi, provider });

  strapi.plugin("sms").switchProvider = (provider) =>
    init({ strapi, provider });
}

async function init({ strapi, provider }) {
  strapi.plugin("sms").provider = await initProvider({ strapi, provider });
  strapi.plugin("sms").provider.name = provider;
}

async function initProvider({ strapi, provider }) {
  const providers = strapi.plugin("sms").providers;
  const providersOptions = strapi.config.get("plugin.sms.providersOptions", {});

  return await providers[provider].init(providersOptions[provider]);
}
