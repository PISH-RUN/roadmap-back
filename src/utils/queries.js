const getQuery = (name) => () => strapi.query(name);

// api::meta
const metaQuery = getQuery("api::meta.meta");

// api::payment
const paymentQuery = getQuery("api::payment.payment");

// api::purchase
const purchaseQuery = getQuery("api::purchase.purchase");

// plugin:users-permissions
const userPermissionQuery = getQuery("plugin::users-permissions.permission");
const userQuery = getQuery("plugin::users-permissions.user");
const userRoleQuery = getQuery("plugin::users-permissions.role");

module.exports = {
  metaQuery,
  paymentQuery,
  purchaseQuery,
  userPermissionQuery,
  userQuery,
  userRoleQuery,
};
