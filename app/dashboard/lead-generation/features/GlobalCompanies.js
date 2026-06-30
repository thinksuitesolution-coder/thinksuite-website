"use client";
import { useState } from "react";
import { ToolCard, PrimaryButton, T } from "@/app/dashboard/lead-generation/_shell";

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

export const INTL_COUNTRIES = [
  // Asia-Pacific
  "UAE","Saudi Arabia","Qatar","Kuwait","Bahrain","Oman",
  "Pakistan","Bangladesh","Sri Lanka","Nepal","Myanmar",
  "Malaysia","Singapore","Indonesia","Philippines","Thailand","Vietnam","Cambodia",
  "Japan","China","Hong Kong","Taiwan","South Korea","Mongolia",
  "Australia","New Zealand",
  // Europe
  "United Kingdom","Germany","France","Netherlands","Italy","Spain",
  "Sweden","Norway","Denmark","Switzerland","Belgium","Poland","Portugal",
  "Ireland","Austria","Czech Republic","Hungary","Romania","Greece","Finland",
  "Ukraine","Russia","Turkey",
  // Americas
  "United States","Canada","Mexico","Brazil","Argentina","Colombia","Chile","Peru",
  "Venezuela","Ecuador","Bolivia","Paraguay","Uruguay",
  // Africa
  "Nigeria","South Africa","Kenya","Ghana","Ethiopia","Egypt","Morocco","Tanzania",
  "Uganda","Rwanda","Senegal","Ivory Coast","Cameroon","Zambia","Zimbabwe",
  // Middle East & North Africa
  "Israel","Jordan","Lebanon","Iraq","Iran",
];

const INTL_CO_CATS = [
  {v:"any",           l:"All Industries",  i:"🏢"},
  {v:"technology",    l:"IT & Software",   i:"💻"},
  {v:"ecommerce",     l:"E-commerce",      i:"🛒"},
  {v:"manufacturing", l:"Manufacturing",   i:"🏭"},
  {v:"trading",       l:"Trading",         i:"🚢"},
  {v:"healthcare",    l:"Healthcare",      i:"🏥"},
  {v:"real-estate",   l:"Real Estate",     i:"🏗️"},
  {v:"education",     l:"Education",       i:"🎓"},
  {v:"finance",       l:"Finance",         i:"💰"},
  {v:"logistics",     l:"Logistics",       i:"🚛"},
  {v:"hospitality",   l:"Hospitality",     i:"🏨"},
  {v:"food-beverage", l:"Food & Beverage", i:"🍽️"},
  {v:"media",         l:"Media",           i:"🎬"},
  {v:"consulting",    l:"Consulting",      i:"📊"},
  {v:"energy",        l:"Energy",          i:"⚡"},
  {v:"automotive",    l:"Automotive",      i:"🚗"},
];

