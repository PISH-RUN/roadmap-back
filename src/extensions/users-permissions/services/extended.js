"use strict";
const _ = require("lodash");
const { getModelFieldsEnum } = require("../../../utils/model");
const { userService } = require("../../../utils/services");
const { metaQuery } = require("../../../utils/queries");

const updateUser = (userId, params) =>
  strapi.entityService.update("plugin::users-permissions.user", userId, params);

module.exports = ({ strapi }) => ({
  async createReferral(user, referral) {
    const meta = await metaQuery(strapi).findOne({
      where: { referral },
      select: ["id"],
      populate: { user: { select: ["id"] } },
    });

    if (!meta || !meta.user) {
      return null;
    }

    return await userService().edit(user.id, { referredBy: meta.user.id });
  },

  async enums(field) {
    return await getModelFieldsEnum("plugin::users-permissions.user", field);
  },

  async setAvatar(userId, files) {
    await updateUser(userId, {
      data: { avatar: null },
    });

    const user = await updateUser(userId, {
      data: {},
      files: { avatar: files.avatar },
      populate: ["avatar"],
    });

    return user;
  },
});
