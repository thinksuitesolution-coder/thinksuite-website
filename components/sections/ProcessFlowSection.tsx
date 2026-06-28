'use client'

import { useEffect, useRef } from 'react'

/* ─── Step data ─────────────────────────────────────────────────────── */
const steps = [
  {
    step: 0,
    num: '01',
    title: ['Strategic Discovery', '& Market Research'],
    body: 'We start with a deep-dive session to understand your business goals, target audience, competitive landscape, and growth opportunities. You receive a strategy document with defined KPIs, go-to-market recommendations, and a realistic roadmap before a single line of code is written.',
    tags: ['Business Goals', 'Audience Research', 'Competitor Analysis', 'KPI Framework'],
    highlight: 'Strategy document delivered within 3 to 5 business days',
    textLeft: true,
    graphic: 'audit',
  },
  {
    step: 1,
    num: '02',
    title: ['Brand Design', '& System Architecture'],
    body: 'Our designers and solution architects work in parallel, crafting your brand identity, UX wireframes, and high-fidelity prototypes alongside a scalable technical foundation. Every design decision is client-approved before build begins, with two rounds of revisions included.',
    tags: ['Brand Identity', 'UX Wireframes', 'Prototyping', 'Tech Architecture'],
    highlight: 'Two full revision rounds included at no extra cost',
    textLeft: false,
    graphic: 'blueprint',
  },
  {
    step: 2,
    num: '03',
    title: ['Agile Development', '& Campaign Launch'],
    body: 'From web and mobile development to performance marketing campaigns, our cross-functional teams ship fast and test constantly. QA-verified code, A/B-tested creatives, and phased rollouts ensure your product or campaign goes live with confidence, not guesswork.',
    tags: ['Sprint Delivery', 'QA Testing', 'A/B Testing', 'Phased Rollout'],
    highlight: 'Weekly sprint check-ins with live progress tracking',
    textLeft: true,
    graphic: 'build',
  },
  {
    step: 3,
    num: '04',
    title: ['Data-Driven Growth', '& Optimization'],
    body: 'Post-launch is where results compound. We monitor real-time analytics, optimize conversion funnels, scale winning campaigns, and continuously improve product performance. Every decision is backed by data, and monthly reports keep you fully informed.',
    tags: ['Real-Time Analytics', 'Conversion Funnels', 'Campaign Scaling', 'Monthly Reports'],
    highlight: 'Monthly performance reports with live dashboard access',
    textLeft: false,
    graphic: 'roi',
  },
]

/* ─── SVG Placeholder Graphics ──────────────────────────────────────── */

function AuditSVG() {
  return (
    <svg viewBox="0 0 400 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="pf-placeholder-svg" aria-hidden="true">
      <circle cx="200" cy="180" r="110" stroke="#dbeafe" strokeWidth="1" strokeDasharray="6 4"/>
      <circle cx="200" cy="180" r="54" fill="white" stroke="#1d4ed8" strokeWidth="1.5"/>
      <circle cx="200" cy="180" r="36" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1"/>
      <circle cx="200" cy="180" r="14" fill="#1d4ed8"/>
      <circle cx="86" cy="96" r="34" fill="white" stroke="#bfdbfe" strokeWidth="1.5"/>
      <rect x="74" y="84" width="24" height="20" rx="4" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1"/>
      <line x1="78" y1="90" x2="96" y2="90" stroke="#1d4ed8" strokeWidth="1.5"/>
      <line x1="78" y1="97" x2="98" y2="97" stroke="#1d4ed8" strokeWidth="1"/>
      <line x1="78" y1="104" x2="88" y2="104" stroke="#1d4ed8" strokeWidth="1"/>
      <circle cx="314" cy="96" r="34" fill="white" stroke="#bfdbfe" strokeWidth="1.5"/>
      <path d="M296 88 L314 78 L332 88 L332 108 L314 118 L296 108 Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1"/>
      <circle cx="314" cy="98" r="9" fill="#1d4ed8"/>
      <circle cx="86" cy="264" r="34" fill="white" stroke="#bfdbfe" strokeWidth="1.5"/>
      <circle cx="86" cy="264" r="16" fill="none" stroke="#1d4ed8" strokeWidth="1.5"/>
      <circle cx="86" cy="264" r="6" fill="#1d4ed8"/>
      <circle cx="104" cy="246" r="5" fill="none" stroke="#1d4ed8" strokeWidth="1.5"/>
      <line x1="101" y1="250" x2="114" y2="238" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="314" cy="264" r="34" fill="white" stroke="#bfdbfe" strokeWidth="1.5"/>
      <path d="M298 256 Q314 242 330 256 L330 272 Q314 286 298 272 Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1"/>
      <text x="314" y="270" textAnchor="middle" fill="#1d4ed8" fontSize="12" fontWeight="800" fontFamily="system-ui, sans-serif">AI</text>
      <line x1="117" y1="120" x2="162" y2="152" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1="283" y1="120" x2="238" y2="152" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1="117" y1="240" x2="162" y2="208" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1="283" y1="240" x2="238" y2="208" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="5 4"/>
      <circle cx="200" cy="180" r="70" fill="none" stroke="#bfdbfe" strokeWidth="0.8" strokeDasharray="2 6"/>
    </svg>
  )
}

