"use strict";

const { userService, userJwtService } = require("../../utils/services");

async function auth(socket, next) {
  const { token } = socket.handshake.auth;

  if (!token) {
    throw Error("You need to pass token to authorize");
  }

  try {
    const user = await userJwtService().verify(token);
    const authUser = await userService().fetchAuthenticatedUser(user.id);

    if (user.blocked) {
      throw Error("Invalid credentials");
    }

    socket.user = authUser;
  } catch (error) {
    next(error);
  }

  next();
}

module.exports = auth;
