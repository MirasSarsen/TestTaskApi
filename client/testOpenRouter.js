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
