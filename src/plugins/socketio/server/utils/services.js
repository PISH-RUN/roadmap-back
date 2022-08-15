const getService = (name) => () => strapi.service(name);

const userJwtService = getService("plugin::users-permissions.jwt");
const userService = getService("plugin::users-permissions.user");

module.exports = {
  userJwtService,
  userService,
};
