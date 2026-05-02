const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimiter");

// REGISTER (no limit needed)
router.post("/register", registerUser);

// LOGIN (protected with limiter)
router.post("/login", loginLimiter, loginUser);

module.exports = router;