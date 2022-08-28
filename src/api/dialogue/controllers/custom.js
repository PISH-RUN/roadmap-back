"use strict";

const crypto = require("crypto");
const _ = require("lodash");

const { dialogueService } = require("../../../utils/services");
const { userQuery, dialogueQuery } = require("../../../utils/queries");

module.exports = {
  async find(ctx) {
    const { user: authUser } = ctx.state;
    const { query } = ctx.request;

    const dialogues = await dialogueService().find({
      filters: {
        users: { id: { $in: [authUser.id] } },
      },
      populate: {
        users: {
          fields: ["uuid", "firstName", "lastName"],
          populate: ["avatar"],
        },
      },
      ...query,
    });

    return { data: dialogues.results, pagination: dialogues.pagination };
  },

  async create(ctx) {
    const { user: authUser } = ctx.state;
    const { body } = ctx.request;

    const { data } = body;

    const targetUser = await userQuery().findOne({
      where: { uuid: data.user },
    });

    if (!targetUser) return ctx.badRequest("User not found");

    const authorDialogues = await dialogueQuery().findMany({
      filter: ["id"],
      where: {
        type: "direct",
        users: authUser.id,
      },
    });
    const authorDialogueIds = authorDialogues.map((adi) => adi.id);

    const targetDialogues = await dialogueQuery().findMany({
      filter: ["id"],
      where: {
        type: "direct",
        users: targetUser.id,
      },
    });
    const targetDialogueIds = targetDialogues.map((tdi) => tdi.id);

    const intersects = _.intersection(authorDialogueIds, targetDialogueIds);

    if (intersects.length > 1) return ctx.serviceUnavailable();

    const [dialogueId] = intersects;

    let dialogue = dialogueId
      ? await dialogueQuery().findOne({
          where: {
            id: dialogueId,
          },
          populate: {
            users: {
              fields: ["uuid", "firstName", "lastName"],
              populate: ["avatar"],
            },
          },
        })
      : null;

    if (!dialogue) {
      dialogue = await dialogueService().create({
        data: {
          type: "direct",
          uuid: crypto.randomUUID(),
          users: [authUser.id, targetUser.id],
        },
        populate: {
          users: {
            fields: ["uuid", "firstName", "lastName"],
            populate: ["avatar"],
          },
        },
      });
    }

    return { data: dialogue };
  },
};
