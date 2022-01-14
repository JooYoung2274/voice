const chatService = require("../services/chat");

const io = require("../config/socket").getIo();

io.on("connection", (socket) => {
  const req = socket.request;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("접속됨", ip, socket.id, req.ip);
  let roomNum = 0;

  socket.on("disconnect", () => {
    console.log("접속해제", ip, socket.id);
    clearInterval(socket.interval);
  });

  socket.on("error", (error) => {
    console.error(error);
  });

  socket.on("joinRoom", async ({ userId, qUserId }) => {
    try {
      const arr = [userId, qUserId];
      arr.sort((a, b) => a - b);
      roomNum = arr[0].toString() + arr[1];
      await chatService.createChatRoom({ userId, roomNum });
      socket.join(roomNum);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("room", async ({ userId, sendUserId, chatText }) => {
    try {
      const getChat = [{ sendUserId, chatText }];
      await chatService.createChat({ roomNum, sendUserId, chatText });
      io.to(roomNum).emit("chat", getChat);
    } catch (error) {
      console.log(error);
    }
  });

  //   // emit은 전체 알림
  //   // to(socket.id).emit 은 해당 socket.id 가진 사람한테만 알림
  //   socket.on("user-send", (data) => {
  //     io.emit("chat", data); //socket에 참여하는 모든 유저에게 보냄 io.emit의 특징 (브로드캐스트)
  //     // io.to(socket.id).emit("broadcast", data); //이건 한명한테만 보내는 코드 해당 socket.id(자동발급) 를 갖고있는 사람한테만보냄
  //   });
});
