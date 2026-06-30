"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/* ── Design tokens ── */
const T = {
  pageBg:    "linear-gradient(135deg,#0f172a 0%,#1a1040 60%,#0f172a 100%)",
  sidebarBg: "rgba(10,12,28,0.97)",
  cardBg:    "rgba(255,255,255,0.05)",
  border:    "rgba(255,255,255,0.08)",
  accent:    "#7c3aed",
  text:      "#ffffff",
  muted:     "rgba(255,255,255,0.45)",
};

const MODES = [
  { id: "generate",  icon: "✨", label: "Generate Image" },
  { id: "bulk",      icon: "📦", label: "Bulk Generate" },
  { id: "removebg",  icon: "✂️", label: "Remove Background" },
];

const MODELS = [
  { id: "dall-e-3",     label: "DALL-E 3",     desc: "Best for artistic & creative" },
  { id: "gpt-image-1",  label: "GPT Image 1",  desc: "Best for photorealism" },
  { id: "flux",         label: "Flux Schnell",  desc: "Fast & high quality" },
];

const RATIOS = [
  { id: "1:1",  label: "Square 1:1" },
  { id: "16:9", label: "Landscape 16:9" },
  { id: "9:16", label: "Portrait 9:16" },
  { id: "4:3",  label: "Classic 4:3" },
];

const inp = {
  width: "100%", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
  padding: "12px 15px", color: "#fff", fontSize: 14, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", colorScheme: "dark",
};

