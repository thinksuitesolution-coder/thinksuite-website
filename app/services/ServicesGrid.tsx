'use client'
import React, { useState } from 'react'
import { ServiceDrawer, ServiceDrawerData, serviceDrawerData } from '@/components/ui/ServiceDrawer'

/* ─────────────────────── SVG Mockups ─────────────────────────── */

function SoftwareDevMockup() {
  return (
    <svg viewBox="0 0 230 310" fill="none" xmlns="http://www.w3.org/2000/svg" className="sp-mockup">
      <rect x="4" y="0" width="222" height="228" rx="14" fill="#1e1e2e"/>
      <rect x="4" y="0" width="222" height="32" rx="14" fill="#2a2a3d"/>
      <rect x="4" y="26" width="222" height="6" fill="#2a2a3d"/>
      <circle cx="24" cy="16" r="5" fill="#ff5f57"/><circle cx="40" cy="16" r="5" fill="#febc2e"/><circle cx="56" cy="16" r="5" fill="#28c840"/>
      <text x="18" y="56" fontFamily="monospace" fontSize="8.5" fill="#c792ea">import</text>
      <text x="56" y="56" fontFamily="monospace" fontSize="8.5" fill="#cdd6f4"> React </text>
      <text x="92" y="56" fontFamily="monospace" fontSize="8.5" fill="#c792ea">from</text>
      <text x="118" y="56" fontFamily="monospace" fontSize="8.5" fill="#a6e3a1"> &apos;react&apos;</text>
      <text x="18" y="72" fontFamily="monospace" fontSize="8.5" fill="#c792ea">import</text>
      <text x="56" y="72" fontFamily="monospace" fontSize="8.5" fill="#cdd6f4"> &#123; Chart &#125; </text>
      <text x="110" y="72" fontFamily="monospace" fontSize="8.5" fill="#c792ea">from</text>
      <text x="136" y="72" fontFamily="monospace" fontSize="8.5" fill="#a6e3a1"> &apos;recharts&apos;</text>
      <text x="18" y="90" fontFamily="monospace" fontSize="8.5" fill="#c792ea">const</text>
      <text x="48" y="90" fontFamily="monospace" fontSize="8.5" fill="#89dceb"> Dashboard</text>
      <text x="108" y="90" fontFamily="monospace" fontSize="8.5" fill="#89b4fa"> = () =&gt; &#123;</text>
      <text x="18" y="106" fontFamily="monospace" fontSize="8.5" fill="#c792ea">  return</text>
      <text x="64" y="106" fontFamily="monospace" fontSize="8.5" fill="#cdd6f4"> (</text>
      <text x="28" y="122" fontFamily="monospace" fontSize="8.5" fill="#f38ba8">&lt;</text>
      <text x="34" y="122" fontFamily="monospace" fontSize="8.5" fill="#89dceb">div</text>
      <text x="58" y="122" fontFamily="monospace" fontSize="8.5" fill="#fab387"> className</text>
      <text x="116" y="122" fontFamily="monospace" fontSize="8.5" fill="#89b4fa">=&quot;dash&quot;</text>
      <text x="152" y="122" fontFamily="monospace" fontSize="8.5" fill="#f38ba8">&gt;</text>
      <text x="38" y="138" fontFamily="monospace" fontSize="8.5" fill="#f38ba8">&lt;</text>
      <text x="44" y="138" fontFamily="monospace" fontSize="8.5" fill="#89dceb">Chart</text>
      <text x="82" y="138" fontFamily="monospace" fontSize="8.5" fill="#fab387"> data</text>
      <text x="110" y="138" fontFamily="monospace" fontSize="8.5" fill="#a6e3a1">=&#123;data&#125;</text>
      <text x="144" y="138" fontFamily="monospace" fontSize="8.5" fill="#f38ba8"> /&gt;</text>
      <text x="28" y="154" fontFamily="monospace" fontSize="8.5" fill="#f38ba8">&lt;/</text>
      <text x="40" y="154" fontFamily="monospace" fontSize="8.5" fill="#89dceb">div</text>
      <text x="66" y="154" fontFamily="monospace" fontSize="8.5" fill="#f38ba8">&gt;</text>
      <text x="18" y="170" fontFamily="monospace" fontSize="8.5" fill="#cdd6f4">&#125;</text>
      <text x="18" y="188" fontFamily="monospace" fontSize="8.5" fill="#c792ea">export</text>
      <text x="58" y="188" fontFamily="monospace" fontSize="8.5" fill="#c792ea"> default</text>
      <text x="110" y="188" fontFamily="monospace" fontSize="8.5" fill="#89dceb"> Dashboard</text>
      <text x="172" y="188" fontFamily="monospace" fontSize="8.5" fill="#cdd6f4">;</text>
      <rect x="24" y="244" width="182" height="62" rx="11" fill="white" filter="url(#sdsh1)"/>
      <text x="40" y="264" fontFamily="system-ui,sans-serif" fontSize="10" fill="#64748b">Performance</text>
      <text x="40" y="290" fontFamily="system-ui,sans-serif" fontSize="20" fontWeight="800" fill="#0f172a">98%</text>
      <polyline points="120,286 134,278 144,282 156,270 168,275 180,260" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <defs><filter id="sdsh1"><feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.08"/></filter></defs>
    </svg>
  )
}

function DigitalMarketingMockup() {
  return (
    <svg viewBox="0 0 230 310" fill="none" xmlns="http://www.w3.org/2000/svg" className="sp-mockup">
      <rect x="8" y="0" width="214" height="130" rx="13" fill="white" filter="url(#sdsh2)"/>
      <text x="24" y="24" fontFamily="system-ui,sans-serif" fontSize="10" fill="#64748b">Total Leads</text>
      <text x="24" y="54" fontFamily="system-ui,sans-serif" fontSize="26" fontWeight="800" fill="#0f172a">12.5K</text>
      <rect x="106" y="38" width="56" height="20" rx="5" fill="rgba(34,197,94,0.1)"/>
      <text x="112" y="52" fontFamily="system-ui,sans-serif" fontSize="10" fontWeight="700" fill="#16a34a">▲ 25.8%</text>
      <polyline points="24,112 50,100 72,106 94,88 116,94 138,78 160,84 186,68" stroke="#2563eb" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <polyline points="24,112 50,100 72,106 94,88 116,94 138,78 160,84 186,68 186,130 24,130" fill="rgba(37,99,235,0.06)"/>
      <text x="24" y="128" fontFamily="system-ui,sans-serif" fontSize="8" fill="#94a3b8">Performance</text>
      <rect x="8" y="140" width="214" height="166" rx="13" fill="white" filter="url(#sdsh2)"/>
      <circle cx="86" cy="210" r="44" stroke="#e2e8f0" strokeWidth="18" fill="none"/>
      <circle cx="86" cy="210" r="44" stroke="#2563eb" strokeWidth="18" fill="none" strokeDasharray="133 276" strokeDashoffset="69"/>
      <circle cx="86" cy="210" r="44" stroke="#d97706" strokeWidth="18" fill="none" strokeDasharray="88 276" strokeDashoffset="-64"/>
      <circle cx="86" cy="210" r="44" stroke="#22c55e" strokeWidth="18" fill="none" strokeDasharray="55 276" strokeDashoffset="-152"/>
      <circle cx="150" cy="178" r="4" fill="#2563eb"/><text x="160" y="182" fontFamily="system-ui,sans-serif" fontSize="9" fill="#334155">SEO</text><text x="196" y="182" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700" fill="#0f172a">48%</text>
      <circle cx="150" cy="198" r="4" fill="#d97706"/><text x="160" y="202" fontFamily="system-ui,sans-serif" fontSize="9" fill="#334155">Paid Ads</text><text x="196" y="202" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700" fill="#0f172a">32%</text>
      <circle cx="150" cy="218" r="4" fill="#22c55e"/><text x="160" y="222" fontFamily="system-ui,sans-serif" fontSize="9" fill="#334155">Social</text><text x="196" y="222" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700" fill="#0f172a">20%</text>
      <defs><filter id="sdsh2"><feDropShadow dx="0" dy="3" stdDeviation="7" floodColor="#000" floodOpacity="0.07"/></filter></defs>
    </svg>
  )
}

function BrandingDesignMockup() {
  return (
    <svg viewBox="0 0 230 310" fill="none" xmlns="http://www.w3.org/2000/svg" className="sp-mockup">
      <rect x="4" y="0" width="138" height="168" rx="13" fill="#0f172a"/>
      <text x="22" y="72" fontFamily="Georgia,serif" fontSize="44" fontWeight="800" fill="white">Aa</text>
      <text x="22" y="95" fontFamily="system-ui,sans-serif" fontSize="12" fill="#94a3b8">Satoshi</text>
      <text x="22" y="118" fontFamily="system-ui,sans-serif" fontSize="8" fill="rgba(255,255,255,0.35)">A B C D E F G H I J K L</text>
      <text x="22" y="132" fontFamily="system-ui,sans-serif" fontSize="8" fill="rgba(255,255,255,0.35)">M N O P Q R S T U V W X</text>
      <text x="22" y="146" fontFamily="system-ui,sans-serif" fontSize="8" fill="rgba(255,255,255,0.35)">1 2 3 4 5 6 7 8 9 0</text>
      <rect x="152" y="0" width="74" height="50" rx="10" fill="#1e293b"/>
      <rect x="152" y="58" width="74" height="50" rx="10" fill="#7c3aed"/>
      <rect x="152" y="116" width="74" height="50" rx="10" fill="#fbbf24"/>
      <rect x="4" y="178" width="222" height="128" rx="13" fill="white" filter="url(#sdsh3)"/>
      <text x="20" y="202" fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="700" fill="#0f172a">Guideline</text>
      <rect x="20" y="212" width="72" height="3" rx="2" fill="#0f172a"/>
      <rect x="20" y="224" width="190" height="2" rx="1" fill="#e2e8f0"/>
      <rect x="20" y="234" width="190" height="2" rx="1" fill="#e2e8f0"/>
      <rect x="20" y="244" width="190" height="2" rx="1" fill="#e2e8f0"/>
      <rect x="20" y="254" width="140" height="2" rx="1" fill="#e2e8f0"/>
      <rect x="20" y="268" width="80" height="2" rx="1" fill="#7c3aed" opacity="0.5"/>
      <rect x="108" y="268" width="44" height="2" rx="1" fill="#e2e8f0"/>
      <defs><filter id="sdsh3"><feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.07"/></filter></defs>
    </svg>
  )
}

function AIAutomationMockup() {
  const nodes = [{cx:38,cy:90},{cx:38,cy:140},{cx:38,cy:190},{cx:108,cy:65},{cx:108,cy:115},{cx:108,cy:165},{cx:108,cy:215},{cx:178,cy:90},{cx:178,cy:165}]
  const edges = [[0,3],[0,4],[1,3],[1,4],[1,5],[2,4],[2,5],[2,6],[3,7],[3,8],[4,7],[4,8],[5,7],[5,8],[6,8]]
  return (
    <svg viewBox="0 0 230 310" fill="none" xmlns="http://www.w3.org/2000/svg" className="sp-mockup">
      <rect x="4" y="0" width="222" height="222" rx="14" fill="#060c1f"/>
      {edges.map(([a,b],i)=><line key={i} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy} stroke="rgba(96,165,250,0.22)" strokeWidth="1"/>)}
      {nodes.map((n,i)=><g key={i}><circle cx={n.cx} cy={n.cy} r="9" fill="rgba(37,99,235,0.2)"/><circle cx={n.cx} cy={n.cy} r="5" fill="#60a5fa"/><circle cx={n.cx} cy={n.cy} r="2.5" fill="white"/></g>)}
      <text x="115" y="212" fontFamily="system-ui,sans-serif" fontSize="8" fill="rgba(148,163,184,0.7)" textAnchor="middle">Neural Network Active</text>
      <rect x="14" y="236" width="202" height="72" rx="12" fill="white" filter="url(#sdsh4)"/>
      <text x="28" y="258" fontFamily="system-ui,sans-serif" fontSize="10" fontWeight="700" fill="#0f172a">Workflow Automation</text>
      <circle cx="188" cy="254" r="4" fill="#22c55e"/>
      <text x="166" y="258" fontFamily="system-ui,sans-serif" fontSize="8" fill="#16a34a">Active</text>
      <rect x="28" y="268" width="26" height="26" rx="8" fill="#eff6ff"/><text x="34" y="285" fontFamily="system-ui,sans-serif" fontSize="13">⚡</text>
      <rect x="80" y="268" width="26" height="26" rx="8" fill="#eff6ff"/><text x="86" y="285" fontFamily="system-ui,sans-serif" fontSize="11">→</text>
      <rect x="132" y="268" width="26" height="26" rx="8" fill="#dcfce7"/><text x="137" y="285" fontFamily="system-ui,sans-serif" fontSize="11" fill="#16a34a">✓</text>
      <defs><filter id="sdsh4"><feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.08"/></filter></defs>
    </svg>
  )
}

