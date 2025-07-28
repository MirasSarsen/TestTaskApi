const fs = require("fs");
const path = require("path");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

// === Авто-поиск .env ===
let envPath = path.resolve(__dirname, ".env");
if (!fs.existsSync(envPath)) {
    envPath = path.resolve(__dirname, "../.env");
}
if (!fs.existsSync(envPath)) {
    console.error("❌ ERROR: .env file not found in server/ or project root!");
    process.exit(1);
}

require("dotenv").config({ path: envPath });
console.log("✅ .env loaded from:", envPath);
console.log(
    "🔑 OPENROUTER_API_KEY:",
    process.env.OPENROUTER_API_KEY ? "LOADED" : "NOT FOUND"
);

const app = express();
app.use(cors());
app.use(express.json());

// === Основной эндпоинт для общения с OpenRouter ===
app.post("/api/chat", async (req, res) => {
    const { message } = req.body;
    console.log("📩 Message from client:", message);

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo",
                messages: [{ role: "user", content: message }],
                max_tokens: 500,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "My Chat App",
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("❌ OpenRouter API Error:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error message:", error.message);
        }
        res.status(500).json({
            error: error.response?.data || "Unknown error",
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
