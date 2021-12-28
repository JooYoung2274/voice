const rateLimit = require("express-rate-limit");
const { customizedError } = require("../utils/error");

const reqLimiter = rateLimit.default({
  windowMs: 1 * 1000,
  max: 60,
  delayMs: 0,
  handler(req, res, next) {
    next(customizedError("1초에 60번만 요청할 수 있습니다.", 429));
  },
});

module.exports = { reqLimiter };
