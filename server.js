const { connectDB } = require("./services/index");
const app = require("./app.js");

const { SERVER_PORT, SERVER_DOMAIN } = process.env;

connectDB();
server = app.listen(SERVER_PORT, () => {
  console.log(`listening at ${SERVER_DOMAIN}:${SERVER_PORT}`);
});

// socket connection
require("./config/socket").init(server);
require("./utils/socketHandler");
