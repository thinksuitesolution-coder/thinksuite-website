"use client";
import { useState, useRef } from "react";
import { ToolCard, PrimaryButton, T } from "@/app/dashboard/lead-generation/_shell";
import { STATES } from "@/lib/frontend/constants";
import { INTL_COUNTRIES } from "./GlobalCompanies";

const inp = {
  width: "100%", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
  padding: "12px 15px", color: "#fff", fontSize: 14, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", colorScheme: "dark",
};
const ghostBtn = {
  fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 10, cursor: "pointer",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.6)",
};


/* ══════════════════════════════════════════════════════════════════════════
   Group Finder Panel
══════════════════════════════════════════════════════════════════════════ */
const GRP_PLATFORMS = [
  { key: "whatsapp",  icon: "💬", label: "WhatsApp",  color: "#25d366", bg: "#25d366" },
  { key: "telegram",  icon: "✈️", label: "Telegram",  color: "#0088cc", bg: "#0088cc" },
  { key: "facebook",  icon: "📘", label: "Facebook",  color: "#1877f2", bg: "#1877f2" },
  { key: "linkedin",  icon: "🔷", label: "LinkedIn",  color: "#0a66c2", bg: "#0a66c2" },
  { key: "instagram", icon: "📸", label: "Instagram", color: "#e1306c", bg: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)" },
];

const GRP_PLATFORM_ICONS = {
  whatsapp: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
};

const GRP_PLATFORM_MAP = Object.fromEntries(GRP_PLATFORMS.map(p => [p.key, p]));

function getPlatformMeta(key) {
  return GRP_PLATFORM_MAP[key] || { icon: "🔗", label: key, color: "#6b7280" };
}

