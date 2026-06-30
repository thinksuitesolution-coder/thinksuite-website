"use client";
import { createContext, useContext, useState, useCallback, useMemo } from "react";

// Minimal PlanContext — provides showSubscribe for quota-exceeded flows.
// Full subscription management is handled server-side via the quota API.
const PlanContext = createContext(null);

export function PlanProvider({ children }) {
  const [subModal, setSubModal] = useState({ open: false, toolSlug: null, reason: "" });

  const showSubscribe = useCallback((toolSlug, reason = "") => {
    setSubModal({ open: true, toolSlug, reason });
  }, []);

  const hideSubscribe = useCallback(() => {
    setSubModal({ open: false, toolSlug: null, reason: "" });
  }, []);

  const value = useMemo(() => ({
    subModal,
    showSubscribe,
    hideSubscribe,
    showUpgrade: showSubscribe,
    hideUpgrade: hideSubscribe,
    upgradeModal: { open: subModal.open, reason: subModal.reason },
    canUseTool: () => true,
    getToolStatus: () => "active",
    getTrialDaysLeft: () => 0,
    getToolPrice: () => 999,
    isAdmin: false,
    subsLoaded: true,
  }), [subModal, showSubscribe, hideSubscribe]);

  return (
    <PlanContext.Provider value={value}>
      {children}
      {subModal.open && (
        <div
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={e => e.target === e.currentTarget && hideSubscribe()}
        >
          <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, padding:32, maxWidth:420, width:"100%", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:16 }}>🔒</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:8 }}>Quota Exceeded</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", marginBottom:24, lineHeight:1.7 }}>
              {subModal.reason || "You've used all your leads for this period. Top up your wallet to continue."}
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button
                onClick={hideSubscribe}
                style={{ padding:"10px 20px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.6)" }}
              >
                Close
              </button>
              <a
                href="/pricing"
                style={{ padding:"10px 24px", borderRadius:10, fontSize:13, fontWeight:700, background:"linear-gradient(135deg,#7c3aed,#3b82f6)", color:"#fff", textDecoration:"none", display:"inline-block" }}
              >
                Upgrade Plan →
              </a>
            </div>
          </div>
        </div>
      )}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within <PlanProvider>");
  return ctx;
}
