"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/custom/dialogues",
      handler: "custom.find",
    },
    {
      method: "POST",
      path: "/custom/dialogues",
      handler: "custom.create",
    },

    {
      method: "POST",
      path: "/custom/dialogues/group",
      handler: "group.create",
    },
    {
      method: "POST",
      path: "/custom/dialogues/group/join",
      handler: "group.join",
    },
    {
      method: "POST",
      path: "/custom/dialogues/group/add",
      handler: "group.add",
    },
    {
      method: "POST",
      path: "/custom/dialogues/group/left",
      handler: "group.left",
    },
    {
      method: "POST",
      path: "/custom/dialogues/group/remove",
      handler: "group.remove",
    },

    {
      method: "POST",
      path: "/custom/dialogues/:uuid/chats",
      handler: "chat.create",
    },
    {
      method: "GET",
      path: "/custom/dialogues/:uuid/chats",
      handler: "chat.find",
    },
  ],
};
