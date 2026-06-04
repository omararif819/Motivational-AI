import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hey — I’m your self-help mindset coach. Tell me what you’re struggling with, and I’ll help you take the next step.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // This ID keeps the same chat memory going
  const [conversationID] = useState("mindset-chat-1");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationID: conversationID,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend response failed");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Something went wrong. Make sure your Spring Boot backend is running on port 8080.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function resetChat() {
    try {
      await fetch("http://localhost:8080/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationID: conversationID,
          message: "",
        }),
      });

      setMessages([
        {
          sender: "ai",
          text: "Fresh start. What do you want to work on today — motivation, stress, confidence, discipline, or focus?",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Could not reset the chat. Check if your backend is running.",
        },
      ]);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="page">
      <div className="background-glow"></div>

      <main className="chat-card">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Self-Help AI</p>
            <h1>Elite Mindset Coach</h1>
            <p className="subtitle">
              Build discipline, confidence, focus, and emotional control — inspired by elite performance mindsets.
            </p>
          </div>

          <button className="reset-button" onClick={resetChat}>
            Reset
          </button>
        </header>

        <section className="quick-prompts">
          <button onClick={() => setInput("I feel unmotivated today")}>
            I feel unmotivated
          </button>
          <button onClick={() => setInput("Help me become more disciplined")}>
            Build discipline
          </button>
          <button onClick={() => setInput("Help me calm down and focus")}>
            Calm my mind
          </button>
          <button onClick={() => setInput("Give me Ronaldo-style advice")}>
            Elite mindset advice
          </button>
        </section>

        <section className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-row ${
                message.sender === "user" ? "user-row" : "ai-row"
              }`}
            >
              <div
                className={`message-bubble ${
                  message.sender === "user" ? "user-bubble" : "ai-bubble"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row ai-row">
              <div className="message-bubble ai-bubble typing">
                Thinking<span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
        </section>

        <footer className="input-area">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me what you need help with..."
            rows="1"
          />

          <button onClick={sendMessage} disabled={loading}>
            {loading ? "Wait" : "Send"}
          </button>
        </footer>
      </main>
    </div>
  );
}

export default App;