function MediaAdvertisingMockup() {
  return (
    <svg viewBox="0 0 230 310" fill="none" xmlns="http://www.w3.org/2000/svg" className="sp-mockup">
      <rect x="8" y="0" width="214" height="308" rx="14" fill="white" filter="url(#sdsh5)"/>
      <rect x="22" y="12" width="28" height="28" rx="8" fill="#2563eb"/>
      <text x="27" y="31" fontFamily="system-ui,sans-serif" fontSize="13" fontWeight="800" fill="white">T</text>
      <text x="56" y="23" fontFamily="system-ui,sans-serif" fontSize="10" fontWeight="700" fill="#0f172a">ThinkSuite</text>
      <text x="56" y="35" fontFamily="system-ui,sans-serif" fontSize="8.5" fill="#64748b">Sponsored · ✦</text>
      <text x="196" y="28" fontFamily="system-ui,sans-serif" fontSize="14" fill="#64748b">···</text>
      <defs>
        <linearGradient id="sdPostGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4c1d95"/><stop offset="60%" stopColor="#1e1b4b"/><stop offset="100%" stopColor="#0c0a09"/>
        </linearGradient>
        <filter id="sdsh5"><feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.09"/></filter>
      </defs>
      <rect x="8" y="50" width="214" height="168" fill="url(#sdPostGrad)"/>
      <ellipse cx="115" cy="100" rx="60" ry="60" fill="rgba(139,92,246,0.3)"/>
      <ellipse cx="115" cy="100" rx="35" ry="35" fill="rgba(167,139,250,0.25)"/>
      <text x="26" y="148" fontFamily="system-ui,sans-serif" fontSize="14" fontWeight="700" fill="white">Digital ideas.</text>
      <text x="26" y="168" fontFamily="system-ui,sans-serif" fontSize="14" fontWeight="700" fill="white">Powerful impact.</text>
      <text x="22" y="242" fontFamily="system-ui,sans-serif" fontSize="16">♡</text>
      <text x="46" y="242" fontFamily="system-ui,sans-serif" fontSize="16">↻</text>
      <text x="70" y="242" fontFamily="system-ui,sans-serif" fontSize="14">✈</text>
      <text x="194" y="242" fontFamily="system-ui,sans-serif" fontSize="14">🔖</text>
      <line x1="8" y1="252" x2="222" y2="252" stroke="#f1f5f9" strokeWidth="1"/>
      <text x="22" y="270" fontFamily="system-ui,sans-serif" fontSize="10" fontWeight="700" fill="#0f172a">4,328 likes</text>
      <text x="22" y="288" fontFamily="system-ui,sans-serif" fontSize="9" fill="#64748b">View all 186 comments</text>
    </svg>
  )
}

