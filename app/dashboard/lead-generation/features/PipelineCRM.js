"use client";
import { useState, useEffect } from "react";
import { ToolCard, T } from "@/app/dashboard/lead-generation/_shell";

const STAGES = [
  { id: "new",       label: "New Leads",   icon: "🆕", color: "#6366f1" },
  { id: "contacted", label: "Contacted",    icon: "📤", color: "#f59e0b" },
  { id: "replied",   label: "Replied",      icon: "💬", color: "#3b82f6" },
  { id: "meeting",   label: "Meeting Set",  icon: "📅", color: "#8b5cf6" },
  { id: "won",       label: "Closed Won",   icon: "✅", color: "#22c55e" },
  { id: "lost",      label: "Closed Lost",  icon: "❌", color: "#6b7280" },
];

// Days after first contact when each follow-up step is due
const FOLLOWUP_DAYS = [3, 7, 14, 21];

function getFollowUpInfo(lead) {
  if (!lead.lastContactedAt) return null;
  const step = lead.currentSequenceStep || 0;
  const daysUntilNext = FOLLOWUP_DAYS[step];
  if (daysUntilNext === undefined) {
    return { status: "done", label: "All steps done", color: "rgba(255,255,255,0.3)" };
  }
  const nextDate = lead.lastContactedAt + daysUntilNext * 86400000;
  const diff     = nextDate - Date.now();
  if (diff < 0) {
    const overdue = Math.floor(-diff / 86400000);
    return { status: "overdue", label: overdue === 0 ? "Due today!" : `${overdue}d overdue`, color: "#f87171" };
  }
  if (diff < 86400000) return { status: "today", label: "Due today", color: "#fbbf24" };
  const inDays = Math.ceil(diff / 86400000);
  return { status: "upcoming", label: `Follow-up in ${inDays}d`, color: "#34d399" };
}

function daysInStage(lead) {
  return Math.floor((Date.now() - (lead.movedAt || lead.addedAt || Date.now())) / 86400000);
}

const ghostBtn = {
  fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 8, cursor: "pointer",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap",
};

