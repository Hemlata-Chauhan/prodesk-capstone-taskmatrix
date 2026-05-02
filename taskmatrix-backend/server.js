const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const helmet = require("helmet");

// 🔥 IMPORT ERROR MIDDLEWARE
const errorHandler = require("./middleware/errorMiddleware");

connectDB();

const app = express();

// ✅ MIDDLEWARE (ALWAYS FIRST)
app.use(cors());
app.use(express.json());
app.use(helmet());

// ✅ ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// ✅ BASIC ROUTE
app.get("/", (req, res) => {
  res.send("TaskMatrix API is running...");
});

// ❗ 404 HANDLER (VERY IMPORTANT)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    msg: "Route not found"
  });
});

// 🔥 GLOBAL ERROR HANDLER (MUST BE LAST)
app.use(errorHandler);

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});