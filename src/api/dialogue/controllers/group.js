"use strict";

const crypto = require("crypto");
const _ = require("lodash");

const { dialogueService } = require("../../../utils/services");
const { userQuery } = require("../../../utils/queries");

module.exports = {
  async create(ctx) {
    const { user: authUser } = ctx.state;
    const { body } = ctx.request;

    const { data } = body;
    // TDOD - validate data
    const { name } = data;

    const dialogue = await dialogueService().firstOrCreate(
      {
        name,
        type: "group",
        admin: authUser.id,
      },
      {
        uuid: crypto.randomUUID(),
        users: [authUser.id],
      }
    );

    return { data: dialogue };
  },

  async join(ctx) {
    const { user: authUser } = ctx.state;
    const { body } = ctx.request;

    const { data } = body;
    // TODO - validate data

    const { dialogueUUID } = data;

    const dialogue = await dialogueService().findOneBy(
      { uuid: dialogueUUID },
      { populate: ["users"] }
    );
    if (!dialogue) return ctx.badRequest("Dialogue does not exist");

    const user = dialogue.users.find((u) => u.id === authUser.id);
    if (user) return { data: dialogue };

    const updatedDialogue = await dialogueService().update(dialogue.id, {
      data: {
        users: [...dialogue.users, authUser.id],
      },
      populate: ["users"],
    });
    return { data: updatedDialogue };
  },

  async add(ctx) {
    const { user: authUser } = ctx.state;
    const { body } = ctx.request;

    const { data } = body;
    // TODO - validate data
    const { targetUUID, dialogueUUID } = data;

    const targetUser = await userQuery().findOne({
      where: { uuid: targetUUID },
    });
    if (!targetUser) return ctx.badRequest("User not found");

    const dialogue = await dialogueService().findOneBy(
      { uuid: dialogueUUID },
      { populate: ["users", "admin"] }
    );
    if (!dialogue) return ctx.badRequest("Dialogue does not exist");
    if (dialogue.admin.id !== authUser.id)
      return ctx.badRequest("Permission denied");

    const user = dialogue.users.find((u) => u.id === targetUser.id);
    if (user) return { data: dialogue };

    const updatedDialogue = await dialogueService().update(dialogue.id, {
      data: {
        users: [...dialogue.users, targetUser.id],
      },
      populate: ["users"],
    });
    return { data: updatedDialogue };
  },

  async left(ctx) {
    const { user: authUser } = ctx.state;
    const { body } = ctx.request;

    const { data } = body;
    // TODO - validate data
    const { dialogueUUID } = data;

    const dialogue = await dialogueService().findOneBy(
      { uuid: dialogueUUID },
      { populate: ["users", "admin"] }
    );
    if (!dialogue) return ctx.badRequest("Dialogue does not exist");

    if (dialogue.admin.id === authUser.id)
      return ctx.badRequest("Admin cannot left the group");

    const updatedUsers = dialogue.users.filter((u) => u.id !== authUser.id);
    const updatedDialogue = await dialogueService().update(dialogue.id, {
      data: {
        users: updatedUsers,
      },
      populate: ["users"],
    });
    return { data: updatedDialogue };
  },

  async remove(ctx) {
    const { user: authUser } = ctx.state;
    const { body } = ctx.request;

    const { data } = body;
    // TODO - validate data
    const { targetUUID, dialogueUUID } = data;

    const targetUser = await userQuery().findOne({
      where: { uuid: targetUUID },
    });
    if (!targetUser) return ctx.badRequest("User not found");

    const dialogue = await dialogueService().findOneBy(
      { uuid: dialogueUUID },
      { populate: ["users", "admin"] }
    );
    if (!dialogue) return ctx.badRequest("Dialogue does not exist");
    if (dialogue.admin.id !== authUser.id)
      return ctx.badRequest("Permission denied");

    if (dialogue.admin.id === targetUser.id)
      return ctx.badRequest("Admin cannot be removed");

    const updatedUsers = dialogue.users.filter((u) => u.id !== targetUser.id);
    const updatedDialogue = await dialogueService().update(dialogue.id, {
      data: {
        users: updatedUsers,
      },
      populate: ["users"],
    });
    return { data: updatedDialogue };
  },
};