function BlueprintSVG() {
  return (
    <svg viewBox="0 0 400 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="pf-placeholder-svg" aria-hidden="true">
      <rect x="150" y="20" width="100" height="36" rx="18" fill="white" stroke="#7c3aed" strokeWidth="1.5"/>
      <line x1="170" y1="38" x2="230" y2="38" stroke="#a78bfa" strokeWidth="1.5"/>
      <circle cx="200" cy="38" r="5" fill="#7c3aed"/>
      <line x1="200" y1="56" x2="200" y2="82" stroke="#7c3aed" strokeWidth="1.5"/>
      <path d="M194,78 L200,88 L206,78" fill="#7c3aed"/>
      <rect x="124" y="88" width="152" height="46" rx="8" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.5"/>
      <rect x="140" y="101" width="120" height="8" rx="3" fill="#ddd6fe"/>
      <rect x="140" y="116" width="90" height="6" rx="3" fill="#ede9fe"/>
      <line x1="200" y1="134" x2="200" y2="158" stroke="#7c3aed" strokeWidth="1.5"/>
      <line x1="96" y1="158" x2="304" y2="158" stroke="#7c3aed" strokeWidth="1.5"/>
      <line x1="96" y1="158" x2="96" y2="192" stroke="#7c3aed" strokeWidth="1.5"/>
      <line x1="304" y1="158" x2="304" y2="192" stroke="#7c3aed" strokeWidth="1.5"/>
      <rect x="40" y="192" width="112" height="52" rx="8" fill="white" stroke="#a78bfa" strokeWidth="1.5"/>
      <polyline points="56,218 68,208 82,222 96,212 110,218 124,210 140,218" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <rect x="248" y="192" width="112" height="52" rx="8" fill="white" stroke="#a78bfa" strokeWidth="1.5"/>
      <circle cx="304" cy="218" r="18" fill="#f5f3ff" stroke="#a78bfa" strokeWidth="1.5"/>
      <text x="304" y="223" textAnchor="middle" fill="#7c3aed" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">GEO</text>
      <line x1="96" y1="244" x2="96" y2="268" stroke="#7c3aed" strokeWidth="1.5"/>
      <line x1="304" y1="244" x2="304" y2="268" stroke="#7c3aed" strokeWidth="1.5"/>
      <line x1="96" y1="268" x2="304" y2="268" stroke="#7c3aed" strokeWidth="1.5"/>
      <line x1="200" y1="268" x2="200" y2="290" stroke="#7c3aed" strokeWidth="1.5"/>
      <rect x="110" y="290" width="180" height="50" rx="10" fill="#7c3aed"/>
      <circle cx="140" cy="315" r="8" fill="rgba(255,255,255,0.2)"/>
      <circle cx="140" cy="315" r="4" fill="white"/>
      <rect x="156" y="308" width="110" height="8" rx="3" fill="rgba(255,255,255,0.55)"/>
      <rect x="156" y="323" width="80" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
      <circle cx="40" cy="38" r="4" fill="#ddd6fe"/>
      <circle cx="360" cy="38" r="4" fill="#ddd6fe"/>
      <circle cx="40" cy="322" r="4" fill="#ddd6fe"/>
      <circle cx="360" cy="322" r="4" fill="#ddd6fe"/>
    </svg>
  )
}

