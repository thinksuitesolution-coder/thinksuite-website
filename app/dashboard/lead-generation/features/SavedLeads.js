"use client";
import { useState, useEffect } from "react";
import { ToolCard, T } from "@/app/dashboard/lead-generation/_shell";
import { EnrichedDetailModal } from "./Projects";

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


function SavedLeadsView({ leads, stats, loading, onEnrich, enrichingId, onDelete, onFavorite, onExport, onRefresh, onAddToPipeline, pipelineLeadIds }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy]             = useState("date");
  const [selectedIds, setSelectedIds]   = useState(new Set());
  const [detailLead, setDetailLead]     = useState(null);
  const [isMobile, setIsMobile]         = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleSelect = id => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAll    = () => setSelectedIds(new Set(filteredLeads.map(l => l.id)));
  const clearAll     = () => setSelectedIds(new Set());

  const filteredLeads = leads.filter(l => {
    if (filterStatus === "enriched") return l.status === "enriched";
    if (filterStatus === "raw")      return l.status === "raw" || !l.status;
    if (filterStatus === "favorite") return l.isFavorite;
    return true;
  }).sort((a, b) => {
    if (sortBy === "score")  return (b.aiLeadScore || 0) - (a.aiLeadScore || 0);
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "name")   return (a.businessName || "").localeCompare(b.businessName || "");
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  if (loading) return (
    <ToolCard style={{ textAlign:"center", padding:"56px 24px" }}>
      <div style={{ width:52, height:52, borderRadius:"50%", border:`3px solid rgba(124,58,237,0.12)`, borderTopColor:T.accent, animation:"spin 0.85s linear infinite", margin:"0 auto 18px" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)" }}>Loading saved leads...</div>
    </ToolCard>
  );

  if (!loading && leads.length === 0) return (
    <ToolCard style={{ textAlign:"center", padding:"64px 24px" }}>
      <div style={{ fontSize:52, marginBottom:18 }}>📂</div>
      <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:10 }}>No Saved Leads Yet</div>
      <div style={{ fontSize:14, color:"rgba(255,255,255,0.45)", lineHeight:1.7, maxWidth:360, margin:"0 auto 24px" }}>
        Search for leads in any section, then click the <strong style={{ color:T.accent }}>💾 Save</strong> button on any lead card to store it here with AI enrichment support.
      </div>
      <button onClick={onRefresh} style={{ fontSize:13, padding:"10px 24px", borderRadius:10, cursor:"pointer", background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)", color:T.accent, fontFamily:"inherit", fontWeight:600 }}>
        🔄 Refresh
      </button>
    </ToolCard>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {detailLead && <EnrichedDetailModal lead={detailLead} onClose={() => setDetailLead(null)} />}

      {/* Stats bar */}
      {stats && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:12 }}>
          {[
            { label:"Total Leads",     val:stats.total,     icon:"📊", color:"#7c3aed" },
            { label:"Email Verified",  val:stats.verified,  icon:"✅", color:"#22c55e" },
            { label:"AI Enriched",     val:stats.enriched,  icon:"🤖", color:"#3b82f6" },
            { label:"High Score (8+)", val:stats.highScore, icon:"🔥", color:"#f59e0b" },
          ].map(s => (
            <div key={s.label} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"14px 18px" }}>
              <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.icon} {s.val}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <ToolCard style={{ padding:0, overflow:"hidden" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)", flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{leads.length} Saved Leads</span>
            <button onClick={selectAll} style={ghostBtn}>Select All</button>
            {selectedIds.size > 0 && <>
              <button onClick={clearAll} style={ghostBtn}>Clear ({selectedIds.size})</button>
              <button onClick={() => onExport([...selectedIds])} style={{ fontSize:12, fontWeight:700, padding:"6px 14px", borderRadius:10, cursor:"pointer", background:"linear-gradient(135deg,#7c3aed,#3b82f6)", border:"none", color:"#fff" }}>
                ⬇ Export ({selectedIds.size})
              </button>
            </>}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => onExport()} style={ghostBtn}>⬇ Export All</button>
            <button onClick={onRefresh} style={ghostBtn}>🔄 Refresh</button>
          </div>
        </div>

        {/* Filters + Sort */}
        <div style={{ padding:"10px 18px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"rgba(0,0,0,0.15)", display:"flex", gap:16, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:0.5 }}>Filter</span>
            {[
              { id:"all",      label:`All (${leads.length})` },
              { id:"enriched", label:`🤖 Enriched (${leads.filter(l=>l.status==="enriched").length})` },
              { id:"raw",      label:`Raw (${leads.filter(l=>l.status==="raw"||!l.status).length})` },
              { id:"favorite", label:`⭐ Starred (${leads.filter(l=>l.isFavorite).length})` },
            ].map(f => (
              <button key={f.id} onClick={() => setFilterStatus(f.id)}
                style={{ fontSize:11, fontWeight:600, padding:"4px 11px", borderRadius:20, cursor:"pointer",
                  background: filterStatus===f.id ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.04)",
                  border:`1px solid ${filterStatus===f.id ? "rgba(124,58,237,0.45)" : "rgba(255,255,255,0.08)"}`,
                  color: filterStatus===f.id ? T.accent : "rgba(255,255,255,0.45)" }}>
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:0.5 }}>Sort</span>
            {[
              { id:"date",  label:"Latest" },
              { id:"score", label:"🔥 Score" },
              { id:"rating",label:"⭐ Rating" },
              { id:"name",  label:"A–Z" },
            ].map(s => (
              <button key={s.id} onClick={() => setSortBy(s.id)}
                style={{ fontSize:11, fontWeight:600, padding:"4px 11px", borderRadius:20, cursor:"pointer",
                  background: sortBy===s.id ? "rgba(59,130,246,0.14)" : "rgba(255,255,255,0.04)",
                  border:`1px solid ${sortBy===s.id ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.08)"}`,
                  color: sortBy===s.id ? "#3b82f6" : "rgba(255,255,255,0.45)" }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px 24px" }}>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.4)" }}>No leads match this filter</div>
            <button onClick={() => setFilterStatus("all")} style={{ marginTop:12, fontSize:12, padding:"7px 18px", borderRadius:8, cursor:"pointer", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent, fontFamily:"inherit" }}>Show All</button>
          </div>
        ) : isMobile ? (
          /* Mobile cards */
          <div style={{ display:"flex", flexDirection:"column", gap:10, padding:"12px 14px" }}>
            {filteredLeads.map(lead => {
              const sel      = selectedIds.has(lead.id);
              const enriched = lead.status === "enriched";
              const enr      = enrichingId === lead.id;
              return (
                <div key={lead.id} style={{ background: sel ? "rgba(124,58,237,0.05)" : "rgba(255,255,255,0.03)", border:`1px solid ${sel ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius:12, padding:"14px 16px" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <input type="checkbox" checked={sel} onChange={() => toggleSelect(lead.id)} style={{ accentColor:T.accent, width:15, height:15, cursor:"pointer" }} />
                      <div>
                        <div style={{ fontWeight:700, color:"#fff", fontSize:14 }}>{lead.businessName || lead.name}</div>
                        {lead.industry && <div style={{ fontSize:11, color:T.textMuted }}>{lead.industry}</div>}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:5, alignItems:"center", flexShrink:0 }}>
                      {lead.aiLeadScore && <span style={{ fontSize:12, fontWeight:800, color:"#f59e0b", background:"rgba(245,158,11,0.12)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:8, padding:"2px 8px" }}>🔥 {lead.aiLeadScore}/10</span>}
                      {enriched && <span style={{ fontSize:10, fontWeight:700, color:"#22c55e", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:6, padding:"2px 7px" }}>AI</span>}
                    </div>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:10, fontSize:12, marginBottom:10 }}>
                    {lead.phone   && <span style={{ color:T.accent }}>📞 {lead.phone}</span>}
                    {lead.email   && <span style={{ color:"#34d399" }}>📧 {lead.email}</span>}
                    {lead.city    && <span style={{ color:"rgba(255,255,255,0.4)" }}>📍 {lead.city}</span>}
                    {lead.rating  && <span style={{ color:"#fbbf24" }}>★ {lead.rating}</span>}
                  </div>
                  {enriched && lead.aiSummary && (
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.5, marginBottom:10, padding:"8px 10px", background:"rgba(59,130,246,0.06)", borderRadius:8, borderLeft:"2px solid rgba(59,130,246,0.35)" }}>
                      {lead.aiSummary.length > 100 ? lead.aiSummary.slice(0,100) + "…" : lead.aiSummary}
                    </div>
                  )}
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {enriched
                      ? <button onClick={() => setDetailLead(lead)} style={{ flex:1, minWidth:80, fontSize:11, padding:"7px 0", borderRadius:8, cursor:"pointer", background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.25)", color:"#3b82f6", fontWeight:600 }}>📋 View Details</button>
                      : <button onClick={() => onEnrich(lead)} disabled={enr} style={{ flex:1, minWidth:80, fontSize:11, padding:"7px 0", borderRadius:8, cursor: enr ? "not-allowed" : "pointer", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent, fontWeight:600, opacity: enr ? 0.6 : 1 }}>
                          {enr ? "Enriching..." : "🤖 AI Enrich"}
                        </button>
                    }
                    {onAddToPipeline && (
                      pipelineLeadIds?.has(lead.id)
                        ? <span style={{ fontSize:11, padding:"7px 10px", borderRadius:8, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", color:"#34d399", fontWeight:600 }}>✅ Pipeline</span>
                        : <button onClick={() => onAddToPipeline(lead)} style={{ fontSize:11, padding:"7px 10px", borderRadius:8, cursor:"pointer", background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.18)", color:"#34d399", fontWeight:600, whiteSpace:"nowrap" }}>+ Pipeline</button>
                    )}
                    <button onClick={() => onFavorite(lead)} style={{ fontSize:11, padding:"7px 12px", borderRadius:8, cursor:"pointer", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color: lead.isFavorite ? "#f59e0b" : "rgba(255,255,255,0.4)" }}>
                      {lead.isFavorite ? "⭐" : "☆"}
                    </button>
                    <button onClick={() => onDelete(lead)} style={{ fontSize:11, padding:"7px 12px", borderRadius:8, cursor:"pointer", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171" }}>🗑</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop table */
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                  {["","#","Business / AI Summary","Contact","Location","Score","Status","Actions"].map(h => (
                    <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:0.7, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, idx) => {
                  const sel      = selectedIds.has(lead.id);
                  const enriched = lead.status === "enriched";
                  const enr      = enrichingId === lead.id;
                  return (
                    <tr key={lead.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", background: sel ? "rgba(124,58,237,0.04)" : "transparent" }}>
                      <td style={{ padding:"12px 8px 12px 14px" }}>
                        <input type="checkbox" checked={sel} onChange={() => toggleSelect(lead.id)} style={{ accentColor:T.accent, width:15, height:15, cursor:"pointer" }} />
                      </td>
                      <td style={{ padding:"12px 14px", color:T.textMuted }}>{idx+1}</td>
                      <td style={{ padding:"12px 14px", maxWidth:240 }}>
                        <div style={{ fontWeight:600, color:"#fff" }}>{lead.businessName || lead.name}</div>
                        {lead.industry && <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>{lead.industry}</div>}
                        {enriched && lead.aiSummary && <div style={{ fontSize:11, color:"rgba(255,255,255,0.38)", marginTop:4, lineHeight:1.4 }}>{lead.aiSummary.slice(0,90)}…</div>}
                      </td>
                      <td style={{ padding:"12px 14px", minWidth:160 }}>
                        {lead.phone   && <div style={{ color:T.accent, marginBottom:2 }}>{lead.phone}</div>}
                        {lead.email   && <div style={{ color:"#34d399", fontSize:12, marginBottom:2 }}>{lead.email}</div>}
                        {lead.website && <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ color:"#3b82f6", fontSize:11, display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:180 }}>🌐 {lead.website.replace(/^https?:\/\//,"").slice(0,28)}</a>}
                      </td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:"rgba(255,255,255,0.4)", whiteSpace:"nowrap" }}>
                        {[lead.city, lead.country && lead.country !== "India" ? lead.country : lead.state].filter(Boolean).join(", ")}
                      </td>
                      <td style={{ padding:"12px 14px", whiteSpace:"nowrap" }}>
                        {lead.aiLeadScore
                          ? <span style={{ fontSize:13, fontWeight:800, color: lead.aiLeadScore>=8 ? "#f59e0b" : lead.aiLeadScore>=6 ? "#34d399" : "rgba(255,255,255,0.5)" }}>
                              {lead.aiLeadScore>=8 ? "🔥 " : lead.aiLeadScore>=6 ? "⚡ " : ""}{lead.aiLeadScore}/10
                            </span>
                          : <span style={{ color:"rgba(255,255,255,0.2)" }}>-</span>}
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, whiteSpace:"nowrap",
                          background: enriched ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)",
                          border:`1px solid ${enriched ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.1)"}`,
                          color: enriched ? "#22c55e" : "rgba(255,255,255,0.35)" }}>
                          {enriched ? "✅ Enriched" : "Raw"}
                        </span>
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", gap:5, alignItems:"center", flexWrap:"wrap" }}>
                          {enriched
                            ? <button onClick={() => setDetailLead(lead)} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, cursor:"pointer", background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.25)", color:"#3b82f6", fontWeight:600, whiteSpace:"nowrap" }}>📋 Details</button>
                            : <button onClick={() => onEnrich(lead)} disabled={enr} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, cursor: enr ? "not-allowed" : "pointer", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent, fontWeight:600, whiteSpace:"nowrap", opacity: enr ? 0.6 : 1 }}>
                                {enr ? "..." : "🤖 Enrich"}
                              </button>
                          }
                          {onAddToPipeline && (
                            pipelineLeadIds?.has(lead.id)
                              ? <span style={{ fontSize:11, padding:"4px 8px", borderRadius:6, background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.18)", color:"#34d399", fontWeight:600 }}>✅</span>
                              : <button onClick={() => onAddToPipeline(lead)} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, cursor:"pointer", background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.18)", color:"#34d399", fontWeight:600, whiteSpace:"nowrap" }}>+ Pipeline</button>
                          )}
                          <button onClick={() => onFavorite(lead)} style={{ fontSize:11, padding:"4px 8px", borderRadius:6, cursor:"pointer", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color: lead.isFavorite ? "#f59e0b" : "rgba(255,255,255,0.3)" }}>
                            {lead.isFavorite ? "⭐" : "☆"}
                          </button>
                          <button onClick={() => onDelete(lead)} style={{ fontSize:11, padding:"4px 8px", borderRadius:6, cursor:"pointer", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171" }}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </ToolCard>
    </div>
  );
}
export { SavedLeadsView };

