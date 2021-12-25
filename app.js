const express = require("express");
const router = require("./router/index.js");
const port = 3000;
const app = express();
const { sequelize } = require("./models");
const passportConfig = require("./passport");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
const dotenv = require("dotenv");
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
dotenv.config();
passportConfig(app);

//test용
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/kakao.html");
});

app.use(express.json());
app.use("/api", router);
app.use(express.static("uploads"));

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("DB성공");
  })
  .catch((error) => {
    console.error("DB실패");
  });

app.use((req, res, next) => {
  res.sendStatus(404);
});
app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
