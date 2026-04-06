// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /analyze endpoint
app.post("/analyze", async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: "Symptoms missing" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful medical assistant." },
        { role: "user", content: `Analyze these symptoms and suggest possible conditions: ${symptoms}` }
      ]
    });

    const result = response.choices[0].message.content;
    res.json({ result });
  } catch (err) {
    console.error("OpenAI API error:", err.message);
    res.status(500).json({ error: "AI API error", details: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`🔥 Backend running on port ${PORT}`));