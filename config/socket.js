const { MESSAGE, SOCKET_CORS } = require("../config/constants");

let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: SOCKET_CORS,
    });
    return io;
  },
  getIo: () => {
    if (!io) throw new Error(MESSAGE.NOT_CONNECT_SOCKET_IO);
    return io;
  },
};
