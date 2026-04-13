import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getToken } from "../auth/auth";

const ChatbotPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋 How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const question = input;
    setInput("");
    setLoading(true);

    try {
        console.log(getToken(),"token-------------")
      const response = await axios.post(`${baseUrl}/api/openai`, {
        message: question,
      },
      {
        headers: {  "Authorization": `Bearer ${getToken()}` },
      }
      );
    


      const botReply = {
        sender: "bot",
        text: response.data || "Sorry, I could not understand that.",
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
        console.log(error, "in error")
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 mt-10 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center text-2xl"
      >
        💬
      </button>

      {/* Popup */}
      {isOpen && (
        // <div className="fixed bottom-24 right-6 z-50 w-[90%] max-w-sm bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
          <div>
        {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <div>
              <h3 className="font-semibold">Chat Assistant</h3>
              <p className="text-xs text-blue-100">We’re here to help</p>
            </div>

            <button
              onClick={handleToggle}
              className="text-white text-xl leading-none hover:opacity-80"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto px-3 py-4 bg-gray-50 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 border rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 border px-4 py-2 rounded-2xl rounded-bl-md text-sm shadow-sm">
                  Typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotPopup;