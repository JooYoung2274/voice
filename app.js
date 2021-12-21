const express = require("express");
const router = require("./router/index.js");
const port = 3000;
const app = express();
const { sequelize } = require("./models");

app.use(express.json());
app.use("/api", router);
app.use(express.static("uploads"));

sequelize
  .sync({ force: false })
  .then(() => {
    console.log(`
    🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧
    🚧🚧 DB연결 성공! 이게되네🚧🚧
    🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧
    `);
  })
  .catch((error) => {
    console.error(`
    🪓🪓🪓🪓🪓🪓🪓🪓🪓🪓🪓🪓🪓
    🪓🪓 DB연결 실패! ... 🪓🪓
    🪓🪓🪓🪓🪓🪓🪓🪓🪓🪓🪓🪓🪓
    `);
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
