const chatService = require("../services/chat");

const io = require("../config/socket").getIo();

io.on("connection", (socket) => {
  console.log("접속됨");
  let roomNum = 0;

  socket.on("joinRoom", async ({ userId, qUserId }) => {
    await chatService.createChatRoom({ userId, qUserId });
    roomNum = userId.toString() + " " + qUserId;
    socket.join(roomNum);
  });

  socket.on("room", async ({ userId, sendUserId, chatText }) => {
    // console.log(userId, qUserId, chatText);
    const qUserId = roomNum.split(" ")[1]; // 방문객 Id 찾아야함
    await chatService.createChat({ userId, qUserId, sendUserId, chatText });
    io.to(roomNum).emit("chat", chatText);
  });

  //   // emit은 전체 알림
  //   // to(socket.id).emit 은 해당 socket.id 가진 사람한테만 알림
  //   socket.on("user-send", (data) => {
  //     io.emit("chat", data); //socket에 참여하는 모든 유저에게 보냄 io.emit의 특징 (브로드캐스트)
  //     // io.to(socket.id).emit("broadcast", data); //이건 한명한테만 보내는 코드 해당 socket.id(자동발급) 를 갖고있는 사람한테만보냄
  //   });
});
