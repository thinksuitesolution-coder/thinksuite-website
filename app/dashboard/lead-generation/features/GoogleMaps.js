import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ToolCard, PrimaryButton, T } from "@/app/dashboard/lead-generation/_shell";
import { exportCSV } from "@/lib/frontend/exporters";
import { buildLeadInsight, computeLeadPriority, PRIORITY_CONFIG } from "@/lib/frontend/leadHelpers";
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

const STATUS_CONFIG = {
  new:       { label: "New",       color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  border: "rgba(124,58,237,0.3)" },
  contacted: { label: "Contacted", color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)" },
  closed:    { label: "Closed",    color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)"  },
};

/* ── Lead Gen niches ─────────────────────────────────────────────────────── */
const NICHES = [
  { value: "real-estate",  label: "Real Estate",      icon: "🏠", hint: "Builders, brokers, property dealers",         count: "12,000+ Businesses" },
  { value: "edtech",       label: "EdTech / Coaching", icon: "🎓", hint: "Institutes, coaching centers, courses",       count: "8,500+ Businesses"  },
  { value: "healthcare",   label: "Healthcare",        icon: "🏥", hint: "Clinics, hospitals, diagnostic centers",      count: "10,000+ Businesses" },
  { value: "restaurant",   label: "Restaurant",        icon: "🍽️", hint: "Restaurants, cafes, cloud kitchens",         count: "15,000+ Businesses" },
  { value: "retail",       label: "Retail",            icon: "🛍️", hint: "Shops, showrooms, boutiques",               count: "18,000+ Businesses" },
  { value: "it",           label: "IT / Software",     icon: "💻", hint: "Dev agencies, SaaS, software companies",     count: "6,500+ Businesses"  },
  { value: "finance",      label: "Finance / CA Firm", icon: "💰", hint: "CA firms, tax consultants, wealth managers", count: "7,000+ Businesses"  },
  { value: "hotel",        label: "Hotel",             icon: "🏨", hint: "Hotels, resorts, homestays, B&Bs",           count: "6,200+ Businesses"  },
  { value: "gym",          label: "Gym / Fitness",     icon: "💪", hint: "Fitness centers, yoga studios, sports academies", count: "5,800+ Businesses" },
  { value: "salon",        label: "Salon / Beauty",    icon: "💇", hint: "Hair & beauty salons, spas, wellness",       count: "6,500+ Businesses"  },
  { value: "other",        label: "Other",             icon: "📦", hint: "Any other business type",                    count: null },
];

const NICHE_AI_SUGGESTIONS = {
  "real-estate": ["Gurgaon", "Noida", "Bangalore", "Mumbai"],
  "edtech":      ["Delhi", "Pune", "Hyderabad", "Bangalore"],
  "healthcare":  ["Mumbai", "Delhi", "Hyderabad", "Chennai"],
  "restaurant":  ["Mumbai", "Delhi", "Bangalore", "Pune"],
  "retail":      ["Delhi", "Mumbai", "Ahmedabad", "Surat"],
  "it":          ["Bangalore", "Hyderabad", "Pune", "Noida"],
  "finance":     ["Mumbai", "Delhi", "Ahmedabad", "Kolkata"],
  "hotel":       ["Goa", "Jaipur", "Mumbai", "Delhi"],
  "gym":         ["Mumbai", "Delhi", "Bangalore", "Pune"],
  "salon":       ["Mumbai", "Delhi", "Bangalore", "Kolkata"],
};

