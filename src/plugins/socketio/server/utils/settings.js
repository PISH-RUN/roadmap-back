const userSettings = () =>
  strapi
    .store({ type: "plugin", name: "users-permissions" })
    .get({ key: "advanced" });

module.exports = {
  userSettings,
};
