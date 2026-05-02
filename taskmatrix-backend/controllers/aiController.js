const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/ai/suggest
exports.getSuggestion = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ msg: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview"
    });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ suggestion: response });

  } catch (error) {
      console.error("AI FULL ERROR:", error);
      res.status(500).json({
      msg: "AI request failed",
      error: error.message
   });
}
};