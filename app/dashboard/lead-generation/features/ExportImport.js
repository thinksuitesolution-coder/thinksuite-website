"use client";
import { useState } from "react";
import { ToolCard, PrimaryButton, T } from "@/app/dashboard/lead-generation/_shell";
import { STATES, STATE_CITIES } from "@/lib/frontend/constants";
import { exportEximCSV } from "@/lib/frontend/exporters";
import { safeJson } from "@/lib/frontend/api";
import { SaveLeadButton } from "./SaveLeadButton";

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
   EXPORT-IMPORT LEADS -Input → Processing → Results → Insight → Message
════════════════════════════════════════════════════════════════════════════ */

const EXIM_PRODUCT_SUGGESTIONS = [
  "Rice", "Wheat", "Cotton Yarn", "Spices", "Leather Goods", "Garments",
  "Steel Products", "Machinery Parts", "Chemicals", "Pharmaceuticals",
  "Plastic Products", "Textile Fabric", "Seafood / Shrimp", "Gems & Jewellery",
  "Engineering Goods", "Auto Components", "Electronic Components", "Furniture",
  "Ceramic Tiles", "Paper & Pulp",
];

const EXIM_TRADE_TYPES = [
  { value: "exporter", label: "Exporters",          icon: "📤", hint: "Companies that sell products to foreign buyers" },
  { value: "importer", label: "Importers",          icon: "📥", hint: "Companies that buy products from foreign sellers" },
  { value: "both",     label: "Both (Exporter + Importer)", icon: "🔄", hint: "Companies doing both import and export" },
];

const EXIM_CATEGORIES = [
  { cat:"Agriculture & Food", products:["Basmati Rice","Spices","Tea & Coffee","Wheat","Pulses","Sugar","Onion","Mango","Seafood","Cotton","Tobacco"] },
  { cat:"Textiles & Apparel", products:["Cotton Yarn","Readymade Garments","Silk Fabric","Woolen Products","Jute Products","Leather Goods","Footwear"] },
  { cat:"Chemicals & Pharma", products:["Pharmaceuticals","Dyes & Chemicals","Agrochemicals","Fertilizers","Plastic Granules","Rubber Products","Cosmetics"] },
  { cat:"Engineering & Metal", products:["Steel Products","Aluminium","Copper","Auto Components","Machinery","Electronic Components","Hand Tools","Castings"] },
  { cat:"Gems & Jewellery",   products:["Cut & Polished Diamonds","Gold Jewellery","Silver Jewellery","Imitation Jewellery","Precious Stones"] },
  { cat:"IT & Electronics",   products:["Software Services","IT Hardware","Electronic Goods","Mobile Accessories","Solar Panels","LED Products"] },
  { cat:"Handicrafts & Home", products:["Handicrafts","Carpets & Rugs","Furniture","Marble Products","Granite","Ceramics","Glassware"] },
  { cat:"Chemicals Raw Mat",  products:["Petrochemicals","Industrial Chemicals","Solvents","Pigments","Essential Oils","Waxes"] },
];

