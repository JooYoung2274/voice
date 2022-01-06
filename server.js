const { connectDB } = require("./services/index");
const http = require("http");
const app = require("./app.js");

const { SERVER_PORT } = process.env;

const server = http.createServer(app);
//아니 그게 무슨 소리야 왜 할게없다고 그래????????????
connectDB();
server.listen(SERVER_PORT, () => {
  console.log(`listening at http://localhost:${SERVER_PORT}`);
});
