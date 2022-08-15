"use strict";

const { Server } = require("socket.io");

const middlewares = require("./middlewares");

class IO {
  constructor(options) {
    this._socket = new Server(strapi.server.httpServer, options);

    this._registerMiddlewares();

    this._socket.on("connection", (socket) => {
      console.log(`user ${socket.user.id} connected`);
    });

    this._socket.on("error", (err) => {
      console.log("socket error", err);
    });
  }

  _registerMiddlewares() {
    for (let middleware of middlewares) {
      this._socket.use(middleware);
    }
  }

  emit(rooms, type, payload) {
    return this._socket.to(rooms).emit(type, payload);
  }

  getSocketBy(userId) {
    const sockets = this._socket.sockets.sockets;
    let socket;
    sockets.forEach((value, key) => {
      if (value.user.id === userId) {
        socket = sockets.get(key);
        return;
      }
    });
    return socket
  }

  get socket() {
    return this._socket;
  }
}

module.exports = IO;