export default function ImageStudioPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [mode,      setMode]      = useState("generate");
  const [prompt,    setPrompt]    = useState("");
  const [model,     setModel]     = useState("dall-e-3");
  const [ratio,     setRatio]     = useState("1:1");
  const [count,     setCount]     = useState(4);
  const [images,    setImages]    = useState([]);
  const [busy,      setBusy]      = useState(false);
  const [error,     setError]     = useState("");
  const [preview,   setPreview]   = useState(null); // lightbox
  const [bgFile,    setBgFile]    = useState(null);
  const [bgPreview, setBgPreview] = useState(null);
  const [bgResult,  setBgResult]  = useState(null);
  const [bgBusy,    setBgBusy]    = useState(false);
  const [bgError,   setBgError]   = useState("");
  const [isMobile,  setIsMobile]  = useState(false);
  const [sideOpen,  setSideOpen]  = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push("/tools/imagestudio");
  }, [loading, user, router]);

  /* ── Generate Image (single via bulk API with count=1) ── */
  async function handleGenerate() {
    if (!prompt.trim()) { setError("Please enter a prompt."); return; }
    setBusy(true); setError(""); setImages([]);
    try {
      const res = await fetch("/api/image-studio/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, count: 1, model, aspectRatio: ratio }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Generation failed");
      setImages((data.images || []).filter(Boolean));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  /* ── Bulk Generate ── */
  async function handleBulk() {
    if (!prompt.trim()) { setError("Please enter a topic/prompt."); return; }
    setBusy(true); setError(""); setImages([]);
    try {
      const res = await fetch("/api/image-studio/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, count, model, aspectRatio: ratio }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Bulk generation failed");
      setImages((data.images || []).filter(Boolean));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  /* ── Remove Background ── */
  async function handleRemoveBg() {
    if (!bgFile) { setBgError("Please upload an image."); return; }
    setBgBusy(true); setBgError(""); setBgResult(null);
    try {
      const formData = new FormData();
      formData.append("image", bgFile);
      const res = await fetch("/api/image-studio/remove-bg", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Background removal failed");
      setBgResult(data.imageUrl);
    } catch (e) {
      setBgError(e.message);
    } finally {
      setBgBusy(false);
    }
  }

  function handleBgFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setBgFile(f);
    setBgResult(null);
    setBgError("");
    const reader = new FileReader();
    reader.onload = ev => setBgPreview(ev.target.result);
    reader.readAsDataURL(f);
  }

  function downloadImage(src, name) {
    const a = document.createElement("a");
    a.href = src; a.download = name || "image.png"; a.click();
  }

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
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>◈</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>Image Studio</div>
            <div style={{ fontSize: 10, color: T.muted }}>AI Image Generation</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 12px", flex: 1 }}>
        <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, paddingLeft: 6 }}>Modes</div>
        {MODES.map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setError(""); setImages([]); setBgResult(null); setSideOpen(false); }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 4, background: mode === m.id ? "rgba(124,58,237,0.18)" : "transparent", color: mode === m.id ? T.text : T.muted, fontWeight: mode === m.id ? 700 : 400, fontSize: 13, transition: "all 0.15s" }}>
            <span style={{ fontSize: 16 }}>{m.icon}</span>
            {m.label}
            {mode === m.id && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: T.accent }} />}
          </button>
        ))}

        <div style={{ marginTop: 24, fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, paddingLeft: 6 }}>Other Tools</div>
        {[
          { href: "/dashboard/lead-generation", icon: "🎯", label: "Lead Generation" },
          { href: "/dashboard/voice", icon: "🎙", label: "Voice Studio" },
          { href: "/dashboard/video", icon: "🎬", label: "Video Studio" },
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
        <span style={{ fontSize: 18 }}>◈</span>
        <span style={{ fontWeight: 800, fontSize: 15 }}>AI Image Studio</span>
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

          {/* Generate / Bulk */}
          {(mode === "generate" || mode === "bulk") && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
                  {mode === "generate" ? "✨ Generate Image" : "📦 Bulk Generate"}
                </h1>
                <p style={{ color: T.muted, fontSize: 14 }}>
                  {mode === "generate" ? "Create a single high-quality AI image from your prompt." : "Generate multiple variations from one topic for A/B testing."}
                </p>
              </div>

              {/* Prompt */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, color: T.muted, fontWeight: 600, display: "block", marginBottom: 7 }}>
                  {mode === "generate" ? "Image Prompt *" : "Topic / Concept *"}
                </label>
                <textarea
                  value={prompt} onChange={e => setPrompt(e.target.value)}
                  placeholder={mode === "generate"
                    ? "e.g. A modern Indian startup office, blue minimalist theme, cinematic lighting"
                    : "e.g. Luxury real estate poster for Mumbai"}
                  rows={3}
                  style={{ ...inp, resize: "vertical" }}
                />
              </div>

              {/* Model + Ratio row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                <div>
                  <label style={{ fontSize: 12, color: T.muted, fontWeight: 600, display: "block", marginBottom: 7 }}>AI Model</label>
                  <select value={model} onChange={e => setModel(e.target.value)} style={{ ...inp }}>
                    {MODELS.map(m => (
                      <option key={m.id} value={m.id}>{m.label} — {m.desc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: T.muted, fontWeight: 600, display: "block", marginBottom: 7 }}>Aspect Ratio</label>
                  <select value={ratio} onChange={e => setRatio(e.target.value)} style={{ ...inp }}>
                    {RATIOS.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {mode === "bulk" && (
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 12, color: T.muted, fontWeight: 600, display: "block", marginBottom: 7 }}>Number of Variations</label>
                  <select value={count} onChange={e => setCount(Number(e.target.value))} style={{ ...inp }}>
                    {[4, 6, 8, 10].map(n => <option key={n} value={n}>{n} images</option>)}
                  </select>
                </div>
              )}

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 18 }}>
                  {error}
                </div>
              )}

              <button onClick={mode === "generate" ? handleGenerate : handleBulk} disabled={busy}
                style={{ padding: "13px 32px", background: busy ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg,#7c3aed,#3b82f6)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 15, cursor: busy ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: "0 8px 28px rgba(124,58,237,0.25)" }}>
                {busy ? "Generating…" : mode === "generate" ? "✨ Generate Image" : "📦 Generate All Variations"}
              </button>

              {/* Results grid */}
              {images.length > 0 && (
                <div style={{ marginTop: 36 }}>
                  <div style={{ fontSize: 13, color: T.muted, marginBottom: 16, fontWeight: 600 }}>
                    {images.length} image{images.length > 1 ? "s" : ""} generated
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
                    {images.map((src, i) => (
                      <div key={i} style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
                        <img src={src} alt={`Generated ${i + 1}`} onClick={() => setPreview(src)}
                          style={{ width: "100%", display: "block", cursor: "zoom-in", aspectRatio: ratio === "9:16" ? "9/16" : ratio === "16:9" ? "16/9" : "1/1", objectFit: "cover" }} />
                        <div style={{ padding: "10px 12px", display: "flex", gap: 8 }}>
                          <button onClick={() => downloadImage(src, `image-${i + 1}.png`)}
                            style={{ flex: 1, padding: "8px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: T.text, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                            ⬇ Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Remove Background */}
          {mode === "removebg" && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>✂️ Remove Background</h1>
                <p style={{ color: T.muted, fontSize: 14 }}>Upload any image and get a clean transparent PNG cutout instantly.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>
                {/* Upload panel */}
                <div>
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{ border: `2px dashed ${bgPreview ? "rgba(124,58,237,0.4)" : T.border}`, borderRadius: 16, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: T.cardBg, marginBottom: 16, minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    {bgPreview ? (
                      <img src={bgPreview} alt="Preview" style={{ maxHeight: 200, maxWidth: "100%", borderRadius: 10, objectFit: "contain" }} />
                    ) : (
                      <>
                        <div style={{ fontSize: 36 }}>🖼</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Click to upload image</div>
                        <div style={{ fontSize: 12, color: T.muted }}>JPG, PNG, WEBP — max 10MB</div>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleBgFileChange} style={{ display: "none" }} />

                  {bgError && (
                    <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 14 }}>
                      {bgError}
                    </div>
                  )}

                  <button onClick={handleRemoveBg} disabled={bgBusy || !bgFile}
                    style={{ width: "100%", padding: "13px", background: bgBusy || !bgFile ? "rgba(124,58,237,0.25)" : "linear-gradient(135deg,#7c3aed,#3b82f6)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 15, cursor: bgBusy || !bgFile ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                    {bgBusy ? "Removing Background…" : "✂️ Remove Background"}
                  </button>
                </div>

                {/* Result panel */}
                <div>
                  <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginBottom: 10 }}>Result</div>
                  <div style={{ border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", background: `repeating-conic-gradient(rgba(255,255,255,0.05) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px`, minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {bgResult ? (
                      <img src={bgResult} alt="Result" style={{ maxHeight: 280, maxWidth: "100%", objectFit: "contain" }} />
                    ) : (
                      <div style={{ color: T.muted, fontSize: 13, textAlign: "center", padding: 20 }}>
                        {bgBusy ? "Processing…" : "Result will appear here"}
                      </div>
                    )}
                  </div>
                  {bgResult && (
                    <button onClick={() => downloadImage(bgResult, "no-bg.png")}
                      style={{ width: "100%", marginTop: 12, padding: "12px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 12, color: T.text, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                      ⬇ Download Transparent PNG
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {preview && (
        <div onClick={() => setPreview(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <img src={preview} alt="Preview" style={{ maxHeight: "90vh", maxWidth: "90vw", borderRadius: 16, objectFit: "contain", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }} />
          <button onClick={e => { e.stopPropagation(); downloadImage(preview, "image.png"); }}
            style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", padding: "12px 32px", background: "#7c3aed", border: "none", borderRadius: 100, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            ⬇ Download
          </button>
        </div>
      )}
    </div>
  );
}
