import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/chat`,
                { message: input }
            );
            const botMessage = { text: res.data.message, sender: "bot" };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = {
                text: "Произошла ошибка при отправке запроса",
                sender: "bot",
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    const handleKeyPress = e => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="App">
            <div className="chat-box">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`message ${
                            msg.sender === "user" ? "user" : "bot"
                        }`}>
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-box">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Введите сообщение..."
                />
                <button onClick={sendMessage}>Отправить</button>
            </div>
        </div>
    );
}

export default App;