function LeadCard({ lead, onUpdate, onMarkSent, onDelete, onGenerateOutreach }) {
  const [editNote,    setEditNote]    = useState(false);
  const [noteText,    setNoteText]    = useState(lead.notes || "");
  const [delConfirm,  setDelConfirm]  = useState(false);
  const [saving,      setSaving]      = useState(false);

  const followUp   = getFollowUpInfo(lead);
  const daysIn     = daysInStage(lead);
  const stepsDone  = lead.currentSequenceStep || 0;

  async function saveNote() {
    setSaving(true);
    await onUpdate(lead.id, { notes: noteText });
    setSaving(false);
    setEditNote(false);
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12, padding: "13px 14px", marginBottom: 10,
      borderLeft: followUp?.status === "overdue" ? "3px solid #f87171" :
                  followUp?.status === "today"   ? "3px solid #fbbf24" : "3px solid transparent",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {lead.leadName}
          </div>
          {lead.leadIndustry && (
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>
              {lead.leadIndustry}
            </div>
          )}
        </div>
        {daysIn > 0 && (
          <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.3)", flexShrink: 0, marginLeft: 6 }}>
            {daysIn}d
          </span>
        )}
      </div>

      {/* Contact info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 8, fontSize: 11 }}>
        {lead.leadEmail   && <span style={{ color: "#34d399", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📧 {lead.leadEmail}</span>}
        {lead.leadPhone   && <span style={{ color: T.accent }}>📞 {lead.leadPhone}</span>}
        {lead.leadCity    && <span style={{ color: "rgba(255,255,255,0.38)" }}>📍 {lead.leadCity}</span>}
        {lead.leadWebsite && (
          <a href={lead.leadWebsite} target="_blank" rel="noopener noreferrer"
            style={{ color: "#3b82f6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
            🌐 {lead.leadWebsite.replace(/^https?:\/\//,"").slice(0,28)}
          </a>
        )}
      </div>

      {/* Follow-up badge */}
      {followUp && (
        <div style={{ display: "inline-block", fontSize: 11, fontWeight: 600, color: followUp.color,
          background: `${followUp.color}12`, border: `1px solid ${followUp.color}28`,
          borderRadius: 8, padding: "3px 9px", marginBottom: 8 }}>
          🔔 {followUp.label}
        </div>
      )}

      {/* Email step tracker */}
      {lead.lastContactedAt && (
        <div style={{ display: "flex", gap: 3, marginBottom: 8, alignItems: "center" }}>
          {[1,2,3,4,5].map(s => (
            <div key={s} style={{
              width: 20, height: 20, borderRadius: 5, fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: s <= stepsDone ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${s <= stepsDone ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: s <= stepsDone ? "#c4b5fd" : "rgba(255,255,255,0.2)",
            }}>
              {s <= stepsDone ? "✓" : s}
            </div>
          ))}
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginLeft: 3 }}>{stepsDone}/5</span>
        </div>
      )}

      {/* Notes */}
      {lead.notes && !editNote && (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "5px 9px", marginBottom: 8, lineHeight: 1.5 }}>
          {lead.notes.length > 80 ? lead.notes.slice(0,80) + "…" : lead.notes}
        </div>
      )}

      {editNote && (
        <div style={{ marginBottom: 8 }}>
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Add notes about this lead…"
            style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 8, padding: "7px 9px", color: "#fff", fontSize: 12, resize: "vertical", minHeight: 56, outline: "none", boxSizing: "border-box", colorScheme: "dark", fontFamily: "inherit" }}
          />
          <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
            <button onClick={saveNote} disabled={saving}
              style={{ fontSize: 11, padding: "4px 12px", borderRadius: 8, cursor: "pointer", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#c4b5fd", fontWeight: 600 }}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => { setNoteText(lead.notes || ""); setEditNote(false); }} style={ghostBtn}>Cancel</button>
          </div>
        </div>
      )}

      {/* Actions row */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {/* Stage mover */}
        <select
          value={lead.stage}
          onChange={e => onUpdate(lead.id, { stage: e.target.value })}
          style={{ fontSize: 11, padding: "4px 6px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", cursor: "pointer", colorScheme: "dark" }}
        >
          {STAGES.map(s => <option key={s.id} value={s.id} style={{ background: "#111" }}>{s.icon} {s.label}</option>)}
        </select>

        {/* Mark email step sent */}
        {stepsDone < 5 && (
          <button onClick={() => onMarkSent(lead.id, lead)}
            style={{ fontSize: 11, padding: "4px 9px", borderRadius: 8, cursor: "pointer", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.22)", color: "#34d399", fontWeight: 600, whiteSpace: "nowrap" }}>
            ✓ Step {stepsDone + 1} sent
          </button>
        )}

        {/* Note */}
        <button onClick={() => setEditNote(v => !v)} style={ghostBtn} title="Add / edit note">📝</button>

        {/* Generate Outreach */}
        <button onClick={() => onGenerateOutreach(lead)}
          style={{ fontSize: 11, padding: "4px 9px", borderRadius: 8, cursor: "pointer", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.28)", color: "#c4b5fd", fontWeight: 600, whiteSpace: "nowrap" }}>
          ✨ Outreach
        </button>

        {/* Delete */}
        {delConfirm ? (
          <>
            <button onClick={() => onDelete(lead.id)}
              style={{ fontSize: 11, padding: "4px 9px", borderRadius: 8, cursor: "pointer", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)", color: "#f87171", fontWeight: 600 }}>
              Confirm
            </button>
            <button onClick={() => setDelConfirm(false)} style={ghostBtn}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setDelConfirm(true)}
            style={{ fontSize: 11, padding: "4px 9px", borderRadius: 8, cursor: "pointer", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.14)", color: "#f87171" }}>
            🗑
          </button>
        )}
      </div>
    </div>
  );
}

export function PipelineCRMView({ leads, loading, onUpdate, onMarkSent, onDelete, onGenerateOutreach, onRefresh }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileStage, setMobileStage] = useState("new");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const total    = leads.length;
  const won      = leads.filter(l => l.stage === "won").length;
  const active   = leads.filter(l => l.stage !== "won" && l.stage !== "lost").length;
  const convRate = total > 0 ? Math.round((won / total) * 100) : 0;

  const dueLeads = leads.filter(l => {
    const info = getFollowUpInfo(l);
    return info && (info.status === "today" || info.status === "overdue");
  });

  if (loading && leads.length === 0) {
    return (
      <ToolCard>
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid rgba(124,58,237,0.15)`, borderTopColor: T.accent, animation: "spin 0.85s linear infinite", margin: "0 auto 16px" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading pipeline…</div>
        </div>
      </ToolCard>
    );
  }

  if (!loading && leads.length === 0) {
    return (
      <ToolCard>
        <div style={{ textAlign: "center", padding: "64px 24px" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>📊</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Pipeline Empty</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 380, margin: "0 auto" }}>
            Go to <strong style={{ color: T.accent }}>Saved Leads</strong> and click{" "}
            <strong style={{ color: T.accent }}>Add to Pipeline</strong> on any lead to start tracking your deals here.
          </div>
        </div>
      </ToolCard>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
        {[
          { label: "Total Leads",  val: total,         icon: "📊", color: "#7c3aed" },
          { label: "Active Deals", val: active,         icon: "🔥", color: "#f59e0b" },
          { label: "Closed Won",   val: won,            icon: "✅", color: "#22c55e" },
          { label: "Conversion",   val: `${convRate}%`, icon: "📈", color: "#3b82f6" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.icon} {s.val}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Follow-up alert */}
      {dueLeads.length > 0 && (
        <div style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.22)", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 22 }}>🔔</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>
              {dueLeads.length} Follow-up{dueLeads.length > 1 ? "s" : ""} Due
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
              {dueLeads.slice(0,3).map(l => l.leadName).join(", ")}
              {dueLeads.length > 3 ? ` +${dueLeads.length - 3} more` : ""}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Deal Pipeline · {total} leads</div>
        <button onClick={onRefresh} style={{ ...ghostBtn, padding: "5px 12px" }}>🔄 Refresh</button>
      </div>

      {/* ── Mobile: stage tabs + vertical list ── */}
      {isMobile && (
        <>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
            {STAGES.map(s => {
              const cnt = leads.filter(l => l.stage === s.id).length;
              return (
                <button key={s.id} onClick={() => setMobileStage(s.id)}
                  style={{ fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 20, cursor: "pointer", whiteSpace: "nowrap",
                    background: mobileStage === s.id ? `${s.color}22` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${mobileStage === s.id ? s.color + "55" : "rgba(255,255,255,0.09)"}`,
                    color: mobileStage === s.id ? s.color : "rgba(255,255,255,0.45)" }}>
                  {s.icon} {s.label} {cnt > 0 ? `(${cnt})` : ""}
                </button>
              );
            })}
          </div>
          <div>
            {leads.filter(l => l.stage === mobileStage).length === 0 ? (
              <ToolCard>
                <div style={{ textAlign: "center", padding: "30px", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No leads in this stage</div>
              </ToolCard>
            ) : (
              leads.filter(l => l.stage === mobileStage).map(lead => (
                <LeadCard key={lead.id} lead={lead} onUpdate={onUpdate} onMarkSent={onMarkSent} onDelete={onDelete} onGenerateOutreach={onGenerateOutreach} />
              ))
            )}
          </div>
        </>
      )}

      {/* ── Desktop: Kanban board ── */}
      {!isMobile && (
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 14, alignItems: "flex-start" }}>
          {STAGES.map(stage => {
            const col = leads.filter(l => l.stage === stage.id);
            return (
              <div key={stage.id} style={{ minWidth: 238, width: 238, flexShrink: 0 }}>
                {/* Column header */}
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, padding: "8px 12px", background: `${stage.color}12`, border: `1px solid ${stage.color}28`, borderRadius: 10 }}>
                  <span style={{ fontSize: 14 }}>{stage.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{stage.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: stage.color, background: `${stage.color}20`, padding: "1px 7px", borderRadius: 20 }}>
                    {col.length}
                  </span>
                </div>
                {/* Cards */}
                {col.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px 10px", color: "rgba(255,255,255,0.18)", fontSize: 12, border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 10 }}>
                    Drop leads here
                  </div>
                ) : (
                  col.map(lead => (
                    <LeadCard key={lead.id} lead={lead} onUpdate={onUpdate} onMarkSent={onMarkSent} onDelete={onDelete} onGenerateOutreach={onGenerateOutreach} />
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

