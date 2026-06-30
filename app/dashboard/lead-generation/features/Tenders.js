"use client";
import { useState } from "react";
import { ToolCard, T } from "@/app/dashboard/lead-generation/_shell";
import { safeJson } from "@/lib/frontend/api";

/* ── Tenders: shared constants ─────────────────────────────────────────────── */
const T_SECTORS = [
  { value: "all",                      label: "All Sectors" },
  { value: "IT Software Technology",   label: "IT / Software / Technology" },
  { value: "Construction Civil Works", label: "Construction / Civil Works" },
  { value: "Medical Healthcare Drugs", label: "Medical / Healthcare" },
  { value: "Supply Equipment Goods",   label: "Supply / Equipment / Goods" },
  { value: "Consultancy Advisory",     label: "Consultancy / Advisory" },
  { value: "Infrastructure Roads",     label: "Infrastructure / Roads" },
  { value: "Power Energy Solar",       label: "Power / Energy / Solar" },
  { value: "Agriculture Food",         label: "Agriculture / Food" },
  { value: "Education Training",       label: "Education / Training" },
  { value: "Water Sanitation",         label: "Water / Sanitation" },
  { value: "Transport Logistics",      label: "Transport / Logistics" },
  { value: "Security Defense",         label: "Security / Defense" },
  { value: "Telecommunications",       label: "Telecommunications" },
  { value: "Environment Waste",        label: "Environment / Waste Mgmt" },
];
const T_INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu & Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];
const T_REGIONS = [
  { value: "all",           label: "All Regions (Global)" },
  { value: "South Asia",    label: "South Asia (India, Nepal, Sri Lanka...)" },
  { value: "Southeast Asia",label: "Southeast Asia (Singapore, Malaysia...)" },
  { value: "Africa",        label: "Africa (Kenya, Nigeria, Tanzania...)" },
  { value: "Middle East",   label: "Middle East (UAE, Saudi, Qatar...)" },
  { value: "Europe",        label: "Europe (UK, Germany, France, EU...)" },
  { value: "Americas",      label: "Americas (USA, Canada, Brazil...)" },
  { value: "Pacific",       label: "Pacific (Australia, New Zealand...)" },
  { value: "UN World Bank", label: "UN / World Bank / MDB Projects Only" },
];
const T_FUNDING = [
  { value: "all",               label: "All Funding Sources" },
  { value: "World Bank",        label: "World Bank / IDA / IBRD" },
  { value: "ADB",               label: "Asian Development Bank (ADB)" },
  { value: "UNDP UN",           label: "UNDP / UN Agencies" },
  { value: "AfDB",              label: "African Development Bank (AfDB)" },
  { value: "EU European Union", label: "European Union (EU TED)" },
];
const T_INDIA_MINVALS = [
  {value:"",label:"Any Value"},{value:"₹5 Lakhs",label:"₹5 Lakhs+"},{value:"₹25 Lakhs",label:"₹25 Lakhs+"},{value:"₹1 Crore",label:"₹1 Crore+"},{value:"₹5 Crore",label:"₹5 Crore+"},{value:"₹10 Crore",label:"₹10 Crore+"},{value:"₹50 Crore",label:"₹50 Crore+"},
];
const T_INTL_MINVALS = [
  {value:"",label:"Any Value"},{value:"$10,000 USD",label:"$10,000 USD+"},{value:"$50,000 USD",label:"$50,000 USD+"},{value:"$100,000 USD",label:"$100,000 USD+"},{value:"$500,000 USD",label:"$500,000 USD+"},{value:"$1,000,000 USD",label:"$1 Million USD+"},
];
const TINP = { width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 15px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };

function tDaysColor(d) {
  if (d < 0 || d > 999) return "#6b7280";
  if (d <= 3) return "#7c3aed";
  if (d <= 7) return "#7c3aed";
  if (d <= 14) return "#3b82f6";
  return "#3b82f6";
}

