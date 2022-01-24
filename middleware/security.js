const rateLimit = require("express-rate-limit");
const { customizedError } = require("../utils/error");

const { SECURITY, MESSAGE } = require("../config/constants");

const reqLimiter = rateLimit.default({
  windowMs: SECURITY.WINDOW_MS,
  max: SECURITY.MAX,
  delayMs: SECURITY.DELAY_MS,
  handler(req, res, next) {
    next(customizedError(MESSAGE.REQ_LIMITER, 429));
  },
});

module.exports = { reqLimiter };
