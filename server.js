const { connectDB } = require("./services/index");
const http = require("http");
const app = require("./app.js");

const port = 3000;

const server = http.createServer(app);

connectDB();
server.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
