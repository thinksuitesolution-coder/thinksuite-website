"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/* ── Design tokens ── */
const T = {
  pageBg:    "linear-gradient(135deg,#0f172a 0%,#180d30 60%,#0f172a 100%)",
  sidebarBg: "rgba(10,12,28,0.97)",
  cardBg:    "rgba(255,255,255,0.05)",
  border:    "rgba(255,255,255,0.08)",
  accent:    "#7c3aed",
  text:      "#ffffff",
  muted:     "rgba(255,255,255,0.45)",
};

const inp = {
  width: "100%", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
  padding: "12px 15px", color: "#fff", fontSize: 14, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", colorScheme: "dark",
};

const STYLES  = ["cinematic", "realistic", "animated", "documentary", "corporate", "dramatic"];
const ORIENTATIONS = [{ id: "landscape", label: "Landscape 16:9" }, { id: "portrait", label: "Portrait 9:16" }, { id: "square", label: "Square 1:1" }];
const LANGUAGES  = ["english", "hindi", "tamil", "telugu", "bengali", "marathi"];
const SPEEDS     = [{ id: "0.75", label: "0.75x — Slow" }, { id: "1", label: "1x — Normal" }, { id: "1.25", label: "1.25x — Fast" }];

const VOICE_OPTIONS = [
  { id: "english-female",  label: "English Female" },
  { id: "english-male",    label: "English Male" },
  { id: "hindi-female",    label: "Hindi Female" },
  { id: "hindi-male",      label: "Hindi Male" },
];

/* ── Poll interval ── */
const POLL_MS = 4000;

