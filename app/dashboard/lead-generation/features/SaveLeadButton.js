"use client";

export function SaveLeadButton({ lid, onSave, savedLeadIds, savingLeadId, style, compact = true }) {
  const saved  = savedLeadIds?.has(lid);
  const saving = savingLeadId === lid;
  return (
    <button
      onClick={() => !saved && !saving && onSave()}
      disabled={saved || saving}
      style={{
        fontSize:12, padding:"9px 0", borderRadius:9, fontWeight:600, textAlign:"center",
        cursor:  saved ? "default" : saving ? "not-allowed" : "pointer",
        background: saved ? "rgba(34,197,94,0.1)"  : "rgba(255,255,255,0.05)",
        border: `1px solid ${saved ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
        color:   saved ? "#22c55e" : "rgba(255,255,255,0.5)",
        ...style,
      }}>
      {saving ? "..." : saved ? (compact ? "✅" : "✅ Saved") : (compact ? "💾" : "💾 Save")}
    </button>
  );
}

