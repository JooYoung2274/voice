const express = require("express");
const router = require("./router/index.js");
// const port = 3000;
const app = express();
// const { sequelize } = require("./models");
const session = require("express-session");
const passportConfig = require("./passport");
const passport = require("passport");
const { logHandler, errorHandler } = require("./middleware/errorHandler");

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

app.use(logHandler);
app.use(errorHandler);

module.exports = app;