export default function VideoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [script,      setScript]      = useState("");
  const [style,       setStyle]       = useState("cinematic");
  const [orientation, setOrientation] = useState("landscape");
  const [language,    setLanguage]    = useState("english");
  const [speed,       setSpeed]       = useState("1");
  const [voiceKey,    setVoiceKey]    = useState("english-female");
  const [subtitles,   setSubtitles]   = useState(false);
  const [duration,    setDuration]    = useState(60);
  const [busy,        setBusy]        = useState(false);
  const [error,       setError]       = useState("");
  const [jobId,       setJobId]       = useState(null);
  const [jobStatus,   setJobStatus]   = useState(null); // { status, progress, statusMessage, videoUrl }
  const [isMobile,    setIsMobile]    = useState(false);
  const [sideOpen,    setSideOpen]    = useState(false);
  const pollRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push("/tools/video");
  }, [loading, user, router]);

  /* ── Polling ── */
  useEffect(() => {
    if (!jobId) return;
    const poll = async () => {
      try {
        const res  = await fetch(`/api/video-studio/status?jobId=${jobId}`);
        const data = await res.json();
        setJobStatus(data);
        if (data.status === "completed" || data.status === "error") {
          clearInterval(pollRef.current);
          setBusy(false);
        }
      } catch { /* ignore */ }
    };
    poll();
    pollRef.current = setInterval(poll, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [jobId]);

  async function handleGenerate() {
    if (!script.trim()) { setError("Please enter your script."); return; }
    setBusy(true); setError(""); setJobId(null); setJobStatus(null);
    try {
      const segments = script.split("\n\n").filter(s => s.trim()).map(s => ({ text: s.trim() }));
      if (segments.length === 0) segments.push({ text: script.trim() });

      const res = await fetch("/api/video-studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          segments,
          script,
          voiceKey,
          voiceProvider: "elevenlabs",
          style,
          duration,
          orientation,
          language,
          speed,
          subtitles,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to start video generation");
      setJobId(data.jobId);
      setJobStatus({ status: "queued", progress: 0, statusMessage: "Job queued, starting soon…" });
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  function handleReset() {
    clearInterval(pollRef.current);
    setJobId(null); setJobStatus(null);
    setBusy(false); setError("");
    setScript("");
  }

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: T.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: T.muted, fontSize: 15 }}>Loading…</div>
      </div>
    );
  }

  const isRunning = jobStatus && jobStatus.status !== "completed" && jobStatus.status !== "error";
  const isDone    = jobStatus?.status === "completed";
  const isError   = jobStatus?.status === "error";

  const sidebar = (
    <div style={{ width: isMobile ? "100%" : 240, flexShrink: 0, background: T.sidebarBg, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "20px 0" }}>
      <div style={{ padding: "0 18px 20px", borderBottom: `1px solid ${T.border}` }}>
        <a href="/tools" style={{ color: T.muted, fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          ← All Tools
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎬</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>Video Studio</div>
            <div style={{ fontSize: 10, color: T.muted }}>AI Video Generation</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 12px", flex: 1 }}>
        <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, paddingLeft: 6 }}>Settings</div>

        {/* Style */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginBottom: 6, paddingLeft: 2 }}>Visual Style</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {STYLES.map(s => (
              <button key={s} onClick={() => setStyle(s)}
                style={{ padding: "7px 6px", borderRadius: 8, border: `1px solid ${style === s ? "rgba(124,58,237,0.5)" : T.border}`, background: style === s ? "rgba(124,58,237,0.15)" : "transparent", color: style === s ? T.text : T.muted, fontSize: 11, fontWeight: style === s ? 700 : 400, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Orientation */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginBottom: 6, paddingLeft: 2 }}>Orientation</div>
          {ORIENTATIONS.map(o => (
            <button key={o.id} onClick={() => setOrientation(o.id)}
              style={{ width: "100%", display: "block", padding: "8px 10px", borderRadius: 8, border: "none", background: orientation === o.id ? "rgba(124,58,237,0.15)" : "transparent", color: orientation === o.id ? T.text : T.muted, fontSize: 12, fontWeight: orientation === o.id ? 700 : 400, cursor: "pointer", fontFamily: "inherit", textAlign: "left", marginBottom: 3 }}>
              {o.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 24, fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, paddingLeft: 6 }}>Other Tools</div>
        {[
          { href: "/dashboard/lead-generation", icon: "🎯", label: "Lead Generation" },
          { href: "/dashboard/imagestudio",     icon: "◈",  label: "Image Studio" },
          { href: "/dashboard/voice",           icon: "🎙", label: "Voice Studio" },
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
        <span style={{ fontSize: 18 }}>🎬</span>
        <span style={{ fontWeight: 800, fontSize: 15 }}>AI Video Studio</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: T.accent }}>
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        {(!isMobile || sideOpen) && sidebar}

        {/* Main */}
        <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "20px 16px" : "32px 36px" }}>
          <div style={{ maxWidth: 760 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🎬 Text to Video</h1>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 28 }}>
              Write your script and let AI generate a professional video. Separate scenes with a blank line.
            </p>

            {/* Job running state */}
            {(isRunning || isDone || isError) && (
              <div style={{ background: T.cardBg, border: `1px solid ${isError ? "rgba(239,68,68,0.3)" : isDone ? "rgba(34,197,94,0.3)" : T.border}`, borderRadius: 16, padding: "24px", marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 22 }}>{isError ? "❌" : isDone ? "✅" : "⏳"}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
                      {isError ? "Generation Failed" : isDone ? "Video Ready!" : "Generating Video…"}
                    </div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                      {jobStatus?.statusMessage || ""}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {isRunning && (
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 100, height: 6, overflow: "hidden", marginBottom: 16 }}>
                    <div style={{ height: "100%", borderRadius: 100, background: "linear-gradient(90deg,#7c3aed,#3b82f6)", width: `${jobStatus?.progress || 0}%`, transition: "width 0.5s ease" }} />
                  </div>
                )}

                {isDone && jobStatus?.videoUrl && (
                  <div>
                    <video src={jobStatus.videoUrl} controls style={{ width: "100%", borderRadius: 12, marginBottom: 14, maxHeight: 400 }} />
                    <div style={{ display: "flex", gap: 10 }}>
                      <a href={jobStatus.videoUrl} download={`video-${jobId}.mp4`}
                        style={{ flex: 1, padding: "11px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 10, color: T.text, fontWeight: 700, fontSize: 13, textDecoration: "none", textAlign: "center", display: "block" }}>
                        ⬇ Download MP4
                      </a>
                      <button onClick={handleReset}
                        style={{ padding: "11px 18px", background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 10, color: T.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                        New Video
                      </button>
                    </div>
                  </div>
                )}

                {isError && (
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, fontSize: 12, color: "#f87171" }}>{jobStatus?.error}</div>
                    <button onClick={handleReset}
                      style={{ padding: "10px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#f87171", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      Try Again
                    </button>
                  </div>
                )}

                {isRunning && (
                  <div style={{ fontSize: 11, color: T.muted, textAlign: "center" }}>
                    Video generation takes 2–8 minutes. You can close this tab and come back.
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            {!jobId && (
              <>
                {/* Script */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: T.muted, fontWeight: 600, display: "block", marginBottom: 7 }}>
                    Video Script * <span style={{ fontWeight: 400 }}>(separate scenes with a blank line)</span>
                  </label>
                  <textarea
                    value={script} onChange={e => setScript(e.target.value)}
                    placeholder={"Scene 1: Introduce the product — show a close-up of the packaging.\n\nScene 2: A happy customer using the product in a bright kitchen.\n\nScene 3: CTA — Visit our website to order today!"}
                    rows={8}
                    style={{ ...inp, resize: "vertical" }}
                  />
                </div>

                {/* Voice & Language row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                  <div>
                    <label style={{ fontSize: 12, color: T.muted, fontWeight: 600, display: "block", marginBottom: 7 }}>Voiceover</label>
                    <select value={voiceKey} onChange={e => setVoiceKey(e.target.value)} style={{ ...inp }}>
                      {VOICE_OPTIONS.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: T.muted, fontWeight: 600, display: "block", marginBottom: 7 }}>Language</label>
                    <select value={language} onChange={e => setLanguage(e.target.value)} style={{ ...inp }}>
                      {LANGUAGES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                {/* Speed & Duration row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                  <div>
                    <label style={{ fontSize: 12, color: T.muted, fontWeight: 600, display: "block", marginBottom: 7 }}>Speech Speed</label>
                    <select value={speed} onChange={e => setSpeed(e.target.value)} style={{ ...inp }}>
                      {SPEEDS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: T.muted, fontWeight: 600, display: "block", marginBottom: 7 }}>Target Duration (sec)</label>
                    <select value={duration} onChange={e => setDuration(Number(e.target.value))} style={{ ...inp }}>
                      {[30, 60, 90, 120].map(d => <option key={d} value={d}>{d}s</option>)}
                    </select>
                  </div>
                </div>

                {/* Subtitles toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <button onClick={() => setSubtitles(!subtitles)}
                    style={{ width: 40, height: 22, borderRadius: 100, border: "none", background: subtitles ? T.accent : "rgba(255,255,255,0.15)", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                    <span style={{ position: "absolute", top: 3, left: subtitles ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                  </button>
                  <span style={{ fontSize: 13, color: T.muted }}>Add subtitles</span>
                </div>

                {error && (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 18 }}>
                    {error}
                  </div>
                )}

                <button onClick={handleGenerate} disabled={busy}
                  style={{ padding: "13px 36px", background: busy ? "rgba(124,58,237,0.35)" : "linear-gradient(135deg,#7c3aed,#3b82f6)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 15, cursor: busy ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: "0 8px 28px rgba(124,58,237,0.25)" }}>
                  {busy ? "Starting…" : "🎬 Generate Video"}
                </button>

                {/* Tips */}
                <div style={{ marginTop: 36, background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, marginBottom: 12 }}>💡 Script Tips</div>
                  {[
                    "Separate each scene with a blank line — each paragraph becomes one video segment",
                    "Describe camera angle: 'close-up', 'wide shot', 'aerial view' for cinematic output",
                    "Add mood: 'warm lighting', 'dramatic shadows', 'minimalist white background'",
                    "Keep scenes short (2-4 sentences) for best results",
                  ].map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: T.muted, marginBottom: 8, lineHeight: 1.5 }}>
                      <span style={{ color: T.accent, flexShrink: 0 }}>✓</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
