const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🔥 Backend is working perfectly!");
});

// ✅ MAIN ROUTE (this is missing in your case)
app.post("/analyze", (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: "No symptoms provided" });
  }

  let response = {
    conditions: [],
    risk: "",
    advice: ""
  };

  if (symptoms.includes("fever")) {
    response.conditions.push("Flu", "Viral Infection");
    response.risk = "Medium";
    response.advice = "Take rest, stay hydrated, consult a doctor if persists.";
  } else {
    response.conditions.push("General Checkup Needed");
    response.risk = "Low";
    response.advice = "Monitor symptoms.";
  }

  res.json(response);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});