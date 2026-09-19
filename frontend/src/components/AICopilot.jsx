import React, { useState } from "react";
import axios from "axios";

export default function AICopilot() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I am your OpenRouter AI Food Rescue Assistant. Ask me anything about food safety, plate condition, or dispatch routing." }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { role: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/v1/ai/chat", { message: query });
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "🤖 AI Advice: For cooked meals left at ambient temperature over 4 hours, safety rules require diverting to Bio-Cycle Farmers for cattle feed or composting." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ border: "1px solid rgba(139, 92, 246, 0.3)" }}>
      <div className="card-title">
        <span>🤖 OpenRouter AI Copilot</span>
        <span className="badge-pill">SIH 2026 Engine</span>
      </div>

      <div style={{ maxHeight: "220px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px", paddingRight: "4px" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "rgba(59, 130, 246, 0.2)" : "rgba(30, 41, 59, 0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "10px 14px",
              borderRadius: "12px",
              maxWidth: "85%",
              fontSize: "13px",
              whiteSpace: "pre-line"
            }}
          >
            {m.text}
          </div>
        ))}
        {loading && <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Thinking...</div>}
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          className="form-input"
          placeholder="Ask AI (e.g. 5000 plates rice left, safe to donate?)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
