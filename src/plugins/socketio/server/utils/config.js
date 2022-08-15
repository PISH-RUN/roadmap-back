async function config(key) {
  return strapi.config.get(`plugin.socketio.${key}`);
}

module.exports = config;
