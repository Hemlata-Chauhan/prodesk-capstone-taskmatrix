const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Import Joi Schemas
const { registerSchema, loginSchema } = require("../validators/authValidator");

// ================= REGISTER USER =================
exports.registerUser = async (req, res) => {
  try {
    // 🔒 VALIDATION
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        msg: error.details[0].message
      });
    }

    const { name, email, password } = req.body;

    // 🔍 Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        msg: "User already exists"
      });
    }

    // 🔐 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 💾 Save user
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // ✅ SUCCESS RESPONSE
    res.status(201).json({
      success: true,
      msg: "User registered successfully"
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message
    });
  }
};

// ================= LOGIN USER =================
exports.loginUser = async (req, res) => {
  try {
    // 🔒 VALIDATION
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        msg: error.details[0].message
      });
    }

    const { email, password } = req.body;

    // 🔍 Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials"
      });
    }

    // 🔑 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials"
      });
    }

    // 🎟️ Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ SUCCESS RESPONSE
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message
    });
  }
};