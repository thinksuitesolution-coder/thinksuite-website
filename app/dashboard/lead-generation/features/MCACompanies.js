"use client";
import { useState } from "react";
import { ToolCard, PrimaryButton, T } from "@/app/dashboard/lead-generation/_shell";
import { STATES, STATE_CITIES } from "@/lib/frontend/constants";

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

const MCA_CATS = [
  {v:"it-software",      l:"IT & Software",      i:"💻"},
  {v:"digital-marketing",l:"Digital Marketing",   i:"📣"},
  {v:"ecommerce",        l:"E-commerce",          i:"🛒"},
  {v:"manufacturing",    l:"Manufacturing",        i:"🏭"},
  {v:"trading",          l:"Trading/Import-Export",i:"🚢"},
  {v:"consulting",       l:"Consulting",           i:"📊"},
  {v:"healthcare",       l:"Healthcare/Pharma",    i:"🏥"},
  {v:"real-estate",      l:"Real Estate",          i:"🏗️"},
  {v:"education",        l:"Education/EdTech",     i:"🎓"},
  {v:"finance",          l:"Finance/NBFC",         i:"💰"},
  {v:"logistics",        l:"Logistics",            i:"🚛"},
  {v:"food-beverage",    l:"Food & Beverage",      i:"🍽️"},
  {v:"media-entertainment",l:"Media/Entertainment",i:"🎬"},
  {v:"any",              l:"Any Category",          i:"🌐"},
];

