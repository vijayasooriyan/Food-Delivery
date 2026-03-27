import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const TypingDots = () => (
  <div className="typing-indicator">
    <span /><span /><span />
  </div>
);

const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="8" width="14" height="10" rx="3" fill="currentColor" opacity="0.9"/>
    <rect x="9" y="4" width="6" height="5" rx="2" fill="currentColor"/>
    <circle cx="9" cy="13" r="1.5" fill="white"/>
    <circle cx="15" cy="13" r="1.5" fill="white"/>
    <rect x="8" y="18" width="2" height="3" rx="1" fill="currentColor"/>
    <rect x="14" y="18" width="2" height="3" rx="1" fill="currentColor"/>
    <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const QUICK_REPLIES = ["Show menu", "Best sellers", "Vegetarian options", "Today's offers"];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi there! 👋 I'm Tomato Bot. Ask me anything about our menu, prices, or today's specials!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimatingIn(true);
      setHasNewMessage(false);
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage = { role: "user", content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: updatedMessages.slice(1, -1),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        if (!isOpen) setHasNewMessage(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsAnimatingIn(false);
      setTimeout(() => setIsOpen(false), 300);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="cb-wrapper">
      {/* Floating toggle button */}
      <button
        className={`cb-toggle ${hasNewMessage ? "cb-toggle--pulse" : ""}`}
        onClick={handleToggle}
        aria-label="Open chat"
      >
        <span className={`cb-toggle-icon ${isOpen ? "cb-toggle-icon--close" : ""}`}>
          {isOpen ? <CloseIcon /> : <BotIcon />}
        </span>
        {hasNewMessage && <span className="cb-badge" />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className={`cb-window ${isAnimatingIn ? "cb-window--in" : "cb-window--out"}`}>

          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-avatar">
              <BotIcon />
              <span className="cb-status-dot" />
            </div>
            <div className="cb-header-info">
              <span className="cb-header-name">Tomato Bot</span>
              <span className="cb-header-status">Online · Ready to help</span>
            </div>
            <button className="cb-header-close" onClick={handleToggle}>
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="cb-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`cb-msg cb-msg--${msg.role}`}
                style={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s` }}
              >
                {msg.role === "assistant" && (
                  <div className="cb-msg-avatar"><BotIcon /></div>
                )}
                <div className="cb-bubble">{msg.content}</div>
              </div>
            ))}

            {loading && (
              <div className="cb-msg cb-msg--assistant">
                <div className="cb-msg-avatar"><BotIcon /></div>
                <div className="cb-bubble cb-bubble--typing">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 1 && !loading && (
            <div className="cb-quick-replies">
              {QUICK_REPLIES.map((q) => (
                <button key={q} className="cb-quick-btn" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div className="cb-input-row">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about our menu..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="cb-input"
            />
            <button
              className={`cb-send ${input.trim() ? "cb-send--active" : ""}`}
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              <SendIcon />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Chatbot;