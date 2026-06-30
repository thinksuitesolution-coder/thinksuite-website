import { useState } from "react";
import { ToolCard, PrimaryButton, T } from "@/app/dashboard/lead-generation/_shell";
import { STATES, STATE_CITIES } from "@/lib/frontend/constants";
import { exportWebsiteLeadsCSV } from "@/lib/frontend/exporters";
import { SaveLeadButton } from "./SaveLeadButton";
import { LeadMsgModal } from "./GoogleMaps";

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
   WEBSITE LEADS COMPONENTS  (AI-powered natural language search)
════════════════════════════════════════════════════════════════════════════ */
// exportWebsiteLeadsCSV — moved to lib/frontend/exporters.js

const WL_NICHE_SUGGESTIONS = [
  "Restaurant owners", "IT companies", "CA firms", "Real estate brokers",
  "Hospital / Clinic owners", "Coaching institutes", "Hotel / Resort owners",
  "Manufacturing companies", "Interior designers", "Wedding planners",
];

const WL_POPULAR_LOCATIONS = ["Mumbai","Delhi","Bangalore","Pune","Hyderabad","Chennai"];
const WL_WHAT_YOU_GET = [
  { label:"Business Name" },
  { label:"Website" },
  { label:"Email (if available)" },
  { label:"Phone Number" },
  { label:"Address / Location" },
  { label:"Social Links" },
  { label:"AI Enriched Data", badge:"NEW" },
];
const WL_SAMPLE_LEADS = [
  { name:"ThinKSuite Technologies", cat:"IT Services", site:"https://thinksuite.com", phone:"9876543210", email:"info@thinksuite.com", loc:"Gurgaon, Haryana" },
  { name:"AutomationX Solutions",   cat:"IT Services", site:"https://automationx.in",  phone:"9812345678", email:"hello@automationx.in", loc:"Mumbai, Maharashtra" },
];