/* ── Universal Lead Advisor - appears on any tool failure ───────────────── */
function LeadAdvisor({ suggestion, loading, onChipClick, onDismiss }) {
  if (!loading && !suggestion) return null;

  if (loading) {
    return (
      <div style={{ background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.22)", borderRadius:14, padding:"16px 20px", marginTop:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#c4b5fd" }}>Lead Advisor soch raha hai...</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>Better search options dhundh raha hai</div>
          </div>
          <div style={{ marginLeft:"auto", width:18, height:18, borderRadius:"50%", border:"2px solid rgba(124,58,237,0.3)", borderTopColor:"rgba(124,58,237,0.9)", animation:"spin 0.8s linear infinite" }} />
        </div>
      </div>
    );
  }

  const { headline, whyNote, tip, chips = [], sources } = suggestion;
  const actionable = chips.filter(c => c.action);
  const info       = chips.filter(c => !c.action);

  return (
    <div style={{ background:"rgba(124,58,237,0.05)", border:"1.5px solid rgba(124,58,237,0.25)", borderRadius:14, padding:"16px 18px", marginTop:14, position:"relative" }}>
      <button onClick={onDismiss} style={{ position:"absolute", top:10, right:12, background:"none", border:"none", color:"rgba(255,255,255,0.25)", cursor:"pointer", fontSize:16, lineHeight:1 }}>✕</button>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,rgba(124,58,237,0.4),rgba(139,92,246,0.6))", border:"1.5px solid rgba(124,58,237,0.45)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>🤖</div>
        <div>
          <div style={{ fontSize:13, fontWeight:800, color:"#c4b5fd" }}>Lead Advisor</div>
          {headline && <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginTop:1 }}>{headline}</div>}
        </div>
      </div>

      {/* Why explanation */}
      {whyNote && (
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"11px 13px", marginBottom:12, fontSize:12, color:"rgba(255,255,255,0.72)", lineHeight:1.7 }}>
          {whyNote}
        </div>
      )}

      {/* Actionable chips - clickable */}
      {actionable.length > 0 && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.38)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:7 }}>Quick Actions</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {actionable.map((chip, i) => (
              <button key={i} onClick={() => onChipClick && onChipClick(chip)}
                style={{ fontSize:12, fontWeight:600, padding:"7px 13px", borderRadius:20, cursor:"pointer",
                  background:"rgba(124,58,237,0.14)", border:"1.5px solid rgba(124,58,237,0.38)", color:"#c4b5fd",
                  display:"flex", alignItems:"center", gap:5, transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(124,58,237,0.28)"; e.currentTarget.style.color="#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(124,58,237,0.14)"; e.currentTarget.style.color="#c4b5fd"; }}>
                {chip.icon && <span>{chip.icon}</span>}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info chips - display only */}
      {info.length > 0 && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.38)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:7 }}>Suggestions</div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {info.map((chip, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:7, fontSize:12, color:"rgba(255,255,255,0.6)", lineHeight:1.5 }}>
                <span style={{ flexShrink:0, marginTop:1 }}>{chip.icon || "•"}</span>
                <span>{chip.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro tip */}
      {tip && (
        <div style={{ display:"flex", alignItems:"flex-start", gap:8, background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.18)", borderRadius:8, padding:"9px 12px" }}>
          <span style={{ fontSize:13, flexShrink:0 }}>💡</span>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.62)", lineHeight:1.65 }}><strong style={{ color:"#4ade80" }}>Pro tip:</strong> {tip}</span>
        </div>
      )}

      {/* Sources */}
      {sources && (
        <div style={{ marginTop:8, fontSize:10, color:"rgba(255,255,255,0.25)", textAlign:"right" }}>Sources: {sources}</div>
      )}
    </div>
  );
}

/* ── AI Trade Advisor: shows when exim search fails ─────────────────────── */
function EximSuggestionBot({ suggestion, loading, product, state, onTryState, onTryKeyword, onDismiss }) {
  if (!loading && !suggestion) return null;

  const accentPurple = "rgba(124,58,237,0.9)";

  if (loading) {
    return (
      <div style={{ background:"rgba(124,58,237,0.07)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:14, padding:"18px 20px", marginTop:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#c4b5fd" }}>AI Trade Advisor is thinking...</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>Finding better states and keywords for you</div>
          </div>
          <div style={{ marginLeft:"auto", width:20, height:20, borderRadius:"50%", border:"2px solid rgba(124,58,237,0.3)", borderTopColor:accentPurple, animation:"spin 0.8s linear infinite" }} />
        </div>
      </div>
    );
  }

  const { whyNote, tip, topStates = [], keywords = [], ports = [], hsHint } = suggestion;

  return (
    <div style={{ background:"rgba(124,58,237,0.06)", border:"1.5px solid rgba(124,58,237,0.28)", borderRadius:14, padding:"18px 20px", marginTop:16, position:"relative" }}>
      <button onClick={onDismiss} style={{ position:"absolute", top:12, right:12, background:"none", border:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:14, lineHeight:1 }}>✕</button>

      {/* Bot header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,rgba(124,58,237,0.4),rgba(139,92,246,0.6))", border:"1.5px solid rgba(124,58,237,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🤖</div>
        <div>
          <div style={{ fontSize:14, fontWeight:800, color:"#c4b5fd" }}>AI Trade Advisor</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>India export-import ka expert</div>
        </div>
      </div>

      {/* Why note */}
      <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 14px", marginBottom:14, fontSize:13, color:"rgba(255,255,255,0.75)", lineHeight:1.65 }}>
        {whyNote}
      </div>

      {/* Top states */}
      {topStates.length > 0 && (
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>
            📍 Better States for {product}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {topStates.map(s => (
              <button key={s} onClick={() => onTryState(s)}
                style={{ fontSize:12, fontWeight:700, padding:"7px 14px", borderRadius:20, cursor:"pointer",
                  background:"rgba(124,58,237,0.15)", border:"1.5px solid rgba(124,58,237,0.4)", color:"#c4b5fd",
                  transition:"all 0.15s" }}
                onMouseEnter={e => { e.target.style.background="rgba(124,58,237,0.3)"; e.target.style.color="#fff"; }}
                onMouseLeave={e => { e.target.style.background="rgba(124,58,237,0.15)"; e.target.style.color="#c4b5fd"; }}>
                🔍 Try in {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Better keywords */}
      {keywords.length > 0 && (
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>
            🔤 Better Search Terms
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {keywords.map(k => (
              <button key={k} onClick={() => onTryKeyword(k)}
                style={{ fontSize:12, padding:"5px 12px", borderRadius:16, cursor:"pointer",
                  background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.7)",
                  transition:"all 0.15s" }}
                onMouseEnter={e => { e.target.style.background="rgba(255,255,255,0.12)"; e.target.style.color="#fff"; }}
                onMouseLeave={e => { e.target.style.background="rgba(255,255,255,0.06)"; e.target.style.color="rgba(255,255,255,0.7)"; }}>
                {k}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ports row */}
      {ports.length > 0 && (
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>
            🚢 Primary Export Ports
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>{ports.join("  •  ")}</div>
        </div>
      )}

      {/* HS hint */}
      {hsHint && (
        <div style={{ background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:8, padding:"8px 12px", marginBottom:12 }}>
          <span style={{ fontSize:11, fontWeight:700, color:"#60a5fa" }}>📋 HS Code: </span>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>{hsHint}</span>
        </div>
      )}

      {/* Tip */}
      {tip && (
        <div style={{ display:"flex", alignItems:"flex-start", gap:8, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, padding:"9px 12px" }}>
          <span style={{ fontSize:14, flexShrink:0 }}>💡</span>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}><strong style={{ color:"#4ade80" }}>Pro tip:</strong> {tip}</span>
        </div>
      )}
    </div>
  );
}

function ExportImportInput({ onSubmit, initialProduct = "", initialState = "" }) {
  const [botStep,        setBotStep]        = useState(initialProduct ? 2 : 1);
  const [selectedCat,   setSelectedCat]   = useState("");
  const [product,       setProduct]       = useState(initialProduct);
  const [productInput,  setProductInput]  = useState(initialProduct);
  const [tradeType,     setTradeType]     = useState("exporter");
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCity,  setSelectedCity]  = useState("");
  const [hsCode,        setHsCode]        = useState("");
  const [aiInst,        setAiInst]        = useState("");
  const [showAiInst,    setShowAiInst]    = useState(false);
  const [error,         setError]         = useState("");

  const cities = selectedState ? (STATE_CITIES[selectedState] || []) : [];
  const activeCat = EXIM_CATEGORIES.find(c => c.cat === selectedCat);

  function handleStep1() {
    const p = productInput.trim() || product.trim();
    if (!p) { setError("Product required"); return; }
    setProduct(p); setError(""); setBotStep(2);
  }

  function handleSubmit() {
    if (!product.trim()) { setError("Product required"); return; }
    setError("");
    onSubmit(product.trim(), tradeType, selectedState, selectedCity, "", hsCode.trim(), aiInst.trim());
  }

  return (
    <ToolCard>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:"rgba(124,58,237,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🚢</div>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:"#fff" }}>Exporters / Importers (India)</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>IEC registered companies • Customs data • Shipment history • Contact details</div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:22, padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
        {["Category & Product","Trade Type & Location","Confirm"].map((label,i) => (
          <div key={label} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background: botStep>i+1?"#22c55e":botStep===i+1?T.accent:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.3)" }}>{botStep>i+1?"✓":i+1}</div>
              <span style={{ fontSize:11, fontWeight:botStep===i+1?600:400, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.35)", whiteSpace:"nowrap" }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)", margin:"0 8px" }} />}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {botStep === 1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"10px 14px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>Which product category are you looking for?</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Choose a category or type a product directly</div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            {/* Category chips */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
              {EXIM_CATEGORIES.map(c => (
                <button key={c.cat} onClick={() => setSelectedCat(c.cat === selectedCat ? "" : c.cat)}
                  style={{ fontSize:11, padding:"5px 11px", borderRadius:20, cursor:"pointer",
                    background: selectedCat===c.cat?"rgba(124,58,237,0.18)":"rgba(255,255,255,0.04)",
                    border: selectedCat===c.cat?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                    color: selectedCat===c.cat?T.accent:"rgba(255,255,255,0.55)" }}>{c.cat}</button>
              ))}
            </div>
            {/* Category product chips */}
            {activeCat && (
              <div style={{ marginBottom:12, padding:"10px 12px", background:"rgba(124,58,237,0.06)", borderRadius:10, border:"1px solid rgba(124,58,237,0.15)" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:7, textTransform:"uppercase", letterSpacing:0.5 }}>{selectedCat}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {activeCat.products.map(p => (
                    <button key={p} onClick={() => setProductInput(p)}
                      style={{ fontSize:11, padding:"3px 9px", borderRadius:16, cursor:"pointer",
                        background: productInput===p?"rgba(124,58,237,0.2)":"rgba(255,255,255,0.05)",
                        border: productInput===p?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                        color: productInput===p?T.accent:"rgba(255,255,255,0.6)" }}>{p}</button>
                  ))}
                </div>
              </div>
            )}
            {/* Product input */}
            <input value={productInput} onChange={e => { setProductInput(e.target.value); setError(""); }}
              onKeyDown={e => e.key==="Enter" && handleStep1()} autoFocus
              placeholder="e.g. Basmati Rice, Cotton Yarn, Pharmaceuticals, Steel..."
              style={{ ...inp, fontSize:14, marginBottom:10 }}
              onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            {/* HS Code optional */}
            <input value={hsCode} onChange={e => setHsCode(e.target.value)}
              placeholder="HS Code (optional) e.g. 1006 for Rice"
              style={{ ...inp, fontSize:13, marginBottom:10 }}
              onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            {error && <div style={{ color:"#f87171", fontSize:12, marginBottom:8 }}>{error}</div>}
            <PrimaryButton onClick={handleStep1} disabled={!productInput.trim()}>Next: Trade Type →</PrimaryButton>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {botStep === 2 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:8, alignItems:"center" }}>
            <div style={{ background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:"12px 4px 12px 12px", padding:"7px 13px" }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.accent }}>{product}</span>
            </div>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>👤</div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"10px 14px", flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>Trade type + Location</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Exporter or Importer? + Select State/City</div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            {/* Trade type */}
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {[{v:"exporter",l:"Exporter 🚀",d:"Exports goods"},{v:"importer",l:"Importer 📥",d:"Imports goods"},{v:"both",l:"Both 🔄",d:"Both"}].map(t => (
                <button key={t.v} onClick={() => setTradeType(t.v)}
                  style={{ flex:1, padding:"10px 8px", borderRadius:10, cursor:"pointer", textAlign:"center",
                    background: tradeType===t.v?"rgba(124,58,237,0.18)":"rgba(255,255,255,0.04)",
                    border: tradeType===t.v?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                    color: tradeType===t.v?T.accent:"rgba(255,255,255,0.6)" }}>
                  <div style={{ fontSize:13, fontWeight:700 }}>{t.l}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{t.d}</div>
                </button>
              ))}
            </div>
            {/* Location */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
              <select value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedCity(""); }} style={{ ...inp, cursor:"pointer", fontSize:12 }}>
                <option value="">Select State (optional)</option>
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
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(1)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={() => setBotStep(3)}>Next: Confirm →</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {botStep === 3 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"12px 16px", flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:8 }}>Confirm - ready to start the search?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>🏭 <strong style={{ color:"#fff" }}>Product:</strong> {product}{hsCode ? ` (HS: ${hsCode})` : ""}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>🚢 <strong style={{ color:"#fff" }}>Type:</strong> {tradeType}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>📍 <strong style={{ color:"#fff" }}>Location:</strong> {[selectedCity,selectedState].filter(Boolean).join(", ") || "All India"}</div>
              </div>
              <div style={{ marginTop:8, fontSize:11, color:"rgba(124,58,237,0.7)", lineHeight:1.5 }}>
                🔍 IndiaMart • TradeIndia • ImportYeti (US Customs) • Zauba (India Customs) • DGFT/IEC data
              </div>
              <div style={{ marginTop:6, fontSize:11, color:"rgba(255,255,255,0.5)", lineHeight:1.5 }}>
                📊 You'll get: Company name • IEC registration • Export/Import turnover • Shipment history • Phone • Email • WhatsApp • Certifications
              </div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            {/* Special instructions */}
            <div style={{ marginBottom:12, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, overflow:"hidden" }}>
              <button onClick={() => setShowAiInst(v=>!v)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 12px", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.5)", fontSize:11 }}>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}><span>⚙️</span><span style={{ fontWeight:600 }}>Special Instructions</span><span style={{ fontSize:9, background:"rgba(124,58,237,0.2)", color:"#a78bfa", padding:"1px 6px", borderRadius:8, fontWeight:700 }}>OPTIONAL</span>{aiInst.trim()&&<span style={{ fontSize:9, color:"#4ade80" }}>● Active</span>}</span>
                <span style={{ fontSize:9 }}>{showAiInst?"▲":"▼"}</span>
              </button>
              {showAiInst&&<div style={{ padding:"0 12px 12px" }}><textarea value={aiInst} onChange={e=>setAiInst(e.target.value)} placeholder="e.g. Only APEDA certified, Only Gujarat exporters, Minimum 100 MT/year..." rows={2} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#fff", fontSize:11, padding:"8px 10px", resize:"vertical", outline:"none", lineHeight:1.5, boxSizing:"border-box" }} /></div>}
            </div>
            {error && <div style={{ color:"#f87171", fontSize:12, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(2)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={handleSubmit}>🚢 Find Traders</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

function ExportImportProcessing({ product, tradeType, city }) {
  const typeLabel = tradeType === "exporter" ? "Exporters" : tradeType === "importer" ? "Importers" : "Exporters & Importers";
  return (
    <ToolCard style={{ textAlign:"center", padding:"64px 32px" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", border:`3px solid rgba(124,58,237,0.2)`, borderTopColor:T.accent, animation:"spin 0.9s linear infinite", margin:"0 auto 28px" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:8 }}>Searching for trade leads...</div>
      <div style={{ fontSize:13, color:T.textMuted, marginBottom:24 }}>
        <strong style={{ color:T.accent }}>{product}</strong> · <strong style={{ color:T.accent }}>{typeLabel}</strong> · {city}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:400, margin:"0 auto" }}>
        {[
          "🔍 Searching DGFT IEC database",
          "📦 Scanning Zauba & Volza shipment records",
          "🏭 Checking IndiaMart / TradeIndia company profiles",
          "🤖 MyThinkAI extracting HS codes, ports, and volumes",
          "📊 Scoring and verifying leads",
        ].map(item => (
          <div key={item} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 16px", fontSize:13, color:T.textMuted, textAlign:"left" }}>
            {item}
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ── Export-Import AI Insight Modal ───────────────────────────────────────── */
function EximInsightModal({ lead, onClose }) {
  const [copied, setCopied] = useState(null);
  function copy(val, key) { navigator.clipboard.writeText(val); setCopied(key); setTimeout(() => setCopied(null), 2000); }

  const scoreColor = lead.lead_score >= 8 ? "#3b82f6" : lead.lead_score >= 5 ? "#3b82f6" : "#7c3aed";
  const scoreLabel = lead.lead_score >= 8 ? "High Value" : lead.lead_score >= 5 ? "Medium" : "Low";

  const insight = (() => {
    const parts = [];
    const co = lead.company_name || "This company";
    const type = lead.type === "exporter" ? "exporter" : lead.type === "importer" ? "importer" : "exporter-importer";
    const prod = lead.product || "goods";

    parts.push(`${co} is a ${type} dealing in ${prod}${lead.city ? ` based in ${lead.city}` : ""}.`);

    if (lead.shipment_volume && lead.shipment_volume !== "N/A") {
      parts.push(`Shipment activity: ${lead.shipment_volume} -indicates ${parseInt(lead.shipment_volume) > 100 ? "high-volume active trader" : "regular trade activity"}.`);
    }
    if (lead.top_port && lead.top_port !== "N/A") {
      parts.push(`Primary port: ${lead.top_port}. Target logistics, freight, or compliance services relevant to this port.`);
    }
    if (lead.hs_code && lead.hs_code !== "N/A") {
      parts.push(`ITC-HS Code: ${lead.hs_code}. This helps identify exact trade regulations, duty rates, and compliance requirements for your outreach.`);
    }
    if (lead.verified) {
      parts.push("Contact info verified -direct outreach via phone or email will have the highest conversion rate.");
    } else {
      parts.push("Contact info not directly verified -LinkedIn or IndiaMart message is recommended first.");
    }
    if (lead.past_history && lead.past_history !== "N/A") {
      parts.push(`Trade background: ${lead.past_history}`);
    }
    parts.push(lead.lead_score >= 8
      ? "Priority lead -full data available, reach out immediately with a customized proposal."
      : lead.lead_score >= 5
      ? "Good lead -partial data available, use AI Message to craft a targeted outreach."
      : "Limited data available -cross-verify on DGFT/IndiaMart before outreach.");
    return parts.join(" ");
  })();

  const dataRow = (label, val, copyKey) => val && val !== "N/A" ? (
    <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
      <div>
        <div style={{ fontSize:11, color:T.textMuted, marginBottom:3 }}>{label}</div>
        <div style={{ fontSize:13, color:"#fff", fontWeight:500, lineHeight:1.5, wordBreak:"break-all" }}>{val}</div>
      </div>
      {copyKey && (
        <button onClick={() => copy(val, copyKey)}
          style={{ flexShrink:0, fontSize:11, padding:"4px 10px", borderRadius:6, cursor:"pointer",
            background: copied===copyKey ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)",
            border:`1px solid ${copied===copyKey ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`,
            color: copied===copyKey ? "#3b82f6" : "rgba(255,255,255,0.4)" }}>
          {copied===copyKey ? "✓" : "Copy"}
        </button>
      )}
    </div>
  ) : null;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, width:"100%", maxWidth:560, padding:28, position:"relative", maxHeight:"92vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:20, cursor:"pointer" }}>✕</button>

        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🚢</div>
          <div>
            <div style={{ fontSize:17, fontWeight:800, color:"#fff" }}>{lead.company_name}</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:3 }}>
              <span style={{ fontSize:11, padding:"2px 9px", borderRadius:20, background:`${scoreColor}18`, border:`1px solid ${scoreColor}44`, color:scoreColor, fontWeight:700 }}>
                Score {lead.lead_score}/10 · {scoreLabel}
              </span>
              {lead.verified && <span style={{ fontSize:11, padding:"2px 9px", borderRadius:20, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.3)", color:"#3b82f6", fontWeight:700 }}>✓ Verified</span>}
            </div>
          </div>
        </div>

        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Trade Profile</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            {lead.type && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Trade Type</div><div style={{ fontSize:13, color:T.accent, fontWeight:700, textTransform:"capitalize" }}>{lead.type === "both" ? "Exporter + Importer" : lead.type}</div></div>}
            {lead.hs_code && lead.hs_code !== "N/A" && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>ITC-HS Code</div><div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>{lead.hs_code}</div></div>}
            {lead.annual_turnover && lead.annual_turnover !== "N/A" && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Annual Turnover</div><div style={{ fontSize:13, color:"#22c55e", fontWeight:700 }}>{lead.annual_turnover}</div></div>}
            {lead.shipment_volume && lead.shipment_volume !== "N/A" && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Shipment Volume</div><div style={{ fontSize:13, color:"#3b82f6", fontWeight:700 }}>{lead.shipment_volume}</div></div>}
            {lead.top_port && lead.top_port !== "N/A" && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Primary Port</div><div style={{ fontSize:13, color:"#fff" }}>{lead.top_port}</div></div>}
            {lead.target_countries && lead.target_countries !== "N/A" && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Trade Countries</div><div style={{ fontSize:12, color:"rgba(255,255,255,0.75)" }}>{lead.target_countries}</div></div>}
            {lead.certifications && lead.certifications !== "N/A" && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>Certifications</div><div style={{ fontSize:12, color:"#fbbf24" }}>{lead.certifications}</div></div>}
            {lead.iec_number && lead.iec_number !== "N/A" && <div><div style={{ fontSize:11, color:T.textMuted, marginBottom:2 }}>IEC Number</div><div style={{ fontSize:12, color:"rgba(255,255,255,0.8)", fontFamily:"monospace" }}>{lead.iec_number}</div></div>}
          </div>
          <div style={{ display:"flex", flexDirection:"column" }}>
            {dataRow("📞 Phone", lead.phone, "phone")}
            {lead.whatsapp && lead.whatsapp !== "N/A" && <div style={{ padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}><div style={{ fontSize:11, color:T.textMuted, marginBottom:3 }}>💬 WhatsApp</div><a href={`https://wa.me/${(lead.whatsapp||"").replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" style={{ fontSize:13, color:"#22c55e", textDecoration:"none" }}>{lead.whatsapp}</a></div>}
            {dataRow("📧 Email", lead.email, "email")}
            {dataRow("👤 Contact Person", lead.contact_person)}
            {dataRow("📍 City / State", [lead.city, lead.state].filter(v => v && v !== "N/A").join(", "))}
            {dataRow("📦 Product", lead.product)}
            {lead.website && lead.website !== "N/A" && (
              <div style={{ padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize:11, color:T.textMuted, marginBottom:3 }}>🌐 Website</div>
                <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize:13, color:"#3b82f6", textDecoration:"none" }}>{lead.website.replace(/^https?:\/\//,"").replace(/\/$/,"")}</a>
              </div>
            )}
            {dataRow("📜 Past History / Trade Background", lead.past_history)}
            {dataRow("🔗 Data Source", lead.source)}
          </div>
        </div>

        <div style={{ background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.accent, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>🤖 AI Trade Intelligence</div>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.82)", lineHeight:1.85, margin:0 }}>{insight}</p>
        </div>

        <div style={{ display:"flex", gap:8 }}>
          {lead.phone && lead.phone !== "N/A" && <a href={`tel:${lead.phone}`} style={{ flex:1, padding:"11px 0", borderRadius:10, textAlign:"center", fontSize:13, fontWeight:700, background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent, textDecoration:"none" }}>📞 Call</a>}
          {lead.email && lead.email !== "N/A" && <a href={`mailto:${lead.email}`} style={{ flex:1, padding:"11px 0", borderRadius:10, textAlign:"center", fontSize:13, fontWeight:700, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.25)", color:"#3b82f6", textDecoration:"none" }}>📧 Email</a>}
          {lead.website && lead.website !== "N/A" && <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" style={{ flex:1, padding:"11px 0", borderRadius:10, textAlign:"center", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:T.textMuted, textDecoration:"none" }}>🌐 Website</a>}
        </div>
      </div>
    </div>
  );
}

/* ── Export-Import AI Message Modal ───────────────────────────────────────── */
function EximMsgModal({ lead, onClose }) {
  const [step,       setStep]       = useState("services");
  const [services,   setServices]   = useState("");
  const [msgs,       setMsgs]       = useState(null);
  const [error,      setError]      = useState("");
  const [tab,        setTab]        = useState("english");
  const [copied,     setCopied]     = useState(false);
  const [extraCtx,   setExtraCtx]   = useState("");
  const [showCustomize, setShowCustomize] = useState(false);

  function generate(extra = "") {
    if (!services.trim()) return;
    setStep("loading");
    setError("");
    fetch("/api/lead-gen/export-import-message", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ lead, userServices: services, extraContext: extra }),
    })
      .then(r => safeJson(r))
      .then(d => { if (d.error) throw new Error(d.error); setMsgs(d); setStep("result"); setShowCustomize(false); })
      .catch(e => { setError(e.message); setStep("services"); });
  }

  const TABS = [
    { key:"english",  label:"English",    color:"#3b82f6" },
    { key:"hinglish", label:"Casual",     color:T.accent  },
    { key:"whatsapp", label:"WhatsApp",   color:"#3b82f6" },
  ];
  const currentText = msgs ? (tab === "email_subject" ? msgs.email_subject : msgs[tab]) : "";

  function copyText() {
    if (!currentText) return;
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", zIndex:1001, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, width:"100%", maxWidth:540, padding:28, position:"relative", maxHeight:"92vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:20, cursor:"pointer" }}>✕</button>

        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>AI Trade Outreach</div>
            <div style={{ fontSize:12, color:T.accent }}>{lead.company_name}</div>
          </div>
        </div>

        {step === "services" && (
          <>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.7)", display:"block", marginBottom:8 }}>What do you offer? *</label>
              <textarea
                value={services}
                onChange={e => setServices(e.target.value)}
                placeholder="e.g. Export documentation services, freight forwarding, customs clearance, trade finance, buyer connections, packaging solutions..."
                rows={3}
                style={{ ...inp, resize:"vertical", lineHeight:1.6 }}
                onFocus={e => e.target.style.borderColor=T.accent}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"}
              />
            </div>
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:12, color:T.textMuted }}>
              <strong style={{ color:"rgba(255,255,255,0.5)" }}>Lead:</strong> {lead.company_name} · {lead.product || "N/A"} · {lead.type || "N/A"} · {lead.city || ""}{lead.state ? `, ${lead.state}` : ""}
            </div>
            {error && <div style={{ color:"#f87171", fontSize:13, marginBottom:12 }}>{error}</div>}
            <PrimaryButton onClick={() => generate()} disabled={!services.trim()}>
              🤖 Generate Trade Messages
            </PrimaryButton>
          </>
        )}

        {step === "loading" && (
          <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ width:48, height:48, borderRadius:"50%", border:`3px solid rgba(124,58,237,0.2)`, borderTopColor:T.accent, animation:"spin 0.9s linear infinite", margin:"0 auto 20px" }} />
            <div style={{ fontSize:15, color:"rgba(255,255,255,0.7)" }}>Generating trade outreach messages...</div>
          </div>
        )}

        {step === "result" && msgs && (
          <>
            <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
              {TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{ fontSize:12, fontWeight:700, padding:"6px 14px", borderRadius:20, cursor:"pointer",
                    background: tab===t.key ? `${t.color}20` : "rgba(255,255,255,0.04)",
                    border:`1.5px solid ${tab===t.key ? t.color+"66" : "rgba(255,255,255,0.1)"}`,
                    color: tab===t.key ? t.color : "rgba(255,255,255,0.45)", transition:"all 0.15s" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {msgs.email_subject && (
              <div style={{ background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:10, padding:"10px 14px", marginBottom:12 }}>
                <div style={{ fontSize:11, color:"rgba(59,130,246,0.8)", fontWeight:700, marginBottom:4 }}>EMAIL SUBJECT</div>
                <div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>{msgs.email_subject}</div>
              </div>
            )}

            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:16, marginBottom:14 }}>
              <div style={{ fontSize:14, color:"rgba(255,255,255,0.85)", lineHeight:1.85, whiteSpace:"pre-wrap" }}>{currentText}</div>
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              <button onClick={copyText}
                style={{ flex:1, padding:"10px 0", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
                  background: copied ? "rgba(59,130,246,0.12)" : "rgba(124,58,237,0.1)",
                  border:`1px solid ${copied ? "rgba(59,130,246,0.3)" : "rgba(124,58,237,0.25)"}`,
                  color: copied ? "#3b82f6" : T.accent }}>
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
              <button onClick={() => setShowCustomize(v => !v)}
                style={{ flex:1, padding:"10px 0", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
                  background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.55)" }}>
                ✏️ Customize
              </button>
              <button onClick={() => setStep("services")}
                style={{ padding:"10px 16px", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:600,
                  background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", color:T.textMuted }}>
                ↺
              </button>
            </div>

            {showCustomize && (
              <div>
                <textarea
                  value={extraCtx}
                  onChange={e => setExtraCtx(e.target.value)}
                  placeholder="e.g. Include a price quote, add a 3-day deadline, keep it formal..."
                  rows={3}
                  style={{ ...inp, resize:"vertical", lineHeight:1.6, marginBottom:10 }}
                  onFocus={e => e.target.style.borderColor=T.accent}
                  onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"}
                />
                <PrimaryButton onClick={() => generate(extraCtx)}>
                  ✨ Regenerate with Instructions
                </PrimaryButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Export-Import Results ─────────────────────────────────────────────────── */
function ExportImportResults({ leads, product, tradeType, totalSeen, onReset, onLoadMore, loadingMore, onSaveLead, savedLeadIds, savingLeadId }) {
  const [msgLead,     setMsgLead]     = useState(null);
  const [insightLead, setInsightLead] = useState(null);
  const [copiedKey,   setCopiedKey]   = useState(null);

  function copy(val, key) { navigator.clipboard.writeText(val); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 2000); }

  const typeColor = { exporter:"#3b82f6", importer:"#3b82f6", both:"#3b82f6" };
  const typeIcon  = { exporter:"📤", importer:"📥", both:"🔄" };

  if (leads.length === 0) {
    return (
      <ToolCard style={{ textAlign:"center", padding:"48px 32px" }}>
        <div style={{ fontSize:40, marginBottom:16 }}>🔍</div>
        <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:8 }}>No trade leads found</div>
        <div style={{ fontSize:14, color:T.textMuted, marginBottom:24 }}>Try a different product name or location and search again.</div>
        <button onClick={onReset} style={{ padding:"10px 24px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700, background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)", color:T.accent }}>
          ← New Search
        </button>
      </ToolCard>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {msgLead     && <EximMsgModal     lead={msgLead}     onClose={() => setMsgLead(null)} />}
      {insightLead && <EximInsightModal lead={insightLead} onClose={() => setInsightLead(null)} />}

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <span style={{ fontSize:17, fontWeight:800, color:"#fff" }}>{leads.length} Trade Leads</span>
          <span style={{ fontSize:13, color:T.textMuted, marginLeft:10 }}>{product} · {tradeType === "both" ? "Exporter+Importer" : tradeType}</span>
          {totalSeen > 0 && (
            <div style={{ marginTop:4, fontSize:12, color:"rgba(255,255,255,0.35)" }}>
              ✅ <strong style={{ color:"rgba(124,58,237,0.85)" }}>{totalSeen}</strong> total unique leads seen · no repeats guaranteed
            </div>
          )}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => exportEximCSV(leads, product)}
            style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:700, padding:"7px 16px", borderRadius:10, cursor:"pointer", background:"linear-gradient(135deg,#7c3aed,#5b21b6)", border:"none", color:"#fff" }}>
            ⬇ Export CSV
          </button>
          <button onClick={onReset} style={ghostBtn}>← New Search</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:14 }}>
        {leads.map((lead, idx) => {
          const tc = typeColor[lead.type] || T.accent;
          const ti = typeIcon[lead.type] || "🚢";
          const scoreColor = lead.lead_score >= 8 ? "#3b82f6" : lead.lead_score >= 5 ? "#3b82f6" : "#7c3aed";
          return (
            <div key={idx}
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:18, display:"flex", flexDirection:"column", gap:11, transition:"border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(124,58,237,0.35)"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}>

              {/* Header */}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.3, wordBreak:"break-word" }}>{lead.company_name}</div>
                  {lead.contact_person && lead.contact_person !== "N/A" && (
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:3 }}>👤 {lead.contact_person}</div>
                  )}
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0, maxWidth:130 }}>
                  <span style={{ fontSize:11, padding:"2px 9px", borderRadius:20, background:`${tc}18`, border:`1px solid ${tc}44`, color:tc, fontWeight:700, textAlign:"right", wordBreak:"break-word" }}>
                    {ti} {lead.type === "both" ? "Both" : lead.type?.charAt(0).toUpperCase() + lead.type?.slice(1)}
                  </span>
                  <span style={{ fontSize:11, padding:"2px 9px", borderRadius:20, background:`${scoreColor}14`, border:`1px solid ${scoreColor}33`, color:scoreColor }}>
                    Score {lead.lead_score}/10
                  </span>
                </div>
              </div>

              {/* Location */}
              {(lead.city || lead.state) && (
                <div style={{ fontSize:12, color:T.textMuted }}>
                  📍 {[lead.city, lead.state].filter(v => v && v !== "N/A").join(", ")}
                </div>
              )}

              {/* Product + HS Code */}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {lead.product && lead.product !== "N/A" && (
                  <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.65)" }}>
                    📦 {lead.product}
                  </span>
                )}
                {lead.hs_code && lead.hs_code !== "N/A" && (
                  <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent, fontWeight:600 }}>
                    HS {lead.hs_code}
                  </span>
                )}
                {lead.verified && (
                  <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.25)", color:"#3b82f6", fontWeight:700 }}>
                    ✓ Verified
                  </span>
                )}
              </div>

              {/* Shipment + Port */}
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {lead.shipment_volume && lead.shipment_volume !== "N/A" && (
                  <div style={{ fontSize:12, color:"#3b82f6" }}>📊 {lead.shipment_volume}</div>
                )}
                {lead.top_port && lead.top_port !== "N/A" && (
                  <div style={{ fontSize:12, color:T.textMuted }}>⚓ {lead.top_port}</div>
                )}
              </div>

              {/* About Us */}
              {lead.about_us && lead.about_us !== "N/A" && (
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.6, background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"8px 10px", borderLeft:"2px solid rgba(124,58,237,0.4)" }}>
                  {lead.about_us}
                </div>
              )}

              {/* Contact info */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {lead.phone && lead.phone !== "N/A" && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <a href={`tel:${lead.phone}`} style={{ fontSize:12, color:T.accent, textDecoration:"none", fontWeight:600 }}>📞 {lead.phone}</a>
                    <button onClick={() => copy(lead.phone, `ph-${idx}`)}
                      style={{ fontSize:11, padding:"3px 9px", borderRadius:6, cursor:"pointer",
                        background: copiedKey===`ph-${idx}` ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)",
                        border:`1px solid ${copiedKey===`ph-${idx}` ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`,
                        color: copiedKey===`ph-${idx}` ? "#3b82f6" : "rgba(255,255,255,0.35)" }}>
                      {copiedKey===`ph-${idx}` ? "✓" : "📋"}
                    </button>
                  </div>
                )}
                {lead.email && lead.email !== "N/A" && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:12, color:"#60a5fa", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>✉ {lead.email}</span>
                    <button onClick={() => copy(lead.email, `em-${idx}`)}
                      style={{ flexShrink:0, fontSize:11, padding:"3px 9px", borderRadius:6, cursor:"pointer",
                        background: copiedKey===`em-${idx}` ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)",
                        border:`1px solid ${copiedKey===`em-${idx}` ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`,
                        color: copiedKey===`em-${idx}` ? "#3b82f6" : "rgba(255,255,255,0.35)" }}>
                      {copiedKey===`em-${idx}` ? "✓" : "📋"}
                    </button>
                  </div>
                )}
                {lead.website && lead.website !== "N/A" && (
                  <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize:12, color:"#3b82f6", textDecoration:"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    🌐 {lead.website.replace(/^https?:\/\//,"").replace(/\/$/,"")}
                  </a>
                )}
                {!lead.phone && !lead.email && lead.phone !== "N/A" && lead.email !== "N/A" && (
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)", fontStyle:"italic" }}>No contact info found - verify using AI Insight</span>
                )}
              </div>

              {/* Source + Action buttons */}
              {lead.source && lead.source !== "N/A" && (
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:8 }}>
                  Source: {lead.source}
                </div>
              )}

              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <button onClick={() => setInsightLead(lead)}
                  style={{ flex:1, minWidth:70, fontSize:12, padding:"9px 0", borderRadius:9, cursor:"pointer", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", color:T.accent, fontWeight:600 }}>
                  🔍 Insight
                </button>
                <button onClick={() => setMsgLead(lead)}
                  style={{ flex:1, minWidth:70, fontSize:12, padding:"9px 0", borderRadius:9, cursor:"pointer", background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)", color:"#7c3aed", fontWeight:600 }}>
                  🤖 AI Msg
                </button>
                {onSaveLead && <SaveLeadButton lid={lead.company_name || lead.name} onSave={() => onSaveLead({ ...lead, business_name: lead.company_name, source: "exim" })} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId} style={{ flex:1, minWidth:50 }} />}
              </div>
            </div>
          );
        })}
      </div>

      {onLoadMore && (
        <div style={{ textAlign:"center" }}>
          <button onClick={onLoadMore} disabled={loadingMore}
            style={{ padding:"11px 36px", borderRadius:12, cursor: loadingMore ? "not-allowed" : "pointer", fontSize:14, fontWeight:700,
              background: loadingMore ? "rgba(255,255,255,0.04)" : "rgba(124,58,237,0.12)",
              border:`1.5px solid ${loadingMore ? "rgba(255,255,255,0.08)" : "rgba(124,58,237,0.35)"}`,
              color: loadingMore ? T.textMuted : T.accent }}>
            {loadingMore ? "Loading..." : "🔄 Load More Leads"}
          </button>
        </div>
      )}
    </div>
  );
}
export {
  EXIM_PRODUCT_SUGGESTIONS, EXIM_TRADE_TYPES, EXIM_CATEGORIES,
  LeadAdvisor, ExportImportInput, ExportImportProcessing,
  EximInsightModal, EximMsgModal, ExportImportResults, EximSuggestionBot,
};

