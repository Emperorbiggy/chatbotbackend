import React, { useState, useEffect, useRef } from "react";

const AIChat = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { sender: "ai", text: `You said: "${userMessage.text}"` };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Chat Messages */}
      <div className="flex-grow-1 overflow-auto p-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 d-flex ${message.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`p-3 rounded-lg shadow-sm ${
                message.sender === "user" ? "bg-primary text-white" : "bg-secondary text-white"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div> {/* This is the scroll target */}
      </div>

      {/* Input Box */}
      <div className="d-flex align-items-center p-3 border-top">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="form-control"
        />
        <button onClick={handleSendMessage} className="ms-3 btn btn-primary">
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;
