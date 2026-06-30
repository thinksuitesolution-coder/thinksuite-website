"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/* ── Design tokens ── */
const T = {
  pageBg:    "linear-gradient(135deg,#0f172a 0%,#0d1a30 60%,#0f172a 100%)",
  sidebarBg: "rgba(10,12,28,0.97)",
  cardBg:    "rgba(255,255,255,0.05)",
  border:    "rgba(255,255,255,0.08)",
  accent:    "#3b82f6",
  text:      "#ffffff",
  muted:     "rgba(255,255,255,0.45)",
};

const inp = {
  width: "100%", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
  padding: "12px 15px", color: "#fff", fontSize: 14, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", colorScheme: "dark",
};

const PROVIDERS = [
  { id: "elevenlabs", label: "ElevenLabs", desc: "Most realistic, multilingual" },
  { id: "google",     label: "Google TTS", desc: "Natural, Hindi strong" },
  { id: "openai",     label: "OpenAI TTS", desc: "Fast, clean English" },
];

const OPENAI_VOICES = [
  { id: "alloy",   name: "Alloy",   desc: "Neutral" },
  { id: "echo",    name: "Echo",    desc: "Male" },
  { id: "fable",   name: "Fable",   desc: "British" },
  { id: "onyx",    name: "Onyx",    desc: "Deep male" },
  { id: "nova",    name: "Nova",    desc: "Female" },
  { id: "shimmer", name: "Shimmer", desc: "Soft female" },
];

export default function VoicePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [provider,    setProvider]    = useState("elevenlabs");
  const [text,        setText]        = useState("");
  const [speed,       setSpeed]       = useState(1.0);
  const [voices,      setVoices]      = useState([]);
  const [voiceId,     setVoiceId]     = useState("");
  const [voicesLoading, setVoicesLoading] = useState(false);
  const [busy,        setBusy]        = useState(false);
  const [error,       setError]       = useState("");
  const [audioSrc,    setAudioSrc]    = useState(null);
  const [audioFormat, setAudioFormat] = useState("mp3");
  const [isMobile,    setIsMobile]    = useState(false);
  const [sideOpen,    setSideOpen]    = useState(false);
  const [charCount,   setCharCount]   = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push("/tools/voice");
  }, [loading, user, router]);

  /* Load voices when provider changes */
  useEffect(() => {
    if (!user) return;
    setVoices([]); setVoiceId(""); setError("");
    if (provider === "openai") {
      setVoices(OPENAI_VOICES.map(v => ({ id: v.id, name: v.name, desc: v.desc, category: "english" })));
      setVoiceId("alloy");
      return;
    }
    setVoicesLoading(true);
    fetch(`/api/voice?provider=${provider}`)
      .then(r => r.json())
      .then(d => {
        const list = d.voices || [];
        setVoices(list);
        if (list.length > 0) setVoiceId(list[0].id);
      })
      .catch(() => setError("Could not load voices."))
      .finally(() => setVoicesLoading(false));
  }, [provider, user]);

  async function handleGenerate() {
    if (!text.trim()) { setError("Please enter some text."); return; }
    if (!voiceId && provider !== "openai") { setError("Please select a voice."); return; }
    setBusy(true); setError(""); setAudioSrc(null);
    try {
      const body = { provider, text, voiceId, speed };
      if (provider === "google") {
        const v = voices.find(v => v.id === voiceId);
        body.lang = v?.lang || "hi-IN";
      }
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Voice generation failed");
      const mime = data.mimeType || "audio/mpeg";
      const src  = `data:${mime};base64,${data.audioData}`;
      setAudioSrc(src);
      setAudioFormat(data.outputFormat?.startsWith("mp3") ? "mp3" : "wav");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function handleDownload() {
    if (!audioSrc) return;
    const a = document.createElement("a");
    a.href = audioSrc;
    a.download = `voice-${Date.now()}.${audioFormat}`;
    a.click();
  }

  const hindiVoices  = voices.filter(v => v.category === "hindi");
  const engVoices    = voices.filter(v => v.category !== "hindi");

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: T.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: T.muted, fontSize: 15 }}>Loading…</div>
      </div>
    );
  }

  const sidebar = (
    <div style={{ width: isMobile ? "100%" : 240, flexShrink: 0, background: T.sidebarBg, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "20px 0" }}>
      <div style={{ padding: "0 18px 20px", borderBottom: `1px solid ${T.border}` }}>
        <a href="/tools" style={{ color: T.muted, fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          ← All Tools
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎙</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>Voice Studio</div>
            <div style={{ fontSize: 10, color: T.muted }}>Text to Speech AI</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 12px", flex: 1 }}>
        <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, paddingLeft: 6 }}>AI Provider</div>
        {PROVIDERS.map(p => (
          <button key={p.id} onClick={() => { setProvider(p.id); setSideOpen(false); }}
            style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 4, background: provider === p.id ? "rgba(59,130,246,0.18)" : "transparent", transition: "all 0.15s" }}>
            <div style={{ fontSize: 13, fontWeight: provider === p.id ? 700 : 400, color: provider === p.id ? T.text : T.muted }}>{p.label}</div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{p.desc}</div>
          </button>
        ))}

        <div style={{ marginTop: 24, fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, paddingLeft: 6 }}>Other Tools</div>
        {[
          { href: "/dashboard/lead-generation", icon: "🎯", label: "Lead Generation" },
          { href: "/dashboard/imagestudio",     icon: "◈",  label: "Image Studio" },
          { href: "/dashboard/video",           icon: "🎬", label: "Video Studio" },
        ].map(t => (
          <a key={t.href} href={t.href}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, color: T.muted, textDecoration: "none", fontSize: 13, marginBottom: 4 }}>
            <span>{t.icon}</span>{t.label}
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, display: "flex", flexDirection: "column", fontFamily: "'Segoe UI',system-ui,sans-serif", color: T.text }}>
      {/* Top nav */}
      <div style={{ height: 52, background: T.sidebarBg, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, flexShrink: 0 }}>
        {isMobile && (
          <button onClick={() => setSideOpen(!sideOpen)} style={{ background: "none", border: "none", color: T.muted, fontSize: 20, cursor: "pointer", padding: "4px 8px" }}>☰</button>
        )}
        <span style={{ fontSize: 18 }}>🎙</span>
        <span style={{ fontWeight: 800, fontSize: 15 }}>AI Voice Studio</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: T.accent }}>
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        {(!isMobile || sideOpen) && sidebar}

        {/* Main */}
        <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "20px 16px" : "32px 36px" }}>
          <div style={{ maxWidth: 720 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🎙 Text to Speech</h1>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 28 }}>
              Convert any text to natural, studio-quality voice. Download as MP3.
            </p>

            {/* Text input */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <label style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>Your Script *</label>
                <span style={{ fontSize: 11, color: charCount > 4000 ? "#f87171" : T.muted }}>{charCount} / 5000 chars</span>
              </div>
              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setCharCount(e.target.value.length); }}
                placeholder="Paste your script here…\n\nExample: Welcome to ThinkSuite AI. Our platform helps businesses grow with powerful AI tools."
                rows={6}
                maxLength={5000}
                style={{ ...inp, resize: "vertical" }}
              />
            </div>

            {/* Voice selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: T.muted, fontWeight: 600, display: "block", marginBottom: 7 }}>
                Voice {voicesLoading && <span style={{ color: T.muted, fontWeight: 400 }}>— Loading…</span>}
              </label>
              {provider === "openai" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  {OPENAI_VOICES.map(v => (
                    <button key={v.id} onClick={() => setVoiceId(v.id)}
                      style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${voiceId === v.id ? "rgba(59,130,246,0.5)" : T.border}`, background: voiceId === v.id ? "rgba(59,130,246,0.15)" : T.cardBg, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{v.name}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>{v.desc}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <select value={voiceId} onChange={e => setVoiceId(e.target.value)} style={{ ...inp }} disabled={voicesLoading}>
                  {hindiVoices.length > 0 && (
                    <optgroup label="Hindi / Indian">
                      {hindiVoices.map(v => (
                        <option key={v.id} value={v.id}>{v.name} — {v.desc || v.accent || v.lang || ""}</option>
                      ))}
                    </optgroup>
                  )}
                  {engVoices.length > 0 && (
                    <optgroup label="English / Other">
                      {engVoices.map(v => (
                        <option key={v.id} value={v.id}>{v.name} — {v.desc || v.accent || v.lang || ""}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              )}
            </div>

            {/* Speed */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <label style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>Speed</label>
                <span style={{ fontSize: 12, color: T.accent, fontWeight: 700 }}>{speed.toFixed(1)}x</span>
              </div>
              <input type="range" min="0.7" max="1.3" step="0.05" value={speed} onChange={e => setSpeed(Number(e.target.value))}
                style={{ width: "100%", accentColor: T.accent }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.muted, marginTop: 4 }}>
                <span>0.7x — Slow</span><span>1.0x — Normal</span><span>1.3x — Fast</span>
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 18 }}>
                {error}
              </div>
            )}

            <button onClick={handleGenerate} disabled={busy}
              style={{ padding: "13px 36px", background: busy ? "rgba(59,130,246,0.35)" : "linear-gradient(135deg,#3b82f6,#1a237e)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 15, cursor: busy ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: "0 8px 28px rgba(59,130,246,0.25)", marginBottom: 28 }}>
              {busy ? "Generating…" : "🎙 Generate Voice"}
            </button>

            {/* Audio player */}
            {audioSrc && (
              <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 14 }}>✅ Audio Ready</div>
                <audio ref={audioRef} src={audioSrc} controls style={{ width: "100%", borderRadius: 8, marginBottom: 14 }} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleDownload}
                    style={{ flex: 1, padding: "11px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 10, color: T.text, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                    ⬇ Download {audioFormat.toUpperCase()}
                  </button>
                  <button onClick={() => { setAudioSrc(null); setText(""); setCharCount(0); }}
                    style={{ padding: "11px 18px", background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 10, color: T.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                    New
                  </button>
                </div>
              </div>
            )}

            {/* Tips */}
            <div style={{ marginTop: 36, background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, marginBottom: 12, letterSpacing: 0.5 }}>💡 Pro Tips</div>
              {[
                "ElevenLabs — Best for multilingual content including Hindi & Indian English",
                "Google TTS — Great for Hindi with natural WaveNet & Neural2 voices",
                "OpenAI — Fastest, clean English voices, best for ads and short clips",
                "Speed 0.8x for audiobooks/training · 1.2x for social media clips",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: T.muted, marginBottom: 8, lineHeight: 1.5 }}>
                  <span style={{ color: T.accent, flexShrink: 0 }}>✓</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
