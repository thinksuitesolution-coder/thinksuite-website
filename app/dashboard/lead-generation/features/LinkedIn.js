import { useState } from "react";
import { ToolCard, PrimaryButton, T } from "@/app/dashboard/lead-generation/_shell";
import { STATES, STATE_CITIES } from "@/lib/frontend/constants";
import { INTL_COUNTRIES } from "./GlobalCompanies";
import { exportLinkedInCSV } from "@/lib/frontend/exporters";
import { buildLinkedInInsight } from "@/lib/frontend/leadHelpers";
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
   LINKEDIN LEADS -INDIA (DOMESTIC)
════════════════════════════════════════════════════════════════════════════ */
const LI_JOB_TITLES_INDIA = [
  { value: "founder OR owner OR CEO",       label: "Founder / Owner / CEO",  icon: "👑" },
  { value: "director OR manager",           label: "Director / Manager",      icon: "🏢" },
  { value: "VP OR Head",                    label: "VP / Head",               icon: "⬆️" },
  { value: "sales OR business development", label: "Sales / BD",              icon: "🤝" },
  { value: "marketing",                     label: "Marketing",               icon: "📣" },
  { value: "HR OR recruiter",               label: "HR / Recruiter",          icon: "👥" },
  { value: "other",                         label: "Other",                   icon: "✏️" },
];

const LI_POPULAR_INDUSTRIES = [
  { label:"SaaS",          icon:"☁️",  bg:"rgba(59,130,246,0.18)",  iconBg:"rgba(59,130,246,0.28)"  },
  { label:"Real Estate",   icon:"🏠",  bg:"rgba(249,115,22,0.15)",  iconBg:"rgba(249,115,22,0.25)"  },
  { label:"Fintech",       icon:"₹",   bg:"rgba(234,179,8,0.15)",   iconBg:"rgba(234,179,8,0.28)"   },
  { label:"Healthcare",    icon:"❤️",  bg:"rgba(239,68,68,0.12)",   iconBg:"rgba(239,68,68,0.22)"   },
  { label:"Education",     icon:"🎓",  bg:"rgba(99,102,241,0.15)",  iconBg:"rgba(99,102,241,0.28)"  },
  { label:"Manufacturing", icon:"🏭",  bg:"rgba(107,114,128,0.15)", iconBg:"rgba(107,114,128,0.28)" },
  { label:"Retail",        icon:"🛍️", bg:"rgba(168,85,247,0.15)",  iconBg:"rgba(168,85,247,0.25)"  },
];

const LI_WHAT_YOU_GET = ["Name","Designation / Job Title","Company Name","LinkedIn Profile URL","Location","Company Website","Email (if available)","Phone (if available)","And much more..."];

const LI_POPULAR_SEARCHES = ["SaaS Founder - Bangalore","Real Estate Director - Mumbai","Marketing Head - Delhi","HR Manager - Pune","Fintech CEO - Gurgaon"];

