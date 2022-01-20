const chatService = require("../services/chat");
const userService = require("../services/auth");

const io = require("../config/socket").getIo();

io.on("connection", (socket) => {
  const req = socket.request;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("접속됨", ip, socket.id);
  let roomNum = 0;
  socket.on("disconnect", () => {
    console.log("접속해제", ip, socket.id);
    clearInterval(socket.interval);
  });

  socket.on("error", (error) => {
    console.error(error);
  });

  const roomNumMaker = (x, y) => {
    const arr = [x, y];
    arr.sort((a, b) => a - b);
    roomNum = arr[0].toString() + arr[1];
  };

  socket.on("joinRoom", async ({ userId, qUserId }) => {
    try {
      roomNumMaker(userId, qUserId);
      await chatService.createChatRoom({ userId, qUserId, roomNum });
      console.log("joinRoom!", roomNum);
      socket.join(roomNum);
      socket.leave(Number(userId));
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("leaveRoom", ({ userId, qUserId }) => {
    roomNumMaker(userId, qUserId);
    console.log("leaveRoom!", roomNum);
    socket.leave(roomNum);
  });

  socket.on("room", async ({ receiveUserId, sendUserId, chatText, sample }) => {
    try {
      let createdAt = new Date();
      let checkChat = false;
      if (io.sockets.adapter.rooms.get(roomNum).size === 2) {
        checkChat = true;
      }
      const chatType = "text";
      await chatService.createChat({
        roomNum,
        sendUserId,
        receiveUserId,
        chatText,
        checkChat,
        chatType,
        sample,
      });
      sendUserId = await userService.getUserByUserId({ userId: sendUserId });
      const getChat = { sendUserId, receiveUserId, chatText, createdAt, sample };
      io.to(roomNum).emit("chat", getChat);
      io.to(receiveUserId).emit("list", getChat);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("file", async ({ receiveUserId, sendUserId, chatType }) => {
    try {
      const getChat = await chatService.getChatByIds({ receiveUserId, sendUserId, chatType });
      io.to(roomNum).emit("chat", getChat);
      io.to(receiveUserId).emit("list", getChat);
    } catch (error) {
      console.log(error);
    }
  });
});