export function IntlCompaniesInput({ onSubmit, loading }) {
  const [botStep,     setBotStep]     = useState(1);
  const [industry,    setIndustry]    = useState("any");
  const [country,     setCountry]     = useState("");
  const [city,        setCity]        = useState("");
  const [companySize, setCompanySize] = useState("any");
  const [count,       setCount]       = useState(15);
  const [error,       setError]       = useState("");

  function handleSubmit() {
    if (!country) { setError("Please select a country"); return; }
    setError("");
    onSubmit({ country, city, industry, companySize, count });
  }

  return (
    <ToolCard>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:"rgba(124,58,237,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌍</div>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:"#fff" }}>Global Companies</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>Real data from LinkedIn, Crunchbase, Clutch, country directories - not AI generated</div>
        </div>
      </div>
      <div style={{ marginBottom:16, padding:"9px 13px", background:"rgba(251,191,36,0.07)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:9, fontSize:11, color:"rgba(255,255,255,0.65)" }}>
        ⚠️ <strong style={{ color:"#fbbf24" }}>Real data:</strong> AI searches LinkedIn, Crunchbase, Clutch for actual companies. Contact enriched from Google/website.
      </div>
      <div style={{ display:"flex", alignItems:"center", marginBottom:22, padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
        {["Industry","Country","Confirm"].map((label,i) => (
          <div key={label} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background: botStep>i+1?"#22c55e":botStep===i+1?T.accent:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.3)" }}>{botStep>i+1?"✓":i+1}</div>
              <span style={{ fontSize:12, fontWeight:botStep===i+1?600:400, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.35)" }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)", margin:"0 8px" }} />}
          </div>
        ))}
      </div>
      {botStep === 1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"10px 14px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>Which industry companies do you need?</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Choose a category + company size</div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:7, marginBottom:14 }}>
              {INTL_CO_CATS.map(c => (
                <button key={c.v} onClick={() => setIndustry(c.v)}
                  style={{ padding:"8px 8px", borderRadius:9, cursor:"pointer", textAlign:"left",
                    background: industry===c.v?"rgba(124,58,237,0.18)":"rgba(255,255,255,0.04)",
                    border: industry===c.v?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                    color: industry===c.v?T.accent:"rgba(255,255,255,0.65)" }}>
                  <span style={{ fontSize:16, display:"block", marginBottom:2 }}>{c.i}</span>
                  <span style={{ fontSize:11, fontWeight:600 }}>{c.l}</span>
                </button>
              ))}
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.5)", marginBottom:7 }}>Company Size</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {[{v:"any",l:"Any"},{v:"startup",l:"Startup (<10)"},{v:"small",l:"Small (10-50)"},{v:"sme",l:"SME (50-500)"},{v:"enterprise",l:"Enterprise (500+)"}].map(s => (
                  <button key={s.v} onClick={() => setCompanySize(s.v)}
                    style={{ fontSize:11, padding:"5px 11px", borderRadius:20, cursor:"pointer",
                      background: companySize===s.v?"rgba(124,58,237,0.15)":"rgba(255,255,255,0.04)",
                      border: companySize===s.v?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                      color: companySize===s.v?T.accent:"rgba(255,255,255,0.55)" }}>{s.l}</button>
                ))}
              </div>
            </div>
            <PrimaryButton onClick={() => setBotStep(2)}>Next: Country →</PrimaryButton>
          </div>
        </div>
      )}
      {botStep === 2 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:8, alignItems:"center" }}>
            <div style={{ background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:"12px 4px 12px 12px", padding:"7px 13px" }}>
              <span style={{ fontSize:12, fontWeight:600, color:T.accent }}>{INTL_CO_CATS.find(c=>c.v===industry)?.l || "Any"} · {companySize}</span>
            </div>
            <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>👤</div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"10px 14px", flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>Select Country + City</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Country mandatory - city optional</div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
              <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...inp, cursor:"pointer" }}>
                <option value="">Select Country *</option>
                {[...INTL_COUNTRIES].sort((a,b) => a.localeCompare(b)).map(c => <option key={c} value={c} style={{ color:"#111", background:"#fff" }}>{c}</option>)}
              </select>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="City (optional)"
                style={{ ...inp }} onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>Count</div>
              <div style={{ display:"flex", gap:7 }}>
                {[10,15,20,25].map(n => (
                  <button key={n} onClick={() => setCount(n)}
                    style={{ padding:"5px 13px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:600,
                      background: count===n?"rgba(124,58,237,0.15)":"rgba(255,255,255,0.04)",
                      border: count===n?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.12)",
                      color: count===n?T.accent:"rgba(255,255,255,0.5)" }}>{n}</button>
                ))}
              </div>
            </div>
            {error && <div style={{ color:"#f87171", fontSize:12, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(1)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={() => setBotStep(3)}>Next: Confirm →</PrimaryButton>
            </div>
          </div>
        </div>
      )}
      {botStep === 3 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"12px 16px", flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:8 }}>Confirm - ready to start the search?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>🏢 <strong style={{ color:"#fff" }}>Industry:</strong> {INTL_CO_CATS.find(c=>c.v===industry)?.l || "Any"}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>📊 <strong style={{ color:"#fff" }}>Size:</strong> {companySize}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>📍 <strong style={{ color:"#fff" }}>Location:</strong> {[city,country].filter(Boolean).join(", ")}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>🔢 <strong style={{ color:"#fff" }}>Count:</strong> {count}</div>
              </div>
              <div style={{ marginTop:8, fontSize:11, color:"rgba(124,58,237,0.7)" }}>
                📡 Real data: LinkedIn • Crunchbase • Clutch • Country Directories + Google contact enrichment
              </div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            {error && <div style={{ color:"#f87171", fontSize:12, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(2)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton disabled={loading} onClick={handleSubmit}>
                {loading ? "⏳ Fetching..." : "🌍 Find Global Companies"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

export function IntlCompaniesResults({ leads, params, onReset, onSaveLead, savedLeadIds, savingLeadId }) {
  const [copiedId,   setCopiedId]   = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  return (
    <ToolCard>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#e9d5ff" }}>🌍 {leads.length} Companies Found</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
            {params.city ? `${params.city}, ` : ""}{params.country}
            {params.industry !== "any" && ` · ${params.industry}`}
            {params.companySize !== "any" && ` · ${params.companySize}`}
          </div>
        </div>
        <button onClick={onReset} style={ghostBtn}>🔄 New Search</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {leads.map(lead => {
          const lid      = lead.id;
          const saved    = savedLeadIds?.has(lid);
          const saving   = savingLeadId === lid;
          const expanded = expandedId === lid;

          return (
            <div key={lid} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{lead.businessName}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>{lead.industry} · {lead.employeeCount} employees · Est. {lead.founded}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa" }}>🌍 {lead.city ? `${lead.city}, ` : ""}{lead.country}</span>
                      {lead.annualRevenue && <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#86efac" }}>💰 {lead.annualRevenue}</span>}
                      {lead.contactDesignation && <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>{lead.contactPerson} · {lead.contactDesignation}</span>}
                    </div>
                    {lead.growthSignal && <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>{lead.growthSignal}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => setExpandedId(expanded ? null : lid)} style={{ ...ghostBtn, fontSize: 11 }}>{expanded ? "▲ Less" : "▼ More"}</button>
                    <button onClick={() => !saved && !saving && onSaveLead(lead, lid)} style={{ fontSize: 11, fontWeight: 700, padding: "7px 14px", borderRadius: 10, cursor: saved ? "default" : "pointer", background: saved ? "rgba(34,197,94,0.15)" : "rgba(124,58,237,0.15)", border: `1px solid ${saved ? "rgba(34,197,94,0.3)" : "rgba(124,58,237,0.3)"}`, color: saved ? "#86efac" : "#c4b5fd" }}>
                      {saving ? "⏳" : saved ? "✅ Saved" : "💾 Save"}
                    </button>
                  </div>
                </div>

                {(lead.aiPitch || lead.description) && (
                  <div style={{ marginTop: 10, padding: "10px 12px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#c4b5fd", marginBottom: 4 }}>🤖 {lead.aiPitch ? "AI Pitch" : "About"}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{lead.aiPitch || lead.description}</div>
                  </div>
                )}
              </div>

              {expanded && (
                <div style={{ padding: "0 16px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                  {lead.dataSource === "real" && <div style={{ marginBottom:8, fontSize:11, color:"#22c55e", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:6, padding:"3px 10px", display:"inline-block" }}>✅ Real data - not AI generated</div>}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 10 }}>
                    {[
                      { label: "Contact",      val: lead.contactPerson && `${lead.contactPerson}${lead.contactDesignation ? ` (${lead.contactDesignation})` : ""}` },
                      { label: "📞 Phone",     val: lead.phone },
                      { label: "📧 Email",     val: lead.email },
                      { label: "🌐 Website",   val: lead.website },
                      { label: "💼 LinkedIn",  val: lead.linkedinUrl },
                      { label: "👥 Employees", val: lead.employeeCount },
                      { label: "📅 Founded",   val: lead.founded },
                      { label: "💰 Revenue",   val: lead.annualRevenue },
                      { label: "Address",      val: lead.address },
                    ].filter(f => f.val).map(f => (
                      <div key={f.label}>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>{f.label}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", wordBreak: "break-all" }}>{f.val}</div>
                      </div>
                    ))}
                  </div>
                  {lead.needsServices?.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>SERVICES THEY NEED</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {lead.needsServices.map(s => <span key={s} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd" }}>✓ {s}</span>)}
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => { navigator.clipboard.writeText(lead.aiPitch || ""); setCopiedId(lid); setTimeout(() => setCopiedId(null), 2000); }} style={ghostBtn}>{copiedId === lid ? "✅ Copied" : "📋 Copy Pitch"}</button>
                    {lead.email && <button onClick={() => navigator.clipboard.writeText(lead.email)} style={ghostBtn}>📧 Copy Email</button>}
                    {lead.website && <button onClick={() => window.open(lead.website.startsWith("http") ? lead.website : `https://${lead.website}`, "_blank")} style={ghostBtn}>🌐 Website</button>}
                    {lead.linkedinUrl && <button onClick={() => window.open(`https://${lead.linkedinUrl.replace(/^https?:\/\//, "")}`, "_blank")} style={ghostBtn}>💼 LinkedIn</button>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ToolCard>
  );
}

