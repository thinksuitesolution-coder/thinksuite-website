"use client";
import { useState } from "react";
import { SaveLeadButton } from "./SaveLeadButton";

export const HISTORY_TYPE_OPTIONS = [
  { value: "",                label: "All Types" },
  { value: "google-map",      label: "Google Map Leads" },
  { value: "website-leads",   label: "Website Leads" },
  { value: "instagram",       label: "Instagram Leads" },
  { value: "linkedin",        label: "LinkedIn Leads" },
  { value: "freelancer",      label: "Projects" },
  { value: "mca-companies",   label: "MCA Fresh Companies" },
  { value: "intl-companies",  label: "Global Companies" },
  { value: "job-intent",      label: "Trigger Leads" },
  { value: "group-finder",    label: "Group Finder" },
  { value: "exim",            label: "Exporter / Importer" },
  { value: "startup-founders",label: "Startup Founders" },
];

function exportLeadsCSV(leads, label) {
  if (!leads?.length) return;
  const headers = ["Name","Phone","Email","Website","Address","Source"];
  const rows = leads.map(l => [
    l.name || l.businessName || l.company_name || "",
    l.phone || "",
    l.email || "",
    l.website || l.url || "",
    l.address || "",
    l.source || "",
  ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type:"text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${label}-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function SearchHistoryView({ sessions, stats, loading, hasMore, typeFilter, onTypeFilter, onLoadMore, onSaveLead, savedLeadIds, savingLeadId }) {
  const [expandedId, setExpandedId] = useState(null);
  const accentGrad = "linear-gradient(135deg,#7c3aed,#4f46e5)";

  function formatDate(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) +
      " " + d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* Stats row */}
      {stats && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[
            { label:"Total Searches", value: stats.totalSessions || 0, icon:"🔍" },
            { label:"Total Leads Found", value: stats.totalLeads || 0, icon:"👤" },
            { label:"Search Types Used", value: Object.keys(stats.byType || {}).length, icon:"📊" },
          ].map(s => (
            <div key={s.label} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"16px 18px" }}>
              <div style={{ fontSize:22 }}>{s.icon}</div>
              <div style={{ fontSize:26, fontWeight:800, color:"#c4b5fd", margin:"6px 0 2px" }}>{s.value.toLocaleString()}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", flexShrink:0 }}>Filter by type:</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {HISTORY_TYPE_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => onTypeFilter(opt.value)}
              style={{
                padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer",
                background: typeFilter === opt.value ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${typeFilter === opt.value ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.1)"}`,
                color: typeFilter === opt.value ? "#c4b5fd" : "rgba(255,255,255,0.5)",
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading spinner */}
      {loading && sessions.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(255,255,255,0.3)", fontSize:14 }}>
          Loading search history…
        </div>
      )}

      {/* Empty state */}
      {!loading && sessions.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 20px", background:"rgba(255,255,255,0.03)", borderRadius:16, border:"1px dashed rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🕓</div>
          <div style={{ fontSize:16, fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>No search history yet</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.3)" }}>Every search you run will be saved here permanently</div>
        </div>
      )}

      {/* Session list */}
      {sessions.map(session => {
        const isOpen = expandedId === session.id;
        const leads  = session.leads || [];
        return (
          <div key={session.id} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, overflow:"hidden" }}>
            {/* Session header */}
            <div
              onClick={() => setExpandedId(isOpen ? null : session.id)}
              style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 20px", cursor:"pointer", transition:"background 0.15s" }}
            >
              <div style={{ flexShrink:0, width:42, height:42, borderRadius:10, background:"rgba(124,58,237,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                {HISTORY_TYPE_OPTIONS.find(o => o.value === session.type)?.label === "Google Map Leads" ? "🗺️"
                  : session.type === "instagram" ? "📸"
                  : session.type === "linkedin" ? "💼"
                  : session.type === "website-leads" ? "🌐"
                  : session.type === "mca-companies" ? "🏛️"
                  : session.type === "intl-companies" ? "🌍"
                  : session.type === "group-finder" ? "👥"
                  : session.type === "exim" ? "🚢"
                  : session.type === "freelancer" ? "📋"
                  : session.type === "job-intent" ? "🔥"
                  : "🔍"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#c4b5fd" }}>{session.typeLabel}</span>
                  <span style={{ fontSize:11, padding:"2px 8px", borderRadius:20, background:"rgba(124,58,237,0.15)", color:"rgba(196,181,253,0.7)" }}>{session.leadCount} leads</span>
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {[session.niche, session.location].filter(Boolean).join(" · ")}
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{formatDate(session.createdAt)}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                {leads.length > 0 && (
                  <button
                    onClick={e => { e.stopPropagation(); exportLeadsCSV(leads, `${session.type}-${session.niche}`); }}
                    style={{ padding:"6px 12px", borderRadius:8, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:600, cursor:"pointer" }}>
                    CSV
                  </button>
                )}
                <div style={{ fontSize:18, color:"rgba(255,255,255,0.3)", transform: isOpen ? "rotate(180deg)" : "none", transition:"transform 0.2s" }}>▼</div>
              </div>
            </div>

            {/* Expanded leads */}
            {isOpen && (
              <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
                {leads.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"20px", color:"rgba(255,255,255,0.3)", fontSize:13 }}>No lead data stored for this search</div>
                ) : (
                  leads.map((lead, i) => {
                    const name = lead.name || lead.businessName || lead.company_name || lead.title || "";
                    return (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", background:"rgba(255,255,255,0.03)", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ width:32, height:32, borderRadius:8, background:"rgba(124,58,237,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>
                          {name ? name[0].toUpperCase() : "?"}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.85)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{name || "—"}</div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:1 }}>
                            {[lead.phone, lead.email, lead.address || lead.location].filter(Boolean).join(" · ").slice(0,80)}
                          </div>
                        </div>
                        {(lead.website || lead.url) && (
                          <a href={lead.website || lead.url} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ fontSize:11, color:"#818cf8", textDecoration:"none", flexShrink:0 }}>
                            🔗 Visit
                          </a>
                        )}
                        <div onClick={e => e.stopPropagation()} style={{ flexShrink:0 }}>
                          <SaveLeadButton
                            lid={lead.id || name}
                            onSave={() => onSaveLead({ ...lead, name, businessName: name, source: session.type })}
                            savedLeadIds={savedLeadIds}
                            savingLeadId={savingLeadId}
                            compact={false}
                            style={{ padding:"5px 12px" }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Load more */}
      {(hasMore || loading) && sessions.length > 0 && (
        <div style={{ textAlign:"center", paddingTop:8 }}>
          <button onClick={onLoadMore} disabled={loading}
            style={{ padding:"11px 32px", borderRadius:10, background: loading ? "rgba(255,255,255,0.05)" : accentGrad, border:"none", color: loading ? "rgba(255,255,255,0.3)" : "#fff", fontWeight:700, fontSize:13, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Loading…" : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

