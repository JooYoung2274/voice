const { connectDB } = require("./services/index");
const http = require("http");
const app = require("./app.js");

const { SERVER_PORT } = process.env;

const server = http.createServer(app);

// const test = "tesdf33dsfadfd

connectDB();
server.listen(SERVER_PORT, () => {
  console.log(`listening at http://localhost:${SERVER_PORT}`);
});
