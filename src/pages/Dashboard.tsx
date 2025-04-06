import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  isMobile: boolean;
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isMobile, isDarkMode }) => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState<{ text: string; fromBot: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [awaitingBotReply, setAwaitingBotReply] = useState(false);
  const [customQuestionMode, setCustomQuestionMode] = useState(false);

  const navigate = useNavigate();

  const toggleChatbot = () => {
    setShowChatbot((prev) => !prev);
    if (!showChatbot && messages.length === 0) {
      // Initial bot greeting + options
      const greeting = { text: "Hello! How may I assist you?", fromBot: true };
      const prompt = { text: "Please choose an option:", fromBot: true };
      setMessages([greeting, prompt]);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input.trim(), fromBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (!customQuestionMode) return; // Don't send to API unless in custom question mode

    setMessages((prev) => [...prev, { text: "Typing...", fromBot: true }]);
    setAwaitingBotReply(true);

    try {
      const response = await fetch("https://chatbotbackend-1wds.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const responseData = await response.json();
      console.log("Response from bot:", responseData);

      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove "Typing..."
        { text: responseData.response, fromBot: true },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "Error fetching response", fromBot: true },
      ]);
    } finally {
      setAwaitingBotReply(false);
    }
  };

  const handlePredefinedButtonClick = async (message: string) => {
    const userMessage = { text: message, fromBot: false };
    setMessages((prev) => [...prev, userMessage]);

    if (message === "Ask My Own Question") {
      setCustomQuestionMode(true);
      setMessages((prev) => [
        ...prev,
        {
          text: "Please type your message in the input so I can assist you.",
          fromBot: true,
        },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { text: "Typing...", fromBot: true }]);
    setAwaitingBotReply(true);

    try {
      const response = await fetch("https://chatbotbackend-1wds.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const responseData = await response.json();
      console.log("Response from bot:", responseData);

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: responseData.response, fromBot: true },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "Error fetching response", fromBot: true },
      ]);
    } finally {
      setAwaitingBotReply(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light text-dark d-flex flex-column align-items-center justify-content-center p-5">
      <h1 className="text-center text-indigo mb-4 fw-bold">
        Welcome to NMBOU Marketing and Operations Cloud
      </h1>
      <div className="text-center mb-5">
        <h2 className="h4 text-indigo mb-3">CHATBOT & CMS</h2>
        <p className="mb-3">Click the button below to manage your content.</p>
        <button className="btn btn-indigo" onClick={() => navigate("/cms")}>
          Manage Content
        </button>
      </div>

      {/* Chatbot Icon (toggle button) */}
      {!showChatbot && (
        <div className="chatbot-icon" onClick={toggleChatbot}>
          💬
        </div>
      )}

      {/* Chatbot Popup */}
      <div className={`chatbot-popup ${showChatbot ? "show" : ""}`}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="chatbot-header">Support Bot</span>
          <button className="btn btn-sm btn-outline-secondary" onClick={toggleChatbot}>
            ✖
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-message ${msg.fromBot ? "bot" : "user"}`}>
              {msg.text}
              {msg.fromBot && msg.text === "Please choose an option:" && (
                <div className="chatbot-buttons mt-2">
                  <button
                    className="chatbot-btn btn-indigo"
                    onClick={() => handlePredefinedButtonClick("Lost Password")}
                  >
                    Lost Password
                  </button>
                  <button
                    className="chatbot-btn btn-indigo"
                    onClick={() => handlePredefinedButtonClick("Delete Account")}
                  >
                    Delete Account
                  </button>
                  <button
                    className="chatbot-btn btn-indigo"
                    onClick={() => handlePredefinedButtonClick("Withdraw My Money")}
                  >
                    Withdraw My Money
                  </button>
                  <button
                    className="chatbot-btn btn-indigo"
                    onClick={() => handlePredefinedButtonClick("Ask My Own Question")}
                  >
                    Ask My Own Question
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chatbot-input-container">
          <input
            className="chatbot-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={awaitingBotReply}
          />
          <button className="chatbot-send-btn" onClick={handleSend} disabled={awaitingBotReply}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