const POPULAR_SEARCH_CITIES = ["Gurgaon", "Noida", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Chandigarh"];

/* ════════════════════════════════════════════════════════════════════════════
   LEAD FINDER COMPONENTS
════════════════════════════════════════════════════════════════════════════ */
export function StepInputGoogleMap({ onSubmit }) {
  const [selectedNiche,  setSelectedNiche]  = useState(null);
  const [customCategory, setCustomCategory] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [cityInput,      setCityInput]      = useState("");
  const [selectedCity,   setSelectedCity]   = useState(null);
  const [aiFilterOn,     setAiFilterOn]     = useState(false);
  const [aiFilterText,   setAiFilterText]   = useState("");
  const [isMobile,       setIsMobile]       = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const aiCities = selectedNiche ? (NICHE_AI_SUGGESTIONS[selectedNiche] || []) : [];

  const filteredNiches = categorySearch.trim()
    ? NICHES.filter(n => n.label.toLowerCase().includes(categorySearch.toLowerCase()))
    : NICHES;

  const activeCategory = selectedNiche === "other"
    ? customCategory.trim()
    : selectedNiche ? (NICHES.find(n => n.value === selectedNiche)?.label || "") : "";

  const activeCity = selectedCity || cityInput.trim();
  const canSubmit  = !!(activeCategory);

  const SAMPLE_LEADS = [
    { name: "ThinKSuite Technologies", cat: "IT Services", rating: 4.6, reviews: 129, phone: "98xxxxxx89", site: "thinksuite.co", city: "Gurgaon, Haryana" },
    { name: "AutomationX Solutions",   cat: "IT Services", rating: 4.3, reviews: 96,  phone: "97xxxxxxxx",  site: "automations.in", city: "Gurgaon, Haryana" },
  ];

  return (
    <div style={{ display:"flex", flexDirection: isMobile ? "column-reverse" : "row", gap:18, alignItems:"flex-start" }}>

      {/* ── Left: inputs ── */}
      <div style={{ flex:"1 1 0%", display:"flex", flexDirection:"column", gap:18, minWidth:0 }}>

        {/* Category */}
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"18px 18px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8 }}>
            <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)" }}>1. Choose Category *</span>
            <button style={{ fontSize:12, color:T.accent, background:"none", border:"none", cursor:"pointer", fontWeight:600, padding:0 }}>
              Can't find your category? Request New
            </button>
          </div>
          <div style={{ position:"relative", marginBottom:14 }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)", fontSize:13, pointerEvents:"none" }}>🔍</span>
            <input
              value={categorySearch}
              onChange={e => setCategorySearch(e.target.value)}
              placeholder="Search categories..."
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px 10px 36px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box" }}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap:10 }}>
            {filteredNiches.map(n => {
              const active = selectedNiche === n.value;
              return (
                <button
                  key={n.value}
                  onClick={() => setSelectedNiche(active ? null : n.value)}
                  style={{
                    position:"relative", display:"flex", flexDirection:"column", alignItems:"center",
                    gap:5, padding:"14px 8px 12px", borderRadius:12, cursor:"pointer", textAlign:"center",
                    border: active ? `2px solid ${T.accent}` : "1px solid rgba(255,255,255,0.1)",
                    background: active ? "rgba(124,58,237,0.14)" : "rgba(255,255,255,0.03)",
                    color:"#fff", transition:"all 0.15s",
                  }}
                >
                  {active && (
                    <span style={{ position:"absolute", top:7, right:7, width:16, height:16, borderRadius:"50%", background:T.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:900 }}>✓</span>
                  )}
                  <span style={{ fontSize:22 }}>{n.icon}</span>
                  <span style={{ fontSize:12, fontWeight:700, lineHeight:1.3 }}>{n.label}</span>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{n.count || "Explore more"}</span>
                </button>
              );
            })}
          </div>
          {selectedNiche === "other" && (
            <input
              value={customCategory} onChange={e => setCustomCategory(e.target.value)}
              placeholder="e.g. Wedding Planner, Interior Designer, Travel Agent..."
              style={{ marginTop:12, width:"100%", ...inp }}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
          )}
          {selectedNiche && aiCities.length > 0 && (
            <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", padding:"8px 12px", background:"rgba(124,58,237,0.06)", borderRadius:8 }}>
              <span style={{ fontSize:13 }}>🤖</span>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>AI Suggestion:</span>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.75)" }}>
                {NICHES.find(n => n.value === selectedNiche)?.label} has high demand in{" "}
                {aiCities.map((c, i) => (
                  <span key={c}><strong style={{ color:T.accent }}>{c}</strong>{i < aiCities.length - 1 ? ", " : ""}</span>
                ))}
              </span>
            </div>
          )}
        </div>

        {/* Location */}
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"18px 18px 16px" }}>
          <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)", display:"block", marginBottom:12 }}>2. Choose Location (India) *</span>
          <div style={{ position:"relative", marginBottom:12 }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)", fontSize:13, pointerEvents:"none" }}>📍</span>
            <input
              value={cityInput}
              onChange={e => { setCityInput(e.target.value); setSelectedCity(null); }}
              placeholder="Search city, state or pin code..."
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px 10px 36px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box" }}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
          </div>
          {aiCities.length > 0 && selectedNiche && (
            <div style={{ marginBottom:12 }}>
              <span style={{ fontSize:11, fontWeight:600, color:T.accent }}>✨ AI Recommended for {NICHES.find(n => n.value === selectedNiche)?.label}</span>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:8 }}>
                {aiCities.map(c => (
                  <button
                    key={c}
                    onClick={() => { setSelectedCity(c); setCityInput(c); }}
                    style={{
                      padding:"5px 13px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:600,
                      border: selectedCity === c ? `1.5px solid ${T.accent}` : "1px solid rgba(124,58,237,0.3)",
                      background: selectedCity === c ? "rgba(124,58,237,0.18)" : "rgba(124,58,237,0.07)",
                      color: selectedCity === c ? T.accent : "rgba(255,255,255,0.65)",
                    }}
                  >
                    {c}{selectedCity === c ? " ×" : ""}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <span style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.4)", display:"block", marginBottom:8 }}>Popular Searches</span>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {POPULAR_SEARCH_CITIES.map(c => (
                <button
                  key={c}
                  onClick={() => { setSelectedCity(c); setCityInput(c); }}
                  style={{
                    padding:"5px 12px", borderRadius:20, cursor:"pointer", fontSize:12,
                    border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.6)",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop:12, display:"flex", gap:8, alignItems:"center", background:"rgba(124,58,237,0.06)", borderRadius:8, padding:"8px 12px" }}>
            <span style={{ fontSize:13 }}>ℹ️</span>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>
              <strong style={{ color:T.accent }}>Up to 60 leads</strong> fetched per search · Real verified Indian businesses from Google Maps.
            </span>
          </div>
        </div>

        {/* AI Filter */}
        <div style={{ border: aiFilterOn ? `1.5px solid ${T.accent}` : "1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"14px 16px", background: aiFilterOn ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.02)", transition:"all 0.2s" }}>
          <button onClick={() => setAiFilterOn(v => !v)} style={{ display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", padding:0, width:"100%" }}>
            <span style={{ fontSize:16 }}>🤖</span>
            <span style={{ fontSize:13, fontWeight:700, color: aiFilterOn ? T.accent : "rgba(255,255,255,0.75)" }}>AI Filter Mode</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginLeft:4 }}>(optional)</span>
            <span style={{ marginLeft:"auto", fontSize:12, color: aiFilterOn ? T.accent : "rgba(255,255,255,0.3)", fontWeight:700 }}>{aiFilterOn ? "ON ✓" : "OFF"}</span>
          </button>
          {aiFilterOn && (
            <textarea
              value={aiFilterText} onChange={e => setAiFilterText(e.target.value)}
              placeholder={"e.g. Only businesses without a website\ne.g. Only businesses with rating above 4.0\ne.g. Local independent shops only, no chains"}
              rows={3}
              style={{ width:"100%", marginTop:12, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", resize:"vertical", fontFamily:"inherit", lineHeight:1.6 }}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
            />
          )}
        </div>

        {/* CTA */}
        <PrimaryButton
          onClick={() => onSubmit(activeCategory, activeCity, 60, "", "", "India", false, aiFilterOn && aiFilterText.trim() ? aiFilterText.trim() : "")}
          disabled={!canSubmit}
        >
          {aiFilterOn && aiFilterText.trim() ? "🤖 Find & AI-Filter Leads" : "Find Leads Now →"}
        </PrimaryButton>

        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {["✓ Up to 60 leads per search", "✓ Google Maps verified", "✓ Real Indian businesses", "✓ Export in CSV"].map(item => (
            <span key={item} style={{ fontSize:12, color:T.textMuted, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"4px 12px" }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── Right: preview panel ── */}
      <div style={{ flex: isMobile ? "1 1 100%" : "0 0 270px", width: isMobile ? "100%" : "auto", display:"flex", flexDirection:"column", gap:14 }}>
        {/* What You'll Get */}
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:18 }}>
          <div style={{ fontSize:13, fontWeight:800, color:"#fff", marginBottom:14 }}>What You'll Get</div>
          {["Business Name", "Phone Number", "Website", "Address", "Google Maps Rating", "Total Reviews", "Category"].map(item => (
            <div key={item} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:9 }}>
              <span style={{ width:18, height:18, borderRadius:"50%", background:"rgba(124,58,237,0.18)", border:"1px solid rgba(124,58,237,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:T.accent, flexShrink:0, fontWeight:900 }}>✓</span>
              <span style={{ fontSize:13, color:"rgba(255,255,255,0.8)" }}>{item}</span>
            </div>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ width:18, height:18, borderRadius:"50%", background:"rgba(124,58,237,0.18)", border:"1px solid rgba(124,58,237,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:T.accent, flexShrink:0, fontWeight:900 }}>✓</span>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.8)" }}>AI Outreach Message</span>
            <span style={{ marginLeft:4, fontSize:10, fontWeight:700, color:"#fff", background:T.accent, borderRadius:5, padding:"2px 6px" }}>NEW</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const PROCESSING_STEPS = [
  { icon:"🗺️", text:"Dividing city into 6 zones",                  delay:0 },
  { icon:"📍", text:"Crawling businesses from each zone",          delay:2500 },
  { icon:"🔍", text:"Removing duplicates and merging leads",       delay:5000 },
  { icon:"🤖", text:"MyThinkAI analyzing leads",         delay:3500 },
  { icon:"📊", text:"Preparing CSV export",             delay:5000 },
];

export function StepProcessing({ niche, city }) {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const timers = PROCESSING_STEPS.slice(1).map((s, i) =>
      setTimeout(() => setActiveStep(i + 1), s.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <ToolCard style={{ textAlign:"center", padding:"60px 32px" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeup{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ position:"relative", width:72, height:72, margin:"0 auto 28px" }}>
        <div style={{ width:72, height:72, borderRadius:"50%", border:"3px solid rgba(124,58,237,0.15)", borderTopColor:T.accent, animation:"spin 0.9s linear infinite" }} />
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>
          {PROCESSING_STEPS[activeStep].icon}
        </div>
      </div>
      <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:6 }}>Scanning city listings...</div>
      <div style={{ fontSize:13, color:T.textMuted, marginBottom:28 }}>
        {niche && <><strong style={{ color:T.accent }}>{niche}</strong>{city ? <> · <strong style={{ color:T.accent }}>{city}</strong></> : null}</>}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, maxWidth:340, margin:"0 auto" }}>
        {PROCESSING_STEPS.map((s, i) => {
          const done    = i < activeStep;
          const current = i === activeStep;
          return (
            <div key={s.text} style={{ display:"flex", alignItems:"center", gap:12, background: current ? "rgba(124,58,237,0.08)" : done ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.03)", border:`1px solid ${current ? "rgba(124,58,237,0.3)" : done ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius:10, padding:"11px 16px", fontSize:13, color: current ? "#fff" : done ? "#4ade80" : "rgba(255,255,255,0.3)", transition:"all 0.4s", animation: current ? "fadeup 0.35s ease" : "none" }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{done ? "✅" : current ? s.icon : s.icon}</span>
              <span style={{ fontWeight: current ? 700 : 500 }}>{s.text}</span>
              {current && <span style={{ marginLeft:"auto", fontSize:11, color:T.accent, fontWeight:700 }}>●</span>}
              {done && <span style={{ marginLeft:"auto", fontSize:11, color:"#4ade80" }}>✓</span>}
            </div>
          );
        })}
      </div>
    </ToolCard>
  );
}

/* ── AI Call Campaign Modal ───────────────────────────────────────────── */
const CALL_LANGUAGES = [
  { value:"hinglish", label:"Casual English" },
  { value:"hindi",    label:"Hindi" },
  { value:"english",  label:"🇬🇧 English" },
  { value:"tamil",    label:"Tamil" },
  { value:"telugu",   label:"Telugu" },
  { value:"kannada",  label:"Kannada" },
  { value:"malayalam",label:"Malayalam" },
  { value:"marathi",  label:"Marathi" },
  { value:"gujarati", label:"Gujarati" },
  { value:"bengali",  label:"Bengali" },
  { value:"punjabi",  label:"Punjabi" },
];

function AiCallCampaignModal({ leads, userId, onClose, onLaunched }) {
  const [step,     setStep]     = useState("setup"); // "setup" | "credits" | "launching" | "done"
  const [name,     setName]     = useState("");
  const [goal,     setGoal]     = useState("");
  const [lang,     setLang]     = useState("english");
  const [biz,      setBiz]      = useState("");
  const [selected, setSelected] = useState(() => new Set(leads.filter(l => l.phone).map(l => l.phone)));
  const [credits,  setCredits]  = useState(null);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [campaignId, setCampaignId] = useState(null);

  const phonedLeads = leads.filter(l => l.phone);
  const selectedLeads = phonedLeads.filter(l => selected.has(l.phone));

  // Fetch credits on mount
  useEffect(() => {
    fetch("/api/ai-calling/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).then(r => r.json()).then(d => setCredits(d.credits ?? 0)).catch(() => setCredits(0));
  }, [userId]);

  const toggleLead = (phone) => {
    setSelected(prev => { const n = new Set(prev); n.has(phone) ? n.delete(phone) : n.add(phone); return n; });
  };

  const handleLaunch = async () => {
    if (!goal.trim()) { setError("Campaign goal required"); return; }
    if (selectedLeads.length === 0) { setError("Select at least 1 lead with phone"); return; }
    if (credits !== null && credits < selectedLeads.length) {
      setStep("credits"); return;
    }
    setLoading(true); setError("");

    try {
      // Step 1: Create campaign + Bolna agent
      const res1 = await fetch("/api/ai-calling/create-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: name.trim() || undefined, goal, language: lang, businessContext: biz, leads: selectedLeads }),
      });
      const d1 = await res1.json();
      if (!res1.ok) {
        if (d1.code === "INSUFFICIENT_CREDITS") { setStep("credits"); setLoading(false); return; }
        throw new Error(d1.error || "Campaign creation failed");
      }

      const cId = d1.campaignId;
      setCampaignId(cId);

      // Step 2: Launch calls
      const res2 = await fetch("/api/ai-calling/launch-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, campaignId: cId }),
      });
      const d2 = await res2.json();
      if (!res2.ok) throw new Error(d2.error || "Launch failed");

      setStep("done");
      setCredits(c => Math.max(0, (c || 0) - selectedLeads.length));
      if (onLaunched) onLaunched(cId);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const inp2 = {
    width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
    borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:13, outline:"none",
    boxSizing:"border-box", fontFamily:"inherit",
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, width:"100%", maxWidth:580, maxHeight:"90vh", overflowY:"auto", padding:28, position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:22, cursor:"pointer" }}>✕</button>

        {/* ── Setup step ── */}
        {step === "setup" && (
          <>
            <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginBottom:4 }}>📞 AI Call Campaign</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:20 }}>
              AI agent makes human-like calls in 15+ Indian languages
            </div>

            {/* Credit balance pill */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:10, padding:"10px 16px", marginBottom:20 }}>
              <span style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>
                Credits: <strong style={{ color:"#fff" }}>{credits === null ? "..." : credits}</strong>
              </span>
              <a href="/dashboard/ai-calling" target="_blank" style={{ fontSize:12, color:T.accent, textDecoration:"none", fontWeight:600 }}>+ Buy Credits →</a>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.6)", display:"block", marginBottom:6 }}>Campaign Name (optional)</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. May 2026 Real Estate Leads" style={inp2} />
              </div>

              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.6)", display:"block", marginBottom:6 }}>AI Agent Goal *</label>
                <textarea
                  value={goal} onChange={e => setGoal(e.target.value)} rows={3}
                  placeholder="e.g. Ask the lead if they need digital marketing help. Confirm budget and timeline."
                  style={{ ...inp2, resize:"vertical", lineHeight:1.6 }}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                />
              </div>

              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.6)", display:"block", marginBottom:6 }}>Language</label>
                <select value={lang} onChange={e => setLang(e.target.value)} style={{ ...inp2, cursor:"pointer" }}>
                  {CALL_LANGUAGES.map(l => (
                    <option key={l.value} value={l.value} style={{ background:"#111" }}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.6)", display:"block", marginBottom:6 }}>About Your Business (optional)</label>
                <input value={biz} onChange={e => setBiz(e.target.value)} placeholder="e.g. ThinkSuite digital marketing SaaS for Indian businesses" style={inp2} />
              </div>

              {/* Lead selector */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.6)" }}>
                    Select Leads to Call ({selectedLeads.length}/{phonedLeads.length} with phone)
                  </label>
                  <button
                    onClick={() => selected.size === phonedLeads.length
                      ? setSelected(new Set())
                      : setSelected(new Set(phonedLeads.map(l => l.phone)))}
                    style={{ fontSize:11, color:T.accent, background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>
                    {selected.size === phonedLeads.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div style={{ maxHeight:180, overflowY:"auto", display:"flex", flexDirection:"column", gap:6, paddingRight:4 }}>
                  {phonedLeads.map(lead => (
                    <label key={lead.phone} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.03)", border:`1px solid ${selected.has(lead.phone) ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius:8, padding:"8px 12px", cursor:"pointer" }}>
                      <input type="checkbox" checked={selected.has(lead.phone)} onChange={() => toggleLead(lead.phone)} style={{ accentColor:T.accent, width:14, height:14, flexShrink:0 }} />
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{lead.business_name || lead.name}</div>
                        <div style={{ fontSize:11, color:T.textMuted }}>{lead.phone}</div>
                      </div>
                    </label>
                  ))}
                  {phonedLeads.length === 0 && (
                    <div style={{ textAlign:"center", padding:"16px 0", fontSize:13, color:T.textMuted }}>
                      No phone numbers found in these leads. Try filtering to get leads with phone numbers.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && <div style={{ color:"#f87171", fontSize:13, marginTop:14, padding:"10px 14px", background:"rgba(239,68,68,0.08)", borderRadius:8, border:"1px solid rgba(239,68,68,0.2)" }}>{error}</div>}

            <div style={{ marginTop:20, display:"flex", gap:10 }}>
              <button onClick={onClose} style={{ flex:"0 0 90px", padding:"12px 0", borderRadius:12, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)" }}>Cancel</button>
              <button
                onClick={handleLaunch}
                disabled={loading || !goal.trim() || selectedLeads.length === 0}
                style={{ flex:1, padding:"12px 0", borderRadius:12, cursor:(!goal.trim() || selectedLeads.length === 0 || loading) ? "not-allowed":"pointer", fontSize:14, fontWeight:700,
                  background: (!goal.trim() || selectedLeads.length === 0 || loading) ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#7c3aed,#3b82f6)",
                  border: "none", color: (!goal.trim() || selectedLeads.length === 0 || loading) ? "rgba(255,255,255,0.3)" : "#fff", transition:"all 0.15s" }}>
                {loading ? "Creating campaign..." : `🚀 Launch ${selectedLeads.length} AI Call${selectedLeads.length !== 1 ? "s" : ""}`}
              </button>
            </div>
          </>
        )}

        {/* ── No credits step ── */}
        {step === "credits" && (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:40, marginBottom:16 }}>💳</div>
            <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginBottom:8 }}>Credits Needed</div>
            <div style={{ fontSize:13, color:T.textMuted, marginBottom:24, lineHeight:1.7 }}>
              You need <strong style={{ color:"#fff" }}>{selectedLeads.length} credits</strong> for {selectedLeads.length} calls.<br/>
              You currently have <strong style={{ color:T.accent }}>{credits || 0} credits</strong>.
            </div>
            <a href="/dashboard/ai-calling" target="_blank"
              style={{ display:"inline-block", padding:"13px 32px", borderRadius:14, fontSize:14, fontWeight:700,
                background:"linear-gradient(135deg,#7c3aed,#3b82f6)", color:"#fff", textDecoration:"none" }}>
              Buy Credits →
            </a>
            <div style={{ marginTop:16 }}>
              <button onClick={() => setStep("setup")} style={{ fontSize:12, color:T.textMuted, background:"none", border:"none", cursor:"pointer" }}>← Back</button>
            </div>
          </div>
        )}

        {/* ── Done step ── */}
        {step === "done" && (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🚀</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:8 }}>Calls Launched!</div>
            <div style={{ fontSize:13, color:T.textMuted, marginBottom:24, lineHeight:1.7 }}>
              AI agent is calling <strong style={{ color:"#fff" }}>{selectedLeads.length} leads</strong>.<br/>
              Results may take 5-15 minutes to appear.
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={onClose} style={{ padding:"11px 24px", borderRadius:12, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)" }}>Close</button>
              <a href="/dashboard/ai-calling" target="_blank"
                style={{ padding:"11px 24px", borderRadius:12, fontSize:13, fontWeight:700,
                  background:"linear-gradient(135deg,#7c3aed,#3b82f6)", color:"#fff", textDecoration:"none" }}>
                View Campaign →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function LeadMsgModal({ lead, searchCategory, onClose }) {
  const [step, setStep]           = useState("services"); // "services" | "loading" | "result"
  const [services, setServices]   = useState("");
  const [msgs, setMsgs]           = useState(null);
  const [error, setError]         = useState("");
  const [tab, setTab]             = useState("english");
  const [copied, setCopied]       = useState(false);
  const [extraCtx, setExtraCtx]   = useState("");
  const [showCustomize, setShowCustomize] = useState(false);

  const generateMsg = (extra = "") => {
    if (!services.trim()) return;
    setStep("loading");
    setError("");
    fetch("/api/lead-gen/lead-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead, userServices: services, searchCategory, extraContext: extra }),
    })
      .then(r => safeJson(r))
      .then(d => { if (d.error) throw new Error(d.error); setMsgs(d); setStep("result"); setShowCustomize(false); })
      .catch(e => { setError(e.message); setStep("services"); });
  };

  const text = msgs?.[tab] || "";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, width:"100%", maxWidth:560, padding:28, position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:20, cursor:"pointer", lineHeight:1 }}>✕</button>
        <div style={{ fontSize:15, fontWeight:800, color:"#fff", marginBottom:4 }}>🤖 AI Outreach Message</div>
        <div style={{ fontSize:12, color:T.textMuted, marginBottom:20 }}>{lead.business_name} · {lead.city}</div>

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

            {/* Customize / Regenerate section */}
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