export function LinkedInBotInput({ onSubmit, isInternational = false, onClearError = () => {} }) {
  const [botStep,         setBotStep]         = useState(1);
  const [niche,           setNiche]           = useState("");
  const [nicheInput,      setNicheInput]      = useState("");
  const [searchType,      setSearchType]      = useState("both");
  const [jobTitle,        setJobTitle]        = useState("");
  const [selectedState,   setSelectedState]   = useState("");
  const [selectedCity,    setSelectedCity]    = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [area,            setArea]            = useState("");
  const [aiInstructions,  setAiInstructions]  = useState("");
  const [showAiInst,      setShowAiInst]      = useState(false);
  const [error,           setError]           = useState("");

  const cities = selectedState ? (STATE_CITIES[selectedState] || []) : [];

  const LI_NICHES = ["CA Firms","IT Companies","Real Estate","Digital Marketing Agencies","SaaS Startups","Manufacturing","Healthcare","Legal Firms","E-commerce Brands","Financial Services","Education","HR Consulting","Logistics","Architecture","Interior Design"];
  const LI_TITLES = [
    { value:"",                                        label:"All Roles",      desc:"Everyone" },
    { value:"founder OR owner OR CEO OR MD",           label:"Founders/CEOs",  desc:"Top decision makers" },
    { value:"director OR VP OR head of",               label:"Directors/VPs",  desc:"Senior leaders" },
    { value:"manager OR senior manager OR GM",         label:"Managers",       desc:"Mid-level" },
    { value:"founder OR CEO OR director OR manager",   label:"Decision Makers",desc:"All senior roles" },
  ];

  function handleStep1() {
    const n = nicheInput.trim() || niche.trim();
    if (!n) { setError("Niche required"); return; }
    setNiche(n); setError(""); onClearError?.(); setBotStep(2);
  }

  function handleFinalSubmit() {
    if (!niche.trim()) { setError("Niche required"); return; }
    setError("");
    onSubmit(niche.trim(), selectedState, selectedCity, area.trim(), jobTitle || "founder OR owner OR CEO OR director OR manager", selectedCountry, isInternational, aiInstructions.trim(), searchType);
  }

  return (
    <ToolCard>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#0077b5,#00a0dc)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        </div>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:"#fff" }}>LinkedIn Leads {isInternational ? "(International)" : "(India)"}</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>Find decision makers with contact info, skills, company + AI insights</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", marginBottom:22, padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
        {["Niche & Type","Location","Confirm"].map((label,i) => (
          <div key={label} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background: botStep>i+1?"#22c55e":botStep===i+1?"#0077b5":"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.3)", flexShrink:0 }}>{botStep>i+1?"✓":i+1}</div>
              <span style={{ fontSize:12, fontWeight:botStep===i+1?600:400, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.3)", whiteSpace:"nowrap" }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)", margin:"0 8px" }} />}
          </div>
        ))}
      </div>
      {botStep === 1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#0077b5,#00a0dc)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(0,119,181,0.1)", border:"1px solid rgba(0,119,181,0.25)", borderRadius:"4px 14px 14px 14px", padding:"12px 16px" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:3 }}>Which industry or niche leads do you need?</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>Type a niche or choose from the popular options</div>
            </div>
          </div>
          <div style={{ paddingLeft:48 }}>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {[{v:"both",l:"Person + Company"},{v:"person",l:"Person only"},{v:"company",l:"Company only"}].map(t => (
                <button key={t.v} onClick={() => setSearchType(t.v)} style={{ flex:1, padding:"9px 0", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:600, background: searchType===t.v?"rgba(0,119,181,0.15)":"rgba(255,255,255,0.04)", border: `1.5px solid ${searchType===t.v?"#0077b5":"rgba(255,255,255,0.1)"}`, color: searchType===t.v?"#00a0dc":"rgba(255,255,255,0.55)" }}>{t.l}</button>
              ))}
            </div>
            <input value={nicheInput} onChange={e => { setNicheInput(e.target.value); setError(""); }} onKeyDown={e => e.key==="Enter" && handleStep1()} autoFocus placeholder="e.g. CA Firms, IT Companies, Real Estate..." style={{ ...inp, fontSize:14, marginBottom:12 }} onFocus={e => e.target.style.borderColor="#0077b5"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
              {LI_NICHES.map(s => (<button key={s} onClick={() => setNicheInput(s)} style={{ fontSize:11, padding:"4px 10px", borderRadius:20, cursor:"pointer", background: nicheInput===s?"rgba(0,119,181,0.15)":"rgba(255,255,255,0.04)", border: nicheInput===s?"1.5px solid #0077b5":"1px solid rgba(255,255,255,0.1)", color: nicheInput===s?"#00a0dc":"rgba(255,255,255,0.5)" }}>{s}</button>))}
            </div>
            {error && <div style={{ color:"#f87171", fontSize:13, marginBottom:8 }}>{error}</div>}
            <PrimaryButton onClick={handleStep1} disabled={!nicheInput.trim()}>Next: Location →</PrimaryButton>
          </div>
        </div>
      )}
      {botStep === 2 && (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#0077b5,#00a0dc)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(0,119,181,0.1)", border:"1px solid rgba(0,119,181,0.25)", borderRadius:"4px 14px 14px 14px", padding:"12px 16px", flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:3 }}>Location + Job Title Filter</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>Location optional. Use title filter to find exact decision makers.</div>
            </div>
          </div>
          <div style={{ paddingLeft:48 }}>
            {isInternational ? (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} style={{ ...inp, cursor:"pointer", fontSize:12 }}>
                  <option value="">Select Country (optional)</option>
                  {[...INTL_COUNTRIES].sort((a,b) => a.localeCompare(b)).map(c => <option key={c} value={c} style={{ color:"#111", background:"#fff" }}>{c}</option>)}
                </select>
                <input value={selectedCity} onChange={e => setSelectedCity(e.target.value)} placeholder="City (optional)" style={{ ...inp, fontSize:12 }} onFocus={e => e.target.style.borderColor="#0077b5"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
                <select value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedCity(""); }} style={{ ...inp, cursor:"pointer", fontSize:12 }}>
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s} value={s} style={{ color:"#111", background:"#fff" }}>{s}</option>)}
                </select>
                {selectedState ? (
                  <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} style={{ ...inp, cursor:"pointer", fontSize:12 }}>
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c} value={c} style={{ color:"#111", background:"#fff" }}>{c}</option>)}
                  </select>
                ) : (
                  <input value={selectedCity} onChange={e => setSelectedCity(e.target.value)} placeholder="City (optional)" style={{ ...inp, fontSize:12 }} onFocus={e => e.target.style.borderColor="#0077b5"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
                )}
                <input value={area} onChange={e => setArea(e.target.value)} placeholder="Area (optional)" style={{ ...inp, fontSize:12 }} onFocus={e => e.target.style.borderColor="#0077b5"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
              </div>
            )}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.6)", marginBottom:8 }}>Job Title / Role Filter</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {LI_TITLES.map(t => (
                  <button key={t.value} onClick={() => setJobTitle(t.value)} style={{ fontSize:11, padding:"5px 12px", borderRadius:20, cursor:"pointer", background: jobTitle===t.value?"rgba(0,119,181,0.15)":"rgba(255,255,255,0.04)", border: jobTitle===t.value?"1.5px solid #0077b5":"1px solid rgba(255,255,255,0.1)", color: jobTitle===t.value?"#00a0dc":"rgba(255,255,255,0.5)" }}>
                    <span style={{ fontWeight:600 }}>{t.label}</span><span style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginLeft:4 }}>{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            {error && <div style={{ color:"#f87171", fontSize:13, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(1)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={() => setBotStep(3)}>Next: Confirm →</PrimaryButton>
            </div>
          </div>
        </div>
      )}
      {botStep === 3 && (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#0077b5,#00a0dc)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(0,119,181,0.1)", border:"1px solid rgba(0,119,181,0.25)", borderRadius:"4px 14px 14px 14px", padding:"12px 16px", flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:8 }}>Confirm - ready to start the search?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>💼 <strong style={{ color:"#fff" }}>Niche:</strong> {niche}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>🔍 <strong style={{ color:"#fff" }}>Type:</strong> {searchType}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>📍 <strong style={{ color:"#fff" }}>Location:</strong> {[area,selectedCity,selectedState,selectedCountry].filter(Boolean).join(", ") || (isInternational?"Global":"Pan India")}</div>
                {jobTitle && <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>👔 <strong style={{ color:"#fff" }}>Title:</strong> {LI_TITLES.find(t=>t.value===jobTitle)?.label || jobTitle}</div>}
              </div>
            </div>
          </div>
          <div style={{ paddingLeft:48 }}>
            <div style={{ marginBottom:14, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, overflow:"hidden" }}>
              <button onClick={() => setShowAiInst(v=>!v)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.6)", fontSize:12 }}>
                <span style={{ display:"flex", alignItems:"center", gap:7 }}><span>⚙️</span><span style={{ fontWeight:600 }}>Special Instructions</span><span style={{ fontSize:10, background:"rgba(124,58,237,0.2)", color:"#a78bfa", padding:"1px 7px", borderRadius:10, fontWeight:700 }}>OPTIONAL</span>{aiInstructions.trim() && <span style={{ fontSize:10, color:"#4ade80" }}>● Active</span>}</span>
                <span style={{ fontSize:10 }}>{showAiInst?"▲":"▼"}</span>
              </button>
              {showAiInst && (
                <div style={{ padding:"0 14px 14px" }}>
                  <textarea value={aiInstructions} onChange={e => setAiInstructions(e.target.value)} placeholder="e.g. Only with email, Only fintech companies..." rows={3} style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#fff", fontSize:12, padding:"10px 12px", resize:"vertical", outline:"none", lineHeight:1.6, boxSizing:"border-box" }} />
                </div>
              )}
            </div>
            {error && <div style={{ color:"#f87171", fontSize:13, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(2)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={handleFinalSubmit}>💼 Search LinkedIn</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

export function LinkedInInputIndia({ onSubmit, onClearError }) {
  return <LinkedInBotInput onSubmit={onSubmit} isInternational={false} onClearError={onClearError} />;
}

export function LinkedInInput({ onSubmit, onClearError }) {
  return <LinkedInBotInput onSubmit={onSubmit} isInternational={true} onClearError={onClearError} />;
}

export function LinkedInProcessing({ niche, city, state }) {
  return (
    <ToolCard style={{ textAlign:"center", padding:"64px 32px" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", border:"3px solid rgba(59,130,246,0.2)", borderTopColor:"#3b82f6", animation:"spin 0.9s linear infinite", margin:"0 auto 28px" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:8 }}>Searching for LinkedIn Leads...</div>
      <div style={{ fontSize:13, color:T.textMuted, marginBottom:24 }}>
        <strong style={{ color:"#4a9edd" }}>{niche}</strong>
        {city && <> · <strong style={{ color:"#4a9edd" }}>{city}</strong></>}
        {state && <>, {state}</>}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:360, margin:"0 auto" }}>
        {[
          "🔍 Searching LinkedIn profiles",
          "🤖 MyThinkAI extracting name, title, and company",
          "📧 Looking up email and phone",
          "📦 Preparing lead cards",
        ].map((s, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:"rgba(255,255,255,0.55)", background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"9px 14px" }}>
            {s}
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ── Social Lead Message Modal (LinkedIn + Instagram) ─────────────────────── */
export function SocialMsgModal({ lead, leadType, searchCategory, onClose }) {
  const [step, setStep]         = useState("services");
  const [services, setServices] = useState("");
  const [msgs, setMsgs]         = useState(null);
  const [error, setError]       = useState("");
  const [tab, setTab]           = useState("english");
  const [copied, setCopied]     = useState(false);
  const [extraCtx, setExtraCtx] = useState("");
  const [showCustomize, setShowCustomize] = useState(false);

  const displayName = leadType === "linkedin"
    ? (lead.name || lead.linkedinId || "LinkedIn Profile")
    : (lead.name || `@${lead.handle}` || "Instagram Profile");

  function generateMsg(extra = "") {
    if (!services.trim()) return;
    setStep("loading");
    setError("");
    fetch("/api/lead-gen/social-lead-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead, leadType, userServices: services, searchCategory, extraContext: extra }),
    })
      .then(r => safeJson(r))
      .then(d => { if (d.error) throw new Error(d.error); setMsgs(d); setStep("result"); setShowCustomize(false); })
      .catch(e => { setError(e.message); setStep("services"); });
  }

  const text = msgs?.[tab] || "";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, width:"100%", maxWidth:560, padding:28, position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:20, cursor:"pointer", lineHeight:1 }}>✕</button>
        <div style={{ fontSize:15, fontWeight:800, color:"#fff", marginBottom:4 }}>🤖 AI Outreach Message</div>
        <div style={{ fontSize:12, color:T.textMuted, marginBottom:20 }}>
          {leadType === "linkedin" ? "💼" : "📸"} {displayName}
          {lead.location && ` · ${lead.location}`}
        </div>

        {step === "services" && (
          <>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.75)", display:"block", marginBottom:8 }}>
                What services / products do you offer? *
              </label>
              <textarea
                value={services}
                onChange={e => setServices(e.target.value)}
                placeholder="e.g. Website design, SEO, social media management&#10;or e.g. CA firm – tax filing, GST, audit services&#10;or e.g. Gym equipment supply & installation"
                rows={3}
                style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", resize:"vertical", lineHeight:1.6, fontFamily:"inherit" }}
                onFocus={e => e.target.style.borderColor=T.accent}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"}
                onKeyDown={e => e.key === "Enter" && e.ctrlKey && generateMsg()}
              />
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:6 }}>AI will generate a personalized message based on this</div>
            </div>
            {error && <div style={{ color:"#f87171", fontSize:13, marginBottom:12 }}>{error}</div>}
            <button
              onClick={() => generateMsg()}
              disabled={!services.trim()}
              style={{ width:"100%", padding:"11px 0", borderRadius:10, cursor: services.trim() ? "pointer" : "not-allowed", fontSize:13, fontWeight:700, background: services.trim() ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)", border:`1px solid ${services.trim() ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.08)"}`, color: services.trim() ? T.accent : "rgba(255,255,255,0.25)", transition:"all 0.15s" }}>
              🚀 Generate Message
            </button>
          </>
        )}

        {step === "loading" && (
          <div style={{ textAlign:"center", padding:"40px 0", color:T.textMuted }}>
            <div style={{ width:36, height:36, border:`3px solid rgba(124,58,237,0.2)`, borderTopColor:T.accent, borderRadius:"50%", animation:"spin 0.9s linear infinite", margin:"0 auto 14px" }} />
            Generating message...
          </div>
        )}

        {step === "result" && msgs && (
          <>
            <div style={{ display:"flex", gap:8, marginBottom:18 }}>
              {[["english","🇬🇧 English"],["hinglish","Casual English"]].map(([key, label]) => (
                <button key={key} onClick={() => { setTab(key); setCopied(false); }}
                  style={{ flex:1, padding:"9px 0", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
                    border: tab===key ? `1.5px solid ${T.accent}` : "1px solid rgba(255,255,255,0.1)",
                    background: tab===key ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)",
                    color: tab===key ? T.accent : "rgba(255,255,255,0.45)" }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:18, fontSize:14, color:"rgba(255,255,255,0.85)", lineHeight:1.8, whiteSpace:"pre-wrap", minHeight:120, marginBottom:14 }}>
              {text}
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              <button onClick={() => { setStep("services"); setMsgs(null); setCopied(false); setShowCustomize(false); setExtraCtx(""); }}
                style={{ padding:"11px 0", flex:"0 0 110px", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:700, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)" }}>
                ← Change
              </button>
              <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ flex:1, padding:"11px 0", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700, background: copied ? "rgba(59,130,246,0.15)" : "rgba(124,58,237,0.1)", border:`1px solid ${copied ? "rgba(59,130,246,0.4)" : "rgba(124,58,237,0.25)"}`, color: copied ? "#3b82f6" : T.accent }}>
                {copied ? "✓ Copied!" : "📋 Copy Message"}
              </button>
            </div>
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:12 }}>
              <button onClick={() => setShowCustomize(v => !v)}
                style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.45)", background:"none", border:"none", cursor:"pointer", padding:0, marginBottom: showCustomize ? 10 : 0 }}>
                {showCustomize ? "▲ Hide customize" : "✏️ Customize & Regenerate"}
              </button>
              {showCustomize && (
                <>
                  <textarea
                    value={extraCtx}
                    onChange={e => setExtraCtx(e.target.value)}
                    placeholder="Add specifics – e.g. offer 20% discount, mention free demo, focus on Instagram growth, avoid mentioning price..."
                    rows={3}
                    style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", resize:"vertical", lineHeight:1.6, fontFamily:"inherit", marginBottom:10 }}
                    onFocus={e => e.target.style.borderColor=T.accent}
                    onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"}
                  />
                  <button
                    onClick={() => generateMsg(extraCtx)}
                    disabled={!extraCtx.trim()}
                    style={{ width:"100%", padding:"10px 0", borderRadius:10, cursor: extraCtx.trim() ? "pointer" : "not-allowed", fontSize:13, fontWeight:700, background: extraCtx.trim() ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)", border:`1px solid ${extraCtx.trim() ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.08)"}`, color: extraCtx.trim() ? "#7c3aed" : "rgba(255,255,255,0.25)", transition:"all 0.15s" }}>
                    🔄 Regenerate with this context
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── LinkedIn AI Insight Modal ─────────────────────────────────────────────── */
// buildLinkedInInsight — moved to lib/frontend/leadHelpers.js

export function LinkedInInsightModal({ lead, onClose }) {
  const insight = buildLinkedInInsight(lead);
  const profileUrl = lead.profileUrl || `https://www.linkedin.com/in/${lead.linkedinId}/`;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, width:"100%", maxWidth:560, padding:28, position:"relative", maxHeight:"90vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:20, cursor:"pointer", lineHeight:1 }}>✕</button>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"rgba(59,130,246,0.12)", border:"1px solid rgba(59,130,246,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>AI Lead Insight</div>
            <div style={{ fontSize:12, color:"#4a9edd" }}>{lead.name || lead.linkedinId}</div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Profile Details</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {lead.title && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Job Title</div><div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>{lead.title}</div></div>}
            {lead.company && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Company</div><div style={{ fontSize:13, color:"#fff" }}>{lead.company}</div></div>}
            {lead.location && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Location</div><div style={{ fontSize:13, color:"#fff" }}>{lead.location}</div></div>}
            {lead.email && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Email</div><div style={{ fontSize:13, color:T.accent, fontWeight:600 }}>{lead.email}</div></div>}
          </div>
          {lead.bio && (
            <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:11, color:T.textMuted, marginBottom:4 }}>About</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>{lead.bio}</div>
            </div>
          )}
        </div>
        <div style={{ background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#4a9edd", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>🤖 AI Analysis</div>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.82)", lineHeight:1.8, margin:0 }}>{insight}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {lead.email && <a href={`mailto:${lead.email}`} style={{ flex:1, padding:"11px 0", borderRadius:10, textAlign:"center", fontSize:13, fontWeight:700, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.25)", color:"#4a9edd", textDecoration:"none" }}>📧 Email</a>}
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" style={{ flex:1, padding:"11px 0", borderRadius:10, textAlign:"center", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", textDecoration:"none" }}>↗ LinkedIn</a>
        </div>
      </div>
    </div>
  );
}

// buildInstagramInsight — moved to lib/frontend/leadHelpers.js


export function LinkedInResults({ leads, queryLabel, niche, onReset, onLoadMore, loadingMore, onSaveLead, savedLeadIds, savingLeadId, aiInsight }) {
  const [copiedKey,   setCopiedKey]   = useState(null);
  const [msgLead,     setMsgLead]     = useState(null);
  const [insightLead, setInsightLead] = useState(null);
  const [dismissed,   setDismissed]   = useState(new Set());

  function copy(val, key) {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }
  function dismiss(i) { setDismissed(prev => new Set([...prev, i])); }

  const visibleLeads = leads.reduce((acc, lead, i) => {
    if (!dismissed.has(i)) acc.push({ lead, origIdx: i });
    return acc;
  }, []);

  if (leads.length === 0) {
    return (
      <ToolCard style={{ textAlign:"center", padding:"48px 32px" }}>
        <div style={{ fontSize:40, marginBottom:16 }}>😕</div>
        <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:8 }}>No leads found</div>
        <div style={{ fontSize:14, color:T.textMuted, marginBottom:24 }}>Try a slightly different niche or location and search again.</div>
        <button onClick={onReset} style={{ padding:"10px 24px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700, background:"rgba(59,130,246,0.12)", border:"1px solid rgba(59,130,246,0.3)", color:"#4a9edd" }}>
          ← New Search
        </button>
      </ToolCard>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {msgLead && <SocialMsgModal lead={msgLead} leadType="linkedin" searchCategory={niche} onClose={() => setMsgLead(null)} />}
      {insightLead && <LinkedInInsightModal lead={insightLead} onClose={() => setInsightLead(null)} />}

      {/* AI Insight Banner */}
      {aiInsight && (
        <div style={{ padding:"14px 18px", background:"rgba(0,119,181,0.08)", border:"1px solid rgba(0,119,181,0.25)", borderRadius:12, display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ fontSize:20, flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"#00a0dc", marginBottom:4 }}>AI Insight</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", lineHeight:1.6 }}>{aiInsight}</div>
          </div>
        </div>
      )}

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <span style={{ fontSize:17, fontWeight:800, color:"#fff" }}>{visibleLeads.length} LinkedIn Leads</span>
          {queryLabel && <span style={{ fontSize:13, color:T.textMuted, marginLeft:10 }}>"{queryLabel}"</span>}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => exportLinkedInCSV(leads, niche)}
            style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:700, padding:"7px 16px", borderRadius:10, cursor:"pointer", background:"linear-gradient(135deg,#3b82f6,#0077b5)", border:"none", color:"#fff" }}>
            ⬇ Export CSV
          </button>
          <button onClick={onReset} style={ghostBtn}>← New Search</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:14 }}>
        {visibleLeads.map(({ lead, origIdx: idx }) => {
          const profileUrl = lead.profileUrl || `https://www.linkedin.com/in/${lead.linkedinId}/`;
          return (
            <div key={idx}
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:14, padding:18, display:"flex", flexDirection:"column", gap:11, transition:"border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(59,130,246,0.4)"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.09)"}>

              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.3 }}>
                      {lead.name || lead.linkedinId}
                    </div>
                    {lead.data_quality === "verified" && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"rgba(52,211,153,0.12)", border:"1px solid rgba(52,211,153,0.3)", color:"#34d399", fontWeight:700, flexShrink:0 }}>✓ Verified</span>}
                    {lead.data_quality === "partial"  && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"rgba(251,191,36,0.12)", border:"1px solid rgba(251,191,36,0.3)", color:"#fbbf24", fontWeight:700, flexShrink:0 }}>~ Partial</span>}
                    {lead.data_quality === "limited"  && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"rgba(148,163,184,0.1)", border:"1px solid rgba(148,163,184,0.2)", color:"rgba(255,255,255,0.4)", fontWeight:700, flexShrink:0 }}>• Website</span>}
                  </div>
                  {lead.title && (
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:2 }}>{lead.title}</div>
                  )}
                  {lead.company && (
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:1 }}>🏢 {lead.company}</div>
                  )}
                  {lead.linkedinId && (
                    <span style={{ display:"inline-block", marginTop:5, fontSize:11, padding:"2px 8px", borderRadius:20, background:"rgba(59,130,246,0.12)", border:"1px solid rgba(59,130,246,0.3)", color:"#4a9edd" }}>
                      in/{lead.linkedinId}
                    </span>
                  )}
                </div>
                {lead.isAiSuggested ? (
                  <a href={`https://www.google.com/search?q=linkedin+${encodeURIComponent(lead.name || lead.linkedinId || "")}+${encodeURIComponent(niche)}`} target="_blank" rel="noopener noreferrer"
                    title="Search on Google AI-suggested profile may not exist"
                    style={{ flexShrink:0, display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, padding:"6px 12px", borderRadius:10, background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.3)", color:"#3b82f6", textDecoration:"none", transition:"all 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(59,130,246,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.background="rgba(59,130,246,0.08)"}>
                    🔍 Search
                  </a>
                ) : (
                  <a href={profileUrl} target="_blank" rel="noopener noreferrer"
                    title="LinkedIn profile kholo"
                    style={{ flexShrink:0, display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, padding:"6px 12px", borderRadius:10, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.3)", color:"#4a9edd", textDecoration:"none", transition:"all 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(59,130,246,0.22)"}
                    onMouseLeave={e => e.currentTarget.style.background="rgba(59,130,246,0.1)"}>
                    ↗ LinkedIn
                  </a>
                )}
              </div>

              {/* DM Score + Skills */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                {lead.dm_score && lead.type === "person" && (
                  <span style={{ fontSize:10, padding:"2px 9px", borderRadius:20, fontWeight:700,
                    background: lead.dm_score >= 8 ? "rgba(34,197,94,0.12)" : lead.dm_score >= 6 ? "rgba(251,191,36,0.12)" : "rgba(148,163,184,0.1)",
                    border: `1px solid ${lead.dm_score >= 8 ? "rgba(34,197,94,0.3)" : lead.dm_score >= 6 ? "rgba(251,191,36,0.3)" : "rgba(148,163,184,0.2)"}`,
                    color: lead.dm_score >= 8 ? "#22c55e" : lead.dm_score >= 6 ? "#fbbf24" : "rgba(255,255,255,0.4)" }}>
                    {lead.dm_score >= 8 ? "⭐ Decision Maker" : lead.dm_score >= 6 ? "👔 Manager" : "👤 Other"} {lead.dm_score}/10
                  </span>
                )}
                {(lead.skills || []).slice(0, 4).map(sk => (
                  <span key={sk} style={{ fontSize:10, padding:"2px 7px", borderRadius:6, background:"rgba(0,119,181,0.1)", border:"1px solid rgba(0,119,181,0.25)", color:"#60a5fa" }}>{sk}</span>
                ))}
              </div>

              {lead.location && (
                <span style={{ fontSize:12, color:T.textMuted, display:"flex", alignItems:"center", gap:4 }}>
                  📍 {lead.location}
                </span>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {lead.email && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                    <span style={{ fontSize:12, color:T.accent, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      ✉ {lead.email}
                    </span>
                    <button onClick={() => copy(lead.email, `email-${idx}`)}
                      style={{ flexShrink:0, fontSize:11, padding:"3px 9px", borderRadius:6, cursor:"pointer",
                        background: copiedKey === `email-${idx}` ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)",
                        border:`1px solid ${copiedKey === `email-${idx}` ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`,
                        color: copiedKey === `email-${idx}` ? "#3b82f6" : "rgba(255,255,255,0.4)" }}>
                      {copiedKey === `email-${idx}` ? "✓" : "📋"}
                    </button>
                  </div>
                )}
                {lead.phone && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                    <span style={{ fontSize:12, color:"#60a5fa" }}>📞 {lead.phone}</span>
                    <button onClick={() => copy(lead.phone, `phone-${idx}`)}
                      style={{ flexShrink:0, fontSize:11, padding:"3px 9px", borderRadius:6, cursor:"pointer",
                        background: copiedKey === `phone-${idx}` ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)",
                        border:`1px solid ${copiedKey === `phone-${idx}` ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`,
                        color: copiedKey === `phone-${idx}` ? "#3b82f6" : "rgba(255,255,255,0.4)" }}>
                      {copiedKey === `phone-${idx}` ? "✓" : "📋"}
                    </button>
                  </div>
                )}
                {lead.linkedinId && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                    <span style={{ fontSize:12, color:"#4a9edd", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      🔗 linkedin.com/in/{lead.linkedinId}
                    </span>
                    <button onClick={() => copy(`https://www.linkedin.com/in/${lead.linkedinId}/`, `lid-${idx}`)}
                      style={{ flexShrink:0, fontSize:11, padding:"3px 9px", borderRadius:6, cursor:"pointer",
                        background: copiedKey === `lid-${idx}` ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                        border:`1px solid ${copiedKey === `lid-${idx}` ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.1)"}`,
                        color: copiedKey === `lid-${idx}` ? "#4a9edd" : "rgba(255,255,255,0.4)" }}>
                      {copiedKey === `lid-${idx}` ? "✓" : "📋"}
                    </button>
                  </div>
                )}
                {lead.website && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                    <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize:12, color:"#34d399", textDecoration:"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      🌐 {lead.website.replace(/^https?:\/\//,"").replace(/\/$/,"")}
                    </a>
                    <button onClick={() => copy(lead.website, `web-${idx}`)}
                      style={{ flexShrink:0, fontSize:11, padding:"3px 9px", borderRadius:6, cursor:"pointer",
                        background: copiedKey === `web-${idx}` ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)",
                        border:`1px solid ${copiedKey === `web-${idx}` ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.1)"}`,
                        color: copiedKey === `web-${idx}` ? "#34d399" : "rgba(255,255,255,0.4)" }}>
                      {copiedKey === `web-${idx}` ? "✓" : "📋"}
                    </button>
                  </div>
                )}
                {!lead.email && !lead.phone && !lead.website && (
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)", fontStyle:"italic" }}>No contact info found</span>
                )}
              </div>

              {lead.bio && (
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.38)", lineHeight:1.5, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:8 }}>
                  {lead.bio}
                </div>
              )}

              {/* AI Insight + AI Message + WhatsApp buttons */}
              <div style={{ display:"flex", gap:8, marginTop:2, flexWrap:"wrap" }}>
                <button onClick={() => setInsightLead(lead)}
                  style={{ flex:1, minWidth:70, fontSize:12, padding:"9px 0", borderRadius:9, cursor:"pointer", background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.25)", color:"#4a9edd", fontWeight:600 }}>
                  🔍 Insight
                </button>
                <button onClick={() => setMsgLead(lead)}
                  style={{ flex:1, minWidth:70, fontSize:12, padding:"9px 0", borderRadius:9, cursor:"pointer", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.3)", color:"#7c3aed", fontWeight:600 }}>
                  🤖 AI Msg
                </button>
                {(lead.whatsapp_number || lead.phone) && (
                  <a href={`https://wa.me/${(lead.whatsapp_number || lead.phone).replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                    style={{ flex:1, minWidth:40, fontSize:12, padding:"9px 0", borderRadius:9, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", color:"#22c55e", textDecoration:"none", textAlign:"center", fontWeight:600 }}>
                    💬
                  </a>
                )}
                {onSaveLead && <SaveLeadButton lid={lead.linkedinId || lead.name} onSave={() => onSaveLead({ ...lead, business_name: lead.name, source: "linkedin", category: lead.jobTitle || niche })} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId} style={{ flex:1, minWidth:50 }} />}
              </div>
              <button onClick={() => dismiss(idx)}
                style={{ fontSize:11, padding:"5px 0", borderRadius:8, cursor:"pointer", background:"transparent", border:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.22)", fontWeight:500, width:"100%" }}>
                ✕ Dead link -hatao
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign:"center", paddingTop:8 }}>
        <button onClick={onLoadMore} disabled={loadingMore}
          style={{ padding:"12px 32px", borderRadius:12, cursor:loadingMore ? "not-allowed" : "pointer", fontSize:14, fontWeight:700,
            background:loadingMore ? "rgba(255,255,255,0.04)" : "rgba(59,130,246,0.1)",
            border:`1px solid ${loadingMore ? "rgba(255,255,255,0.08)" : "rgba(59,130,246,0.3)"}`,
            color:loadingMore ? "rgba(255,255,255,0.3)" : "#4a9edd", transition:"all 0.15s" }}>
          {loadingMore ? "⏳ Searching for more leads..." : "🔄 Load More Leads"}
        </button>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", marginTop:8 }}>
          Each load brings fresh, filtered leads
        </div>
      </div>
    </div>
  );
}