export function WebsiteLeadsInput({ onSubmit, quota }) {
  const [botStep,              setBotStep]             = useState(1); // 1=niche 2=location 3=confirm
  const [niche,                setNiche]               = useState("");
  const [nicheInput,           setNicheInput]          = useState("");
  const [selectedState,        setSelectedState]       = useState("");
  const [selectedCity,         setSelectedCity]        = useState("");
  const [area,                 setArea]                = useState("");
  const [error,                setError]               = useState("");
  const [count,                setCount]               = useState(20);
  const [aiInstructions,       setAiInstructions]      = useState("");
  const [showAiInstructions,   setShowAiInstructions]  = useState(false);

  const cities = selectedState ? (STATE_CITIES[selectedState] || []) : [];

  const WL_BOT_NICHES = ["CA Firms","Restaurant owners","IT companies","Hotel owners","Clinic & Hospitals","Gym & Fitness","Real Estate Agents","Law Firms","Salon & Beauty","Coaching Institutes","E-commerce brands","Digital Marketing Agencies"];

  function handleNicheConfirm() {
    const n = nicheInput.trim() || niche.trim();
    if (!n) { setError("Business type required"); return; }
    setNiche(n); setError(""); setBotStep(2);
  }

  function handleLocationConfirm() {
    setBotStep(3);
  }

  function handleFinalSubmit() {
    if (!niche.trim()) { setError("Business type required"); return; }
    setError("");
    onSubmit(niche.trim(), selectedState, selectedCity, area.trim(), count, aiInstructions.trim());
  }

  const wlQ = quota || { used: 0, remaining: 350, limit: 350 };

  return (
    <ToolCard>
      {/* Progress Steps */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:20, padding:"12px 16px", background:"rgba(255,255,255,0.04)", borderRadius:12 }}>
        {[{n:1,label:"Niche",sub:"What are you looking for"},{n:2,label:"Location",sub:"Where to search"},{n:3,label:"Confirm",sub:"Review & Search"}].map((step,i) => (
          <div key={step.n} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:28, height:28, borderRadius:"50%",
                background: botStep > i+1 ? "#22c55e" : botStep === i+1 ? T.accent : "rgba(255,255,255,0.08)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700,
                color: botStep >= i+1 ? "#fff" : "rgba(255,255,255,0.3)", flexShrink:0 }}>
                {botStep > i+1 ? "✓" : step.n}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight: botStep===i+1 ? 600 : 400, color: botStep>=i+1 ? "#fff" : "rgba(255,255,255,0.35)", whiteSpace:"nowrap", lineHeight:1.2 }}>{step.label}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", whiteSpace:"nowrap" }}>{step.sub}</div>
              </div>
            </div>
            {i < 2 && <div style={{ flex:1, height:1, background: botStep > i+1 ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)", margin:"0 8px" }} />}
          </div>
        ))}
      </div>

      {/* BOT STEP 1 - Niche */}
      {botStep === 1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:"4px 14px 14px 14px", padding:"14px 18px", maxWidth:460 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:4 }}>What type of business leads do you need?</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>Type a category or choose from the list below</div>
            </div>
          </div>
          <div style={{ paddingLeft:48 }}>
            <div style={{ position:"relative", marginBottom:12 }}>
              <input
                value={nicheInput}
                onChange={e => { setNicheInput(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleNicheConfirm()}
                placeholder="e.g. CA firms, Restaurant owners, IT companies..."
                autoFocus
                style={{ ...inp, fontSize:14 }}
                onFocus={e => e.target.style.borderColor=T.accent}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"}
              />
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:16 }}>
              {WL_BOT_NICHES.map(s => (
                <button key={s} onClick={() => { setNicheInput(s); setNiche(s); }}
                  style={{ fontSize:12, padding:"5px 12px", borderRadius:20, cursor:"pointer",
                    background: (nicheInput===s||niche===s) ? `${T.accent}18` : "rgba(255,255,255,0.04)",
                    border: (nicheInput===s||niche===s) ? `1.5px solid ${T.accent}` : "1px solid rgba(255,255,255,0.1)",
                    color: (nicheInput===s||niche===s) ? T.accent : "rgba(255,255,255,0.55)", fontWeight: (nicheInput===s||niche===s) ? 600 : 400 }}>
                  {s}
                </button>
              ))}
            </div>
            {error && <div style={{ color:"#f87171", fontSize:13, marginBottom:8 }}>{error}</div>}
            <PrimaryButton onClick={handleNicheConfirm} disabled={!nicheInput.trim() && !niche.trim()}>
              Next: Location →
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* BOT STEP 2 - Location */}
      {botStep === 2 && (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          {/* Confirmed niche bubble */}
          <div style={{ display:"flex", gap:12, alignItems:"flex-start", justifyContent:"flex-end" }}>
            <div style={{ background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", borderRadius:"14px 4px 14px 14px", padding:"10px 16px" }}>
              <div style={{ fontSize:13, fontWeight:600, color:T.accent }}>{niche}</div>
            </div>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>👤</div>
          </div>
          {/* Bot question */}
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:"4px 14px 14px 14px", padding:"14px 18px", maxWidth:460 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:4 }}>Which city or state?</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>A location helps narrow down your results. You can skip this too.</div>
            </div>
          </div>
          <div style={{ paddingLeft:48 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
              <select value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedCity(""); }}
                style={{ ...inp, cursor:"pointer", fontSize:12 }}>
                <option value="">Select State</option>
                {STATES.map(s => <option key={s} value={s} style={{ color:"#111", background:"#fff" }}>{s}</option>)}
              </select>
              {selectedState ? (
                <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} style={{ ...inp, cursor:"pointer", fontSize:12 }}>
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c} value={c} style={{ color:"#111", background:"#fff" }}>{c}</option>)}
                </select>
              ) : (
                <input value={selectedCity} onChange={e => setSelectedCity(e.target.value)} placeholder="Type City (optional)" style={{ ...inp, fontSize:12 }}
                  onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
              )}
              <input value={area} onChange={e => setArea(e.target.value)} placeholder="Area/Locality (optional)" style={{ ...inp, fontSize:12 }}
                onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(1)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={handleLocationConfirm}>Next: Confirm →</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* BOT STEP 3 - Confirm */}
      {botStep === 3 && (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          {/* Bot summary */}
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:"4px 14px 14px 14px", padding:"14px 18px", flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:8 }}>Confirm - start the search?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>🎯 <strong style={{ color:"#fff" }}>Niche:</strong> {niche}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>📍 <strong style={{ color:"#fff" }}>Location:</strong> {[area,selectedCity,selectedState].filter(Boolean).join(", ") || "Pan India"}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>📊 <strong style={{ color:"#fff" }}>Leads:</strong> {count} leads</div>
              </div>
            </div>
          </div>

          <div style={{ paddingLeft:48 }}>
            {/* Count selector */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>How many leads do you need?</div>
              <div style={{ display:"flex", gap:8 }}>
                {[5, 10, 20].map(n => (
                  <button key={n} onClick={() => setCount(n)}
                    style={{ padding:"8px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
                      background: count===n ? `${T.accent}18` : "rgba(255,255,255,0.05)",
                      border: `1.5px solid ${count===n ? T.accent : "rgba(255,255,255,0.12)"}`,
                      color: count===n ? T.accent : "rgba(255,255,255,0.55)" }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Special instructions */}
            <div style={{ marginBottom:14, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, overflow:"hidden" }}>
              <button onClick={() => setShowAiInstructions(v => !v)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.6)", fontSize:12 }}>
                <span style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <span>⚙️</span>
                  <span style={{ fontWeight:600 }}>Special Instructions</span>
                  <span style={{ fontSize:10, background:"rgba(124,58,237,0.2)", color:"#a78bfa", padding:"1px 7px", borderRadius:10, fontWeight:700 }}>OPTIONAL</span>
                  {aiInstructions.trim() && <span style={{ fontSize:10, color:"#4ade80" }}>● Active</span>}
                </span>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{showAiInstructions ? "▲" : "▼"}</span>
              </button>
              {showAiInstructions && (
                <div style={{ padding:"0 14px 14px" }}>
                  <textarea value={aiInstructions} onChange={e => setAiInstructions(e.target.value)}
                    placeholder="e.g. Only B2B companies, Only with email, Only proprietorship firms..."
                    rows={3}
                    style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#fff", fontSize:12, padding:"10px 12px", resize:"vertical", outline:"none", lineHeight:1.6, boxSizing:"border-box" }}
                  />
                </div>
              )}
            </div>

            {error && <div style={{ color:"#f87171", fontSize:13, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(2)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={handleFinalSubmit}>🔍 Search Leads</PrimaryButton>
            </div>

            <div style={{ marginTop:12, fontSize:12, color:"rgba(255,255,255,0.35)" }}>
              {wlQ.remaining} leads remaining this month · {wlQ.used}/{wlQ.limit || 350} used
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

export function WebsiteLeadsProcessing({ niche, city, state, count = 20 }) {
  return (
    <ToolCard style={{ textAlign: "center", padding: "64px 32px" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid rgba(124,58,237,0.2)`, borderTopColor: T.accent, animation: "spin 0.9s linear infinite", margin: "0 auto 28px" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>AI is searching for leads...</div>
      <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 24 }}>
        <strong style={{ color:T.accent }}>{niche}</strong> · <strong style={{ color:T.accent }}>{city}</strong>{state ? `, ${state}` : ""}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 360, margin: "0 auto" }}>
        {[
          "🧠 AI identifying relevant directories",
          "🌐 Crawling multiple websites",
          "🤖 MyThinkAI filtering & extracting contacts",
          `📦 Preparing ${count} lead cards`,
        ].map(item => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: T.textMuted, textAlign: "left" }}>
            {item}
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

export function LeadInfoModal({ lead, onClose }) {
  const [copied, setCopied] = useState(null);
  function copy(val, key) {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }
  const row = (label, val, copyKey) => val ? (
    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div>
        <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 13, color: "#fff", fontWeight: 500, lineHeight: 1.5 }}>{val}</div>
      </div>
      {copyKey && (
        <button onClick={() => copy(val, copyKey)}
          style={{ flexShrink: 0, fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer",
            background: copied === copyKey ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${copied === copyKey ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`,
            color: copied === copyKey ? "#3b82f6" : "rgba(255,255,255,0.4)" }}>
          {copied === copyKey ? "✓" : "Copy"}
        </button>
      )}
    </div>
  ) : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, width: "100%", maxWidth: 520, padding: 28, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}>✕</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🏢</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{lead.name}</div>
            {lead.category && <div style={{ fontSize: 12, color: T.accent, marginTop: 2 }}>{lead.category}</div>}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {row("📞 Phone", lead.phone, "phone")}
          {row("📧 Email", lead.email, "email")}
          {row("📍 Location", lead.location)}
          {row("🏠 Address", lead.address)}
          {lead.website && (
            <div style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 3 }}>🌐 Website</div>
              <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, color: "#3b82f6", textDecoration: "none" }}>
                {lead.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            </div>
          )}
          {row("📝 About", lead.description)}
          {row("🔗 Source", lead.source)}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {lead.phone && (
            <a href={`tel:${lead.phone}`}
              style={{ flex: 1, padding: "11px 0", borderRadius: 10, textAlign: "center", fontSize: 13, fontWeight: 700, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: T.accent, textDecoration: "none" }}>
              📞 Call Now
            </a>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}`}
              style={{ flex: 1, padding: "11px 0", borderRadius: 10, textAlign: "center", fontSize: 13, fontWeight: 700, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", color: "#3b82f6", textDecoration: "none" }}>
              📧 Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function WebsiteLeadsResults({ leads, queryLabel, sourcesSearched, onReset, onLoadMore, loadingMore, aiInsight, onSaveLead, savedLeadIds, savingLeadId }) {
  const [selectedLead, setSelectedLead] = useState(null);
  const [msgLead,      setMsgLead]      = useState(null);
  const [contactOnly, setContactOnly]   = useState(true);

  const displayLeads = contactOnly ? leads.filter(l => l.phone || l.email || l.whatsapp) : leads;

  if (leads.length === 0) {
    return (
      <ToolCard style={{ textAlign: "center", padding: "48px 32px" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>😕</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>No leads found</div>
        <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 24 }}>
          Make your query more specific add city, category, or state for better results.
        </div>
        <button onClick={onReset} style={{ padding: "10px 24px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: T.accent }}>
          ← Search Again
        </button>
      </ToolCard>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {selectedLead && <LeadInfoModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
      {msgLead && <LeadMsgModal lead={{ ...msgLead, business_name: msgLead.name, city: msgLead.location }} searchCategory={queryLabel} onClose={() => setMsgLead(null)} />}

      {/* AI Insight Banner */}
      {aiInsight && (
        <div style={{ padding:"14px 18px", background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:12, display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ fontSize:20, flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:T.accent, marginBottom:4 }}>AI Insight</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", lineHeight:1.6 }}>{aiInsight}</div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{displayLeads.length} Leads Found</span>
          {queryLabel && <span style={{ fontSize: 13, color: T.textMuted, marginLeft: 10 }}>"{queryLabel}"</span>}
          {sourcesSearched > 0 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 8 }}>· {sourcesSearched} sources</span>}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => setContactOnly(v => !v)}
            style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:700, padding:"7px 13px", borderRadius:10, cursor:"pointer",
              background: contactOnly ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${contactOnly ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.12)"}`,
              color: contactOnly ? "#3b82f6" : "rgba(255,255,255,0.45)" }}>
            {contactOnly ? "✓ With Contact" : "📋 All leads"}
          </button>
          <button onClick={() => exportWebsiteLeadsCSV(displayLeads, queryLabel)}
            style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:700, padding:"7px 16px", borderRadius:10, cursor:"pointer", background:"linear-gradient(135deg,#7c3aed,#3b82f6)", border:"none", color:"#fff" }}>
            ⬇ Export CSV
          </button>
          <button onClick={onReset} style={ghostBtn}>← New Search</button>
        </div>
      </div>

      {contactOnly && displayLeads.length === 0 && leads.length > 0 && (
        <div style={{ padding:"14px 18px", background:"rgba(59,130,246,0.07)", border:"1px solid rgba(59,130,246,0.25)", borderRadius:12, fontSize:13, color:"rgba(255,255,255,0.72)" }}>
          ⚠ No leads with contact info found. Turn off the filter above to see all leads.
        </div>
      )}

      {/* Lead Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(290px, 1fr))", gap:14 }}>
        {displayLeads.map((lead, idx) => {
          const sl = lead.social_links || {};
          const waNum = lead.whatsapp || (lead.phone ? lead.phone.replace(/\D/g,"") : "");
          return (
            <div key={idx} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:14, padding:16, display:"flex", flexDirection:"column", gap:9, transition:"border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(124,58,237,0.35)"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.09)"}>

              {/* Header */}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.3 }}>{lead.name}</div>
                  {lead.owner_name && <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginTop:2 }}>👤 {lead.owner_name}</div>}
                  {lead.category && (
                    <div style={{ marginTop:5 }}>
                      <span style={{ fontSize:11, padding:"2px 8px", borderRadius:20, background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent }}>{lead.category}</span>
                    </div>
                  )}
                </div>
                <div style={{ fontSize:18, flexShrink:0 }}>🏢</div>
              </div>

              {/* Location */}
              {lead.location && <div style={{ fontSize:12, color:T.textMuted, display:"flex", alignItems:"center", gap:5 }}><span>📍</span>{lead.location}</div>}

              {/* Description */}
              {lead.description && <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.5, borderLeft:"2px solid rgba(124,58,237,0.3)", paddingLeft:8 }}>{lead.description}</div>}

              {/* Contacts */}
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {lead.phone && <div style={{ fontSize:12, color:"#60a5fa", display:"flex", alignItems:"center", gap:5 }}><span>📞</span>{lead.phone}</div>}
                {lead.whatsapp && lead.whatsapp !== lead.phone && <div style={{ fontSize:12, color:"#22c55e", display:"flex", alignItems:"center", gap:5 }}><span>💬</span>{lead.whatsapp}</div>}
                {lead.email && <div style={{ fontSize:12, color:T.accent, display:"flex", alignItems:"center", gap:5, overflow:"hidden" }}><span style={{ flexShrink:0 }}>📧</span><span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{lead.email}</span></div>}
                {lead.website && <div style={{ fontSize:11, color:"#38bdf8", display:"flex", alignItems:"center", gap:5, overflow:"hidden" }}><span style={{ flexShrink:0 }}>🌐</span><a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ color:"#38bdf8", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{lead.website.replace(/^https?:\/\/(www\.)?/,"")}</a></div>}
                {!lead.phone && !lead.email && !lead.whatsapp && !lead.website && <div style={{ fontSize:11, color:"rgba(255,255,255,0.2)", fontStyle:"italic" }}>No contact found</div>}
              </div>

              {/* Social links */}
              {(sl.instagram || sl.linkedin || sl.facebook) && (
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {sl.instagram && <a href={sl.instagram} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#f472b6", background:"rgba(244,114,182,0.08)", border:"1px solid rgba(244,114,182,0.2)", borderRadius:6, padding:"3px 8px", textDecoration:"none" }}>📸 Instagram</a>}
                  {sl.linkedin  && <a href={sl.linkedin}  target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#60a5fa", background:"rgba(96,165,250,0.08)", border:"1px solid rgba(96,165,250,0.2)", borderRadius:6, padding:"3px 8px", textDecoration:"none" }}>💼 LinkedIn</a>}
                  {sl.facebook  && <a href={sl.facebook}  target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#818cf8", background:"rgba(129,140,248,0.08)", border:"1px solid rgba(129,140,248,0.2)", borderRadius:6, padding:"3px 8px", textDecoration:"none" }}>👥 Facebook</a>}
                </div>
              )}

              {/* Actions */}
              <div style={{ display:"flex", gap:8, marginTop:"auto", flexWrap:"wrap" }}>
                <button onClick={() => setSelectedLead(lead)}
                  style={{ flex:1, minWidth:70, padding:"8px 0", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:700, background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", color:T.accent }}>
                  🔍 View Info
                </button>
                <button onClick={() => setMsgLead(lead)}
                  style={{ flex:1, minWidth:70, padding:"8px 0", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:700, background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent }}>
                  🤖 AI Msg
                </button>
                {waNum && (
                  <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"8px 12px", borderRadius:10, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", color:"#22c55e", textDecoration:"none", fontSize:12, fontWeight:700 }}>
                    💬
                  </a>
                )}
                {onSaveLead && <SaveLeadButton lid={lead.name || lead.website} onSave={() => onSaveLead({ ...lead, business_name: lead.name, source: "website" })} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId} style={{ padding:"8px 10px", borderRadius:10 }} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div style={{ textAlign:"center", paddingTop:8 }}>
        <button onClick={onLoadMore} disabled={loadingMore}
          style={{ padding:"12px 32px", borderRadius:12, cursor:loadingMore ? "not-allowed" : "pointer", fontSize:14, fontWeight:700,
            background:loadingMore ? "rgba(255,255,255,0.04)" : "rgba(124,58,237,0.1)",
            border:`1px solid ${loadingMore ? "rgba(255,255,255,0.08)" : "rgba(124,58,237,0.3)"}`,
            color:loadingMore ? "rgba(255,255,255,0.3)" : T.accent }}>
          {loadingMore ? "⏳ Searching for more leads..." : "🔄 Load More Leads"}
        </button>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", marginTop:8 }}>Each load brings fresh, verified leads</div>
      </div>
    </div>
  );
}