function ConsultingGrowthMockup() {
  const steps = [{n:'01',label:'Discovery',sub:'Understand your business',c:'#7c3aed'},{n:'02',label:'Strategy',sub:'Build the right plan',c:'#2563eb'},{n:'03',label:'Execution',sub:'Launch and optimize',c:'#059669'},{n:'04',label:'Scale',sub:'Measure and grow',c:'#d97706'}]
  return (
    <svg viewBox="0 0 230 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="sp-mockup">
      <rect x="6" y="0" width="218" height="278" rx="14" fill="white" filter="url(#sdsh6)"/>
      <text x="24" y="28" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="700" fill="#0f172a">Growth Roadmap</text>
      {steps.map(({n,label,sub,c},i)=>{const y=56+i*55;return(<g key={n}>{i<steps.length-1&&<line x1="36" y1={y+18} x2="36" y2={y+46} stroke={c} strokeWidth="1.5" strokeDasharray="3 2.5" opacity="0.4"/>}<circle cx="36" cy={y} r="15" fill={c} opacity="0.12"/><text x="36" y={y+4} textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="800" fill={c}>{n}</text><text x="62" y={y-2} fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="700" fill="#0f172a">{label}</text><text x="62" y={y+14} fontFamily="system-ui,sans-serif" fontSize="9.5" fill="#64748b">{sub}</text></g>)})}
      <defs><filter id="sdsh6"><feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.08"/></filter></defs>
    </svg>
  )
}