function TFilterSelect({ label, value, onChange, options }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.52)", textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ ...TINP, cursor:"pointer", appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2322C55E' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", paddingRight:36 }}
      >
        {options.map(o => <option key={o.value} value={o.value} style={{ background:"#0f172a", color:"#fff" }}>{o.label}</option>)}
      </select>
    </div>
  );
}

function TenderCard({ tender, isIndia }) {
  const [exp,        setExp]        = useState(false);
  const [aiExp,      setAiExp]      = useState(false);
  const [deepData,   setDeepData]   = useState(null);
  const [deepLoading,setDeepLoading]= useState(false);
  const [deepExp,    setDeepExp]    = useState(false);

  async function handleDeepResearch() {
    if (deepData) { setDeepExp(v => !v); return; }
    setDeepLoading(true);
    try {
      const res  = await fetch("/api/tenders/gem-bid-detail", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tender }),
      });
      const data = await res.json();
      const details = data.details || data;
      if (data.success || details.pro_tips || details.pricing_strategy || details.scope_of_work) { setDeepData(details); setDeepExp(true); }
      else if (!res.ok) { setDeepData({ _error: data.error || "Deep research unavailable. Check your API keys." }); setDeepExp(true); }
    } catch (e) { setDeepData({ _error: "Network error. Please try again." }); setDeepExp(true); }
    setDeepLoading(false);
  }
  const days = tender.days_remaining;
  const dCol = tDaysColor(days);
  const hasLink = tender.direct_link && tender.direct_link !== "N/A" && tender.direct_link.startsWith("http");
  const isTED = hasLink && tender.direct_link.includes("ted.europa.eu");
  const isGeM  = (tender.source_portal || "").startsWith("GeM");
  const portalLower = (tender.source_portal || "").toLowerCase();
  const isCPPP = !isGeM && (portalLower.includes("cppp") || portalLower.includes("eprocure") || portalLower.includes("nicsi"));
  const tid = tender.tender_id && tender.tender_id !== "N/A" ? tender.tender_id : null;
  // For TED: use search link (avoids login). For GeM: bid list search. For CPPP/eProcure: eProcure search.
  const tedSearchLink = isTED && tid
    ? `https://ted.europa.eu/en/search/result?q=${encodeURIComponent(tid)}`
    : null;
  const gemSearchLink = isGeM && tid
    ? `https://bidplus.gem.gov.in/all-bids?bid_no=${encodeURIComponent(tid)}`
    : (isGeM ? "https://bidplus.gem.gov.in/all-bids" : null);
  const cpppSearchLink = isCPPP && tid
    ? `https://eprocure.gov.in/eprocure/app?component=%24DirectLink&page=FrontEndAdvancedSearchResult&service=page&searchString=${encodeURIComponent(tid)}`
    : (isCPPP ? "https://eprocure.gov.in/eprocure/app" : null);
  const portalFallbackLink = tender.portal_registration_link && tender.portal_registration_link.startsWith("http") ? tender.portal_registration_link : null;
  // Direct portal link for tenders that have a portal name but no direct_link
  const portalDirectLink = !hasLink && tid ? (
    isGeM ? gemSearchLink :
    isCPPP ? cpppSearchLink :
    tid.match(/^GEM\//) ? `https://bidplus.gem.gov.in/all-bids?bid_no=${encodeURIComponent(tid)}` :
    portalFallbackLink || null
  ) : null;
  const viewLink = tedSearchLink || gemSearchLink || (hasLink ? tender.direct_link : portalDirectLink || portalFallbackLink);
  const hasAI = !!(tender.ai_summary_english || tender.should_apply_score || tender.win_probability);

  const score = tender.should_apply_score;
  const scoreColor = score >= 8 ? "#22c55e" : score >= 6 ? "#fbbf24" : score >= 4 ? "#f97316" : "#ef4444";
  const strategyColor = tender.strategy_advice?.startsWith("Yes") ? "#22c55e" : tender.strategy_advice?.startsWith("Maybe") ? "#fbbf24" : "#ef4444";
  const diffColor = tender.difficulty_level === "Easy" ? "#22c55e" : tender.difficulty_level === "Medium" ? "#fbbf24" : "#ef4444";
  const riskColor = tender.risk_level === "Low" ? "#22c55e" : tender.risk_level === "Medium" ? "#fbbf24" : "#ef4444";
  const eligColor = tender.eligibility_status === "Eligible for most SMEs" ? "#22c55e" : tender.eligibility_status === "Partially Eligible" ? "#fbbf24" : "#ef4444";

  const infoItems = [
    { label:"Tender ID", value:tender.tender_id },
    { label:"Value",     value:tender.value, accent:"#3b82f6" },
    { label:"Last Date", value:tender.last_date },
    { label:"Published", value:tender.published_date },
    { label:"EMD",       value:tender.emd },
    { label:"Doc Fee",   value:tender.document_fee },
    { label:"Funding",   value:tender.funding_agency !== "Government" ? tender.funding_agency : null },
    { label:"Source",    value:tender.source_portal },
    ...(!isIndia ? [
      { label:"Country",      value:tender.country },
      { label:"Indian Firms", value:tender.indian_firms_eligible, accent:tender.indian_firms_eligible==="YES"?"#3b82f6":tender.indian_firms_eligible==="NO"?"#7c3aed":"#3b82f6" },
    ] : []),
  ].filter(i => i.value && i.value !== "N/A");

  return (
    <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"18px 20px", marginBottom:12, transition:"border-color 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor="rgba(59,130,246,0.35)"}
      onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}
    >
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
            <span style={{ fontSize:10, fontWeight:700, color:"#3b82f6", background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.22)", borderRadius:6, padding:"2px 8px" }}>{isIndia?"🇮🇳 INDIA":"🌍 INTL"}</span>
            {tender.sector && tender.sector !== "N/A" && <span style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.52)", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"2px 8px" }}>{tender.sector}</span>}
            {tender.eligibility_status && <span style={{ fontSize:10, fontWeight:700, color:eligColor, background:`${eligColor}15`, border:`1px solid ${eligColor}35`, borderRadius:6, padding:"2px 8px" }}>{tender.eligibility_status}</span>}
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.45, marginBottom:3 }}>{tender.title}</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.48)" }}>{tender.organization}{tender.state_city && tender.state_city !== "N/A" ? ` • ${tender.state_city}` : ""}</div>
        </div>
        <div style={{ textAlign:"center", flexShrink:0, display:"flex", flexDirection:"column", gap:6, alignItems:"center" }}>
          {days >= 0 && days <= 999 ? (
            <div style={{ background:`${dCol}12`, border:`1px solid ${dCol}35`, borderRadius:10, padding:"7px 12px", minWidth:64 }}>
              <div style={{ fontSize:22, fontWeight:900, color:dCol, lineHeight:1 }}>{days}</div>
              <div style={{ fontSize:9, fontWeight:700, color:dCol, opacity:0.75, letterSpacing:0.5 }}>DAYS LEFT</div>
            </div>
          ) : (
            <div style={{ background:"rgba(107,114,128,0.08)", border:"1px solid rgba(107,114,128,0.2)", borderRadius:10, padding:"7px 12px", minWidth:64 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"#6b7280" }}>?</div>
            </div>
          )}
          {score && (
            <div style={{ background:`${scoreColor}12`, border:`1px solid ${scoreColor}35`, borderRadius:10, padding:"5px 10px", minWidth:64, textAlign:"center" }}>
              <div style={{ fontSize:18, fontWeight:900, color:scoreColor, lineHeight:1 }}>{score}/10</div>
              <div style={{ fontSize:9, fontWeight:700, color:scoreColor, opacity:0.75, letterSpacing:0.5 }}>AI SCORE</div>
            </div>
          )}
        </div>
      </div>

      {/* AI Quick Metrics Row */}
      {hasAI && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
          {tender.win_probability && <span style={{ fontSize:11, fontWeight:700, color:"#7c3aed", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:8, padding:"4px 10px" }}>🎯 {tender.win_probability}</span>}
          {tender.difficulty_level && <span style={{ fontSize:11, fontWeight:700, color:diffColor, background:`${diffColor}12`, border:`1px solid ${diffColor}30`, borderRadius:8, padding:"4px 10px" }}>⚡ {tender.difficulty_level}</span>}
          {tender.risk_level && <span style={{ fontSize:11, fontWeight:700, color:riskColor, background:`${riskColor}12`, border:`1px solid ${riskColor}30`, borderRadius:8, padding:"4px 10px" }}>🛡 Risk: {tender.risk_level}</span>}
          {tender.strategy_advice && <span style={{ fontSize:11, fontWeight:700, color:strategyColor, background:`${strategyColor}12`, border:`1px solid ${strategyColor}30`, borderRadius:8, padding:"4px 10px" }}>💡 {tender.strategy_advice}</span>}
        </div>
      )}

      {/* AI Summary */}
      {tender.ai_summary_english && (
        <div style={{ fontSize:12, color:"#93c5fd", lineHeight:1.65, marginBottom:10, padding:"10px 12px", background:"rgba(59,130,246,0.06)", borderRadius:8, borderLeft:"3px solid #3b82f6" }}>
          🤖 {tender.ai_summary_english}
          {tender.ai_summary_hinglish && <div style={{ marginTop:4, color:"rgba(255,255,255,0.45)", fontSize:11 }}>{tender.ai_summary_hinglish}</div>}
        </div>
      )}

      {infoItems.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))", gap:7, marginBottom:12 }}>
          {infoItems.map((item, i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"7px 10px" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.32)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>{item.label}</div>
              <div style={{ fontSize:12, fontWeight:600, color:item.accent||"rgba(255,255,255,0.78)" }}>{item.value}</div>
            </div>
          ))}
        </div>
      )}

      {tender.scope && tender.scope !== "N/A" && (
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.58)", lineHeight:1.65, marginBottom:10, padding:"10px 12px", background:"rgba(255,255,255,0.025)", borderRadius:8, borderLeft:"3px solid rgba(59,130,246,0.35)" }}>
          {exp ? tender.scope : `${tender.scope.slice(0,200)}${tender.scope.length>200?"…":""}`}
          {tender.scope.length > 200 && <button onClick={() => setExp(!exp)} style={{ background:"none", border:"none", color:"#3b82f6", cursor:"pointer", fontSize:11, marginLeft:6, fontFamily:"inherit" }}>{exp?"less ▲":"more ▼"}</button>}
        </div>
      )}
      {tender.eligibility && tender.eligibility !== "N/A" && (
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.42)", marginBottom:10 }}>
          <span style={{ fontWeight:700, color:"rgba(255,255,255,0.52)" }}>Eligibility: </span>{tender.eligibility}
        </div>
      )}

      {/* Expanded AI Details */}
      {hasAI && (
        <div style={{ marginBottom:10 }}>
          <button onClick={() => setAiExp(!aiExp)} style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:8, color:"#7c3aed", fontSize:11, fontWeight:700, padding:"6px 14px", cursor:"pointer", fontFamily:"inherit" }}>
            {aiExp ? "▲ Hide AI Insights" : "▼ Full AI Analysis"}
          </button>
          {aiExp && (
            <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:8 }}>
              {tender.who_can_apply && (
                <div style={{ padding:"10px 12px", background:"rgba(34,197,94,0.06)", borderRadius:8, borderLeft:"3px solid rgba(34,197,94,0.4)" }}>
                  <div style={{ fontSize:9, fontWeight:700, color:"#22c55e", textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>✅ Who Can Apply</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)" }}>{tender.who_can_apply}</div>
                </div>
              )}
              {tender.who_cannot_apply && (
                <div style={{ padding:"10px 12px", background:"rgba(239,68,68,0.06)", borderRadius:8, borderLeft:"3px solid rgba(239,68,68,0.4)" }}>
                  <div style={{ fontSize:9, fontWeight:700, color:"#ef4444", textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>❌ Who Cannot Apply</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)" }}>{tender.who_cannot_apply}</div>
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:7 }}>
                {tender.min_turnover_required && tender.min_turnover_required !== "Not specified" && (
                  <div style={{ padding:"8px 10px", background:"rgba(255,255,255,0.03)", borderRadius:8 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.32)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>Min Turnover</div>
                    <div style={{ fontSize:12, fontWeight:600, color:"#3b82f6" }}>{tender.min_turnover_required}</div>
                  </div>
                )}
                {tender.required_certifications?.length > 0 && (
                  <div style={{ padding:"8px 10px", background:"rgba(255,255,255,0.03)", borderRadius:8 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.32)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>Certifications</div>
                    <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.78)" }}>{Array.isArray(tender.required_certifications) ? tender.required_certifications.join(", ") : tender.required_certifications}</div>
                  </div>
                )}
              </div>
              {tender.red_flags?.length > 0 && (
                <div style={{ padding:"10px 12px", background:"rgba(124,58,237,0.06)", borderRadius:8, borderLeft:"3px solid rgba(124,58,237,0.4)" }}>
                  <div style={{ fontSize:9, fontWeight:700, color:"#7c3aed", textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>⚠ Red Flags</div>
                  {(Array.isArray(tender.red_flags) ? tender.red_flags : [tender.red_flags]).map((f, i) => (
                    <div key={i} style={{ fontSize:12, color:"rgba(255,255,255,0.62)", marginBottom:2 }}>• {f}</div>
                  ))}
                </div>
              )}
              {tender.bid_tips && (
                <div style={{ padding:"10px 12px", background:"rgba(124,58,237,0.06)", borderRadius:8, borderLeft:"3px solid rgba(124,58,237,0.4)" }}>
                  <div style={{ fontSize:9, fontWeight:700, color:"#7c3aed", textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>💡 Bid Tips</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.72)", lineHeight:1.6 }}>{tender.bid_tips}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Deep Research Panel */}
      {deepExp && deepData && (
        <div style={{ marginBottom:12, padding:"14px 16px", background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:12 }}>
          <div style={{ fontSize:12, fontWeight:800, color:"#a78bfa", marginBottom:10 }}>🔬 Deep Research</div>
          {deepData._error && (
            <div style={{ fontSize:12, color:"#f87171", padding:"8px 10px", background:"rgba(239,68,68,0.08)", borderRadius:8, borderLeft:"2px solid #ef4444" }}>
              {deepData._error.includes("429") || deepData._error.includes("quota")
                ? "AI quota exceeded. Please try again in a few minutes."
                : deepData._error.includes("403") || deepData._error.includes("PERMISSION_DENIED") || deepData._error.includes("dunning")
                  ? "AI service temporarily unavailable. Please try again later."
                  : deepData._error.length > 200
                    ? "Deep research failed. Please try again."
                    : deepData._error}
            </div>
          )}
          {deepData.scope_of_work && deepData.scope_of_work !== "N/A" && (
            <div style={{ marginBottom:8 }}>
              <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>Scope of Work</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", lineHeight:1.6 }}>{deepData.scope_of_work}</div>
            </div>
          )}
          {deepData.eligibility_criteria && deepData.eligibility_criteria !== "N/A" && (
            <div style={{ marginBottom:8, padding:"8px 10px", background:"rgba(34,197,94,0.07)", borderRadius:8, borderLeft:"2px solid #22c55e" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#22c55e", textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>Eligibility Criteria</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)" }}>{deepData.eligibility_criteria}</div>
              {deepData.min_turnover_required && deepData.min_turnover_required !== "N/A" && <div style={{ fontSize:11, color:"#22c55e", marginTop:3 }}>Min Turnover: {deepData.min_turnover_required}</div>}
              {deepData.min_experience_required && deepData.min_experience_required !== "N/A" && <div style={{ fontSize:11, color:"#fbbf24", marginTop:2 }}>Min Experience: {deepData.min_experience_required}</div>}
            </div>
          )}
          {/* Buyer Intelligence - always available from AI analysis */}
          {(deepData.competition_level || deepData.buyer_reputation || deepData.l1_price_estimate) && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7, marginBottom:8 }}>
              {deepData.buyer_reputation && <div style={{ padding:"8px 10px", background:"rgba(255,255,255,0.03)", borderRadius:8 }}><div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.32)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>Buyer Rep</div><div style={{ fontSize:12, fontWeight:700, color:"#3b82f6" }}>{deepData.buyer_reputation}</div></div>}
              {deepData.competition_level && <div style={{ padding:"8px 10px", background:"rgba(255,255,255,0.03)", borderRadius:8 }}><div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.32)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>Competition</div><div style={{ fontSize:12, fontWeight:700, color: deepData.competition_level==="Low"?"#22c55e":deepData.competition_level==="High"?"#ef4444":"#fbbf24" }}>{deepData.competition_level}</div></div>}
              {deepData.estimated_bidders && <div style={{ padding:"8px 10px", background:"rgba(255,255,255,0.03)", borderRadius:8 }}><div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.32)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>Est. Bidders</div><div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.78)" }}>{deepData.estimated_bidders}</div></div>}
            </div>
          )}
          {deepData.l1_price_estimate && (
            <div style={{ marginBottom:8, padding:"8px 10px", background:"rgba(59,130,246,0.07)", borderRadius:8, borderLeft:"2px solid #3b82f6" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#3b82f6", textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>💰 Estimated L1 Price Range</div>
              <div style={{ fontSize:13, fontWeight:800, color:"#60a5fa" }}>{deepData.l1_price_estimate}</div>
              {deepData.typical_l1_discount && <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:2 }}>{deepData.typical_l1_discount}</div>}
            </div>
          )}
          {(deepData.documents_required?.length > 0 || deepData.required_certifications?.length > 0) && (
            <div style={{ marginBottom:8 }}>
              <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>📋 Documents Required</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {[...(deepData.documents_required || []), ...(deepData.required_certifications || [])].map((doc, i) => (
                  <span key={i} style={{ fontSize:11, padding:"3px 9px", borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.7)" }}>📄 {doc}</span>
                ))}
              </div>
            </div>
          )}
          {(deepData.mse_exemption || deepData.startup_exemption) && (
            <div style={{ display:"flex", gap:8, marginBottom:8, flexWrap:"wrap" }}>
              {deepData.mse_exemption === "yes" && <span style={{ fontSize:11, padding:"3px 9px", borderRadius:6, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", color:"#22c55e" }}>✅ MSE/MSME EMD Exempt</span>}
              {deepData.startup_exemption === "yes" && <span style={{ fontSize:11, padding:"3px 9px", borderRadius:6, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", color:"#22c55e" }}>✅ Startup Exempt</span>}
            </div>
          )}
          {deepData.hidden_conditions?.length > 0 && (
            <div style={{ marginBottom:8, padding:"8px 10px", background:"rgba(251,191,36,0.07)", borderRadius:8, borderLeft:"2px solid #fbbf24" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#fbbf24", textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>⚠ Hidden Conditions</div>
              {(Array.isArray(deepData.hidden_conditions) ? deepData.hidden_conditions : [deepData.hidden_conditions]).map((c, i) => <div key={i} style={{ fontSize:12, color:"rgba(255,255,255,0.68)", marginBottom:2 }}>• {c}</div>)}
            </div>
          )}
          {deepData.pro_tips?.length > 0 && (
            <div style={{ padding:"8px 10px", background:"rgba(124,58,237,0.08)", borderRadius:8, borderLeft:"2px solid #7c3aed", marginBottom:8 }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#a78bfa", textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>💡 Pro Tips to Win</div>
              {deepData.pro_tips.map((tip, i) => <div key={i} style={{ fontSize:12, color:"rgba(255,255,255,0.72)", marginBottom:2 }}>• {tip}</div>)}
            </div>
          )}
          {deepData.pricing_strategy && (
            <div style={{ padding:"8px 10px", background:"rgba(251,191,36,0.07)", borderRadius:8, borderLeft:"2px solid #fbbf24" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#fbbf24", textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>💰 Pricing Strategy</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.72)" }}>{deepData.pricing_strategy}</div>
            </div>
          )}
        </div>
      )}

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        {viewLink && <a href={viewLink} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, fontWeight:700, padding:"8px 18px", borderRadius:8, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.3)", color:"#3b82f6", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:5 }}>{hasLink ? "🔗 Apply Now →" : isGeM ? "🏛️ Open on GeM →" : isCPPP ? "🏛️ Open on eProcure →" : portalDirectLink ? "🏛️ Open Portal →" : "🔍 Search on Google →"}</a>}
        <button onClick={handleDeepResearch} disabled={deepLoading}
          style={{ fontSize:12, fontWeight:700, padding:"8px 14px", borderRadius:8, cursor:deepLoading?"wait":"pointer",
            background: deepExp ? "rgba(124,58,237,0.15)" : "rgba(124,58,237,0.08)",
            border:`1px solid ${deepExp ? "rgba(124,58,237,0.4)" : "rgba(124,58,237,0.25)"}`,
            color:"#a78bfa", display:"inline-flex", alignItems:"center", gap:5 }}>
          {deepLoading ? "⏳ Researching..." : deepExp ? "▲ Hide Deep Research" : "🔬 Deep Research"}
        </button>
        {tender.source_portal && <span style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.45)" }}>📡 {tender.source_portal}</span>}
        {tender.bid_opening_date && tender.bid_opening_date !== "N/A" && <span style={{ fontSize:11, color:"rgba(255,255,255,0.38)", padding:"8px 10px", background:"rgba(255,255,255,0.03)", borderRadius:8, border:"1px solid rgba(255,255,255,0.07)" }}>📅 Opening: {tender.bid_opening_date}</span>}
      </div>
    </div>
  );
}

function TenderSummaryBar({ tenders, isIndia, onExport }) {
  const urgent   = tenders.filter(t => t.days_remaining >= 0 && t.days_remaining <= 7).length;
  const eligible = !isIndia ? tenders.filter(t => t.indian_firms_eligible === "YES").length : null;
  const highest  = tenders.reduce((b, t) => { const v = parseFloat((t.value||"0").replace(/[^0-9.]/g,""))||0; const bv = parseFloat((b?.value||"0").replace(/[^0-9.]/g,""))||0; return v > bv ? t : b; }, null);
  return (
    <div style={{ background:"rgba(59,130,246,0.05)", border:"1px solid rgba(59,130,246,0.18)", borderRadius:14, padding:"16px 20px", marginBottom:16, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", justifyContent:"space-between" }}>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
        <div><div style={{ fontSize:22, fontWeight:900, color:"#3b82f6" }}>{tenders.length}</div><div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.42)", textTransform:"uppercase", letterSpacing:0.5 }}>Total Tenders</div></div>
        {urgent > 0 && <div><div style={{ fontSize:22, fontWeight:900, color:"#7c3aed" }}>{urgent}</div><div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.42)", textTransform:"uppercase", letterSpacing:0.5 }}>Closing ≤7 Days</div></div>}
        {eligible !== null && <div><div style={{ fontSize:22, fontWeight:900, color:"#3b82f6" }}>{eligible}</div><div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.42)", textTransform:"uppercase", letterSpacing:0.5 }}>Indian Firms YES</div></div>}
        {highest?.value && highest.value !== "N/A" && <div><div style={{ fontSize:14, fontWeight:800, color:"#7c3aed", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{highest.value}</div><div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.42)", textTransform:"uppercase", letterSpacing:0.5 }}>Highest Value</div></div>}
      </div>
      <button onClick={onExport} style={{ fontSize:12, fontWeight:700, padding:"10px 20px", borderRadius:10, background:"rgba(59,130,246,0.12)", border:"1px solid rgba(59,130,246,0.3)", color:"#3b82f6", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>⬇ Export CSV</button>
    </div>
  );
}
export {
  T_SECTORS, T_INDIA_STATES, T_REGIONS, T_FUNDING,
  T_INDIA_MINVALS, T_INTL_MINVALS, TINP,
  tDaysColor, TFilterSelect, TenderCard, TenderSummaryBar,
};

