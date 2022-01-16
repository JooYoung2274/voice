const { connectDB } = require("./services/index");
const http = require("http");
const https = require("https");
const app = require("./app.js");

const { SERVER_PORT, SERVER_DOMAIN } = process.env;
var server = http.createServer(app);
connectDB();
server.listen(SERVER_PORT, () => {
  console.log(`listening at ${SERVER_DOMAIN}:${SERVER_PORT}`);
});

require("./config/socket").init(server);
require("./utils/socketHandler");