function BuildSVG() {
  return (
    <svg viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="pf-placeholder-svg" aria-hidden="true">
      <rect x="24" y="20" width="352" height="286" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
      <rect x="24" y="20" width="352" height="38" rx="12" fill="#f8fafc"/>
      <rect x="24" y="46" width="352" height="12" fill="#f8fafc"/>
      <circle cx="50" cy="39" r="6" fill="#fc5c65"/>
      <circle cx="70" cy="39" r="6" fill="#feca57"/>
      <circle cx="90" cy="39" r="6" fill="#54a0ff"/>
      <rect x="112" y="27" width="82" height="22" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
      <circle cx="127" cy="38" r="4" fill="#059669"/>
      <rect x="136" y="34" width="48" height="8" rx="2" fill="#e2e8f0"/>
      <rect x="24" y="58" width="48" height="248" fill="#f8fafc"/>
      {[76, 98, 120, 142, 164, 186, 208, 230, 252, 274].map((y, i) => (
        <rect key={i} x="34" y={y - 4} width="28" height="8" rx="2" fill="#e2e8f0"/>
      ))}
      <rect x="84" y="72" width="32" height="8" rx="2" fill="#ddd6fe"/>
      <rect x="122" y="72" width="56" height="8" rx="2" fill="#e2e8f0"/>
      <rect x="184" y="72" width="28" height="8" rx="2" fill="#ddd6fe"/>
      <rect x="218" y="72" width="70" height="8" rx="2" fill="#dcfce7"/>
      <rect x="84" y="94" width="32" height="8" rx="2" fill="#ddd6fe"/>
      <rect x="122" y="94" width="44" height="8" rx="2" fill="#e2e8f0"/>
      <rect x="172" y="94" width="28" height="8" rx="2" fill="#ddd6fe"/>
      <rect x="206" y="94" width="88" height="8" rx="2" fill="#dcfce7"/>
      <rect x="84" y="116" width="30" height="8" rx="2" fill="#fef08a"/>
      <rect x="120" y="116" width="60" height="8" rx="2" fill="#fef9c3"/>
      <rect x="186" y="116" width="88" height="8" rx="2" fill="#e2e8f0"/>
      <rect x="100" y="138" width="24" height="8" rx="2" fill="#fef08a"/>
      <rect x="130" y="138" width="74" height="8" rx="2" fill="#e2e8f0"/>
      <rect x="210" y="138" width="54" height="8" rx="2" fill="#dcfce7"/>
      <rect x="100" y="160" width="30" height="8" rx="2" fill="#ddd6fe"/>
      <rect x="136" y="160" width="92" height="8" rx="2" fill="#e2e8f0"/>
      <rect x="100" y="182" width="38" height="8" rx="2" fill="#ddd6fe"/>
      <rect x="116" y="204" width="16" height="8" rx="2" fill="#fef08a"/>
      <rect x="138" y="204" width="54" height="8" rx="2" fill="#fef9c3"/>
      <rect x="198" y="204" width="44" height="8" rx="2" fill="#fef08a"/>
      <rect x="248" y="204" width="56" height="8" rx="2" fill="#dcfce7"/>
      <rect x="310" y="200" width="2" height="14" fill="#059669">
        <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/>
      </rect>
      <path d="M24,278 L376,278 L376,294 Q376,306 364,306 L36,306 Q24,306 24,294 Z" fill="#0f172a"/>
      <circle cx="50" cy="292" r="5" fill="#059669"/>
      <rect x="62" y="288" width="64" height="8" rx="2" fill="rgba(255,255,255,0.3)"/>
      <rect x="298" y="288" width="56" height="8" rx="2" fill="rgba(255,255,255,0.2)"/>
    </svg>
  )
}

