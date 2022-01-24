const { ERROR } = require("../config/constants2");

function logHandler(err, req, res, next) {
  console.error("[" + new Date() + "]\n" + err.stack);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message || ERROR.DEFAULT_ERROR);
}

module.exports = { logHandler, errorHandler };
