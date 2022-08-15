"user strict";

module.exports = ({ strapi }) => ({
  async otpUser(identifier) {
    return await this.findUser(identifier);
  },

  async callbackUser(identifier) {
    return await this.findUser(identifier);
  },

  async findUser(identifier) {
    return await strapi.query("plugin::users-permissions.user").findOne({
      where: {
        provider: "local",
        $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
      },
    });
  },
});
