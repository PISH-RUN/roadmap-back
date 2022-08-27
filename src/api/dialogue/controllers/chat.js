"use strict";

const { dialogueService, chatService } = require("../../../utils/services");

module.exports = {
  async find(ctx) {
    const { user: authUser } = ctx.state;
    const { params, query } = ctx.request;
    const { pagination } = query;

    const dialogue = await dialogueService().findOneBy(
      { uuid: params.uuid, users: { id: { $in: [authUser.id] } } },
      { populate: ["users"] }
    );

    if (!dialogue) return ctx.badRequest("Dialogue not found");

    const chats = await chatService().find({
      filters: { dialogue: dialogue.id },
      populate: {
        user: {
          select: ["uuid", "firstName", "lastName"],
        },
        dialogue: {
          select: ["uuid"],
        },
        attachments: true,
      },
      sort: { createdAt: "desc" },
      pagination,
    });

    const socket = strapi.$io.getSocketBy(authUser.id);
    if (socket) {
        socket.join(`dialogue_${dialogue.uuid}`);
    }

    return { data: chats.results, pagination: chats.pagination };
  },

  async create(ctx) {
    const { user: authUser } = ctx.state;
    const { body, params, files } = ctx.request;

    const dialogue = await dialogueService().findOneBy(
      { uuid: params.uuid, users: { id: { $in: [authUser.id] } } },
      { populate: ["users"] }
    );

    if (!dialogue) return ctx.badRequest("Dialogue not found");

    const chat = await chatService().create({
      data: { body: body.body, user: authUser.id, dialogue: dialogue.id },
      files: files?.attachments
        ? { attachments: files?.attachments }
        : undefined,
      populate: {
        user: {
          select: ["uuid", "firstName", "lastName"],
        },
        dialogue: {
          select: ["uuid"],
        },
        attachments: true,
      },
    });

    strapi.$io.emit(`dialogue_${dialogue.uuid}`, "dialogue", { chat });

    return { data: chat };
  },
};
