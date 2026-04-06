// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: "*", // In production, replace with your frontend domain e.g. "https://yourdomain.com"
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ─── OpenAI Client ───────────────────────────────────────────────────────────
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "SymptoCare backend is running ✅" });
});

// ─── POST /analyze ───────────────────────────────────────────────────────────
app.post("/analyze", async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || typeof symptoms !== "string" || !symptoms.trim()) {
    return res.status(400).json({ error: "Symptoms field is required and must be a non-empty string." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful and cautious medical assistant AI integrated into the SymptoCare app.
Your role is to provide general health information based on described symptoms.
Always structure your responses clearly. 
Never claim to replace a real doctor.
If symptoms sound severe or life-threatening, always urge the user to call emergency services immediately.`
        },
        {
          role: "user",
          content: symptoms
        }
      ],
      max_tokens: 800,
      temperature: 0.5
    });

    const result = response.choices[0].message.content;
    res.json({ result });

  } catch (err) {
    console.error("OpenAI API error:", err.message);

    // Surface a helpful error if the API key is missing or invalid
    if (err.status === 401) {
      return res.status(500).json({ error: "Invalid OpenAI API key. Check your .env file." });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: "OpenAI rate limit hit. Please wait and try again." });
    }

    res.status(500).json({ error: "AI API error", details: err.message });
  }
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🔥 SymptoCare backend running on http://localhost:${PORT}`);
});