const express = require("express");
const router = require("./router/index.js");
const port = 3000;
const app = express();
const { sequelize } = require("./models");
const session = require("express-session");
const passportConfig = require("./passport");
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }),
);

passportConfig();
app.use(passport.initialize());
app.use(passport.session());
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