/* ─────────────────────── Grid Data (with Mockups) ───────────────────────── */

type ServiceData = ServiceDrawerData & { Mockup: () => React.ReactElement }

const services: ServiceData[] = serviceDrawerData.map((s, i) => ({
  ...s,
  Mockup: [SoftwareDevMockup, DigitalMarketingMockup, BrandingDesignMockup, AIAutomationMockup, MediaAdvertisingMockup, ConsultingGrowthMockup][i],
}))


/* ─────────────────────── Main Grid ─────────────────────────── */

export default function ServicesGrid() {
  const [activeService, setActiveService] = useState<ServiceData | null>(null)

  return (
    <>
      <div className="sp-grid">
        {services.map((s) => (
          <div key={s.num} className="sp-card" style={{ background: s.cardBg }}>
            <span className="sp-card-ghost">{s.num}</span>
            <div className="sp-card-left">
              <span className="sp-card-num" style={{ color: s.numColor }}>{s.num}</span>
              <h3 className="sp-card-title">{s.title}</h3>
              <div className="sp-card-line" style={{ background: s.lineColor }} />
              <p className="sp-card-desc">{s.desc}</p>
              <button
                className="sp-card-link"
                style={{ color: s.linkColor, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                onClick={() => setActiveService(s)}
              >
                Learn More <i className="fa-solid fa-arrow-right" style={{ fontSize: 11 }} />
              </button>
            </div>
            <div className="sp-card-right">
              <s.Mockup />
            </div>
          </div>
        ))}
      </div>

      <ServiceDrawer service={activeService} onClose={() => setActiveService(null)} />
    </>
  )
}
