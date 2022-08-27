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