function RoiSVG() {
  return (
    <svg viewBox="0 0 400 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="pf-placeholder-svg" aria-hidden="true">
      <defs>
        <linearGradient id="roi-area" x1="200" y1="70" x2="200" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect x="24" y="16" width="352" height="210" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
      <rect x="44" y="34" width="110" height="10" rx="3" fill="#e2e8f0"/>
      <rect x="44" y="50" width="70" height="8" rx="3" fill="#f1f5f9"/>
      <rect x="286" y="28" width="68" height="26" rx="8" fill="#fef3c7" stroke="#fde68a" strokeWidth="1"/>
      <rect x="296" y="37" width="48" height="8" rx="3" fill="#fbbf24"/>
      {[76, 106, 136, 166, 196].map((y, i) => (
        <line key={i} x1="72" y1={y} x2="360" y2={y} stroke={i === 4 ? '#e2e8f0' : '#f1f5f9'} strokeWidth="1"/>
      ))}
      {[76, 106, 136, 166, 196].map((y, i) => (
        <rect key={i} x="34" y={y - 5} width="30" height="8" rx="2" fill="#f1f5f9"/>
      ))}
      <path d="M72,196 L124,183 L176,170 L228,149 L280,120 L332,88 L360,70 L360,196 Z" fill="url(#roi-area)"/>
      <polyline points="72,196 124,183 176,170 228,149 280,120 332,88 360,70" stroke="#b45309" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {[[72,196],[124,183],[176,170],[228,149],[280,120],[332,88]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5" fill="white" stroke="#b45309" strokeWidth="2"/>
      ))}
      <circle cx="360" cy="70" r="6.5" fill="#b45309" stroke="white" strokeWidth="2"/>
      {[124,176,228,280,332,360].map((x, i) => (
        <rect key={i} x={x - 18} y={206} width="36" height="8" rx="2" fill="#f1f5f9"/>
      ))}
      <rect x="24" y="242" width="352" height="100" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
      <rect x="44" y="258" width="80" height="10" rx="3" fill="#e2e8f0"/>
      <rect x="44" y="282" width="72" height="44" rx="10" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5"/>
      <rect x="56" y="296" width="48" height="8" rx="3" fill="#93c5fd"/>
      <rect x="56" y="309" width="32" height="6" rx="2" fill="#dbeafe"/>
      <rect x="126" y="282" width="72" height="44" rx="10" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
      <rect x="138" y="296" width="48" height="8" rx="3" fill="#86efac"/>
      <rect x="138" y="309" width="36" height="6" rx="2" fill="#dcfce7"/>
      <rect x="208" y="282" width="72" height="44" rx="10" fill="#fef3c7" stroke="#fde68a" strokeWidth="1.5"/>
      <rect x="220" y="296" width="48" height="8" rx="3" fill="#fcd34d"/>
      <rect x="220" y="309" width="30" height="6" rx="2" fill="#fef3c7"/>
      <rect x="290" y="282" width="72" height="44" rx="10" fill="#f5f3ff" stroke="#ddd6fe" strokeWidth="1.5"/>
      <rect x="302" y="296" width="48" height="8" rx="3" fill="#c4b5fd"/>
      <rect x="302" y="309" width="34" height="6" rx="2" fill="#ede9fe"/>
    </svg>
  )
}

