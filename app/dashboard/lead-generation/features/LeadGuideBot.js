"use client";
import { useState, useEffect, useRef } from "react";
import { T } from "@/app/dashboard/lead-generation/_shell";

/* ══════════════════════════════════════════════════════════════════════════
   Lead Guide Bot — contextual AI assistant, shown on step 1 of every tool
══════════════════════════════════════════════════════════════════════════ */
function LeadGuideBot({ toolId }) {
  const [isOpen,    setIsOpen]    = useState(false);
  const [language,  setLanguage]  = useState(null);      // null | "english" | "hinglish"
  const [phase,     setPhase]     = useState("language"); // "language" | "business" | "chat"
  const [input,     setInput]     = useState("");
  const [messages,  setMessages]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [history,   setHistory]   = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    if (isOpen && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, isOpen]);

  const WELCOME = {
    english:  "Hi! 👋 I'm your Lead Guide for this tool.\n\nTell me about your business — what do you sell or offer? I'll tell you exactly how to use this tool to find your best leads.",
    hinglish: "Hi! 👋 Main tera Lead Guide hoon is tool ke liye.\n\nBata mujhe apne business ke baare mein — tu kya bechta hai ya kya service deta hai? Main bataunga exactly kaise is tool ko use karna hai tere liye.",
  };

  function handleOpen() {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([{ role: "bot", text: "Hi! 👋 Do you want to continue in English or Hinglish?\n\nनमस्ते! English में बात करनी है या Hinglish में?" }]);
      setPhase("language");
    }
  }

  function handleLanguageSelect(lang) {
    setLanguage(lang);
    setPhase("business");
    setMessages(prev => [
      ...prev,
      { role: "user", text: lang === "english" ? "🇺🇸 English" : "🇮🇳 Hinglish" },
      { role: "bot",  text: WELCOME[lang] },
    ]);
  }

  async function handleSend() {
    const txt = input.trim();
    if (!txt || loading) return;
    setInput("");

    const userMsg = { role: "user", text: txt };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const newHistory = [...history, { role: "user", content: txt }];

    try {
      const isFirstBusiness = phase === "business";
      const res  = await fetch("/api/lead-gen/guide-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId,
          language: language || "english",
          businessDesc: isFirstBusiness ? txt : (history.find(h => h.role === "user")?.content || txt),
          followUp:     isFirstBusiness ? "" : txt,
          history:      history.slice(-6),
        }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't generate a response. Please try again.";

      setMessages(prev => [...prev, { role: "bot", text: reply }]);
      setHistory([...newHistory, { role: "assistant", content: reply }]);
      if (isFirstBusiness) setPhase("chat");
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      {/* Collapsed trigger button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px", borderRadius: 12, cursor: "pointer",
            background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)",
            color: "#c4b5fd", fontFamily: "inherit", textAlign: "left",
            transition: "all 0.15s",
          }}
        >
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🤖</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#c4b5fd" }}>AI Lead Guide</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Tell me your business → I'll tell you exactly how to find your best leads here</div>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>▸ Open</span>
        </button>
      )}

      {/* Expanded chat panel */}
      {isOpen && (
        <div style={{ background: "rgba(10,6,25,0.97)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 14, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "rgba(124,58,237,0.08)", borderBottom: "1px solid rgba(124,58,237,0.15)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#c4b5fd" }}>AI Lead Guide</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Contextual guidance for this tool</div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0, fontFamily: "inherit" }}
            >×</button>
          </div>

          {/* Messages */}
          <div style={{ maxHeight: 320, overflowY: "auto", padding: "14px 14px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "bot" && (
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginRight: 8, alignSelf: "flex-end" }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "82%", padding: "9px 13px", fontSize: 12.5, lineHeight: 1.65, whiteSpace: "pre-wrap",
                  borderRadius: msg.role === "user" ? "12px 3px 12px 12px" : "3px 12px 12px 12px",
                  background: msg.role === "user" ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${msg.role === "user" ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.08)"}`,
                  color: "rgba(255,255,255,0.85)",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Language selection buttons — shown only on first bot message */}
            {phase === "language" && messages.length === 1 && (
              <div style={{ display: "flex", gap: 8, paddingLeft: 32, marginTop: 2 }}>
                <button onClick={() => handleLanguageSelect("english")}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 10, cursor: "pointer", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.35)", color: "#60a5fa", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>
                  🇺🇸 English
                </button>
                <button onClick={() => handleLanguageSelect("hinglish")}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 10, cursor: "pointer", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.35)", color: "#fcd34d", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>
                  🇮🇳 Hinglish
                </button>
              </div>
            )}

            {loading && (
              <div style={{ display: "flex", gap: 8, paddingLeft: 32 }}>
                <div style={{ padding: "9px 13px", borderRadius: "3px 12px 12px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  AI is thinking...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input — shown after language is selected */}
          {phase !== "language" && (
            <div style={{ display: "flex", gap: 8, padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder={phase === "business" ? "Describe your business..." : "Ask a follow-up..."}
                disabled={loading}
                style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 12.5, outline: "none", fontFamily: "inherit" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                style={{ padding: "9px 16px", borderRadius: 10, background: input.trim() && !loading ? "linear-gradient(135deg,#7c3aed,#3b82f6)" : "rgba(255,255,255,0.06)", border: "none", color: input.trim() && !loading ? "#fff" : "rgba(255,255,255,0.25)", cursor: input.trim() && !loading ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 700, flexShrink: 0, fontFamily: "inherit" }}
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export { LeadGuideBot };

