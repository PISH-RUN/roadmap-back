const getQuery = (name) => () => strapi.query(name);

// api::meta
const metaQuery = getQuery("api::meta.meta");

// plugin:users-permissions
const permissionQuery = getQuery("plugin::users-permissions.permission");
const roleQuery = getQuery("plugin::users-permissions.role");
const userQuery = getQuery("plugin::users-permissions.user");

module.exports = {
  metaQuery,
  permissionQuery,
  roleQuery,
  userQuery,
};
