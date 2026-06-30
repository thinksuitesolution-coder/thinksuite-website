"use client";
import { useState } from "react";
import { ToolCard, PrimaryButton, T, ToolHeading } from "@/app/dashboard/lead-generation/_shell";
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


/* ══════════════════════════════════════════════════════════════════════════
   Trigger Leads Components
══════════════════════════════════════════════════════════════════════════ */
const JOB_ROLES = [
  { value: "digital-marketing-manager", label: "Digital Marketing Manager" },
  { value: "social-media-manager",      label: "Social Media Manager" },
  { value: "react-developer",           label: "React Developer" },
  { value: "nodejs-developer",          label: "Node.js Developer" },
  { value: "graphic-designer",          label: "Graphic Designer" },
  { value: "content-writer",            label: "Content Writer" },
  { value: "sales-executive",           label: "Sales Executive" },
  { value: "hr-manager",                label: "HR Manager" },
  { value: "accountant",                label: "Accountant" },
  { value: "customer-support",          label: "Customer Support" },
  { value: "ecommerce-manager",         label: "E-Commerce Manager" },
  { value: "data-analyst",              label: "Data Analyst" },
  { value: "seo-specialist",            label: "SEO Specialist" },
  { value: "ui-ux-designer",            label: "UI/UX Designer" },
  { value: "business-development",      label: "Business Development" },
];

function TriggerLeadsInput({ onSubmit, loading }) {
  const [jobRole,   setJobRole]   = useState("");
  const [state,     setState]     = useState("");
  const [city,      setCity]      = useState("");
  const [industry,  setIndustry]  = useState("");
  const [count,     setCount]     = useState(12);

  const cities = state ? (STATE_CITIES[state] || []) : [];
  const canSubmit = !!(jobRole && state);

  return (
    <ToolCard>
      <ToolHeading
        title="Trigger Leads"
        subtitle="Find companies actively hiring — they have budget and are growing. Convert their job post into your sales opportunity."
        icon="🔥"
      />

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginBottom:6, fontWeight:600 }}>1. Job Role They're Hiring *</div>
          <select value={jobRole} onChange={e => setJobRole(e.target.value)} style={{ ...inp, cursor:"pointer" }}>
            <option value="">-- Select Job Role</option>
            {JOB_ROLES.map(r => <option key={r.value} value={r.value} style={{ background:"#111", color:"#fff" }}>{r.label}</option>)}
          </select>
          {jobRole && (
            <div style={{ marginTop:6, fontSize:11, color:"rgba(124,58,237,0.8)", background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:8, padding:"6px 10px" }}>
              🎯 Companies hiring this role need digital services — pitch your solution instead of competing with their hire.
            </div>
          )}
        </div>

        <div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginBottom:6, fontWeight:600 }}>2. State *</div>
          <select value={state} onChange={e => { setState(e.target.value); setCity(""); }} style={{ ...inp, cursor:"pointer" }}>
            <option value="">-- Select State</option>
            {STATES.map(s => <option key={s} value={s} style={{ background:"#111", color:"#fff" }}>{s}</option>)}
          </select>
        </div>

        {state && (
          <div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginBottom:6, fontWeight:600 }}>3. City (optional)</div>
            <select value={city} onChange={e => setCity(e.target.value)} style={{ ...inp, cursor:"pointer" }}>
              <option value="">-- Any City</option>
              {cities.map(c => <option key={c} value={c} style={{ background:"#111", color:"#fff" }}>{c}</option>)}
            </select>
          </div>
        )}

        <div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginBottom:6, fontWeight:600 }}>4. Industry Filter (optional)</div>
          <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. E-commerce, SaaS, Retail, Healthcare..." style={{ ...inp }} />
        </div>

        <div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginBottom:6, fontWeight:600 }}>5. Number of Leads</div>
          <select value={count} onChange={e => setCount(Number(e.target.value))} style={{ ...inp, cursor:"pointer" }}>
            {[6,8,10,12].map(n => <option key={n} value={n} style={{ background:"#111", color:"#fff" }}>{n} leads</option>)}
          </select>
        </div>

        <PrimaryButton disabled={!canSubmit || loading} onClick={() => onSubmit({ jobRole, state, city, industry, count })}>
          {loading ? "Searching..." : "🔥 Find Trigger Leads"}
        </PrimaryButton>
      </div>
    </ToolCard>
  );
}