// buildLeadInsight, computeLeadPriority, PRIORITY_CONFIG — moved to lib/frontend/leadHelpers.js

function AiInsightModal({ lead, allLeads, onClose }) {
  const insight = buildLeadInsight(lead, allLeads);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, width:"100%", maxWidth:560, padding:28, position:"relative", maxHeight:"90vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:20, cursor:"pointer", lineHeight:1 }}>✕</button>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>AI Lead Insight</div>
            <div style={{ fontSize:12, color:T.accent }}>{lead.business_name}</div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Business Details</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {lead.category && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Category</div><div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>{lead.category}</div></div>}
            {lead.city && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>City</div><div style={{ fontSize:13, color:"#fff" }}>{lead.city}</div></div>}
            {lead.rating && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Rating</div><div style={{ fontSize:13, color:"#fbbf24", fontWeight:700 }}>★ {lead.rating} <span style={{ color:T.textMuted, fontWeight:400, fontSize:12 }}>({lead.total_ratings || 0} reviews)</span></div></div>}
            {lead.phone && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Phone</div><a href={`tel:${lead.phone}`} style={{ fontSize:13, color:T.accent, textDecoration:"none", fontWeight:600 }}>{lead.phone}</a></div>}
          </div>
          {lead.address && (
            <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:11, color:T.textMuted, marginBottom:4 }}>📍 Address</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", lineHeight:1.5 }}>{lead.address}</div>
            </div>
          )}
          {lead.website && (
            <div style={{ marginTop:10 }}>
              <div style={{ fontSize:11, color:T.textMuted, marginBottom:4 }}>🌐 Website</div>
              <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ fontSize:13, color:"#3b82f6", textDecoration:"none" }}>{lead.website.replace(/^https?:\/\//,"").replace(/\/$/,"")}</a>
            </div>
          )}
          {lead.email && (
            <div style={{ marginTop:10 }}>
              <div style={{ fontSize:11, color:T.textMuted, marginBottom:4 }}>📧 Email</div>
              <a href={`mailto:${lead.email}`} style={{ fontSize:13, color:"#34d399", textDecoration:"none" }}>{lead.email}</a>
            </div>
          )}
        </div>
        <div style={{ background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.accent, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>🤖 AI Analysis</div>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.82)", lineHeight:1.8, margin:0 }}>{insight}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {lead.phone && <a href={`tel:${lead.phone}`} style={{ flex:1, padding:"11px 0", borderRadius:10, textAlign:"center", fontSize:13, fontWeight:700, background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent, textDecoration:"none" }}>📞 Call Now</a>}
          {lead.email && <a href={`mailto:${lead.email}`} style={{ flex:1, padding:"11px 0", borderRadius:10, textAlign:"center", fontSize:13, fontWeight:700, background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.25)", color:"#34d399", textDecoration:"none" }}>📧 Email</a>}
          {lead.maps_url && <a href={lead.maps_url} target="_blank" rel="noopener noreferrer" style={{ flex:1, padding:"11px 0", borderRadius:10, textAlign:"center", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", textDecoration:"none" }}>📍 Maps</a>}
        </div>
      </div>
    </div>
  );
}

export function StepResults({ leads, setLeads, niche, city, nicheLabel, onReset, onLoadMore, loadingMore, onSaveLead, savedLeadIds, savingLeadId }) {
  const { user }                       = useAuth();
  const [selectedIds, setSelectedIds]  = useState(new Set());
  const [msgLead, setMsgLead]          = useState(null);
  const [insightLead, setInsightLead]  = useState(null);
  const [showAiCall, setShowAiCall]    = useState(false);
  const [isMobile, setIsMobile]        = useState(false);
  const [filterMode, setFilterMode]    = useState("all");
  const [sortBy, setSortBy]            = useState("default");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!document.getElementById("tbot-anim")) {
      const s = document.createElement("style");
      s.id = "tbot-anim";
      s.textContent = `@keyframes tbot-bounce{0%,80%,100%{transform:translateY(0);opacity:.35}40%{transform:translateY(-5px);opacity:1}}.tbot-dot{animation:tbot-bounce 1.3s ease-in-out infinite;display:inline-block}.tbot-dot:nth-child(2){animation-delay:.18s}.tbot-dot:nth-child(3){animation-delay:.36s}`;
      document.head.appendChild(s);
    }
  }, []);

  const toggleSelect = id => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  // Select All only selects what's visible under the active filter, not the full unfiltered list.
  const selectAll    = () => setSelectedIds(new Set(filteredLeads.map(l => l.place_id || l.business_name)));
  const clearAll     = () => setSelectedIds(new Set());
  const updateStatus = (id, status) => setLeads(prev => prev.map(l => (l.place_id || l.business_name) === id ? { ...l, status } : l));
  const exportSelected = () => exportCSV(selectedIds.size > 0 ? leads.filter(l => selectedIds.has(l.place_id || l.business_name)) : leads, niche, city);

  const withPhone   = leads.filter(l => l.phone).length;
  const withWebsite = leads.filter(l => l.website).length;
  const highRating  = leads.filter(l => (l.rating || 0) >= 4.0).length;
  const noWebsite   = leads.filter(l => !l.website).length;
  const hotLeads    = leads.filter(l => computeLeadPriority(l) === "high").length;

  const filteredLeads = leads.filter(l => {
    if (filterMode === "phone")   return !!l.phone;
    if (filterMode === "website") return !!l.website;
    if (filterMode === "rating")  return (l.rating || 0) >= 4.0;
    if (filterMode === "no-web")  return !l.website;
    if (filterMode === "hot")     return computeLeadPriority(l) === "high";
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating")  return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "reviews") return (b.total_ratings || 0) - (a.total_ratings || 0);
    if (sortBy === "name")    return (a.business_name || "").localeCompare(b.business_name || "");
    return 0;
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {msgLead && <LeadMsgModal lead={msgLead} searchCategory={nicheLabel} onClose={() => setMsgLead(null)} />}
      {insightLead && <AiInsightModal lead={insightLead} allLeads={leads} onClose={() => setInsightLead(null)} />}
      {showAiCall && (
        <AiCallCampaignModal
          leads={selectedIds.size > 0 ? leads.filter(l => selectedIds.has(l.place_id || l.business_name)) : leads}
          userId={user?.uid}
          onClose={() => setShowAiCall(false)}
          onLaunched={() => setShowAiCall(false)}
        />
      )}

      <ToolCard style={{ padding:0, overflow:"hidden" }}>
        {/* ── Header row ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", flexWrap:"wrap", gap:12 }}>
          <div>
            <span style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{leads.length} Leads Found</span>
            {(nicheLabel || city) && <span style={{ fontSize:13, color:T.textMuted, marginLeft:10 }}>{nicheLabel}{city ? ` · ${city}` : ""}</span>}
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <button onClick={selectAll} style={ghostBtn}>Select All</button>
            {selectedIds.size > 0 && <button onClick={clearAll} style={ghostBtn}>Clear ({selectedIds.size})</button>}
            <button onClick={exportSelected} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:700, padding:"7px 16px", borderRadius:10, cursor:"pointer", background:"linear-gradient(135deg,#7c3aed,#3b82f6)", border:"none", color:"#fff" }}>
              ⬇ Export {selectedIds.size > 0 ? `(${selectedIds.size})` : "CSV"}
            </button>
            {leads.some(l => l.phone) && (
              <button onClick={() => setShowAiCall(true)}
                style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:700, padding:"7px 16px", borderRadius:10, cursor:"pointer", background:"rgba(34,197,94,0.12)", border:"1px solid rgba(34,197,94,0.3)", color:"#22c55e" }}>
                📞 AI Call {selectedIds.size > 0 ? `(${[...selectedIds].filter(id => leads.find(l => (l.place_id||l.business_name) === id && l.phone)).length})` : ""}
              </button>
            )}
            <button onClick={onReset} style={ghostBtn}>← New Search</button>
          </div>
        </div>

        {/* ── Stats + Filter + Sort bar ── */}
        <div style={{ padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"rgba(0,0,0,0.15)" }}>
          {/* Stats row */}
          <div style={{ display:"flex", gap:18, flexWrap:"wrap", marginBottom:10 }}>
            {[
              { icon:"🔥", val:hotLeads,    label:"Hot leads",     color:"#7c3aed" },
              { icon:"📞", val:withPhone,   label:"With phone",    color:"#7c3aed" },
              { icon:"🌐", val:withWebsite, label:"With website",  color:"#3b82f6" },
              { icon:"⭐", val:highRating,  label:"Rating ≥4.0",   color:"#fbbf24" },
              { icon:"🎯", val:noWebsite,   label:"Pitch opp.",    color:"#34d399" },
            ].map(s => (
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:12, fontWeight:800, color:s.color }}>{s.icon} {s.val}</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{s.label}</span>
              </div>
            ))}
          </div>
          {/* Filter chips */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:0.6, marginRight:2 }}>Filter</span>
            {[
              { id:"all",     label:`All (${leads.length})` },
              { id:"hot",     label:`🔥 Hot (${hotLeads})` },
              { id:"phone",   label:`📞 Phone (${withPhone})` },
              { id:"website", label:`🌐 Website (${withWebsite})` },
              { id:"rating",  label:`⭐ ≥4.0 (${highRating})` },
              { id:"no-web",  label:`🎯 No Site (${noWebsite})` },
            ].map(f => (
              <button key={f.id} onClick={() => setFilterMode(f.id)}
                style={{ fontSize:11, fontWeight:600, padding:"4px 11px", borderRadius:20, cursor:"pointer",
                  background: filterMode === f.id ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${filterMode === f.id ? "rgba(124,58,237,0.45)" : "rgba(255,255,255,0.08)"}`,
                  color: filterMode === f.id ? T.accent : "rgba(255,255,255,0.45)", transition:"all 0.15s" }}>
                {f.label}
              </button>
            ))}
          </div>
          {/* Sort chips */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:0.6, marginRight:2 }}>Sort</span>
            {[
              { id:"default", label:"Default" },
              { id:"rating",  label:"⭐ Rating" },
              { id:"reviews", label:"💬 Reviews" },
              { id:"name",    label:"A–Z" },
            ].map(s => (
              <button key={s.id} onClick={() => setSortBy(s.id)}
                style={{ fontSize:11, fontWeight:600, padding:"4px 11px", borderRadius:20, cursor:"pointer",
                  background: sortBy === s.id ? "rgba(59,130,246,0.14)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${sortBy === s.id ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.08)"}`,
                  color: sortBy === s.id ? "#3b82f6" : "rgba(255,255,255,0.45)", transition:"all 0.15s" }}>
                {s.label}
              </button>
            ))}
            {filterMode !== "all" && <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginLeft:6 }}>{filteredLeads.length} of {leads.length} shown</span>}
          </div>
        </div>

        {isMobile ? (
          /* ── Mobile card view ── */
          <div style={{ display:"flex", flexDirection:"column", gap:10, padding:"12px 14px" }}>
            {filteredLeads.length === 0 && (
              <div style={{ textAlign:"center", padding:"48px 24px" }}>
                <div style={{ fontSize:32, marginBottom:10 }}>🔍</div>
                <div style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.55)", marginBottom:6 }}>No leads match this filter</div>
                <button onClick={() => setFilterMode("all")} style={{ fontSize:12, padding:"8px 18px", borderRadius:10, cursor:"pointer", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent, fontFamily:"inherit" }}>Show All</button>
              </div>
            )}
            {filteredLeads.map((lead, idx) => {
              const id       = lead.place_id || lead.business_name;
              const status   = lead.status || "new";
              const sc       = STATUS_CONFIG[status];
              const sel      = selectedIds.has(id);
              const priority = computeLeadPriority(lead);
              const pc       = PRIORITY_CONFIG[priority];
              return (
                <div key={id} style={{ background: sel ? "rgba(124,58,237,0.05)" : "rgba(255,255,255,0.03)", border:`1px solid ${sel ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius:12, padding:"14px 16px", transition:"background 0.15s" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <input type="checkbox" checked={sel} onChange={() => toggleSelect(id)} style={{ accentColor:T.accent, width:16, height:16, cursor:"pointer", flexShrink:0, marginTop:2 }} />
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                          <div style={{ fontWeight:700, color:"#fff", fontSize:14, lineHeight:1.3 }}>{idx+1}. {lead.business_name}</div>
                          {priority !== "low" && <span style={{ fontSize:10, fontWeight:700, color:pc.color, background:pc.bg, border:`1px solid ${pc.border}`, borderRadius:10, padding:"2px 7px", flexShrink:0 }}>{priority === "high" ? "🔥" : "⚡"} {pc.label}</span>}
                        </div>
                        {lead.category && <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>{lead.category}</div>}
                      </div>
                    </div>
                    <select value={status} onChange={e => updateStatus(id, e.target.value)}
                      style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, cursor:"pointer", background:sc.bg, border:`1px solid ${sc.border}`, color:sc.color, outline:"none", appearance:"none", flexShrink:0 }}>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  {lead.address && (
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:8, lineHeight:1.4 }}>📍 {lead.address}</div>
                  )}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:12, fontSize:13, marginBottom:10 }}>
                    {lead.phone && <a href={`tel:${lead.phone}`} style={{ color:T.accent, textDecoration:"none", fontWeight:600 }}>📞 {lead.phone}</a>}
                    {lead.email && <a href={`mailto:${lead.email}`} style={{ color:"#34d399", textDecoration:"none", fontWeight:600 }}>📧 {lead.email}</a>}
                    {lead.rating && <span style={{ color:"#fbbf24", fontWeight:600 }}>★ {lead.rating}</span>}
                    {lead.website && <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ color:"#3b82f6", textDecoration:"none" }}>🌐 Website</a>}
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <button onClick={() => setInsightLead(lead)}
                      style={{ flex:1, minWidth:80, fontSize:12, padding:"9px 0", borderRadius:9, cursor:"pointer", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent, fontWeight:600 }}>
                      🔍 AI Insight
                    </button>
                    <button onClick={() => setMsgLead(lead)}
                      style={{ flex:1, minWidth:80, fontSize:12, padding:"9px 0", borderRadius:9, cursor:"pointer", background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)", color:"#7c3aed", fontWeight:600 }}>
                      🤖 AI Msg
                    </button>
                    {lead.phone && (
                      <a href={`https://wa.me/${lead.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                        style={{ flex:1, minWidth:60, fontSize:12, padding:"9px 0", borderRadius:9, background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.25)", color:"#3b82f6", textDecoration:"none", textAlign:"center", fontWeight:600 }}>
                        💬 WA
                      </a>
                    )}
                    {lead.maps_url && (
                      <a href={lead.maps_url} target="_blank" rel="noopener noreferrer"
                        style={{ flex:1, minWidth:60, fontSize:12, padding:"9px 0", borderRadius:9, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:T.textMuted, textDecoration:"none", textAlign:"center" }}>
                        📍 Maps
                      </a>
                    )}
                    {onSaveLead && <SaveLeadButton lid={lead.place_id || lead.business_name} onSave={() => onSaveLead(lead)} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId} compact={false} style={{ flex:1, minWidth:60 }} />}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Desktop table view ── */
          <div style={{ overflowX:"auto" }}>
            {filteredLeads.length === 0 && (
              <div style={{ textAlign:"center", padding:"56px 24px" }}>
                <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
                <div style={{ fontSize:15, fontWeight:700, color:"rgba(255,255,255,0.55)", marginBottom:8 }}>No leads match this filter</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.3)", marginBottom:16 }}>Try a different filter or clear it to see all {leads.length} leads</div>
                <button onClick={() => setFilterMode("all")} style={{ fontSize:13, padding:"9px 22px", borderRadius:10, cursor:"pointer", background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)", color:T.accent, fontFamily:"inherit" }}>Show All Leads</button>
              </div>
            )}
            {filteredLeads.length > 0 && (
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                  {["","#","Business","Phone","Website","Rating","Address","Status","Actions"].map(h => (
                    <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:0.8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, idx) => {
                  const id       = lead.place_id || lead.business_name;
                  const status   = lead.status || "new";
                  const sc       = STATUS_CONFIG[status];
                  const sel      = selectedIds.has(id);
                  const priority = computeLeadPriority(lead);
                  const pc       = PRIORITY_CONFIG[priority];
                  return (
                    <tr key={id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", background: sel ? "rgba(124,58,237,0.04)" : "transparent", transition:"background 0.15s" }}>
                      <td style={{ padding:"12px 8px 12px 14px" }}>
                        <input type="checkbox" checked={sel} onChange={() => toggleSelect(id)} style={{ accentColor:T.accent, width:15, height:15, cursor:"pointer" }} />
                      </td>
                      <td style={{ padding:"12px 14px", color:T.textMuted }}>{idx+1}</td>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                          <div style={{ fontWeight:600, color:"#fff" }}>{lead.business_name}</div>
                          {priority !== "low" && <span style={{ fontSize:10, fontWeight:700, color:pc.color, background:pc.bg, border:`1px solid ${pc.border}`, borderRadius:8, padding:"1px 6px", flexShrink:0 }}>{priority === "high" ? "🔥 Hot" : "⚡ Warm"}</span>}
                        </div>
                        {lead.category && <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>{lead.category}</div>}
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        {lead.phone ? <a href={`tel:${lead.phone}`} style={{ color:T.accent, textDecoration:"none" }}>{lead.phone}</a> : <span style={{ color:"rgba(255,255,255,0.2)" }}>-</span>}
                      </td>
                      <td style={{ padding:"12px 14px", maxWidth:160 }}>
                        {lead.website ? <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ color:"#3b82f6", textDecoration:"none", display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{lead.website.replace(/^https?:\/\//,"").replace(/\/$/,"")}</a> : <span style={{ color:"rgba(255,255,255,0.2)" }}>-</span>}
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        {lead.rating ? <span style={{ color:"#fbbf24" }}>★ {lead.rating}</span> : <span style={{ color:"rgba(255,255,255,0.2)" }}>-</span>}
                      </td>
                      <td style={{ padding:"12px 14px", maxWidth:180 }}>
                        {lead.address ? <span style={{ fontSize:12, color:"rgba(255,255,255,0.45)", display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={lead.address}>{lead.address}</span> : <span style={{ color:"rgba(255,255,255,0.2)" }}>-</span>}
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <select value={status} onChange={e => updateStatus(id, e.target.value)}
                          style={{ fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:20, cursor:"pointer", background:sc.bg, border:`1px solid ${sc.border}`, color:sc.color, outline:"none", appearance:"none" }}>
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                          <button onClick={() => setInsightLead(lead)}
                            style={{ fontSize:11, padding:"4px 9px", borderRadius:6, cursor:"pointer", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent, fontWeight:600, whiteSpace:"nowrap" }}>
                            🔍 Insight
                          </button>
                          <button onClick={() => setMsgLead(lead)}
                            style={{ fontSize:11, padding:"4px 9px", borderRadius:6, cursor:"pointer", background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)", color:"#7c3aed", fontWeight:600, whiteSpace:"nowrap" }}>
                            🤖 AI Msg
                          </button>
                          {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, padding:"4px 9px", borderRadius:6, background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)", color:"#3b82f6", textDecoration:"none" }}>💬</a>}
                          {lead.maps_url && <a href={lead.maps_url} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, padding:"4px 9px", borderRadius:6, cursor:"pointer", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:T.textMuted, textDecoration:"none" }}>Maps</a>}
                          {onSaveLead && <SaveLeadButton lid={lead.place_id || lead.business_name} onSave={() => onSaveLead(lead)} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, whiteSpace:"nowrap" }} />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            )}
          </div>
        )}
      </ToolCard>

      {onLoadMore && (
        <div style={{ display:"flex", justifyContent:"center" }}>
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            style={{ fontSize:13, fontWeight:700, padding:"10px 24px", borderRadius:10, cursor: loadingMore ? "not-allowed" : "pointer", background: loadingMore ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.35)", color: loadingMore ? "rgba(255,255,255,0.4)" : T.accent, opacity: loadingMore ? 0.7 : 1 }}
          >
            {loadingMore ? "Loading..." : "⬇ Load More Leads"}
          </button>
        </div>
      )}
    </div>
  );
}

