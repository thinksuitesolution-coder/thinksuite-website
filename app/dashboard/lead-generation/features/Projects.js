"use client";
import { useState } from "react";
import { ToolCard, PrimaryButton, T } from "@/app/dashboard/lead-generation/_shell";
import { getSeenIds, saveSeenIds } from "@/lib/frontend/localStorage";
import { safeJson } from "@/lib/frontend/api";
import { SaveLeadButton } from "./SaveLeadButton";

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


/* ════════════════════════════════════════════════════════════════════════════
   GLOBAL SOURCES FREELANCER CLIENTS
════════════════════════════════════════════════════════════════════════════ */
const GLOBAL_SERVICES = [
  "web development","mobile app","UI/UX design","logo design","SEO","content writing",
  "video editing","social media","digital marketing","email marketing","copywriting",
  "WordPress","Shopify","React","Node.js","Python","data analysis","AI/ML","automation",
];

const GLOBAL_COUNTRIES = [
  { value:"global",          label:"🌍 Global" },
  { value:"United States",   label:"🇺🇸 United States" },
  { value:"United Kingdom",  label:"🇬🇧 United Kingdom" },
  { value:"India",           label:"🇮🇳 India" },
  { value:"Australia",       label:"🇦🇺 Australia" },
  { value:"Canada",          label:"🇨🇦 Canada" },
  { value:"UAE",             label:"🇦🇪 UAE" },
  { value:"Germany",         label:"🇩🇪 Germany" },
  { value:"Singapore",       label:"🇸🇬 Singapore" },
];

