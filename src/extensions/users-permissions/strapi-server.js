const omit = require("lodash/omit");
const extendedService = require("./services/extended");

module.exports = (plugin) => {
  // register controllers, services, routes
  modifyConfig(plugin);
  //   modifyControllers(plugin);
  //   modifyRoutes(plugin);
  modifyServices(plugin);

  return plugin;
};

function modifyConfig(plugin) {
  plugin.config = omit(plugin.config, "layout");
}

function modifyControllers(plugin) {}

function modifyRoutes(plugin) {}

function modifyServices(plugin) {
  plugin.services.extended = extendedService;
}
