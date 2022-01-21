const chatService = require("../services/chat");
const userService = require("../services/auth");

const io = require("../config/socket").getIo();

const { SOCKET_EVENT: EVENT } = require("../config/constants");

io.on(EVENT.CONNECTION, (socket) => {
  socket.on(EVENT.DISCONNECT, () => {
    clearInterval(socket.interval);
  });

  // socket error
  socket.on(EVENT.ERROR, (error) => {
    console.error(error);
  });

  socket.on(EVENT.LOGIN, ({ userId }) => {
    socket.join(userId);
  });

  // roomNum Maker
  const roomNumMaker = (x, y) => {
    const arr = [x, y];
    arr.sort((a, b) => a - b);
    let roomNum = arr[0].toString() + arr[1];
    return roomNum;
  };

  // socket room join
  socket.on(EVENT.JOIN_ROOM, async ({ userId, qUserId }) => {
    try {
      const roomNum = await roomNumMaker(userId, qUserId);
      await chatService.createChatRoom({ userId, qUserId, roomNum });
      socket.join(roomNum);
      socket.leave(userId);
    } catch (error) {
      console.log(error);
    }
  });

  // socket room leave
  socket.on(EVENT.LEAVE_ROOM, async ({ userId, qUserId }) => {
    try {
      const roomNum = await roomNumMaker(userId, qUserId);
      socket.leave(roomNum);
    } catch (error) {
      console.log(error);
    }
  });

  // socket room (chat)
  socket.on(EVENT.ROOM, async ({ receiveUserId, sendUserId, chatText, sample }) => {
    try {
      const roomNum = await roomNumMaker(sendUserId, receiveUserId);
      const createdAt = new Date();
      const chatType = "text";

      let checkChat = false;
      if (io.sockets.adapter.rooms.get(roomNum).size === 2) {
        checkChat = true;
      }

      const getChat = {
        sendUserId,
        receiveUserId,
        chatText,
        checkChat,
        chatType,
        createdAt,
        sample,
      };

      await chatService.createChat({
        roomNum,
        ...getChat,
      });
      sendUserId = await userService.getUserByUserId({ userId: sendUserId });
      getChat.sendUserId = sendUserId;
      io.to(roomNum).emit(EVENT.CHAT, getChat);
      io.to(receiveUserId).emit(EVENT.LIST, getChat);
    } catch (error) {
      console.log(error);
    }
  });

  // socket file (track, image) post
  socket.on(EVENT.FILE, async ({ receiveUserId, sendUserId, chatType }) => {
    try {
      console.log("소켓!!!!!!!!!!!!!!!!!");
      const roomNum = await roomNumMaker(sendUserId, receiveUserId);
      const getChat = await chatService.getChatByIds({ receiveUserId, sendUserId, chatType });
      io.to(roomNum).emit(EVENT.CHAT, getChat);
      io.to(receiveUserId).emit(EVENT.LIST, getChat);
    } catch (error) {
      console.log(error);
    }
  });
});