function ProjectsInput({ onSubmit, onClearSeen }) {
  const [botStep,  setBotStep]  = useState(1);
  const [service,  setService]  = useState("");
  const [svcInput, setSvcInput] = useState("");
  const [country,  setCountry]  = useState("global");
  const [recency,  setRecency]  = useState("week");
  const [error,    setError]    = useState("");

  const PROJECT_CATEGORIES = [
    "Website Design","App Development","Logo Design","SEO / Digital Marketing",
    "Video Editing","Content Writing","Social Media Management","UI/UX Design",
    "Mobile App","E-commerce Store","WordPress Website","Graphic Design",
    "Data Entry","Virtual Assistant","Accounting / Finance","Legal Services",
  ];

  const COUNTRIES = ["global","india","usa","uk","uae","australia","canada","singapore","germany"];

  function handleStep1() {
    const s = svcInput.trim() || service.trim();
    if (!s) { setError("Category required"); return; }
    setService(s); setError(""); setBotStep(2);
  }

  function handleSubmit() {
    if (!service.trim()) { setError("Category required"); return; }
    setError("");
    onSubmit(service.trim(), country, recency);
  }

  return (
    <ToolCard>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:"rgba(124,58,237,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>📋</div>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:"#fff" }}>Projects</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>Find startups, individuals, companies who want work done - direct link + contact</div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:22, padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
        {["Category","Filters","Confirm"].map((label,i) => (
          <div key={label} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background: botStep>i+1?"#22c55e":botStep===i+1?T.accent:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.3)" }}>{botStep>i+1?"✓":i+1}</div>
              <span style={{ fontSize:12, fontWeight:botStep===i+1?600:400, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.35)" }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)", margin:"0 8px" }} />}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {botStep === 1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"10px 14px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>What type of projects are you looking for?</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Searches across Reddit, IndieHackers, HackerNews, and ProductHunt</div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            <input value={svcInput} onChange={e => { setSvcInput(e.target.value); setError(""); }}
              onKeyDown={e => e.key==="Enter" && handleStep1()} autoFocus
              placeholder="e.g. website design, logo, app development, SEO..."
              style={{ ...inp, fontSize:14, marginBottom:10 }}
              onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
              {PROJECT_CATEGORIES.map(s => (
                <button key={s} onClick={() => setSvcInput(s)}
                  style={{ fontSize:11, padding:"4px 10px", borderRadius:20, cursor:"pointer",
                    background: svcInput===s?"rgba(124,58,237,0.15)":"rgba(255,255,255,0.04)",
                    border: svcInput===s?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                    color: svcInput===s?T.accent:"rgba(255,255,255,0.5)" }}>{s}</button>
              ))}
            </div>
            {error && <div style={{ color:"#f87171", fontSize:12, marginBottom:8 }}>{error}</div>}
            <PrimaryButton onClick={handleStep1} disabled={!svcInput.trim()}>Next: Filters →</PrimaryButton>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {botStep === 2 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:8, alignItems:"center" }}>
            <div style={{ background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:"12px 4px 12px 12px", padding:"7px 13px" }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.accent }}>{service}</span>
            </div>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>👤</div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"10px 14px", flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:3 }}>Set filters</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Country + post recency</div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            {/* Country */}
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>Country</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {COUNTRIES.map(c => (
                  <button key={c} onClick={() => setCountry(c)}
                    style={{ fontSize:12, padding:"5px 12px", borderRadius:20, cursor:"pointer", textTransform:"capitalize",
                      background: country===c?"rgba(124,58,237,0.15)":"rgba(255,255,255,0.04)",
                      border: country===c?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                      color: country===c?T.accent:"rgba(255,255,255,0.55)" }}>{c}</button>
                ))}
              </div>
            </div>
            {/* Recency */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>Post Age</div>
              <div style={{ display:"flex", gap:8 }}>
                {[{v:"day",l:"Today"},{v:"week",l:"This Week"},{v:"any",l:"Any Time"}].map(r => (
                  <button key={r.v} onClick={() => setRecency(r.v)}
                    style={{ padding:"7px 16px", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:600,
                      background: recency===r.v?"rgba(124,58,237,0.15)":"rgba(255,255,255,0.04)",
                      border: recency===r.v?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.12)",
                      color: recency===r.v?T.accent:"rgba(255,255,255,0.5)" }}>{r.l}</button>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(1)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={() => setBotStep(3)}>Next: Confirm →</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {botStep === 3 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"12px 16px", flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:8 }}>Confirm - ready to start the search?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>📋 <strong style={{ color:"#fff" }}>Category:</strong> {service}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>🌍 <strong style={{ color:"#fff" }}>Country:</strong> {country}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>⏱️ <strong style={{ color:"#fff" }}>Posts from:</strong> {recency === "day" ? "Today only" : recency === "week" ? "This week" : "Any time"}</div>
              </div>
              <div style={{ marginTop:8, fontSize:11, color:"rgba(124,58,237,0.7)", lineHeight:1.5 }}>
                🔍 Searching Reddit, IndieHackers, HackerNews, ProductHunt, Wellfound + more
              </div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            {error && <div style={{ color:"#f87171", fontSize:12, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(2)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={handleSubmit}>📋 Find Projects</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

// Keep StartupFounderInput as alias (mode "startup-founders" still routes here)
function FreelancerLeadsInput(props) { return <ProjectsInput {...props} />; }
function StartupFounderInput(props) { return <ProjectsInput {...props} />; }

/* ── Shared processing / results for global source features ──────────────── */
function GlobalSourceProcessing({ service, source, steps }) {
  return (
    <ToolCard style={{ textAlign:"center", padding:"64px 32px" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", border:"3px solid rgba(124,58,237,0.2)", borderTopColor:T.accent, animation:"spin 0.9s linear infinite", margin:"0 auto 28px" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:8 }}>Scanning {source}...</div>
      <div style={{ fontSize:13, color:T.textMuted, marginBottom:24 }}>
        Service: <strong style={{ color:T.accent }}>{service}</strong>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:380, margin:"0 auto" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:"rgba(255,255,255,0.55)", background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"9px 14px" }}>
            {s}
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

const PLATFORM_COLORS = {
  upwork:       "#14a800",
  fiverr:       "#1dbf73",
  freelancer:   "#29b2fe",
  reddit:       "#ff4500",
  hackernews:   "#ff6600",
  producthunt:  "#da552f",
  indiehackers: "#0e2150",
  toptal:       "#204ecf",
  guru:         "#2c95e8",
  peopleperhour:"#3ab5a1",
  twitter:      "#1da1f2",
  other:        "#6b7280",
};

function GlobalSourceResults({ leads, queryLabel, featureIcon, featureName, onReset, onLoadMore, loadingMore, renderMeta, mainField, onSaveLead, savedLeadIds, savingLeadId, source = "freelancer" }) {
  const [copiedKey, setCopiedKey] = useState("");

  function copy(val, key) {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  }

  function exportCSV() {
    const headers = ["#","Name","Platform","Profile URL","Requirement","Budget","Email","Phone","Website","Location"];
    const rows = leads.map((l, i) => [
      i + 1,
      `"${(l.name || l.username || "").replace(/"/g,'""')}"`,
      l.platform || "",
      l.profileUrl || "",
      `"${(l[mainField] || l.requirement || "").replace(/"/g,'""')}"`,
      l.budget || "",
      l.email || "",
      l.phone || "",
      l.website || "",
      l.location || "",
    ]);
    const csv  = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), {
      href: url,
      download: `${featureName.replace(/\s+/g,"_").toLowerCase()}_${new Date().toISOString().slice(0,10)}.csv`,
    }).click();
    URL.revokeObjectURL(url);
  }

  if (leads.length === 0) {
    return (
      <ToolCard style={{ textAlign:"center", padding:"48px 32px" }}>
        <div style={{ fontSize:40, marginBottom:16 }}>🔍</div>
        <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:8 }}>No leads found</div>
        <div style={{ fontSize:14, color:T.textMuted, marginBottom:24 }}>Try a different service keyword and search again.</div>
        <button onClick={onReset} style={{ padding:"10px 24px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700, background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)", color:T.accent }}>
          ← New Search
        </button>
      </ToolCard>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <span style={{ fontSize:17, fontWeight:800, color:"#fff" }}>{featureIcon} {leads.length} {featureName}</span>
          {queryLabel && <span style={{ fontSize:13, color:T.textMuted, marginLeft:10 }}>{queryLabel}</span>}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={exportCSV}
            style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:700, padding:"7px 16px", borderRadius:10, cursor:"pointer", background:"linear-gradient(135deg,#7c3aed,#5b21b6)", border:"none", color:"#fff" }}>
            ⬇ Export CSV
          </button>
          <button onClick={onReset} style={ghostBtn}>← New Search</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:14 }}>
        {leads.map((lead, idx) => {
          const plat     = lead.platform || "other";
          const platColor = PLATFORM_COLORS[plat] || PLATFORM_COLORS.other;
          const meta     = renderMeta ? renderMeta(lead) : [];
          const displayName = lead.name || lead.username || `User ${idx + 1}`;

          return (
            <div key={idx}
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:18, display:"flex", flexDirection:"column", gap:11, transition:"border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(124,58,237,0.35)"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}>

              {/* Header */}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.3 }}>{displayName}</div>
                  {lead.username && lead.name && lead.name !== lead.username && (
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:2 }}>@{lead.username}</div>
                  )}
                </div>
                <span style={{ fontSize:11, padding:"2px 9px", borderRadius:20, background:`${platColor}18`, border:`1px solid ${platColor}44`, color:platColor, fontWeight:700, flexShrink:0, textTransform:"capitalize" }}>
                  {plat}
                </span>
              </div>

              {/* Meta chips */}
              {meta.length > 0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {meta.map((m, mi) => (
                    <span key={mi} style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.65)" }}>
                      {m.icon} {m.val}
                    </span>
                  ))}
                </div>
              )}

              {/* Requirement */}
              {(lead[mainField] || lead.requirement) && (
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", lineHeight:1.6, background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"8px 12px" }}>
                  {(lead[mainField] || lead.requirement).slice(0, 180)}{(lead[mainField] || lead.requirement).length > 180 ? "..." : ""}
                </div>
              )}

              {/* Location */}
              {lead.location && (
                <div style={{ fontSize:12, color:T.textMuted }}>📍 {lead.location}</div>
              )}

              {/* Contact info */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {lead.phone && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <a href={`tel:${lead.phone}`} style={{ fontSize:12, color:T.accent, textDecoration:"none", fontWeight:600 }}>📞 {lead.phone}</a>
                    <button onClick={() => copy(lead.phone, `ph-${idx}`)}
                      style={{ fontSize:11, padding:"3px 9px", borderRadius:6, cursor:"pointer", background: copiedKey===`ph-${idx}` ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)", border:`1px solid ${copiedKey===`ph-${idx}` ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`, color: copiedKey===`ph-${idx}` ? "#3b82f6" : "rgba(255,255,255,0.35)" }}>
                      {copiedKey===`ph-${idx}` ? "✓" : "📋"}
                    </button>
                  </div>
                )}
                {lead.email && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:12, color:"#60a5fa", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>✉ {lead.email}</span>
                    <button onClick={() => copy(lead.email, `em-${idx}`)}
                      style={{ flexShrink:0, fontSize:11, padding:"3px 9px", borderRadius:6, cursor:"pointer", background: copiedKey===`em-${idx}` ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)", border:`1px solid ${copiedKey===`em-${idx}` ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`, color: copiedKey===`em-${idx}` ? "#3b82f6" : "rgba(255,255,255,0.35)" }}>
                      {copiedKey===`em-${idx}` ? "✓" : "📋"}
                    </button>
                  </div>
                )}
                {lead.website && (
                  <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize:12, color:"#3b82f6", textDecoration:"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    🌐 {lead.website.replace(/^https?:\/\//,"").replace(/\/$/,"")}
                  </a>
                )}
              </div>

              {/* View Post button */}
              {lead.profileUrl && (
                <a href={lead.profileUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display:"block", textAlign:"center", fontSize:12, padding:"9px 0", borderRadius:9, fontWeight:700, background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent, textDecoration:"none" }}>
                  🔗 View Post / Profile
                </a>
              )}

              {onSaveLead && (
                <SaveLeadButton
                  lid={lead.profileUrl || displayName}
                  onSave={() => onSaveLead({ ...lead, business_name: displayName, source })}
                  savedLeadIds={savedLeadIds}
                  savingLeadId={savingLeadId}
                />
              )}
            </div>
          );
        })}
      </div>

      {onLoadMore && (
        <div style={{ textAlign:"center" }}>
          <button onClick={onLoadMore} disabled={loadingMore}
            style={{ padding:"11px 36px", borderRadius:12, cursor: loadingMore ? "not-allowed" : "pointer", fontSize:14, fontWeight:700,
              background: loadingMore ? "rgba(255,255,255,0.04)" : "rgba(124,58,237,0.12)",
              border:`1.5px solid ${loadingMore ? "rgba(255,255,255,0.08)" : "rgba(124,58,237,0.35)"}`,
              color: loadingMore ? T.textMuted : T.accent }}>
            {loadingMore ? "Loading..." : "🔄 Load More Leads"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SAVED LEADS VIEW
════════════════════════════════════════════════════════════════════════════ */
function EnrichedDetailModal({ lead, onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);
  function copy(text, key) { navigator.clipboard?.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 2000); }
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:1100, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:18, width:"100%", maxWidth:600, maxHeight:"92vh", overflowY:"auto", padding:28, position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:16, background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:22, cursor:"pointer" }}>✕</button>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{lead.businessName || lead.name}</div>
            {lead.industry && <div style={{ fontSize:12, color:T.accent, marginTop:2 }}>{lead.industry}</div>}
          </div>
          {lead.aiLeadScore && <span style={{ marginLeft:"auto", fontSize:18, fontWeight:900, color:"#f59e0b", background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:10, padding:"4px 12px" }}>🔥 {lead.aiLeadScore}/10</span>}
        </div>
        {lead.aiSummary && (
          <div style={{ background:"rgba(59,130,246,0.07)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#3b82f6", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>AI Summary</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.8)", lineHeight:1.65 }}>{lead.aiSummary}</div>
          </div>
        )}
        {lead.aiPainPoints?.length > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Pain Points</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {lead.aiPainPoints.map((p, i) => (
                <span key={i} style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", color:"#f87171" }}>{p}</span>
              ))}
            </div>
          </div>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[
            { label:"Best Channel", val:lead.aiBestChannel },
            { label:"Best Time",    val:lead.aiBestTime },
            { label:"Urgency",      val:lead.urgency },
            { label:"Company Size", val:lead.companySize },
          ].filter(x => x.val).map(x => (
            <div key={x.label} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 14px" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>{x.label}</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", textTransform:"capitalize" }}>{x.val}</div>
            </div>
          ))}
        </div>
        {lead.aiOutreachEmail && (
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:0.5 }}>Outreach Email</span>
              <button onClick={() => copy(lead.aiOutreachEmail, "email")} style={{ fontSize:11, padding:"3px 10px", borderRadius:6, cursor:"pointer", background: copiedKey==="email" ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)", border:`1px solid ${copiedKey==="email" ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`, color: copiedKey==="email" ? "#3b82f6" : "rgba(255,255,255,0.35)" }}>{copiedKey==="email" ? "✓ Copied" : "Copy"}</button>
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", lineHeight:1.7, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"12px 14px", whiteSpace:"pre-wrap" }}>{lead.aiOutreachEmail}</div>
          </div>
        )}
        {lead.aiOutreachWhatsapp && (
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:0.5 }}>WhatsApp Message</span>
              <button onClick={() => copy(lead.aiOutreachWhatsapp, "wa")} style={{ fontSize:11, padding:"3px 10px", borderRadius:6, cursor:"pointer", background: copiedKey==="wa" ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)", border:`1px solid ${copiedKey==="wa" ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`, color: copiedKey==="wa" ? "#22c55e" : "rgba(255,255,255,0.35)" }}>{copiedKey==="wa" ? "✓ Copied" : "Copy"}</button>
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", lineHeight:1.7, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"12px 14px", whiteSpace:"pre-wrap" }}>{lead.aiOutreachWhatsapp}</div>
          </div>
        )}
        {lead.aiNotes && (
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:10, padding:"10px 14px" }}>
            <span style={{ color:"#f59e0b", fontWeight:700 }}>💡 Note: </span>{lead.aiNotes}
          </div>
        )}
      </div>
    </div>
  );
}
export {
  GLOBAL_SERVICES, GLOBAL_COUNTRIES,
  ProjectsInput, FreelancerLeadsInput, StartupFounderInput,
  GlobalSourceProcessing, GlobalSourceResults, EnrichedDetailModal,
};