/* ─── Graphic dispatcher ─────────────────────────────────────────────── */
function PlaceholderGraphic({ type, step }: { type: string; step: number }) {
  const panelBg = ['#f0f7ff', '#f6f3ff', '#f0fdf6', '#fffbeb'][step]
  const labelColors = [
    { border: '#bfdbfe', color: '#1d4ed8' },
    { border: '#ddd6fe', color: '#6d28d9' },
    { border: '#a7f3d0', color: '#059669' },
    { border: '#fde68a', color: '#b45309' },
  ][step]
  const labels = ['System Audit Diagram', 'Technical Blueprint · GEO Roadmap', 'Production Build Preview', 'ROI Growth · AI Visibility']

  return (
    <div className="pf-img-placeholder" style={{ background: panelBg }}>
      {type === 'audit'     && <AuditSVG />}
      {type === 'blueprint' && <BlueprintSVG />}
      {type === 'build'     && <BuildSVG />}
      {type === 'roi'       && <RoiSVG />}
      <span
        className="pf-img-label"
        style={{ borderColor: labelColors.border, color: labelColors.color }}
      >
        {labels[step]}
      </span>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function ProcessFlowSection() {
  const stackRef  = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const stack  = stackRef.current
    const sticky = stickyRef.current
    if (!stack || !sticky) return

    // Mobile: leave cards in natural flow; CSS handles layout
    if (window.innerWidth < 768) return

    const n = steps.length
    let rafId = 0

    // Cards: absolutely positioned, filling the sticky container (done once)
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      card.style.position   = 'absolute'
      card.style.top        = '0'
      card.style.left       = '0'
      card.style.right      = '0'
      card.style.height     = '100%'
      card.style.margin     = '0'
      card.style.zIndex     = String(i + 1)
      card.style.willChange = 'transform'
      card.style.transition = 'none'
    })

    const onResize = () => { update() }
    window.addEventListener('resize', onResize, { passive: true })

    const update = () => {
      const vh         = window.innerHeight
      // Use zoneBottom (BCR) instead of absolute scroll position.
      // This is immune to layout shifts from lazy-loaded images above the section:
      // zoneBottom starts at n*vh when the zone enters the viewport and decreases
      // by 1 for every pixel scrolled, giving us exact in-zone progress.
      const zoneBottom = stack.getBoundingClientRect().bottom

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        // Card 0 is the base — always visible once the section is in view.
        if (i === 0) { card.style.transform = 'translateY(0%)'; return }
        // Card i slides in during scroll window [(i-1)*vh … i*vh] inside the zone.
        const progress = Math.min(Math.max((n * vh - zoneBottom - (i - 1) * vh) / vh, 0), 1)
        card.style.transform = `translateY(${(1 - progress) * 100}%)`
      })
    }

    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update) }

    window.addEventListener('scroll', onScroll, { passive: true })
    rafId = requestAnimationFrame(update)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section className="pf-section">
      {/* ── Header ── */}
      <div className="pf-header">
        <span className="pf-eyebrow">HOW WE WORK</span>
        <h2 className="pf-heading">
          Our process.<br />Your results.
        </h2>
        <p className="pf-sub">
          From business strategy to final launch, every project follows a proven four-step framework. Transparent timelines, dedicated specialists, and measurable deliverables at every phase, you always know what is happening and why.
        </p>
      </div>

      {/* ── Stack zone: provides scroll distance; sticky container pins inside it ── */}
      <div ref={stackRef} className="pf-stack-zone">
        <div ref={stickyRef} className="pf-stack-sticky">
          {steps.map((s, i) => {
            const graphicPanel = (
              <div className="pf-card__graphic" key="graphic">
                <PlaceholderGraphic type={s.graphic} step={s.step} />
                <div className={`pf-dots${s.textLeft ? ' pf-dots--inner-left' : ''}`}>
                  {steps.map((_, di) => (
                    <div key={di} className={`pf-dot${di === s.step ? ' is-active' : ''}`} />
                  ))}
                </div>
              </div>
            )

            const textPanel = (
              <div className="pf-card__text" key="text">
                <div className="pf-step__inner">
                  <span className="pf-step__num">{s.num}</span>
                  <h3 className="pf-step__title">
                    {s.title.map((line, li) => (
                      <span key={li}>{line}{li < s.title.length - 1 && <br />}</span>
                    ))}
                  </h3>
                  <p className="pf-step__desc">{s.body}</p>
                  <ul className="pf-step__tags">
                    {s.tags.map(tag => <li key={tag}>{tag}</li>)}
                  </ul>
                  <p className="pf-step__highlight">{s.highlight}</p>
                </div>
              </div>
            )

            return (
              <div
                key={s.num}
                ref={el => { cardRefs.current[i] = el }}
                className={`pf-card pf-card--${s.step + 1}${s.textLeft ? ' pf-card--text-left' : ''}`}
                data-step={s.step}
              >
                {s.textLeft ? [textPanel, graphicPanel] : [graphicPanel, textPanel]}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}