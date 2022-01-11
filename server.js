const { connectDB } = require("./services/index");
const http = require("http");
const app = require("./app.js");

// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

const { SERVER_PORT } = process.env;

// io.on("connection", (socket) => {
//   console.log("접속됨");

//   // room1 채팅방에 입장시키는 명령어
//   socket.on("joinRoom", (data) => {
//     socket.join("room1");
//   });

//   // room1-send로 room1에 있는 사람들한테만 전달하는 명령어
//   socket.on("room1-send", (data) => {
//     // db에 저장을 하고
//     // db에 저장된걸 빼서
//     // 프론트로 리턴
//     io.to("room1").emit("broadcast", data);
//   });

//   // emit은 전체 알림
//   // to(socket.id).emit 은 해당 socket.id 가진 사람한테만 알림
//   socket.on("user-send", (data) => {
//     io.emit("broadcast", data); //socket에 참여하는 모든 유저에게 보냄 io.emit의 특징 (브로드캐스트)
//     // io.to(socket.id).emit("broadcast", data); //이건 한명한테만 보내는 코드 해당 socket.id(자동발급) 를 갖고있는 사람한테만보냄
//   });
// });

connectDB();
server = app.listen(SERVER_PORT, () => {
  console.log(`listening at http://localhost:${SERVER_PORT}`);
});

require("./config/socket").init(server);
require("./utils/socketHandler");