function GroupFinderPanel({ isIntl, step, groups, loading, loadingMore, error, niche, platforms, country, quota, quotaHit, onSearch, onLoadMore, onReset, onDismissError }) {
  const [botStep,          setBotStep]          = useState(1); // 1=niche 2=platform+location 3=confirm
  const [localNiche,       setLocalNiche]       = useState("");
  const [nicheInput,       setNicheInput]       = useState("");
  const [localPlatform,    setLocalPlatform]    = useState("whatsapp");
  const [localCountry,     setLocalCountry]     = useState("");
  const [localRecency,     setLocalRecency]     = useState(null);
  const [activeFilter,     setActiveFilter]     = useState(null);
  const [dismissedUrls,    setDismissedUrls]    = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("ts_dismissed_groups") || "[]")); }
    catch { return new Set(); }
  });

  function dismissGroup(url) {
    setDismissedUrls(prev => {
      const next = new Set(prev);
      next.add(url);
      try { localStorage.setItem("ts_dismissed_groups", JSON.stringify([...next].slice(-500))); } catch {}
      return next;
    });
  }

  // AI Business Analyzer state
  const [aiMode,           setAiMode]           = useState(false);   // show business input
  const [bizInput,         setBizInput]         = useState("");
  const [aiLoading,        setAiLoading]        = useState(false);
  const [aiSuggestion,     setAiSuggestion]     = useState(null);    // {niches, platforms, message, tip}
  const [aiMessage,        setAiMessage]        = useState("");      // editable outreach msg
  const [showMsg,          setShowMsg]          = useState(false);

  // AI Related chips state
  const [relatedChips,     setRelatedChips]     = useState([]);
  const [relatedLoading,   setRelatedLoading]   = useState(false);
  const relatedTimer = useRef(null);

  function handleSubmit() {
    if (!localNiche.trim()) return;
    setActiveFilter(null);
    onSearch(localNiche.trim(), [localPlatform], localCountry.trim(), isIntl, localRecency);
  }

  // Fetch related chips with debounce when niche changes
  function handleNicheChange(val) {
    setLocalNiche(val);
    setRelatedChips([]);
    clearTimeout(relatedTimer.current);
    if (val.trim().length < 3) return;
    relatedTimer.current = setTimeout(async () => {
      setRelatedLoading(true);
      try {
        const res  = await fetch("/api/lead-gen/group-ai-suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "related", niche: val.trim(), isInternational: isIntl }),
        });
        const data = await res.json();
        if (data.success) setRelatedChips(data.related || []);
      } catch {} finally { setRelatedLoading(false); }
    }, 700);
  }

  // AI business analyzer
  async function handleAiAnalyze() {
    if (!bizInput.trim()) return;
    setAiLoading(true); setAiSuggestion(null); setShowMsg(false);
    try {
      const res  = await fetch("/api/lead-gen/group-ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "business", business: bizInput.trim(), isInternational: isIntl }),
      });
      const data = await res.json();
      if (data.success) {
        setAiSuggestion(data);
        setAiMessage(data.message || "");
        // Auto-apply first recommended platform
        if (data.platforms?.length) setLocalPlatform(data.platforms[0]);
      }
    } catch {} finally { setAiLoading(false); }
  }

  function applyNiche(n) {
    setLocalNiche(n);
    setRelatedChips([]);
    setAiMode(false);
  }

  const accentColor = isIntl ? "#7c3aed" : "#3b82f6";
  const accentGrad  = isIntl ? "linear-gradient(135deg,#7c3aed,#7c3aed)" : "linear-gradient(135deg,#2563eb,#3b82f6)";
  const aiColor     = "#a78bfa";

  // Step 1 Input
  if (step === 1) {
    const GRP_NICHES = isIntl
      ? ["SaaS Founders","Digital Marketing","E-commerce","Freelancers","Startup Founders","Crypto/Web3","Import Export","IT Professionals","Real Estate","Fitness"]
      : ["Real Estate Investors","CA Community","Digital Marketing","Startup Founders","Freelancers","Traders","Import Export","Fitness","Stock Market","Network Marketing"];

    const GRP_PLATFORMS = [
      { key:"whatsapp", label:"WhatsApp", icon:"💬", color:"#25d366", desc:"Real group invite links only" },
      { key:"telegram", label:"Telegram", icon:"✈️", color:"#0088cc", desc:"Groups only (not channels)" },
      { key:"facebook", label:"Facebook", icon:"📘", color:"#3b82f6", desc:"Public & private groups" },
      { key:"linkedin", label:"LinkedIn", icon:"💼", color:"#0a66c2", desc:"Professional groups" },
    ];

    function handleBotNicheNext() {
      const n = nicheInput.trim() || localNiche.trim();
      if (!n) return;
      setLocalNiche(n);
      setBotStep(2);
    }

    function handleBotSubmit() {
      const n = localNiche.trim();
      if (!n) return;
      setActiveFilter(null);
      onSearch(n, [localPlatform], localCountry.trim(), isIntl, localRecency);
    }

    const accentColor = "#25d366";

    return (
      <div>
        {/* Stats bar */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {GRP_PLATFORMS.map(p => (
            <div key={p.key} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:p.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {GRP_PLATFORM_ICONS[p.key]}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:p.color }}>{p.label}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Real Groups</div>
              </div>
            </div>
          ))}
        </div>

        <ToolCard style={{ padding:0, overflow:"hidden" }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(37,211,102,0.05)" }}>
            <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(37,211,102,0.15)", border:"2px solid rgba(37,211,102,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🤖</div>
            <div>
              <div style={{ fontWeight:800, color:"#fff", fontSize:14 }}>Group Finder AI</div>
              <div style={{ fontSize:11, color:"#25d366" }}>Linktree • Bio Pages • Directory Sites • Deep Scraping</div>
            </div>
            <span style={{ marginLeft:"auto", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.35)" }}>{quota?.remaining || 300} searches left</span>
          </div>

          {/* Bot steps */}
          <div style={{ padding:"14px 18px" }}>
            {/* Step indicator */}
            <div style={{ display:"flex", alignItems:"center", marginBottom:20 }}>
              {["Niche","Platform","Find Groups"].map((label,i) => (
                <div key={label} style={{ display:"flex", alignItems:"center", flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background: botStep>i+1?"#22c55e":botStep===i+1?"#25d366":"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.3)" }}>{botStep>i+1?"✓":i+1}</div>
                    <span style={{ fontSize:11, fontWeight:botStep===i+1?600:400, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.35)", whiteSpace:"nowrap" }}>{label}</span>
                  </div>
                  {i < 2 && <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)", margin:"0 8px" }} />}
                </div>
              ))}
            </div>

            {/* STEP 1: Niche */}
            {botStep === 1 && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(37,211,102,0.15)", border:"1px solid rgba(37,211,102,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
                  <div style={{ background:"rgba(37,211,102,0.07)", border:"1px solid rgba(37,211,102,0.2)", borderRadius:"4px 12px 12px 12px", padding:"10px 14px" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>Which topic's groups are you looking for?</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Type or choose from the options below</div>
                  </div>
                </div>
                <div style={{ paddingLeft:44 }}>
                  <input value={nicheInput} onChange={e => setNicheInput(e.target.value)}
                    onKeyDown={e => e.key==="Enter" && handleBotNicheNext()} autoFocus
                    placeholder="e.g. Digital Marketing, Real Estate, Startup Founders..."
                    style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:14, outline:"none", marginBottom:10, boxSizing:"border-box" }}
                    onFocus={e => e.target.style.borderColor="#25d366"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                    {GRP_NICHES.map(n => (
                      <button key={n} onClick={() => setNicheInput(n)}
                        style={{ fontSize:11, padding:"4px 10px", borderRadius:20, cursor:"pointer",
                          background: nicheInput===n?"rgba(37,211,102,0.15)":"rgba(255,255,255,0.04)",
                          border: nicheInput===n?"1.5px solid #25d366":"1px solid rgba(255,255,255,0.1)",
                          color: nicheInput===n?"#25d366":"rgba(255,255,255,0.5)" }}>{n}</button>
                    ))}
                  </div>
                  <button onClick={handleBotNicheNext} disabled={!nicheInput.trim()}
                    style={{ padding:"10px 24px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
                      background: nicheInput.trim() ? "rgba(37,211,102,0.15)" : "rgba(255,255,255,0.05)",
                      border: nicheInput.trim() ? "1.5px solid #25d366" : "1px solid rgba(255,255,255,0.12)",
                      color: nicheInput.trim() ? "#25d366" : "rgba(255,255,255,0.3)" }}>
                    Next: Platform →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Platform + Location */}
            {botStep === 2 && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {/* Confirmed niche bubble */}
                <div style={{ display:"flex", justifyContent:"flex-end", gap:8, alignItems:"center" }}>
                  <div style={{ background:"rgba(37,211,102,0.12)", border:"1px solid rgba(37,211,102,0.25)", borderRadius:"12px 4px 12px 12px", padding:"8px 14px" }}>
                    <span style={{ fontSize:13, fontWeight:600, color:"#25d366" }}>{localNiche}</span>
                  </div>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>👤</div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(37,211,102,0.15)", border:"1px solid rgba(37,211,102,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
                  <div style={{ background:"rgba(37,211,102,0.07)", border:"1px solid rgba(37,211,102,0.2)", borderRadius:"4px 12px 12px 12px", padding:"10px 14px", flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>Which platform?</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Real group invite links only - no communities or channels</div>
                  </div>
                </div>
                <div style={{ paddingLeft:44 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                    {GRP_PLATFORMS.map(p => (
                      <button key={p.key} onClick={() => setLocalPlatform(p.key)}
                        style={{ padding:"10px 12px", borderRadius:10, cursor:"pointer", textAlign:"left",
                          background: localPlatform===p.key ? `rgba(37,211,102,0.08)` : "rgba(255,255,255,0.03)",
                          border: `1.5px solid ${localPlatform===p.key ? p.color : "rgba(255,255,255,0.1)"}`,
                          color: localPlatform===p.key ? p.color : "rgba(255,255,255,0.6)" }}>
                        <div style={{ marginBottom:5, width:34, height:34, borderRadius:8, background:p.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {GRP_PLATFORM_ICONS[p.key] || <span style={{ fontSize:16 }}>{p.icon}</span>}
                        </div>
                        <div style={{ fontSize:12, fontWeight:700 }}>{p.label}</div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{p.desc}</div>
                      </button>
                    ))}
                  </div>
                  {/* Location */}
                  {isIntl ? (
                    <select value={localCountry} onChange={e => setLocalCountry(e.target.value)}
                      style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:13, outline:"none", cursor:"pointer", marginBottom:12, boxSizing:"border-box" }}>
                      <option value="" style={{ color:"#111", background:"#fff" }}>🌍 Any Country (Global)</option>
                      {[...INTL_COUNTRIES].sort((a,b) => a.localeCompare(b)).map(c => <option key={c} value={c} style={{ color:"#111", background:"#fff" }}>{c}</option>)}
                    </select>
                  ) : (
                    <select value={localCountry} onChange={e => setLocalCountry(e.target.value)}
                      style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:13, outline:"none", cursor:"pointer", marginBottom:12, boxSizing:"border-box" }}>
                      <option value="India" style={{ color:"#111", background:"#fff" }}>🇮🇳 All India</option>
                      {STATES.map(s => <option key={s} value={s} style={{ color:"#111", background:"#fff" }}>{s}</option>)}
                    </select>
                  )}
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => setBotStep(1)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
                    <button onClick={() => setBotStep(3)}
                      style={{ flex:1, padding:"10px 0", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
                        background:"rgba(37,211,102,0.12)", border:"1.5px solid #25d366", color:"#25d366" }}>
                      Next: Confirm →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Confirm */}
            {botStep === 3 && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(37,211,102,0.15)", border:"1px solid rgba(37,211,102,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
                  <div style={{ background:"rgba(37,211,102,0.07)", border:"1px solid rgba(37,211,102,0.2)", borderRadius:"4px 12px 12px 12px", padding:"12px 16px", flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:8 }}>Confirm - start the search?</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>🎯 <strong style={{ color:"#fff" }}>Topic:</strong> {localNiche}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", display:"flex", alignItems:"center", gap:5 }}>
                        <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:18, height:18, borderRadius:4, background:GRP_PLATFORMS.find(p=>p.key===localPlatform)?.color, overflow:"hidden", flexShrink:0 }}>
                          <div style={{ transform:"scale(0.65)", transformOrigin:"center" }}>{GRP_PLATFORM_ICONS[localPlatform]}</div>
                        </span>
                        <span><strong style={{ color:"#fff" }}>Platform:</strong> {GRP_PLATFORMS.find(p=>p.key===localPlatform)?.label}</span>
                      </div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>📍 <strong style={{ color:"#fff" }}>Location:</strong> {localCountry || (isIntl ? "Global" : "All India")}</div>
                    </div>
                    <div style={{ marginTop:8, fontSize:11, color:"rgba(37,211,102,0.7)", lineHeight:1.5 }}>
                      🔍 AI will scrape Linktree pages, bio links, directory sites + validate each link. Only real joinable group links returned.
                    </div>
                  </div>
                </div>
                <div style={{ paddingLeft:44, display:"flex", gap:8 }}>
                  <button onClick={() => setBotStep(2)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
                  <button onClick={handleBotSubmit}
                    style={{ flex:1, padding:"11px 0", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:700,
                      background:"rgba(37,211,102,0.15)", border:"2px solid #25d366", color:"#25d366" }}>
                    🔍 Find Real Groups
                  </button>
                </div>
              </div>
            )}
          </div>
        </ToolCard>
      </div>
    );
  }

  // Step 2 -Loading
  if (step === 2 || loading) {
    return (
      <ToolCard style={{ textAlign:"center", padding:"48px 24px" }}>
        <div style={{ fontSize:36, marginBottom:16 }}>🔍</div>
        <div style={{ fontSize:16, fontWeight:700, color:"#fff", marginBottom:8 }}>
          AI is searching for groups...
        </div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)" }}>
          Generating smart queries for <strong style={{ color: accentColor }}>{niche}</strong> {isIntl ? (country || "globally") : "in India"}
        </div>
        <div style={{ marginTop:24, display:"flex", justifyContent:"center", gap:6 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:8, height:8, borderRadius:"50%", background: accentColor, opacity:0.8,
              animation:`grpDot 1.2s ${i*0.2}s infinite alternate ease-in-out` }} />
          ))}
        </div>
        <style>{`@keyframes grpDot{from{transform:scale(1);opacity:0.4}to{transform:scale(1.6);opacity:1}}`}</style>
      </ToolCard>
    );
  }

  // Step 4 insufficient balance
  if (step === 4 || quotaHit) {
    return (
      <ToolCard style={{ textAlign:"center", padding:"48px 24px" }}>
        <div style={{ fontSize:40, marginBottom:16 }}>👛</div>
        <div style={{ fontSize:17, fontWeight:800, color:"#fff", marginBottom:10 }}>Insufficient Wallet Balance</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.7, marginBottom:24, maxWidth:380, margin:"0 auto 24px" }}>
          Add ₹500 or more to your wallet to continue finding groups.
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={onReset}
            style={{ padding:"11px 28px", borderRadius:10, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>
            Back
          </button>
        </div>
      </ToolCard>
    );
  }

  // Step 3 Results (filter out directory fallback entries only show direct links)
  const directGroups = groups.filter(g => !g.isDirectory && !dismissedUrls.has(g.url));
  const byPlatform = {};
  for (const g of directGroups) {
    if (!byPlatform[g.platform]) byPlatform[g.platform] = [];
    byPlatform[g.platform].push(g);
  }

  const platformsInResults = Object.keys(byPlatform);
  const visibleGroups = activeFilter ? directGroups.filter(g => g.platform === activeFilter) : directGroups;
  const usedPct = quota ? Math.min(100, Math.round((quota.used / quota.limit) * 100)) : 0;

  return (
    <div>
      {/* Summary bar */}
      <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px 20px", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
          <div>
            <span style={{ fontSize:22, fontWeight:900, color: accentColor }}>{directGroups.length}</span>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.55)", marginLeft:6 }}>groups found</span>
          </div>
          {/* Quota bar */}
          {quota && (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:80, height:5, borderRadius:4, background:"rgba(255,255,255,0.1)", overflow:"hidden" }}>
                <div style={{ width:`${usedPct}%`, height:"100%", background: usedPct > 85 ? "#f87171" : accentColor, borderRadius:4, transition:"width 0.4s" }} />
              </div>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{quota.remaining} left · <span title="Group Finder has its own separate 300/month quota, independent from your lead quota">separate quota</span></span>
            </div>
          )}
        </div>
        <button onClick={onReset} style={{ ...ghostBtn }}>🔄 New Search</button>
      </div>

      {/* Platform filter buttons */}
      {platformsInResults.length > 1 && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
          <button onClick={() => setActiveFilter(null)}
            style={{ padding:"6px 14px", borderRadius:9, cursor:"pointer", fontSize:12, fontWeight:700,
              background: !activeFilter ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${!activeFilter ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.1)"}`,
              color: !activeFilter ? "#fff" : "rgba(255,255,255,0.45)" }}>
            All ({directGroups.length})
          </button>
          {platformsInResults.map(k => {
            const meta = getPlatformMeta(k);
            const isActive = activeFilter === k;
            return (
              <button key={k} onClick={() => setActiveFilter(isActive ? null : k)}
                style={{ padding:"6px 14px", borderRadius:9, cursor:"pointer", fontSize:12, fontWeight:700,
                  background: isActive ? `${meta.color}22` : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${isActive ? meta.color + "70" : "rgba(255,255,255,0.1)"}`,
                  color: isActive ? meta.color : "rgba(255,255,255,0.45)", transition:"all 0.15s" }}>
                {meta.icon} {meta.label} ({byPlatform[k].length})
              </button>
            );
          })}
        </div>
      )}

      {visibleGroups.length === 0 ? (
        <ToolCard style={{ textAlign:"center", padding:"40px 24px" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>😕</div>
          <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:8 }}>No groups found</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:20 }}>Try a broader niche or select more platforms</div>
          <button onClick={onReset} style={{ padding:"10px 24px", borderRadius:10, background: accentGrad, border:"none", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>Try Again</button>
        </ToolCard>
      ) : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:12 }}>
            {visibleGroups.map((g, i) => {
              const meta = getPlatformMeta(g.platform);
              return (
                <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${g.isDirectLink ? meta.color + "35" : "rgba(255,255,255,0.08)"}`, borderRadius:14, padding:"16px 18px", display:"flex", flexDirection:"column", gap:10, transition:"border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = meta.color + "60"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = g.isDirectLink ? meta.color + "35" : "rgba(255,255,255,0.08)"}
                >
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, fontWeight:700, color: meta.color, background:`${meta.color}18`, border:`1px solid ${meta.color}35`, borderRadius:6, padding:"3px 10px", flexShrink:0 }}>
                      {meta.icon} {meta.label}
                    </span>
                    <div style={{ display:"flex", gap:5 }}>
                      {g.isVerified  && !g.isMayExpire && <span style={{ fontSize:10, fontWeight:700, color:"#22c55e", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:6, padding:"2px 8px" }}>✅ Verified Active</span>}
                      {g.isVerified  && g.isMayExpire  && <span title="Group name confirmed on WhatsApp servers - link was active at scan time. WA invite links can expire if group admin resets them." style={{ fontSize:10, fontWeight:700, color:"#22c55e", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:6, padding:"2px 8px", cursor:"help" }}>✅ Confirmed</span>}
                      {!g.isVerified && g.isDirectLink && <span style={{ fontSize:10, fontWeight:700, color:"#60a5fa", background:"rgba(96,165,250,0.1)", border:"1px solid rgba(96,165,250,0.25)", borderRadius:6, padding:"2px 8px" }}>🔗 Direct Link</span>}
                      {g.isMayExpire && <span title="WhatsApp invite links can expire when the group admin resets them. If link doesn't open - click ❌ Remove and try the next group." style={{ fontSize:10, fontWeight:600, color:"#f59e0b", background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:6, padding:"2px 8px", cursor:"help" }}>⚠️ May Expire</span>}
                      {g.isAiSuggested && <span style={{ fontSize:10, fontWeight:600, color:"#a78bfa", background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.25)", borderRadius:6, padding:"2px 8px" }}>AI</span>}
                      {isIntl
                        ? <span style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.35)", background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.12)", borderRadius:6, padding:"2px 8px" }}>🌍 INTL</span>
                        : <span style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.35)", background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.12)", borderRadius:6, padding:"2px 8px" }}>🇮🇳 INDIA</span>
                      }
                    </div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.4 }}>{g.name}</div>
                  {g.description && (
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>
                      {g.description.length > 180 ? g.description.slice(0, 180) + "…" : g.description}
                    </div>
                  )}
                  <div style={{ display:"flex", gap:8, marginTop:"auto", flexWrap:"wrap" }}>
                    <a href={g.url} target="_blank" rel="noopener noreferrer"
                      style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:9, background: accentGrad, border:"none", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", textDecoration:"none" }}>
                      🔗 Join Group
                    </a>
                    <button onClick={() => navigator.clipboard?.writeText(g.url)}
                      style={{ padding:"8px 12px", borderRadius:9, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.55)", fontWeight:600, fontSize:11, cursor:"pointer" }}>
                      📋 Copy
                    </button>
                    <button onClick={() => dismissGroup(g.url)} title="Dead link - remove from future searches"
                      style={{ padding:"8px 12px", borderRadius:9, background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", color:"rgba(239,68,68,0.65)", fontWeight:600, fontSize:11, cursor:"pointer" }}>
                      ❌ Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More button */}
          <div style={{ marginTop:16, display:"flex", justifyContent:"center", gap:10 }}>
            <button onClick={onLoadMore} disabled={loadingMore}
              style={{ padding:"11px 32px", borderRadius:10, background: loadingMore ? "rgba(255,255,255,0.05)" : accentGrad, border:"none", color: loadingMore ? "rgba(255,255,255,0.3)" : "#fff", fontWeight:700, fontSize:13, cursor: loadingMore ? "not-allowed" : "pointer" }}>
              {loadingMore ? "Loading…" : "Load 10 More Unique Groups"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}



export { GRP_PLATFORMS, GRP_PLATFORM_ICONS, GRP_PLATFORM_MAP, getPlatformMeta, GroupFinderPanel };

