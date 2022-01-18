let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    return io;
  },
  getIo: () => {
    if (!io) throw new Error("socket.io is not initalized");
    return io;
  },
};