function TriggerLeadsResults({ leads, params, onReset, onSaveLead, savedLeadIds, savingLeadId }) {
  function exportCSVTrigger() {
    const headers = ["#","Company","Director","Phone","City","State","Industry","Job Title","Job Portal","Posted (days ago)","Salary","Service to Sell","Budget","AI Pitch","Call Script"];
    const rows = leads.map((l, i) => [
      i + 1,
      `"${(l.businessName || "").replace(/"/g,'""')}"`,
      `"${(l.directorName || "").replace(/"/g,'""')}"`,
      l.phone || "",
      l.city || "", l.state || "", l.industry || "",
      `"${(l.jobTitle || "").replace(/"/g,'""')}"`,
      l.jobPortal || "", l.jobPostedDaysAgo || "",
      `"${(l.salaryOffered || "").replace(/"/g,'""')}"`,
      `"${(l.serviceToSell || "").replace(/"/g,'""')}"`,
      `"${(l.estimatedBudget || "").replace(/"/g,'""')}"`,
      `"${(l.aiPitch || "").replace(/"/g,'""')}"`,
      `"${(l.callScript || "").replace(/"/g,'""')}"`,
    ]);
    const csv  = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `trigger_leads_${(params.jobRole || "results").replace(/\s+/g,"_")}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <div>
          <span style={{ fontSize:16, fontWeight:800, color:"#fff" }}>🔥 {leads.length} Trigger Leads Found</span>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginLeft:10 }}>{params.jobRole?.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase())} · {params.city || params.state}</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={exportCSVTrigger} style={{ ...ghostBtn, color:"#60a5fa", border:"1px solid rgba(59,130,246,0.3)" }}>⬇ Export CSV</button>
          <button onClick={onReset} style={ghostBtn}>🔄 New Search</button>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {leads.map((lead, idx) => {
          const isSaved  = savedLeadIds?.has(lead.businessName || lead.id);
          const isSaving = savingLeadId === (lead.businessName || lead.id);
          return (
            <div key={idx} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"18px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, flexWrap:"wrap", gap:8 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, color:"#fff", marginBottom:4 }}>{lead.businessName}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {lead.city && <span style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>📍 {lead.city}, {lead.state}</span>}
                    {lead.industry && <span style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>🏢 {lead.industry}</span>}
                    {lead.companySize && <span style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>👥 {lead.companySize}</span>}
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {lead.urgency === "high" && <span style={{ fontSize:10, fontWeight:800, color:"#ef4444", background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:6, padding:"3px 8px" }}>🔥 HIGH INTENT</span>}
                  {onSaveLead && <button onClick={() => onSaveLead(lead)} disabled={isSaved || isSaving} style={{ ...ghostBtn, fontSize:11, color: isSaved ? "#10b981" : "rgba(255,255,255,0.6)" }}>{isSaving ? "Saving..." : isSaved ? "✓ Saved" : "💾 Save"}</button>}
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10, marginBottom:12 }}>
                {lead.phone && <div style={{ fontSize:12, color:"#34d399" }}>📞 {lead.phone}</div>}
                {lead.website && <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" style={{ fontSize:12, color:"#60a5fa", textDecoration:"none" }}>🌐 {lead.website}</a>}
                {lead.directorName && <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)" }}>👤 {lead.directorName}{lead.directorDesignation ? ` · ${lead.directorDesignation}` : ""}</div>}
              </div>

              {lead.triggerSignal && (
                <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:8, padding:"8px 12px", marginBottom:10, fontSize:12, color:"#c4b5fd" }}>
                  🎯 <strong>Trigger:</strong> {lead.triggerSignal}
                </div>
              )}

              {lead.aiPitch && (
                <div style={{ background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:8, padding:"10px 12px", marginBottom:8 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#60a5fa", marginBottom:4 }}>AI PITCH</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", lineHeight:1.6 }}>{lead.aiPitch}</div>
                </div>
              )}

              {lead.callScript && (
                <div style={{ background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#10b981", marginBottom:4 }}>📞 CALL SCRIPT</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>{lead.callScript}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export { JOB_ROLES, TriggerLeadsInput, TriggerLeadsResults };