export function McaCompaniesInput({ onSubmit, loading }) {
  const [botStep,          setBotStep]          = useState(1);
  const [businessType,     setBusinessType]     = useState("any");
  const [registrationType, setRegistrationType] = useState("new");
  const [state,            setState]            = useState("");
  const [city,             setCity]             = useState("");
  const [daysRange,        setDaysRange]        = useState(30);
  const [yearRange,        setYearRange]        = useState("2020-2024");
  const [count,            setCount]            = useState(15);
  const [error,            setError]            = useState("");
  const cities = STATE_CITIES[state] || [];

  function handleStep2() {
    if (!state) { setError("Please select a state"); return; }
    setError(""); setBotStep(3);
  }

  function handleSubmit() {
    if (!state) { setError("State required"); return; }
    setError("");
    onSubmit({ state, city, businessType, registrationType, daysRange, yearRange, count });
  }

  return (
    <ToolCard>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:"rgba(124,58,237,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🏛️</div>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:"#fff" }}>MCA Fresh Companies</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>Real companies from MCA21 database - scraped from Zaubacorp + contact enriched from Google</div>
        </div>
      </div>

      {/* Important notice */}
      <div style={{ marginBottom:18, padding:"10px 14px", background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.25)", borderRadius:10, fontSize:12, color:"rgba(255,255,255,0.7)", lineHeight:1.6 }}>
        ⚠️ <strong style={{ color:"#fbbf24" }}>Real data:</strong> MCA records have company name, CIN, director. Phone/email is found separately by searching Google/website.
      </div>

      {/* Steps */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:22, padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
        {["Category","Location","Confirm"].map((label,i) => (
          <div key={label} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background: botStep>i+1?"#22c55e":botStep===i+1?T.accent:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.3)" }}>{botStep>i+1?"✓":i+1}</div>
              <span style={{ fontSize:12, fontWeight:botStep===i+1?600:400, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.35)" }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)", margin:"0 8px" }} />}
          </div>
        ))}
      </div>

      {/* STEP 1 - Category */}
      {botStep === 1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"10px 14px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>Which category of companies are you looking for?</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>IT, Real Estate, Manufacturing - choose a category</div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:7, marginBottom:14 }}>
              {MCA_CATS.map(c => (
                <button key={c.v} onClick={() => setBusinessType(c.v)}
                  style={{ padding:"8px 10px", borderRadius:9, cursor:"pointer", textAlign:"left",
                    background: businessType===c.v?"rgba(124,58,237,0.18)":"rgba(255,255,255,0.04)",
                    border: businessType===c.v?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                    color: businessType===c.v?T.accent:"rgba(255,255,255,0.65)" }}>
                  <span style={{ fontSize:16, display:"block", marginBottom:3 }}>{c.i}</span>
                  <span style={{ fontSize:11, fontWeight:600 }}>{c.l}</span>
                </button>
              ))}
            </div>
            {/* Registration type */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.5)", marginBottom:7 }}>Company Age</div>
              <div style={{ display:"flex", gap:8 }}>
                {[{v:"new",l:"🔥 New (Fresh)",d:"Recently registered"},{v:"established",l:"🏢 Established",d:"Older companies"},{v:"any",l:"🌐 All",d:"Any age"}].map(t => (
                  <button key={t.v} onClick={() => setRegistrationType(t.v)}
                    style={{ flex:1, padding:"8px 6px", borderRadius:9, cursor:"pointer",
                      background: registrationType===t.v?"rgba(124,58,237,0.18)":"rgba(255,255,255,0.04)",
                      border: registrationType===t.v?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                      color: registrationType===t.v?T.accent:"rgba(255,255,255,0.6)" }}>
                    <div style={{ fontSize:12, fontWeight:700 }}>{t.l}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{t.d}</div>
                  </button>
                ))}
              </div>
            </div>
            {/* Days/Year range */}
            {registrationType === "new" && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>Registered in last</div>
                <div style={{ display:"flex", gap:7 }}>
                  {[7,15,30,60,90].map(n => (
                    <button key={n} onClick={() => setDaysRange(n)}
                      style={{ padding:"6px 12px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:600,
                        background: daysRange===n?"rgba(124,58,237,0.15)":"rgba(255,255,255,0.04)",
                        border: daysRange===n?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                        color: daysRange===n?T.accent:"rgba(255,255,255,0.5)" }}>{n} days</button>
                  ))}
                </div>
              </div>
            )}
            {registrationType === "established" && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>Year Range</div>
                <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                  {["2023-2025","2020-2022","2017-2019","2014-2016","2010-2013"].map(yr => (
                    <button key={yr} onClick={() => setYearRange(yr)}
                      style={{ padding:"6px 12px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:600,
                        background: yearRange===yr?"rgba(124,58,237,0.15)":"rgba(255,255,255,0.04)",
                        border: yearRange===yr?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                        color: yearRange===yr?T.accent:"rgba(255,255,255,0.5)" }}>{yr}</button>
                  ))}
                </div>
              </div>
            )}
            <PrimaryButton onClick={() => setBotStep(2)}>Next: Location →</PrimaryButton>
          </div>
        </div>
      )}

      {/* STEP 2 - Location */}
      {botStep === 2 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:8, alignItems:"center" }}>
            <div style={{ background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:"12px 4px 12px 12px", padding:"7px 13px" }}>
              <span style={{ fontSize:12, fontWeight:600, color:T.accent }}>{MCA_CATS.find(c=>c.v===businessType)?.l || "Any"} · {registrationType}</span>
            </div>
            <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>👤</div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"10px 14px", flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>Select State + City</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>State is required - Zaubacorp provides state-wise data</div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
              <select value={state} onChange={e => { setState(e.target.value); setCity(""); }} style={{ ...inp, cursor:"pointer" }}>
                <option value="">Select State *</option>
                {STATES.map(s => <option key={s} value={s} style={{ color:"#111", background:"#fff" }}>{s}</option>)}
              </select>
              <select value={city} onChange={e => setCity(e.target.value)} style={{ ...inp, cursor:"pointer" }} disabled={!state}>
                <option value="">All Cities</option>
                {cities.map(c => <option key={c} value={c} style={{ color:"#111", background:"#fff" }}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>Results Count</div>
              <div style={{ display:"flex", gap:7 }}>
                {[10,15,20,25].map(n => (
                  <button key={n} onClick={() => setCount(n)}
                    style={{ padding:"6px 14px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:600,
                      background: count===n?"rgba(124,58,237,0.15)":"rgba(255,255,255,0.04)",
                      border: count===n?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                      color: count===n?T.accent:"rgba(255,255,255,0.5)" }}>{n}</button>
                ))}
              </div>
            </div>
            {error && <div style={{ color:"#f87171", fontSize:12, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(1)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={handleStep2}>Next: Confirm →</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 - Confirm */}
      {botStep === 3 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"12px 16px", flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:8 }}>Confirm - ready to start the search?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>🏢 <strong style={{ color:"#fff" }}>Category:</strong> {MCA_CATS.find(c=>c.v===businessType)?.l || "Any"}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>📅 <strong style={{ color:"#fff" }}>Age:</strong> {registrationType==="new"?`Last ${daysRange} days`:registrationType==="established"?yearRange:"All"}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>📍 <strong style={{ color:"#fff" }}>Location:</strong> {[city,state].filter(Boolean).join(", ")}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>📊 <strong style={{ color:"#fff" }}>Count:</strong> {count} companies</div>
              </div>
              <div style={{ marginTop:8, fontSize:11, color:"rgba(124,58,237,0.7)", lineHeight:1.5 }}>
                📡 Real data from: Zaubacorp → MCA21 records + Google contact enrichment
              </div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            {error && <div style={{ color:"#f87171", fontSize:12, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(2)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton disabled={loading} onClick={handleSubmit}>
                {loading ? "⏳ Fetching real data..." : "🏛️ Find MCA Companies"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

export function McaCompaniesResults({ leads, params, onReset, onSaveLead, savedLeadIds, savingLeadId }) {
  const [copiedId,   setCopiedId]   = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const regBadge = params.registrationType === "new"
    ? { label: `Last ${params.daysRange || 30} days`, color: "#f87171", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" }
    : params.registrationType === "established"
    ? { label: params.yearRange || "Established", color: "#60a5fa", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)" }
    : { label: "All", color: "#a3e635", bg: "rgba(163,230,53,0.1)", border: "rgba(163,230,53,0.25)" };

  return (
    <ToolCard>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#e9d5ff" }}>🏛️ {leads.length} Companies Found</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
            {params.city || params.state}
            {params.businessType !== "any" && ` · ${params.businessType}`}
            &nbsp;·&nbsp;
            <span style={{ padding: "2px 8px", borderRadius: 6, background: regBadge.bg, border: `1px solid ${regBadge.border}`, color: regBadge.color, fontWeight: 700 }}>{regBadge.label}</span>
          </div>
        </div>
        <button onClick={onReset} style={ghostBtn}>🔄 New Search</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {leads.map(lead => {
          const lid     = lead.id;
          const saved   = savedLeadIds?.has(lid);
          const saving  = savingLeadId === lid;
          const expanded = expandedId === lid;

          return (
            <div key={lid} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{lead.businessName}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", marginBottom: 6 }}>{lead.cin}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {lead.daysAgo > 0 && <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontWeight: 700 }}>🔥 {lead.daysAgo}d ago</span>}
                      {lead.incorporationDate && <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>📅 {lead.incorporationDate}</span>}
                      <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>{lead.companyType}</span>
                      <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>💰 {lead.authorizedCapital}</span>
                      <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>📍 {lead.city || lead.state}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => setExpandedId(expanded ? null : lid)} style={{ ...ghostBtn, fontSize: 11 }}>{expanded ? "▲ Less" : "▼ More"}</button>
                    <button onClick={() => !saved && !saving && onSaveLead(lead, lid)} style={{ fontSize: 11, fontWeight: 700, padding: "7px 14px", borderRadius: 10, cursor: saved ? "default" : "pointer", background: saved ? "rgba(34,197,94,0.15)" : "rgba(124,58,237,0.15)", border: `1px solid ${saved ? "rgba(34,197,94,0.3)" : "rgba(124,58,237,0.3)"}`, color: saved ? "#86efac" : "#c4b5fd" }}>
                      {saving ? "⏳" : saved ? "✅ Saved" : "💾 Save"}
                    </button>
                  </div>
                </div>

                {(lead.aiPitch || lead.businessActivity) && (
                  <div style={{ marginTop: 10, padding: "10px 12px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#c4b5fd", marginBottom: 4 }}>🤖 {lead.aiPitch ? "AI Pitch" : "Business Activity"}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{lead.aiPitch || lead.businessActivity}</div>
                  </div>
                )}
              </div>

              {expanded && (
                <div style={{ padding: "0 16px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                  {lead.dataSource === "real" && <div style={{ marginBottom:8, fontSize:11, color:"#22c55e", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:6, padding:"3px 10px", display:"inline-block" }}>✅ Real MCA data - not AI generated</div>}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 10 }}>
                    {[
                      { label: "Director",   val: lead.directorName },
                      { label: "📞 Phone",   val: lead.phone },
                      { label: "📧 Email",   val: lead.email },
                      { label: "CIN",        val: lead.cin },
                      { label: "Activity",   val: lead.businessActivity },
                      { label: "Capital",    val: lead.authorizedCapital },
                      { label: "Budget Est.",val: lead.estimatedBudget },
                      { label: "Address",    val: lead.address },
                      { label: "Pincode",    val: lead.pincode },
                    ].filter(f => f.val).map(f => (
                      <div key={f.label}>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>{f.label}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{f.val}</div>
                      </div>
                    ))}
                    {lead.website && <div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginBottom:2 }}>🌐 Website</div>
                      <a href={lead.website.startsWith("http")?lead.website:`https://${lead.website}`} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:"#60a5fa", textDecoration:"none" }}>{lead.website.replace(/^https?:\/\//,"").replace(/\/$/,"")}</a>
                    </div>}
                  </div>
                  {lead.needsServices?.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>SERVICES THEY NEED</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {lead.needsServices.map(s => <span key={s} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#86efac" }}>✓ {s}</span>)}
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => { navigator.clipboard.writeText(lead.aiPitch || ""); setCopiedId(lid); setTimeout(() => setCopiedId(null), 2000); }} style={ghostBtn}>{copiedId === lid ? "✅ Copied" : "📋 Copy Pitch"}</button>
                    {lead.phone && <button onClick={() => window.open(`https://wa.me/91${lead.phone}?text=${encodeURIComponent(lead.aiPitch || "")}`, "_blank")} style={ghostBtn}>💬 WhatsApp</button>}
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

