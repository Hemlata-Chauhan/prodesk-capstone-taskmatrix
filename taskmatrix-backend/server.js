require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

// (PROTECTED ROUTE)
app.use("/api/test", require("./routes/testRoutes"));


const apiKey = process.env.API_KEY;

app.get("/api", (req, res) => {
  res.send(`Your API Key is: ${apiKey}`);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));