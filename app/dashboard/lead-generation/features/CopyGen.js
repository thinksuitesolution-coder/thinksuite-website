"use client";
import { useState } from "react";
import { ToolCard, PrimaryButton, T } from "@/app/dashboard/lead-generation/_shell";
import { COPY_SECTIONS } from "@/lib/frontend/constants";
import { formatCopySection } from "@/lib/frontend/leadHelpers";
import { downloadWord } from "@/lib/frontend/exporters";
import { safeJson } from "@/lib/frontend/api";

const inp = {
  width: "100%", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
  padding: "12px 15px", color: "#fff", fontSize: 14, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", colorScheme: "dark",
};

/* ════════════════════════════════════════════════════════════════════════════
   COPY GENERATOR COMPONENTS
════════════════════════════════════════════════════════════════════════════ */
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ fontSize:11, fontWeight:600, padding:"6px 12px", borderRadius:8, cursor:"pointer", background: copied ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.05)", border:`1px solid ${copied ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`, color: copied ? "#3b82f6" : "rgba(255,255,255,0.55)" }}>
      {copied ? "✓ Copied!" : "📋 Copy"}
    </button>
  );
}

function CopySectionBlock({ section, content }) {
  const lines = typeof content === "string" ? content : JSON.stringify(content, null, 2);
  return (
    <div style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${section.color}28`, borderLeft:`3px solid ${section.color}`, borderRadius:"0 12px 12px 0", padding:"18px 20px", marginBottom:16 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, flexWrap:"wrap", gap:8 }}>
        <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{section.icon} {section.label}</div>
        <CopyBtn text={lines} />
      </div>
      <div style={{ fontSize:13.5, color:"rgba(255,255,255,0.82)", lineHeight:1.85, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{lines}</div>
    </div>
  );
}


/* ── Copy section helper (existing) ──────────────────────────────────────── */
// formatCopySection — moved to lib/frontend/leadHelpers.js

const COPY_OBJECTIVES = [
  { value: "lead-gen",        label: "Lead Generation",  icon: "🎯", desc: "Get more leads" },
  { value: "traffic",         label: "Website Traffic",  icon: "🌐", desc: "Drive visitors" },
  { value: "brand-awareness", label: "Brand Awareness",  icon: "📢", desc: "Increase reach" },
  { value: "app-downloads",   label: "App Downloads",    icon: "📱", desc: "Get installs" },
  { value: "sales",           label: "Sales Conversion", icon: "💰", desc: "Boost sales" },
];

const COPY_TONES = [
  { value: "bold",         label: "Bold & Aggressive", icon: "⚡",  desc: "High impact & attention grabbing" },
  { value: "professional", label: "Professional",      icon: "🎩", desc: "Trusted & Credible" },
  { value: "casual",       label: "Casual & Friendly", icon: "😊", desc: "Relatable & Conversational" },
  { value: "luxury",       label: "Luxury & Premium",  icon: "💎", desc: "High-end & Sophisticated" },
  { value: "educational",  label: "Educational",       icon: "📚", desc: "Informative & Value-driven" },
];

function CopyInput({ onGenerate }) {
  const [form, setForm] = useState({
    productName:"", website:"", usp:"", targetAudience:"", pain:"",
    objective:"lead-gen", tone:"bold", language:"english", budget:"medium", additionalInfo:"",
  });
  const [error, setError] = useState("");
  const [crawling, setCrawling] = useState(false);
  const [crawlSuccess, setCrawlSuccess] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit() {
    if (!form.productName.trim()) { setError("Please enter your Service / Product name!"); return; }
    setError("");
    onGenerate({ ...form, offer: form.additionalInfo, competitor: "", model: "openai" });
  }

  async function handleAutoFill() {
    if (!form.website.trim()) { setError("Please enter a website URL first!"); return; }
    setCrawling(true); setError(""); setCrawlSuccess(false);
    try {
      const res = await fetch("/api/lead-copy/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.website.trim() }),
      });
      const data = await safeJson(res);
      if (!res.ok || !data.success) throw new Error(data.error || "Could not analyze the website");
      const e = data.extracted;
      setForm(f => ({
        ...f,
        productName: e.productName || f.productName,
        usp: e.usp || f.usp,
        targetAudience: e.targetAudience || f.targetAudience,
        pain: e.pain || f.pain,
      }));
      setCrawlSuccess(true);
      setTimeout(() => setCrawlSuccess(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setCrawling(false);
    }
  }

  const BUDGET_OPTIONS = [
    { value: "small",   label: "Small (under ₹5k/month)" },
    { value: "medium",  label: "Medium (₹5k – ₹25k/month)" },
    { value: "large",   label: "Large (₹25k – ₹1L/month)" },
    { value: "premium", label: "Premium (₹1L+/month)" },
  ];

  return (
    <div style={{ display:"flex", gap:24, alignItems:"flex-start" }}>

      {/* Left: main form */}
      <div style={{ flex:1, minWidth:0 }}>

        {/* Website auto-fill card */}
        <div style={{
          background:"linear-gradient(135deg,rgba(124,58,237,0.08),rgba(59,130,246,0.06))",
          border:"1.5px solid rgba(124,58,237,0.4)", borderRadius:16, padding:"22px 24px", marginBottom:20,
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
            <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>
              ✨ Start with Your Website
              <span style={{ color:"rgba(255,255,255,0.55)", fontWeight:500, fontSize:14, marginLeft:8 }}>(Recommended)</span>
            </div>
            <span style={{ background:"rgba(16,185,129,0.18)", border:"1px solid rgba(16,185,129,0.4)", color:"#34d399", fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20, letterSpacing:0.5 }}>
              AI-Powered
            </span>
          </div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:16 }}>
            Paste your website URL and let AI analyze your business to fill everything automatically.
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            <input
              value={form.website}
              onChange={e => { set("website", e.target.value); setCrawlSuccess(false); }}
              placeholder="https://yourwebsite.com"
              style={{ ...inp, flex:1 }}
              onFocus={e => e.target.style.borderColor="rgba(124,58,237,0.6)"}
              onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"}
            />
            <button
              onClick={handleAutoFill}
              disabled={crawling || !form.website.trim()}
              style={{
                padding:"0 20px", borderRadius:12, border:"none", whiteSpace:"nowrap", flexShrink:0,
                cursor: crawling || !form.website.trim() ? "not-allowed" : "pointer",
                fontSize:13, fontWeight:700,
                background: crawlSuccess ? "rgba(16,185,129,0.2)" : crawling ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#7c3aed,#3b82f6)",
                color: crawlSuccess ? "#34d399" : crawling ? "rgba(255,255,255,0.35)" : "#fff",
                transition:"all 0.2s",
              }}
            >
              {crawling ? "Analyzing..." : crawlSuccess ? "✓ Auto-filled!" : "⚡ Analyze Website & Auto-Fill"}
            </button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:14 }}>
            {["Extracts business info","Detects your audience","Finds USP & pain points","Suggests best ad strategy"].map(t => (
              <span key={t} style={{ fontSize:11, color:"rgba(255,255,255,0.55)", display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ color:"#34d399", fontWeight:700 }}>✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        {/* OR divider */}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22 }}>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:1 }}>OR</span>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }} />
        </div>

        {/* 1. Campaign Objective */}
        <div style={{ marginBottom:24 }}>
          <div style={{ marginBottom:12 }}>
            <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>1. Campaign Objective</span>
            <span style={{ fontSize:12, fontWeight:400, color:"rgba(255,255,255,0.4)", marginLeft:8 }}>Choose your main goal</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
            {COPY_OBJECTIVES.map(o => (
              <button key={o.value} onClick={() => set("objective", o.value)}
                style={{
                  padding:"14px 8px", borderRadius:12, cursor:"pointer", textAlign:"center",
                  background: form.objective===o.value ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${form.objective===o.value ? "rgba(124,58,237,0.55)" : "rgba(255,255,255,0.09)"}`,
                  transition:"all 0.15s", display:"flex", flexDirection:"column", alignItems:"center", gap:7, fontFamily:"inherit",
                }}>
                <span style={{ fontSize:24 }}>{o.icon}</span>
                <span style={{ fontSize:11, fontWeight:700, color: form.objective===o.value ? "#c4b5fd" : "rgba(255,255,255,0.75)", lineHeight:1.2 }}>{o.label}</span>
                <span style={{ fontSize:10, color: form.objective===o.value ? "rgba(196,181,253,0.6)" : "rgba(255,255,255,0.3)", lineHeight:1.3 }}>{o.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2 + 3: Target Audience + Service/Product */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 }}>
          <div>
            <div style={{ marginBottom:8 }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>2. Target Audience</span>
              <span style={{ fontSize:12, fontWeight:400, color:"rgba(255,255,255,0.4)", marginLeft:8 }}>Who do you want to reach?</span>
            </div>
            <input value={form.targetAudience} onChange={e => set("targetAudience", e.target.value)}
              placeholder="e.g. Small business owners (25–45 years)"
              style={inp}
              onFocus={e => e.target.style.borderColor="rgba(124,58,237,0.5)"}
              onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
              {["Age","Location","Interests","Behavior"].map(tag => (
                <span key={tag} style={{ fontSize:10, padding:"3px 8px", borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)" }}>⊕ {tag}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ marginBottom:8 }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>3. Service / Product</span>
              <span style={{ fontSize:12, fontWeight:400, color:"rgba(255,255,255,0.4)", marginLeft:8 }}>What are you promoting?</span>
            </div>
            <input value={form.productName} onChange={e => set("productName", e.target.value)}
              placeholder="e.g. Web Development, SEO, App Development"
              style={inp}
              onFocus={e => e.target.style.borderColor="rgba(124,58,237,0.5)"}
              onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
          </div>
        </div>

        {/* 4. USP */}
        <div style={{ marginBottom:18 }}>
          <div style={{ marginBottom:8 }}>
            <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>4. Unique Selling Proposition (USP)</span>
            <span style={{ fontSize:12, fontWeight:400, color:"rgba(255,255,255,0.4)", marginLeft:8 }}>Why should they choose you?</span>
          </div>
          <input value={form.usp} onChange={e => set("usp", e.target.value)}
            placeholder="e.g. We deliver 2x faster results with proven strategies"
            style={inp}
            onFocus={e => e.target.style.borderColor="rgba(124,58,237,0.5)"}
            onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
        </div>

        {/* 5. Core Pain Point */}
        <div style={{ marginBottom:18 }}>
          <div style={{ marginBottom:8 }}>
            <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>5. Core Pain Point</span>
            <span style={{ fontSize:12, fontWeight:400, color:"rgba(255,255,255,0.4)", marginLeft:8 }}>What problem do you solve?</span>
          </div>
          <input value={form.pain} onChange={e => set("pain", e.target.value)}
            placeholder="e.g. High ad costs, no quality leads, low conversion rates"
            style={inp}
            onFocus={e => e.target.style.borderColor="rgba(124,58,237,0.5)"}
            onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
        </div>

        {/* 6. Brand Tone */}
        <div style={{ marginBottom:24 }}>
          <div style={{ marginBottom:12 }}>
            <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>6. Brand Tone</span>
            <span style={{ fontSize:12, fontWeight:400, color:"rgba(255,255,255,0.4)", marginLeft:8 }}>How should your ad sound?</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
            {COPY_TONES.map(t => (
              <button key={t.value} onClick={() => set("tone", t.value)}
                style={{
                  padding:"13px 8px", borderRadius:12, cursor:"pointer", textAlign:"center",
                  background: form.tone===t.value ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${form.tone===t.value ? "rgba(59,130,246,0.45)" : "rgba(255,255,255,0.09)"}`,
                  transition:"all 0.15s", display:"flex", flexDirection:"column", alignItems:"center", gap:6, fontFamily:"inherit",
                }}>
                <span style={{ fontSize:22 }}>{t.icon}</span>
                <span style={{ fontSize:11, fontWeight:700, color: form.tone===t.value ? "#60a5fa" : "rgba(255,255,255,0.75)", lineHeight:1.2 }}>{t.label}</span>
                <span style={{ fontSize:10, color: form.tone===t.value ? "rgba(96,165,250,0.65)" : "rgba(255,255,255,0.3)", lineHeight:1.3 }}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 7. Budget */}
        <div style={{ marginBottom:18 }}>
          <div style={{ marginBottom:8 }}>
            <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>7. Budget</span>
            <span style={{ fontSize:12, fontWeight:400, color:"rgba(255,255,255,0.4)", marginLeft:8 }}>(Optional) What's your ad budget?</span>
          </div>
          <select value={form.budget} onChange={e => set("budget", e.target.value)}
            style={{ ...inp, cursor:"pointer" }}>
            {BUDGET_OPTIONS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
        </div>

        {/* 8. Additional Info */}
        <div style={{ marginBottom:26 }}>
          <div style={{ marginBottom:8 }}>
            <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>8. Additional Info</span>
            <span style={{ fontSize:12, fontWeight:400, color:"rgba(255,255,255,0.4)", marginLeft:8 }}>(Optional) Any offers, competitors or special notes?</span>
          </div>
          <textarea value={form.additionalInfo} onChange={e => set("additionalInfo", e.target.value)}
            placeholder="e.g. 20% off for first month, Limited time offer, Competitors: ABC, XYZ"
            rows={3}
            style={{ ...inp, resize:"vertical", lineHeight:1.6 }}
            onFocus={e => e.target.style.borderColor="rgba(124,58,237,0.5)"}
            onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
        </div>

        <ErrorBanner message={error} onDismiss={() => setError("")} />

        {/* CTA */}
        <button onClick={handleSubmit}
          style={{
            width:"100%", padding:"18px 24px", borderRadius:14, cursor:"pointer", border:"none",
            background:"linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#3b82f6 100%)",
            color:"#fff", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:4,
            boxShadow:"0 8px 32px rgba(124,58,237,0.35)", transition:"transform 0.15s,box-shadow 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 14px 44px rgba(124,58,237,0.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(124,58,237,0.35)"; }}
        >
          <span style={{ fontSize:16, fontWeight:800 }}>✨ Generate Ad Campaign</span>
          <span style={{ fontSize:12, opacity:0.75 }}>AI will create high-converting ad copy, headlines &amp; strategy</span>
        </button>
      </div>

      {/* Right: info sidebar */}
      <div style={{ width:260, flexShrink:0, display:"flex", flexDirection:"column", gap:14 }}>

        {/* What You'll Get */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"18px 18px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <span style={{ fontSize:18 }}>🎁</span>
            <span style={{ fontSize:14, fontWeight:800, color:"#fff" }}>What You'll Get</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            {[
              "Ad Headlines (10+ Variations)","Primary Ad Text","Call-To-Action (CTA) Suggestions",
              "Audience Targeting Ideas","Creative & Visual Ideas","Meta Ads Copy",
              "Google Ads Copy","LinkedIn Ads Copy","Performance Tips",
            ].map(item => (
              <div key={item} style={{ display:"flex", alignItems:"center", gap:9 }}>
                <span style={{ width:16, height:16, borderRadius:4, background:"rgba(124,58,237,0.2)", border:"1px solid rgba(124,58,237,0.5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:10, color:"#a78bfa" }}>✓</span>
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.65)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"18px 18px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <span style={{ fontSize:18 }}>⚡</span>
            <span style={{ fontSize:14, fontWeight:800, color:"#fff" }}>How It Works</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[
              { n:1, title:"Enter Details", desc:"Add your business & campaign info manually or use auto-fill." },
              { n:2, title:"AI Analyzes",   desc:"Our AI analyzes your business, audience & competitors." },
              { n:3, title:"Get Campaign",  desc:"Receive a complete ad campaign ready to launch." },
            ].map(s => (
              <div key={s.n} style={{ display:"flex", gap:10 }}>
                <div style={{ width:24, height:24, borderRadius:8, background:"rgba(124,58,237,0.25)", border:"1px solid rgba(124,58,237,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:12, fontWeight:800, color:"#c4b5fd" }}>{s.n}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#fff", marginBottom:2 }}>{s.title}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:14, padding:"16px 18px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
            <span style={{ fontSize:16 }}>⭐</span>
            <span style={{ fontSize:13, fontWeight:800, color:"#fcd34d" }}>Pro Tip</span>
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>
            The more details you provide, the more accurate &amp; high-converting your ad campaign will be.
          </div>
        </div>
      </div>

    </div>
  );
}

function CopySpinner() {
  return (
    <ToolCard style={{ textAlign:"center", padding:"64px 32px" }}>
      <div style={{ position:"relative", width:72, height:72, margin:"0 auto 28px" }}>
        <div style={{ position:"absolute", inset:0, border:`3px solid rgba(124,58,237,0.12)`, borderTopColor:T.accent, borderRadius:"50%", animation:"spin 0.9s linear infinite" }} />
        <div style={{ position:"absolute", inset:8, border:`2px solid rgba(59,130,246,0.15)`, borderBottomColor:"#3b82f6", borderRadius:"50%", animation:"spin 1.4s linear infinite reverse" }} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:8 }}>Generating lead copy...</div>
      <div style={{ fontSize:13, color:T.textMuted }}>Creating conversion copy for 6 platforms</div>
    </ToolCard>
  );
}

const AI_MODIFY_SUGGESTIONS = [
  "Make the tone more aggressive",
  "Customize for real estate agents",
  "Add a limited time offer – 7 days only",
  "Make the tone more casual and friendly",
  "Rewrite for enterprise / B2B clients",
  "Budget-friendly messaging – organic focus",
  "Add social proof – '5000+ businesses trust us'",
  "Target startup founders",
];

function CopyResult({ result, productName, onReset, onModify }) {
  const [chatInput, setChatInput]   = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError]   = useState("");
  const [modifySuccess, setModifySuccess] = useState(false);

  async function handleModify() {
    if (!chatInput.trim() || chatLoading) return;
    setChatLoading(true);
    setChatError("");
    setModifySuccess(false);
    try {
      await onModify(chatInput.trim(), result);
      setModifySuccess(true);
      setChatInput("");
      setTimeout(() => setModifySuccess(false), 3000);
    } catch (err) {
      setChatError(err.message || "Modification failed");
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <ToolCard>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:17, fontWeight:800, color:"#fff", marginBottom:4 }}>📣 Lead Campaign – {productName}</div>
          <div style={{ fontSize:12, color:T.textMuted }}>6 platforms · AI-generated · Copy-paste ready</div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button onClick={() => downloadWord(result, productName)} style={{ fontSize:12, fontWeight:600, padding:"8px 14px", borderRadius:10, cursor:"pointer", background:"rgba(37,99,235,0.12)", border:"1px solid rgba(37,99,235,0.35)", color:"#60a5fa" }}>
            📄 Download Word
          </button>
          <button onClick={onReset} style={{ fontSize:12, fontWeight:600, padding:"8px 14px", borderRadius:10, cursor:"pointer", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.55)" }}>
            ← New Campaign
          </button>
        </div>
      </div>
      <div style={{ height:1, background:"rgba(255,255,255,0.06)", marginBottom:20 }} />
      {COPY_SECTIONS.map(sec => (
        <CopySectionBlock key={sec.key} section={sec} content={formatCopySection(sec.key, result)} />
      ))}
      <div style={{ marginTop:8, padding:"11px 15px", background:"rgba(37,99,235,0.07)", border:"1px solid rgba(37,99,235,0.15)", borderRadius:10, fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>
        💡 <strong style={{ color:"#60a5fa" }}>Tip:</strong> Use the "Copy" button in each section to copy directly to clipboard. "Download Word" saves all 6 sections into one .doc file.
      </div>

      {/* ── AI Campaign Modifier ─────────────────────────────────────────────── */}
      <div style={{ marginTop:28, background:"rgba(124,58,237,0.05)", border:"1px solid rgba(124,58,237,0.22)", borderRadius:16, padding:"22px 22px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#7c3aed,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>AI Campaign Modifier</div>
            <div style={{ fontSize:11.5, color:T.textMuted }}>Enter raw data or instructions - AI will update the entire campaign</div>
          </div>
        </div>

        <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"14px 0" }} />

        {/* Quick suggestion chips */}
        <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.35)", marginBottom:8, letterSpacing:0.4 }}>QUICK SUGGESTIONS</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:16 }}>
          {AI_MODIFY_SUGGESTIONS.map(s => (
            <button key={s} onClick={() => setChatInput(s)}
              style={{ fontSize:11, fontWeight:600, padding:"5px 12px", borderRadius:20, cursor:"pointer",
                background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
                color:"rgba(255,255,255,0.48)", transition:"all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(124,58,237,0.15)"; e.currentTarget.style.color=T.accent; e.currentTarget.style.borderColor="rgba(124,58,237,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="rgba(255,255,255,0.48)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleModify(); }}
          placeholder={`Tell us what to modify...\n\nExamples:\n• "Make the tone more aggressive and add urgency"\n• "Use this raw data: [paste your company info here]"\n• "Rewrite the WhatsApp message in a casual tone and mention the offer"`}
          rows={5}
          style={{ ...inp, resize:"vertical", lineHeight:1.7, marginBottom:10, fontSize:13 }}
          onFocus={e => e.target.style.borderColor="rgba(124,58,237,0.5)"}
          onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"}
        />
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", marginBottom:12 }}>You can also press Ctrl+Enter to submit</div>

        {chatError && (
          <div style={{ fontSize:12, color:"#f87171", marginBottom:10, padding:"8px 12px", background:"rgba(248,113,113,0.08)", borderRadius:8, border:"1px solid rgba(248,113,113,0.2)" }}>
            ⚠️ {chatError}
          </div>
        )}
        {modifySuccess && (
          <div style={{ fontSize:12, color:"#34d399", marginBottom:10, padding:"8px 12px", background:"rgba(52,211,153,0.08)", borderRadius:8, border:"1px solid rgba(52,211,153,0.2)" }}>
            ✅ Campaign successfully update ho gaya!
          </div>
        )}

        <button
          onClick={handleModify}
          disabled={chatLoading || !chatInput.trim()}
          style={{
            width:"100%", padding:"13px 18px", borderRadius:12,
            cursor: chatLoading || !chatInput.trim() ? "not-allowed" : "pointer",
            background: chatLoading || !chatInput.trim()
              ? "rgba(124,58,237,0.08)"
              : "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
            border: `1px solid ${chatLoading || !chatInput.trim() ? "rgba(124,58,237,0.15)" : "rgba(124,58,237,0.4)"}`,
            color: chatLoading || !chatInput.trim() ? "rgba(255,255,255,0.25)" : "#fff",
            fontSize:14, fontWeight:700, letterSpacing:0.3, transition:"all 0.2s",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}
        >
          {chatLoading ? (
            <>
              <div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.2)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
              AI is modifying the campaign...
            </>
          ) : "✨ Modify Campaign with AI"}
        </button>
      </div>
    </ToolCard>
  );
}
export { CopyBtn, CopySectionBlock, COPY_OBJECTIVES, COPY_TONES, CopyInput, CopySpinner, CopyResult };

