import { useState } from "react";
import "./App.css";
import MarkdownRenderer from "./components/MarkdownRenderer";
import CopyMarkdownButton from "./components/CopyMarkdownButton";

const suggestions = [
  {
    icon: "✦",
    title: "Explain something",
    prompt: "Explain how large language models work in simple words.",
  },
  {
    icon: "⌘",
    title: "Help me code",
    prompt: "Give me a practical JavaScript coding challenge.",
  },
  {
    icon: "↗",
    title: "Explore an idea",
    prompt: "Suggest an interesting AI project I could build.",
  },
  {
    icon: "✎",
    title: "Improve my writing",
    prompt: "Give me tips to write more clearly and professionally.",
  },
];

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e?.preventDefault();

    const text = prompt.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setPrompt("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: `${error.message}. Make sure the Python API is running.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function startNewChat() {
    if (loading) return;
    setMessages([]);
    setPrompt("");
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <button
          className="brand"
          onClick={startNewChat}
          aria-label="Start a new chat"
        >
          <span className="brand-mark">✳</span>
          <span>
            nova<span className="brand-light">.ai</span>
          </span>
        </button>

        <div className="topbar-right">
          <span className="model-badge">
            <span className="status-dot" />
            GROQ POWERED
          </span>
          <button
            className="new-chat-button"
            onClick={startNewChat}
            disabled={loading}
          >
            <span>＋</span> New chat
          </button>
        </div>
      </header>

      <section className={`workspace ${messages.length ? "has-messages" : ""}`}>
        {messages.length === 0 ? (
          <div className="welcome">
            <div className="orb-wrap">
              <div className="orb">
                <span>✳</span>
              </div>
            </div>

            <div className="eyebrow">
              <span className="eyebrow-line" />
              YOUR AI THINKING PARTNER
              <span className="eyebrow-line" />
            </div>

            <h1>
              Ideas start here.
              <br />
              <span>Let's make them happen.</span>
            </h1>

            <p className="welcome-description">
              Ask questions, explore ideas, solve problems, or build something
              extraordinary.
            </p>

            <div className="suggestion-grid">
              {suggestions.map((item) => (
                <button
                  className="suggestion-card"
                  key={item.title}
                  onClick={() => setPrompt(item.prompt)}
                >
                  <span className="suggestion-icon">{item.icon}</span>
                  <span className="suggestion-copy">
                    <strong>{item.title}</strong>
                    <span>{item.prompt}</span>
                  </span>
                  <span className="suggestion-arrow">↗</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="conversation">
            <div className="conversation-heading">
              <span className="conversation-indicator" />
              <span>YOUR CONVERSATION</span>
              <span className="message-count">
                {messages.filter((m) => m.role === "user").length} messages
              </span>
            </div>

            {messages.map((message, index) => (
              <article className={`message-row ${message.role}`} key={index}>
                <div className="avatar">
                  {message.role === "user" ? "Y" : "✳"}
                </div>

                <div className="message-content">
                  <div className="message-meta">
                    {message.role === "user"
                      ? "YOU"
                      : message.role === "error"
                        ? "CONNECTION ERROR"
                        : "NOVA"}
                  </div>
                  {message.role === "assistant" ? (
                    <MarkdownRenderer content={message.content} />
                  ) : (
                    <p>{message.content}</p>
                  )}{" "}
                  {message.role === "assistant" && (
                    <CopyMarkdownButton content={message.content} />
                  )}
                </div>
              </article>
            ))}

            {loading && (
              <article className="message-row assistant">
                <div className="avatar">✳</div>
                <div className="message-content">
                  <div className="message-meta">NOVA</div>
                  <div className="typing-indicator">
                    <span />
                    <span />
                    <span />
                    <small>Thinking through it...</small>
                  </div>
                </div>
              </article>
            )}
          </div>
        )}
      </section>

      <footer className="composer-area">
        <form className="composer" onSubmit={sendMessage}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything. Imagine everything..."
            aria-label="Message to AI"
            rows={1}
            disabled={loading}
          />

          <button
            type="submit"
            className="send-button"
            disabled={loading || !prompt.trim()}
            aria-label="Send message"
          >
            <span>↑</span>
          </button>
        </form>

        <div className="composer-hint">
          <span>✳ Powered by Groq &amp; LLMs</span>
          <span>ENTER to send · SHIFT + ENTER for a new line</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
