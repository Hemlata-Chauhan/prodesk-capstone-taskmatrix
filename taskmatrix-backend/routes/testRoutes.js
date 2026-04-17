const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    msg: "You are authorized!",
    user: req.user
  });
});

module.exports = router;