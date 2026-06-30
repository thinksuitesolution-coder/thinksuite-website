"use client";
import { useState, useEffect } from "react";
import { ToolCard, PrimaryButton, ErrorBanner, T } from "@/app/dashboard/lead-generation/_shell";

const inp = { width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", colorScheme:"dark" };
const ghostBtn = { fontSize:12, fontWeight:600, padding:"7px 14px", borderRadius:10, cursor:"pointer", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)" };

const GOALS = [
  { value:"meeting",     label:"Book Meeting",     icon:"📅" },
  { value:"demo",        label:"Request Demo",      icon:"🎬" },
  { value:"trial",       label:"Start Trial",       icon:"🧪" },
  { value:"reply",       label:"Get a Reply",       icon:"💬" },
];
const TONES = [
  { value:"professional", label:"Professional" },
  { value:"casual",       label:"Casual" },
  { value:"friendly",     label:"Friendly" },
];
const STATUS_COLOR = { draft:"#c4b5fd", scheduled:"#fbbf24", sent:"#86efac", paused:"rgba(255,255,255,0.4)" };

export function OutreachSequenceInput({ onGenerate, loading, error, prefillLead }) {
  const [lead,         setLead]         = useState({ businessName:"", email:"", website:"", state:"", industry:"" });

  useEffect(() => {
    if (prefillLead) {
      setLead({
        businessName: prefillLead.businessName || prefillLead.name || "",
        email:        prefillLead.email        || "",
        website:      prefillLead.website      || "",
        state:        prefillLead.city || prefillLead.state || "",
        industry:     prefillLead.industry     || "",
        contactPerson:prefillLead.contactPerson || "",
      });
    }
  }, [prefillLead]);
  const [senderName,   setSenderName]   = useState("");
  const [senderComp,   setSenderComp]   = useState("");
  const [senderProd,   setSenderProd]   = useState("");
  const [goal,         setGoal]         = useState("meeting");
  const [tone,         setTone]         = useState("professional");
  const [steps,        setSteps]        = useState(3);

  function submit() {
    if (!lead.businessName.trim()) return;
    onGenerate({ lead, senderName, senderCompany:senderComp, senderProduct:senderProd, goal, tone, steps });
  }

  return (
    <ToolCard>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <div style={{ fontSize:28 }}>📧</div>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>AI Email Sequence Generator</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>Gemini AI 3-5 step personalized outreach banayega — goal, tone, aur lead context ke basis pe</div>
        </div>
      </div>

      {/* Lead info */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Lead Information</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>Company Name *</div>
            <input value={lead.businessName} onChange={e => setLead(l => ({ ...l, businessName:e.target.value }))} placeholder="e.g. TechCorp Pvt Ltd" style={inp} />
          </div>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>Email</div>
            <input value={lead.email} onChange={e => setLead(l => ({ ...l, email:e.target.value }))} placeholder="contact@company.com" style={inp} />
          </div>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>Website</div>
            <input value={lead.website} onChange={e => setLead(l => ({ ...l, website:e.target.value }))} placeholder="https://…" style={inp} />
          </div>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>Industry / Niche</div>
            <input value={lead.industry} onChange={e => setLead(l => ({ ...l, industry:e.target.value }))} placeholder="e.g. IT & Software" style={inp} />
          </div>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>State / City</div>
            <input value={lead.state} onChange={e => setLead(l => ({ ...l, state:e.target.value }))} placeholder="e.g. Mumbai, Maharashtra" style={inp} />
          </div>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>Contact Person</div>
            <input value={lead.contactPerson || ""} onChange={e => setLead(l => ({ ...l, contactPerson:e.target.value }))} placeholder="e.g. Rahul Sharma (optional)" style={inp} />
          </div>
        </div>
      </div>

      {/* Sender info */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Your Information</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>Your Name</div>
            <input value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Rahul Sharma" style={inp} />
          </div>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>Your Company</div>
            <input value={senderComp} onChange={e => setSenderComp(e.target.value)} placeholder="MyThinkAI" style={inp} />
          </div>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>Product / Service</div>
            <input value={senderProd} onChange={e => setSenderProd(e.target.value)} placeholder="AI Lead Generation SaaS" style={inp} />
          </div>
        </div>
      </div>

      {/* Goal, Tone, Steps */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:16, marginBottom:20, alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Goal</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {GOALS.map(g => (
              <button key={g.value} onClick={() => setGoal(g.value)}
                style={{ padding:"8px 14px", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer",
                  background: goal===g.value ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${goal===g.value ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.1)"}`,
                  color: goal===g.value ? "#c4b5fd" : "rgba(255,255,255,0.45)" }}>
                {g.icon} {g.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Tone</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {TONES.map(t => (
              <button key={t.value} onClick={() => setTone(t.value)}
                style={{ padding:"8px 14px", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer",
                  background: tone===t.value ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${tone===t.value ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.1)"}`,
                  color: tone===t.value ? "#c4b5fd" : "rgba(255,255,255,0.45)" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Emails</div>
          <div style={{ display:"flex", gap:6 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setSteps(n)}
                style={{ width:36, height:36, borderRadius:9, fontSize:13, fontWeight:700, cursor:"pointer",
                  background: steps===n ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${steps===n ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.1)"}`,
                  color: steps===n ? "#c4b5fd" : "rgba(255,255,255,0.45)" }}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => {}} />}

      <PrimaryButton onClick={submit} disabled={loading || !lead.businessName.trim()}>
        {loading ? "🤖 Generating Sequence…" : "✨ Generate Email Sequence"}
      </PrimaryButton>
    </ToolCard>
  );
}

function MultiChannelKit({ whatsapp, linkedin }) {
  const [tab,    setTab]    = useState("whatsapp");
  const [copied, setCopied] = useState(null);

  if (!whatsapp && !linkedin) return null;

  async function copy(text, key) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const msgBox = (label, text, key) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>{label}</div>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px", position: "relative" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.75, whiteSpace: "pre-wrap", paddingRight: 60 }}>{text}</div>
        <button onClick={() => copy(text, key)}
          style={{ position: "absolute", top: 10, right: 10, fontSize: 11, padding: "4px 10px", borderRadius: 7, cursor: "pointer",
            background: copied === key ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${copied === key ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.1)"}`,
            color: copied === key ? "#86efac" : "rgba(255,255,255,0.5)" }}>
          {copied === key ? "✅" : "📋"}
        </button>
      </div>
    </div>
  );

  const TABS = [
    whatsapp && { id: "whatsapp", label: "WhatsApp", icon: "💬" },
    linkedin && { id: "linkedin", label: "LinkedIn",  icon: "💼" },
  ].filter(Boolean);

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 20px", marginTop: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 14 }}>🌐 Multi-Channel Outreach Kit</div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 20, cursor: "pointer",
              background: tab === t.id ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${tab === t.id ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: tab === t.id ? "#c4b5fd" : "rgba(255,255,255,0.45)" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "whatsapp" && whatsapp && (
        <div>
          {msgBox("First Message", whatsapp.initial, "wa_init")}
          {msgBox("Follow-up (Day 3 — no reply)", whatsapp.followup, "wa_follow")}
        </div>
      )}
      {tab === "linkedin" && linkedin && (
        <div>
          {msgBox("Connection Request Note (< 200 chars)", linkedin.connection, "li_conn")}
          {msgBox("First DM after connecting", linkedin.dm, "li_dm")}
        </div>
      )}
    </div>
  );
}

export function OutreachSequenceResults({ sequence, leadName, goal, tone, onSave, saving, saved, onReset, whatsapp, linkedin }) {
  const [copied, setCopied] = useState(null);

  async function copyStep(step) {
    await navigator.clipboard.writeText(`Subject: ${step.subject}\n\n${step.body}`);
    setCopied(step.step);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <ToolCard>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"#fff", marginBottom:4 }}>
              📧 {sequence.length}-Email Sequence for {leadName}
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>
              Goal: <strong style={{ color:"#c4b5fd" }}>{goal}</strong> · Tone: <strong style={{ color:"#c4b5fd" }}>{tone}</strong>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={onReset} style={ghostBtn}>← New Sequence</button>
            <button onClick={onSave} disabled={saving || saved}
              style={{ fontSize:12, fontWeight:700, padding:"8px 18px", borderRadius:10, cursor: saved?"default":saving?"not-allowed":"pointer",
                background: saved ? "rgba(34,197,94,0.15)" : "rgba(124,58,237,0.25)",
                border: `1px solid ${saved ? "rgba(34,197,94,0.4)" : "rgba(124,58,237,0.5)"}`,
                color: saved ? "#86efac" : "#c4b5fd" }}>
              {saving ? "Saving…" : saved ? "✅ Saved" : "💾 Save Sequence"}
            </button>
          </div>
        </div>

        {/* Timeline overview */}
        <div style={{ marginTop:16, display:"flex", gap:0, alignItems:"center", overflowX:"auto" }}>
          {sequence.map((step, i) => (
            <div key={step.step} style={{ display:"flex", alignItems:"center", gap:0 }}>
              <div style={{ textAlign:"center", minWidth:80 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(124,58,237,0.25)", border:"2px solid rgba(124,58,237,0.5)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 4px", fontSize:13, fontWeight:800, color:"#c4b5fd" }}>{step.step}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)" }}>Day {step.sendDay}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", maxWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{step.purpose}</div>
              </div>
              {i < sequence.length - 1 && <div style={{ width:40, height:2, background:"rgba(124,58,237,0.3)", flexShrink:0 }} />}
            </div>
          ))}
        </div>
      </ToolCard>

      {sequence.map(step => (
        <ToolCard key={step.step}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"rgba(124,58,237,0.2)", border:"1px solid rgba(124,58,237,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"#c4b5fd" }}>{step.step}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#c4b5fd" }}>Email {step.step} · Day {step.sendDay}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{step.purpose}</div>
              </div>
            </div>
            <button onClick={() => copyStep(step)}
              style={{ ...ghostBtn, fontSize:11, color: copied===step.step ? "#86efac" : undefined }}>
              {copied === step.step ? "✅ Copied!" : "📋 Copy Email"}
            </button>
          </div>

          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"14px 16px" }}>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:4, textTransform:"uppercase", letterSpacing:0.5, fontSize:10 }}>Subject Line</div>
            <div style={{ fontSize:14, fontWeight:600, color:"#fff", marginBottom:14, lineHeight:1.4 }}>{step.subject}</div>
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:12 }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Email Body</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.8)", lineHeight:1.8, whiteSpace:"pre-wrap" }}>{step.body}</div>
            </div>
          </div>
        </ToolCard>
      ))}

      {(whatsapp || linkedin) && (
        <MultiChannelKit whatsapp={whatsapp} linkedin={linkedin} />
      )}
    </div>
  );
}

export function OutreachHistoryView({ sequences, loading, hasMore, onLoadMore, onDelete, onStatusChange, deletingId }) {
  if (loading && sequences.length === 0) {
    return <ToolCard><div style={{ textAlign:"center", padding:"40px", color:"rgba(255,255,255,0.4)" }}>Loading saved sequences…</div></ToolCard>;
  }

  if (sequences.length === 0) {
    return (
      <ToolCard>
        <div style={{ textAlign:"center", padding:"48px 20px" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
          <div style={{ fontSize:15, fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>Koi saved sequence nahi</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.3)" }}>Upar se sequence generate karo aur "Save" dabao</div>
        </div>
      </ToolCard>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {sequences.map(seq => (
        <ToolCard key={seq.id}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:4 }}>
                {seq.leadName || "Unknown Lead"}
                {seq.leadEmail && <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginLeft:8 }}>{seq.leadEmail}</span>}
              </div>
              <div style={{ display:"flex", gap:8, fontSize:12, color:"rgba(255,255,255,0.5)", flexWrap:"wrap" }}>
                <span>🎯 {seq.goal}</span>
                <span>🗣️ {seq.tone}</span>
                <span>📧 {seq.sequence?.length || 0} emails</span>
                <span>📅 {seq.createdAt ? new Date(seq.createdAt).toLocaleDateString("en-IN") : ""}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color: STATUS_COLOR[seq.status]||"#fff", fontWeight:600 }}>{seq.status}</span>
              <select value={seq.status} onChange={e => onStatusChange(seq.id, e.target.value)}
                style={{ fontSize:11, padding:"4px 8px", borderRadius:8, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.6)", cursor:"pointer" }}>
                {["draft","scheduled","sent","paused"].map(s => <option key={s} value={s} style={{ background:"#111" }}>{s}</option>)}
              </select>
              <button onClick={() => onDelete(seq.id)} disabled={deletingId === seq.id}
                style={{ ...ghostBtn, color:"#f87171", borderColor:"rgba(248,113,113,0.3)" }}>
                {deletingId === seq.id ? "…" : "🗑️"}
              </button>
            </div>
          </div>

          {/* Email steps collapsed view */}
          <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:8 }}>
            {(seq.sequence || []).map((step, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:"10px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"#c4b5fd" }}>Step {step.step} · Day {step.sendDay}</span>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>{step.purpose}</span>
                </div>
                <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.85)" }}>{step.subject}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginTop:4, lineHeight:1.5, maxHeight:60, overflow:"hidden" }}>{step.body?.slice(0,200)}…</div>
                <button onClick={() => navigator.clipboard.writeText(`Subject: ${step.subject}\n\n${step.body}`)}
                  style={{ ...ghostBtn, marginTop:6, fontSize:11, padding:"4px 10px" }}>
                  📋 Copy
                </button>
              </div>
            ))}
          </div>
        </ToolCard>
      ))}

      {(hasMore || loading) && sequences.length > 0 && (
        <div style={{ textAlign:"center" }}>
          <button onClick={onLoadMore} disabled={loading}
            style={{ padding:"10px 28px", borderRadius:10, background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", color:"#c4b5fd", fontWeight:700, fontSize:13, cursor:"pointer" }}>
            {loading ? "Loading…" : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

