const rateLimit = require("express-rate-limit");

// 🔐 Login limiter (strict)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // only 5 requests
  message: {
    success: false,
    msg: "Too many login attempts. Try again later."
  }
});

// 🤖 AI limiter (moderate)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    msg: "Too many AI requests. Please slow down."
  }
});

module.exports = {
  loginLimiter,
  aiLimiter
};