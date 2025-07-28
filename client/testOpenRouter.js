import axios from "axios";

const headers = {
    Authorization:
        "Bearer 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",
    "Content-Type": "application/json",
};

const data = {
    model: "mistralai/mistral-7b-instruct",
    max_tokens: 500,
    messages: [{ role: "user", content: "Привет! Как дела?" }],
};

axios
    .post("https://openrouter.ai/api/v1/chat/completions", data, { headers })
    .then(res => {
        console.log(res.data.choices[0].message.content);
    })
    .catch(err => {
        console.error(err.response?.data || err.message);
    });
