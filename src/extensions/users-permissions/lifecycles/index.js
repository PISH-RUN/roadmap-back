"use strict";

const crypto = require("crypto");

const { metaService, otpRandomService } = require("../../../utils/services");
const { metaQuery } = require("../../../utils/queries");

module.exports = (strapi) => {
  strapi.db.lifecycles.subscribe({
    models: ["plugin::users-permissions.user"],

    async beforeCreate(event) {
      event.params.data.uuid = crypto.randomUUID();
    },

    async afterCreate(event) {
      const { result } = event;

      while (true) {
        const referral = otpRandomService().generate({ length: 6 });

        const meta = await metaQuery(strapi).findOne({
          where: { referral },
        });

        if (meta) {
          continue;
        }

        await metaService(strapi).create({
          data: {
            referral,
            user: result.id,
          },
        });

        break;
      }
    },
  });
};
