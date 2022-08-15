"use strict";

const userExtendedSchema = require("./content-types/users-permissions/user");

module.exports = ({ strapi }) => {
  Object.assign(
    strapi.contentTypes["plugin::users-permissions.user"].attributes,
    userExtendedSchema
  );

  setOtpListener();
};

// TODO: we can move it to a service
function setOtpListener() {
  let listeners = [];
  strapi.plugin("otp").setCallback = (callback) => {
    listeners.push(callback);
  };

  strapi.plugin("otp").removeCallback = (callback) => {
    const index = listeners.indexOf(callback);
    if (index > 0) {
      listeners = [...listeners.slice(0, index), ...listeners.slice(index)];
    }
  };

  strapi.plugin("otp").notify = async (user, token) => {
    for (let listener of listeners) {
      await listener(user, token);
    }
  };
}
