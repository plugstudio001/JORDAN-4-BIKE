import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Gemini API Setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI Insights endpoint
app.post("/api/ai/insights", async (req, res) => {
  try {
    const { data } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analyze this business data and provide 3 key insights/recommendations in short bullet points: ${JSON.stringify(data)}`,
      config: {
        systemInstruction: "You are a professional business consultant for a futuristic management platform called PulseGrid AI. Provide actionable, data-driven insights.",
      },
    });
    res.json({ insights: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate AI insights" });
  }
});

// AI Chatbot endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `User: ${message}\nContext: ${JSON.stringify(context)}`,
      config: {
        systemInstruction: "You are PulseGrid AI Assistant. Help users with business management, inventory tracking, and sales analysis. Be futuristic, concise, and professional.",
      },
    });
    res.json({ reply: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate AI reply" });
  }
});

// Marketing Ad Copy endpoint
app.post("/api/ai/marketing", async (req, res) => {
  try {
    const { topic, platform } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate 3 catchy ad copies for ${platform} about ${topic}.`,
      config: {
        systemInstruction: "You are a creative marketing expert. Generate futuristic and engaging ad copies.",
      },
    });
    res.json({ copies: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate marketing content" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
