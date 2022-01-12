const express = require("express");
const router = require("./router/index.js");
const app = express();
const passportConfig = require("./passport");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const { reqLimiter } = require("./middleware/security");

let corsOptions = {
  origin: "https://oao-voice.com",
  credentials: true,
};

app.use(helmet.hidePoweredBy({ setTo: "PHP 8.1.1" })); //req header x-powerd-by 변경
app.use(helmet.xssFilter()); //xss cross site script 공격 방어
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: "deny" })); //iframe 클릭재킹
// app.use(helmet.ieNoOpen()); //internet explorer 버전에서 신뢰할 수 없는 html을 다운못하게함
// app.use(helmet.hsts()) // 이후 요청이 https로만 와야 허락
// app.use(helmet.dnsPrefetchControl()) //브라우저의 dns레코드 미리추출방지
app.use(hpp()); //오염된 req.query방어

const { logHandler, errorHandler } = require("./middleware/errorHandler");

app.use(cors());

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
dotenv.config();
passportConfig(app);

// //test용
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/kakao.html");
});

app.use(express.json());
app.use("/api", reqLimiter, router);
app.use(express.static("uploads"));

app.use(logHandler);
app.use(errorHandler);

module.exports = app;
