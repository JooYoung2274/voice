const express = require("express");
const router = require("./router/index.js");
const app = express();
const passportConfig = require("./passport");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
const dotenv = require("dotenv");
const { logHandler, errorHandler } = require("./middleware/errorHandler");
const cors = require("cors");

app.use(cors());

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
dotenv.config();
passportConfig(app);

// //test용
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/views/kakao.html");
// });

app.use(express.json());
app.use("/api", router);
app.use(express.static("uploads"));

app.use(logHandler);
app.use(errorHandler);

module.exports = app;
