const express = require("express");
const router = express.Router();

const { getSuggestion } = require("../controllers/aiController");
const { aiLimiter } = require("../middleware/rateLimiter");

// // AI route protected
router.post("/suggest", aiLimiter, getSuggestion);

module.exports = router;