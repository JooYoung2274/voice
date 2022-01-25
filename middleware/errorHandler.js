const { MESSAGE } = require("../config/constants");

function logHandler(err, req, res, next) {
  console.error("[" + new Date() + "]\n" + err.stack);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message || MESSAGE.DEFAULT_MESSAGE);
}

module.exports = { logHandler, errorHandler };
