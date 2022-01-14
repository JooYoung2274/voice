let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, { path: "/socket.io" });
    return io;
  },
  getIo: () => {
    if (!io) throw new Error("socket.io is not initalized");
    return io;
  },
};
