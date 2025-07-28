import { useState } from "react";
import axios from "axios";
import logo from "./assets/logo.svg";
import "./App.css";

function App() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setResponse("");
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/chat`,
                {
                    message: input,
                }
            );
            setResponse(res.data.choices[0].message.content);
        } catch (err) {
            console.error("❌ Axios error:");

            if (err.response) {
                console.error("Status:", err.response.status);
                console.error("Data:", err.response.data);
                setResponse(
                    `❌ Server error: ${err.response.status} – ${JSON.stringify(
                        err.response.data
                    )}`
                );
            } else if (err.request) {
                console.error("No response received:", err.request);
                setResponse("❌ No response received from server.");
            } else {
                console.error("Error:", err.message);
                setResponse(`❌ Request setup error: ${err.message}`);
            }
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    return (
        <div className="App">
            <img src={logo} alt="Logo" />
            <h3>Hi there!</h3>
            <h2>What would you like to know?</h2>
            <p>
                Use one of the most common prompts below or ask your own
                question
            </p>

            <div className="chat-box">
                <input
                    type="text"
                    placeholder="Ask whatever you want..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage} disabled={!input.trim()}>
                    ➤
                </button>
            </div>

            {loading && <p className="response">⏳ Thinking...</p>}
            {!loading && response && <p className="response">{response}</p>}
        </div>
    );
}

export default App;
