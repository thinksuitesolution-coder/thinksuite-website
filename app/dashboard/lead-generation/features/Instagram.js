import { useState } from "react";
import { ToolCard, PrimaryButton, T } from "@/app/dashboard/lead-generation/_shell";
import { STATES, STATE_CITIES } from "@/lib/frontend/constants";
import { INTL_COUNTRIES } from "./GlobalCompanies";
import { exportInstagramCSV } from "@/lib/frontend/exporters";
import { buildInstagramInsight } from "@/lib/frontend/leadHelpers";
import { SaveLeadButton } from "./SaveLeadButton";
import { SocialMsgModal } from "./LinkedIn";

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

/* ════════════════════════════════════════════════════════════════════════════
   INSTAGRAM LEADS -INDIA (DOMESTIC)
════════════════════════════════════════════════════════════════════════════ */
export function InstagramBotInput({ onSubmit, isInternational = false, onClearError = () => {} }) {
  const [botStep,        setBotStep]        = useState(1);
  const [accountType,    setAccountType]    = useState("business");
  const [niche,          setNiche]          = useState("");
  const [nicheInput,     setNicheInput]     = useState("");
  const [selectedState,  setSelectedState]  = useState("");
  const [selectedCity,   setSelectedCity]   = useState("");
  const [selectedCountry,setSelectedCountry]= useState("");
  const [area,           setArea]           = useState("");
  const [followerMin,    setFollowerMin]    = useState("");
  const [followerMax,    setFollowerMax]    = useState("");
  const [aiInstructions, setAiInstructions] = useState("");
  const [showAiInst,     setShowAiInst]     = useState(false);
  const [error,          setError]          = useState("");

  const cities = selectedState ? (STATE_CITIES[selectedState] || []) : [];

  const IG_NICHES = ["Skincare","Fashion","Food & Restaurants","Fitness & Gym","Interior Design","Jewellery","Education","Real Estate","Salon & Beauty","Travel","Photography","Tech & Gadgets","Health & Wellness","Clothing Brand","Handicrafts"];

  function handleStep1Next() {
    const n = nicheInput.trim() || niche.trim();
    if (!n) { setError("Niche required"); return; }
    setNiche(n); setError(""); onClearError?.(); setBotStep(2);
  }

  function handleFinalSubmit() {
    if (!niche.trim()) { setError("Niche required"); return; }
    const minF = followerMin ? Number(followerMin) : null;
    const maxF = followerMax ? Number(followerMax) : null;
    if (minF && maxF && minF > maxF) { setError("Min followers cannot be greater than Max"); return; }
    setError("");
    onSubmit(niche.trim(), selectedState, selectedCity, area.trim(), accountType, selectedCountry, isInternational, aiInstructions.trim(), minF, maxF);
  }

  const IG_BOT_TYPES = [
    { value:"business",   label:"Business",    icon:"🏢", desc:"Shops, brands, services" },
    { value:"influencer", label:"Influencer",  icon:"⭐", desc:"Content creators & influencers" },
    { value:"creator",    label:"Creator/UGC", icon:"🎬", desc:"Content creators" },
    { value:"d2c",        label:"D2C Brand",   icon:"🛍️", desc:"Consumer brands" },
  ];

  return (
    <ToolCard>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </div>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:"#fff" }}>Instagram Leads {isInternational ? "(International)" : "(India)"}</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>Find business or influencer profiles with contact info, WhatsApp, social links</div>
        </div>
      </div>

      {/* Progress steps */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:24, padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
        {["Account Type","Location & Followers","Confirm"].map((label,i) => (
          <div key={label} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:24, height:24, borderRadius:"50%",
                background: botStep > i+1 ? "#22c55e" : botStep === i+1 ? T.accent : "rgba(255,255,255,0.08)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700,
                color: botStep >= i+1 ? "#fff" : "rgba(255,255,255,0.3)", flexShrink:0 }}>
                {botStep > i+1 ? "✓" : i+1}
              </div>
              <span style={{ fontSize:12, fontWeight: botStep===i+1 ? 600 : 400, color: botStep>=i+1 ? "#fff" : "rgba(255,255,255,0.3)", whiteSpace:"nowrap" }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)", margin:"0 8px" }} />}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Account type + Niche ── */}
      {botStep === 1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#f09433,#dc2743)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(240,90,50,0.1)", border:"1px solid rgba(240,90,50,0.25)", borderRadius:"4px 14px 14px 14px", padding:"12px 16px" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:3 }}>Which account type are you looking for?</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>Business profiles ya Influencer profiles?</div>
            </div>
          </div>
          <div style={{ paddingLeft:48 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8, marginBottom:16 }}>
              {IG_BOT_TYPES.map(t => (
                <button key={t.value} onClick={() => setAccountType(t.value)}
                  style={{ padding:"10px 12px", borderRadius:10, cursor:"pointer", textAlign:"left",
                    background: accountType===t.value ? `${T.accent}18` : "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${accountType===t.value ? T.accent : "rgba(255,255,255,0.1)"}`,
                    color: accountType===t.value ? T.accent : "rgba(255,255,255,0.6)" }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{t.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700 }}>{t.label}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{t.desc}</div>
                </button>
              ))}
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>Niche / Category *</div>
              <input value={nicheInput} onChange={e => { setNicheInput(e.target.value); setError(""); }}
                onKeyDown={e => e.key==="Enter" && handleStep1Next()}
                placeholder="e.g. Skincare, Fashion, Food, Fitness, Jewellery..." autoFocus
                style={{ ...inp, fontSize:14 }}
                onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
              {IG_NICHES.map(s => (
                <button key={s} onClick={() => setNicheInput(s)}
                  style={{ fontSize:11, padding:"4px 10px", borderRadius:20, cursor:"pointer",
                    background: nicheInput===s ? `${T.accent}18` : "rgba(255,255,255,0.04)",
                    border: nicheInput===s ? `1.5px solid ${T.accent}` : "1px solid rgba(255,255,255,0.1)",
                    color: nicheInput===s ? T.accent : "rgba(255,255,255,0.5)" }}>{s}</button>
              ))}
            </div>
            {error && <div style={{ color:"#f87171", fontSize:13, marginBottom:8 }}>{error}</div>}
            <PrimaryButton onClick={handleStep1Next} disabled={!nicheInput.trim() && !niche.trim()}>
              Next: Location & Followers →
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* ── STEP 2: Location + Follower range ── */}
      {botStep === 2 && (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          {/* Confirmed bubble */}
          <div style={{ display:"flex", gap:12, alignItems:"center", justifyContent:"flex-end" }}>
            <div style={{ background:"rgba(240,90,50,0.12)", border:"1px solid rgba(240,90,50,0.3)", borderRadius:"14px 4px 14px 14px", padding:"8px 14px" }}>
              <span style={{ fontSize:13, fontWeight:600, color:"#fb923c" }}>{accountType} · {niche}</span>
            </div>
            <div style={{ width:30, height:30, borderRadius:"50%", background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>👤</div>
          </div>
          {/* Bot question */}
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#f09433,#dc2743)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(240,90,50,0.1)", border:"1px solid rgba(240,90,50,0.25)", borderRadius:"4px 14px 14px 14px", padding:"12px 16px", flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:3 }}>Location + Follower Range</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>Location optional. Set a follower range for a more accurate filter.</div>
            </div>
          </div>
          <div style={{ paddingLeft:48 }}>
            {/* Location */}
            {isInternational ? (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} style={{ ...inp, cursor:"pointer", fontSize:12 }}>
                  <option value="">Select Country (optional)</option>
                  {[...INTL_COUNTRIES].sort((a,b) => a.localeCompare(b)).map(c => <option key={c} value={c} style={{ color:"#111", background:"#fff" }}>{c}</option>)}
                </select>
                <input value={selectedCity} onChange={e => setSelectedCity(e.target.value)} placeholder="City (optional)"
                  style={{ ...inp, fontSize:12 }} onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
                <select value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedCity(""); }} style={{ ...inp, cursor:"pointer", fontSize:12 }}>
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s} value={s} style={{ color:"#111", background:"#fff" }}>{s}</option>)}
                </select>
                {selectedState ? (
                  <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} style={{ ...inp, cursor:"pointer", fontSize:12 }}>
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c} value={c} style={{ color:"#111", background:"#fff" }}>{c}</option>)}
                  </select>
                ) : (
                  <input value={selectedCity} onChange={e => setSelectedCity(e.target.value)} placeholder="City (optional)" style={{ ...inp, fontSize:12 }}
                    onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
                )}
                <input value={area} onChange={e => setArea(e.target.value)} placeholder="Area/Locality" style={{ ...inp, fontSize:12 }}
                  onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
              </div>
            )}

            {/* Follower range - FROM TO */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.7)", marginBottom:8 }}>
                Follower Range <span style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:400 }}>(set for accurate filtering - leave blank for no filter)</span>
              </div>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>From (minimum)</div>
                  <input type="number" value={followerMin} onChange={e => setFollowerMin(e.target.value)} placeholder="e.g. 1000" min={0}
                    style={{ ...inp, fontSize:13 }} onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
                </div>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:18, marginTop:16 }}>→</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>To (maximum)</div>
                  <input type="number" value={followerMax} onChange={e => setFollowerMax(e.target.value)} placeholder="e.g. 100000" min={0}
                    style={{ ...inp, fontSize:13 }} onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
                {[
                  { label:"Nano (<10K)",    min:500,    max:9999    },
                  { label:"Micro (10K-100K)",min:10000, max:100000  },
                  { label:"Mid (100K-500K)",min:100000, max:500000  },
                  { label:"Macro (500K-1M)",min:500000, max:1000000 },
                  { label:"Mega (1M+)",     min:1000000,max:null    },
                ].map(p => {
                  const active = followerMin === String(p.min) && followerMax === String(p.max || "");
                  return (
                    <button key={p.label} onClick={() => { setFollowerMin(String(p.min)); setFollowerMax(p.max ? String(p.max) : ""); }}
                      style={{ fontSize:10, padding:"3px 9px", borderRadius:20, cursor:"pointer",
                        background: active ? `${T.accent}18` : "rgba(255,255,255,0.04)",
                        border: active ? `1.5px solid ${T.accent}` : "1px solid rgba(255,255,255,0.1)",
                        color: active ? T.accent : "rgba(255,255,255,0.45)" }}>{p.label}</button>
                  );
                })}
                <button onClick={() => { setFollowerMin(""); setFollowerMax(""); }}
                  style={{ fontSize:10, padding:"3px 9px", borderRadius:20, cursor:"pointer", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)" }}>
                  Clear
                </button>
              </div>
            </div>

            {error && <div style={{ color:"#f87171", fontSize:13, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(1)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={() => setBotStep(3)}>Next: Confirm →</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: Confirm ── */}
      {botStep === 3 && (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#f09433,#dc2743)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(240,90,50,0.1)", border:"1px solid rgba(240,90,50,0.25)", borderRadius:"4px 14px 14px 14px", padding:"12px 16px", flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:8 }}>Confirm - ready to start the search?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>📸 <strong style={{ color:"#fff" }}>Type:</strong> {accountType}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>🎯 <strong style={{ color:"#fff" }}>Niche:</strong> {niche}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>📍 <strong style={{ color:"#fff" }}>Location:</strong> {[area,selectedCity,selectedState,selectedCountry].filter(Boolean).join(", ") || (isInternational ? "Global" : "Pan India")}</div>
                {(followerMin || followerMax) && <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>👥 <strong style={{ color:"#fff" }}>Followers:</strong> {followerMin || "0"} → {followerMax || "∞"} <span style={{ fontSize:11, color:"#22c55e" }}>✓ Strict filter</span></div>}
              </div>
            </div>
          </div>
          <div style={{ paddingLeft:48 }}>
            {/* AI Instructions */}
            <div style={{ marginBottom:14, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, overflow:"hidden" }}>
              <button onClick={() => setShowAiInst(v => !v)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.6)", fontSize:12 }}>
                <span style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <span>⚙️</span><span style={{ fontWeight:600 }}>Special Instructions</span>
                  <span style={{ fontSize:10, background:"rgba(124,58,237,0.2)", color:"#a78bfa", padding:"1px 7px", borderRadius:10, fontWeight:700 }}>OPTIONAL</span>
                  {aiInstructions.trim() && <span style={{ fontSize:10, color:"#4ade80" }}>● Active</span>}
                </span>
                <span style={{ fontSize:10 }}>{showAiInst ? "▲" : "▼"}</span>
              </button>
              {showAiInst && (
                <div style={{ padding:"0 14px 14px" }}>
                  <textarea value={aiInstructions} onChange={e => setAiInstructions(e.target.value)}
                    placeholder="e.g. Only accounts with email in bio, Only verified accounts, Skip accounts without WhatsApp..."
                    rows={3} style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#fff", fontSize:12, padding:"10px 12px", resize:"vertical", outline:"none", lineHeight:1.6, boxSizing:"border-box" }} />
                </div>
              )}
            </div>
            {error && <div style={{ color:"#f87171", fontSize:13, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(2)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={handleFinalSubmit}>📸 Search Instagram Leads</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

export function InstagramInputIndia({ onSubmit, onClearError }) {
  return <InstagramBotInput onSubmit={onSubmit} isInternational={false} onClearError={onClearError} />;
}

/* ════════════════════════════════════════════════════════════════════════════
   INSTAGRAM LEADS COMPONENTS (kept for compatibility)
════════════════════════════════════════════════════════════════════════════ */

const INSTA_ACCOUNT_TYPES = [
  { value: "business",   label: "Business Accounts",            desc: "Verified business profiles",             icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg> },
  { value: "nano",       label: "Nano Accounts (<10k)",         desc: "Small accounts under 10k followers",     icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { value: "influencer", label: "Micro Influencers (10k-100k)", desc: "Influencers with 10k to 100k followers", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { value: "d2c",        label: "B2C Brands",                   desc: "Consumer-focused brands",               icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { value: "creator",    label: "Creators / UGC",               desc: "Content creators & UGC makers",         icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg> },
  { value: "other",      label: "Other",                        desc: "Other types of accounts",               icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg> },
];


export function InstagramInput({ onSubmit, onClearError }) {
  return <InstagramBotInput onSubmit={onSubmit} isInternational={true} onClearError={onClearError} />;
}


export function InstagramInsightModal({ lead, onClose }) {
  const insight = buildInstagramInsight(lead);
  const profileUrl = lead.profileUrl || `https://www.instagram.com/${lead.handle}/`;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, width:"100%", maxWidth:560, padding:28, position:"relative", maxHeight:"90vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:20, cursor:"pointer", lineHeight:1 }}>✕</button>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>AI Lead Insight</div>
            <div style={{ fontSize:12, color:"#7c3aed" }}>{lead.name || `@${lead.handle}`}</div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Profile Details</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {lead.handle && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Handle</div><div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>@{lead.handle}</div></div>}
            {lead.category && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Category</div><div style={{ fontSize:13, color:"#fff" }}>{lead.category}</div></div>}
            {lead.followers && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Followers</div><div style={{ fontSize:13, color:"#fbbf24", fontWeight:600 }}>👥 {lead.followers}</div></div>}
            {lead.location && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Location</div><div style={{ fontSize:13, color:"#fff" }}>{lead.location}</div></div>}
            {lead.email && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Email</div><div style={{ fontSize:13, color:T.accent, fontWeight:600 }}>{lead.email}</div></div>}
          </div>
          {lead.bioSnippet && (
            <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:11, color:T.textMuted, marginBottom:4 }}>Bio</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>{lead.bioSnippet}</div>
            </div>
          )}
        </div>
        <div style={{ background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#7c3aed", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>🤖 AI Analysis</div>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.82)", lineHeight:1.8, margin:0 }}>{insight}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {lead.email && <a href={`mailto:${lead.email}`} style={{ flex:1, padding:"11px 0", borderRadius:10, textAlign:"center", fontSize:13, fontWeight:700, background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:"#7c3aed", textDecoration:"none" }}>📧 Email</a>}
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" style={{ flex:1, padding:"11px 0", borderRadius:10, textAlign:"center", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", textDecoration:"none" }}>↗ Instagram</a>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   INSTAGRAM RESULTS COMPONENTS
════════════════════════════════════════════════════════════════════════════ */
export function InstagramProcessing({ niche, city, state }) {
  return (
    <ToolCard style={{ textAlign:"center", padding:"64px 32px" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", border:"3px solid rgba(225,48,108,0.2)", borderTopColor:"#e1306c", animation:"spin 0.9s linear infinite", margin:"0 auto 28px" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:8 }}>Searching Instagram Leads...</div>
      <div style={{ fontSize:13, color:T.textMuted, marginBottom:24 }}>
        <strong style={{ color:"#e1306c" }}>{niche}</strong>
        {city && <> · <strong style={{ color:"#e1306c" }}>{city}</strong></>}
        {state && <>, {state}</>}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:360, margin:"0 auto" }}>
        {["🔍 Searching Instagram profiles","🤖 MyThinkAI extracting handles & contacts","📧 Finding emails & WhatsApp numbers","📦 Preparing lead cards"].map((s,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 16px", fontSize:13, color:T.textMuted, textAlign:"left" }}>{s}</div>
        ))}
      </div>
    </ToolCard>
  );
}

export function InstagramResults({ leads, queryLabel, niche, onReset, onLoadMore, loadingMore, onSaveLead, savedLeadIds, savingLeadId, aiInsight }) {
  const [msgLead, setMsgLead]         = useState(null);
  const [insightLead, setInsightLead] = useState(null);
  const [filterMode, setFilterMode]   = useState("all");

  if (!leads || leads.length === 0) {
    return (
      <ToolCard style={{ textAlign:"center", padding:"48px 32px" }}>
        <div style={{ fontSize:40, marginBottom:16 }}>😕</div>
        <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:8 }}>No leads found</div>
        <div style={{ fontSize:14, color:T.textMuted, marginBottom:24 }}>Try a different niche, location, or account type.</div>
        <button onClick={onReset} style={{ padding:"10px 24px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700, background:"rgba(225,48,108,0.12)", border:"1px solid rgba(225,48,108,0.3)", color:"#e1306c" }}>← Search Again</button>
      </ToolCard>
    );
  }

  const withEmail  = leads.filter(l => l.email).length;
  const withPhone  = leads.filter(l => l.phone || l.whatsapp).length;

  const displayLeads = leads.filter(l => {
    if (filterMode === "email")  return !!l.email;
    if (filterMode === "phone")  return !!(l.phone || l.whatsapp);
    return true;
  });

  function exportCsv() { exportInstagramCSV(displayLeads, niche); }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {msgLead     && <SocialMsgModal lead={msgLead} leadType="instagram" searchCategory={niche} onClose={() => setMsgLead(null)} />}
      {insightLead && <InstagramInsightModal lead={insightLead} onClose={() => setInsightLead(null)} />}

      {aiInsight && (
        <div style={{ padding:"14px 18px", background:"rgba(225,48,108,0.08)", border:"1px solid rgba(225,48,108,0.25)", borderRadius:12, display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ fontSize:20 }}>🤖</div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"#e1306c", marginBottom:4 }}>AI Insight</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", lineHeight:1.6 }}>{aiInsight}</div>
          </div>
        </div>
      )}

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <span style={{ fontSize:17, fontWeight:800, color:"#fff" }}>{leads.length} Leads Found</span>
          {queryLabel && <span style={{ fontSize:13, color:T.textMuted, marginLeft:10 }}>"{queryLabel}"</span>}
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          {[
            { id:"all",   label:`All (${leads.length})` },
            { id:"email", label:`📧 Email (${withEmail})` },
            { id:"phone", label:`📞 Phone (${withPhone})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFilterMode(f.id)}
              style={{ fontSize:11, fontWeight:600, padding:"5px 12px", borderRadius:20, cursor:"pointer",
                background: filterMode===f.id ? "rgba(225,48,108,0.18)" : "rgba(255,255,255,0.04)",
                border:`1px solid ${filterMode===f.id ? "rgba(225,48,108,0.5)" : "rgba(255,255,255,0.1)"}`,
                color: filterMode===f.id ? "#e1306c" : "rgba(255,255,255,0.5)" }}>{f.label}</button>
          ))}
          <button onClick={exportCsv} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:700, padding:"7px 16px", borderRadius:10, cursor:"pointer", background:"linear-gradient(135deg,#e1306c,#f09433)", border:"none", color:"#fff" }}>⬇ Export CSV</button>
          <button onClick={onReset} style={ghostBtn}>← New Search</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(290px, 1fr))", gap:14 }}>
        {displayLeads.map((lead, idx) => {
          const profileUrl = lead.profileUrl || (lead.handle ? `https://www.instagram.com/${lead.handle}/` : null);
          const waNum = lead.whatsapp || (lead.phone ? lead.phone.replace(/\D/g,"") : "");
          const lid = lead.handle || lead.profileUrl || idx;
          const saved = savedLeadIds?.has(lid);
          const saving = savingLeadId === lid;
          return (
            <div key={idx} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:14, padding:16, display:"flex", flexDirection:"column", gap:9 }}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(225,48,108,0.35)"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.09)"}>

              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.3 }}>{lead.name || `@${lead.handle}`}</div>
                  {lead.handle && <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>@{lead.handle}</div>}
                  {lead.category && <div style={{ marginTop:5 }}><span style={{ fontSize:11, padding:"2px 8px", borderRadius:20, background:"rgba(225,48,108,0.12)", border:"1px solid rgba(225,48,108,0.25)", color:"#e1306c" }}>{lead.category}</span></div>}
                </div>
                <div style={{ fontSize:18 }}>📸</div>
              </div>

              {lead.followers && <div style={{ fontSize:12, color:"#fbbf24", fontWeight:600 }}>👥 {lead.followers} followers</div>}
              {lead.location  && <div style={{ fontSize:12, color:T.textMuted }}>📍 {lead.location}</div>}
              {lead.bioSnippet && <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.5, borderLeft:"2px solid rgba(225,48,108,0.3)", paddingLeft:8 }}>{lead.bioSnippet}</div>}

              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {lead.email    && <div style={{ fontSize:12, color:T.accent }}><span>📧</span> {lead.email}</div>}
                {lead.phone    && <div style={{ fontSize:12, color:"#60a5fa" }}><span>📞</span> {lead.phone}</div>}
                {lead.whatsapp && lead.whatsapp !== lead.phone && <div style={{ fontSize:12, color:"#22c55e" }}><span>💬</span> {lead.whatsapp}</div>}
              </div>

              <div style={{ display:"flex", gap:8, marginTop:"auto" }}>
                <button onClick={() => setInsightLead(lead)} style={{ flex:1, padding:"8px 0", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:700, background:"rgba(225,48,108,0.08)", border:"1px solid rgba(225,48,108,0.25)", color:"#e1306c" }}>🔍 Insight</button>
                <button onClick={() => setMsgLead(lead)} style={{ flex:1, padding:"8px 0", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:700, background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent }}>🤖 AI Msg</button>
                {profileUrl && <a href={profileUrl} target="_blank" rel="noopener noreferrer" style={{ padding:"8px 12px", borderRadius:10, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:12 }}>↗</a>}
                {waNum && <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer" style={{ padding:"8px 12px", borderRadius:10, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", color:"#22c55e", textDecoration:"none", fontSize:12 }}>💬</a>}
                {onSaveLead && <SaveLeadButton lid={lid} onSave={() => onSaveLead({ ...lead, id: lid })} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId} style={{ padding:"8px 10px", borderRadius:10 }} />}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign:"center", paddingTop:8 }}>
        <button onClick={onLoadMore} disabled={loadingMore}
          style={{ padding:"12px 32px", borderRadius:12, cursor:loadingMore?"not-allowed":"pointer", fontSize:14, fontWeight:700,
            background:loadingMore?"rgba(255,255,255,0.04)":"rgba(225,48,108,0.1)",
            border:`1px solid ${loadingMore?"rgba(255,255,255,0.08)":"rgba(225,48,108,0.3)"}`,
            color:loadingMore?"rgba(255,255,255,0.3)":"#e1306c" }}>
          {loadingMore ? "⏳ Loading more..." : "🔄 Load More Leads"}
        </button>
      </div>
    </div>
  );
}


