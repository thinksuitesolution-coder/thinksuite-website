'use client'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import s from './HeroSection.module.css'

const TABS = [
  { id: 'geo',        icon: 'fa-solid fa-magnifying-glass', label: 'AI Search'  },
  { id: 'web',        icon: 'fa-solid fa-code',             label: 'Web Dev'    },
  { id: 'automation', icon: 'fa-solid fa-bolt',             label: 'Automation' },
  { id: 'saas',       icon: 'fa-solid fa-chart-line',       label: 'SaaS'       },
]

const GEO_SEARCHES = [
  {
    query: 'CA firm for GST filing near me',
    results: [
      { title: 'ClearTax | GST Filing & CA Services', url: 'cleartax.in › ca-services', desc: 'Expert CA for GST returns, ITR filing. Trusted by 6M+ Indians.' },
      { title: 'Tax2Win: Online CA Consultation',     url: 'tax2win.in › ca',            desc: 'Connect with top CAs for GST, income tax, audit. From ₹499/month.' },
    ],
  },
  {
    query: 'digital marketing agency Gurugram',
    results: [
      { title: 'Social Panga | Digital Marketing',     url: 'socialpanga.com',       desc: 'Creative digital campaigns. Meta, Google Ads & SEO specialists.' },
      { title: 'iProspect India | Performance Agency', url: 'iprospect.com › india', desc: 'Data-driven marketing. ROI-focused strategies for growing brands.' },
    ],
  },
  {
    query: 'best interior designer Delhi NCR',
    results: [
      { title: 'Livspace | Award-Winning Interiors',   url: 'livspace.com › delhi',         desc: 'Top-rated designers. 500+ projects. Book free consultation today.' },
      { title: 'Urban Company: Home Interior Services',url: 'urbancompany.com › interiors',  desc: 'Verified designers near you. Full home packages from ₹1.29L.' },
    ],
  },
]

const BUBBLES: Record<string, { text: string; delay: string }[]> = {
  geo: [
    { text: 'best CA firm near me',        delay: '0s'   },
    { text: 'interior designer Delhi NCR', delay: '0.8s' },
    { text: 'event planner South Delhi',   delay: '1.6s' },
    { text: 'digital marketing Gurugram',  delay: '0.4s' },
    { text: 'dentist Vasant Kunj',         delay: '1.2s' },
    { text: 'wedding photographer Delhi',  delay: '2s'   },
  ],
  web: [
    { text: 'Next.js',       delay: '0s'   },
    { text: 'React',         delay: '0.8s' },
    { text: 'Tailwind CSS',  delay: '1.6s' },
    { text: 'TypeScript',    delay: '0.4s' },
    { text: 'Node.js',       delay: '1.2s' },
    { text: 'PostgreSQL',    delay: '2s'   },
  ],
  automation: [
    { text: 'Lead Capture',  delay: '0s'   },
    { text: 'n8n Workflow',  delay: '0.8s' },
    { text: 'WhatsApp API',  delay: '1.6s' },
    { text: 'Make.com',      delay: '0.4s' },
    { text: 'CRM Sync',      delay: '1.2s' },
    { text: 'Email Trigger', delay: '2s'   },
  ],
  saas: [
    { text: 'WavCart',    delay: '0s'   },
    { text: 'MyThinkAI',  delay: '0.8s' },
    { text: 'Visibility', delay: '1.6s' },
    { text: 'Analytics',  delay: '0.4s' },
    { text: 'Dashboard',  delay: '1.2s' },
    { text: 'API Access', delay: '2s'   },
  ],
}

const WEB_STEPS = [
  { icon: 'fa-solid fa-pen-ruler',   label: 'Design',  sub: 'Wireframe & UI',     color: '#8b5cf6' },
  { icon: 'fa-solid fa-code',        label: 'Develop', sub: 'Next.js + Tailwind', color: '#3b82f6' },
  { icon: 'fa-solid fa-rocket',      label: 'Launch',  sub: 'Deploy & QA',        color: '#10b981' },
  { icon: 'fa-solid fa-chart-line',  label: 'Grow',    sub: 'SEO & Analytics',    color: '#f97316' },
]

const AUTO_NODES = [
  { icon: 'fa-solid fa-envelope',        label: 'Lead Form',    color: '#3b82f6' },
  { icon: 'fa-solid fa-robot',           label: 'AI Qualifier', color: '#8b5cf6' },
  { icon: 'fa-brands fa-whatsapp',       label: 'WhatsApp',     color: '#22c55e' },
  { icon: 'fa-solid fa-calendar-check',  label: 'Auto Book',    color: '#f97316' },
  { icon: 'fa-solid fa-chart-bar',       label: 'CRM Update',   color: '#06b6d4' },
]

const SAAS_METRICS = [
  { label: 'Active Users', value: '12,847', change: '+18%',  up: true },
  { label: 'MRR',          value: '₹4.2L',  change: '+24%',  up: true },
  { label: 'Churn Rate',   value: '1.8%',   change: '-0.4%', up: true },
  { label: 'NPS Score',    value: '72',     change: '+5',    up: true },
]

const BAR_HEIGHTS = [30, 50, 45, 65, 55, 80, 75]

const MARQUEE_KEYWORDS = [
  'GEO Optimization', 'Website Design', 'Brand Identity', 'AI Automation',
  'Google & Meta Ads', 'Chatbot Development', 'SaaS Products', 'Growth Strategy',
  'Workflow Automation', 'Social Media Marketing', 'PR Campaigns', 'Outdoor Advertising',
  'Content Marketing', 'SEO Optimization', 'Startup Consulting', 'Custom Software',
]

// ── GEO Panel ──────────────────────────────────────────────────────────────
function GeoPanel() {
  const [searchIdx, setSearchIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<'typing' | 'results' | 'clearing'>('typing')
  const [visibleResults, setVisibleResults] = useState<number[]>([])

  useEffect(() => {
    const current = GEO_SEARCHES[searchIdx]
    let charIdx = 0
    setTyped('')
    setPhase('typing')
    setVisibleResults([])

    const typeTimer = setInterval(() => {
      charIdx++
      setTyped(current.query.slice(0, charIdx))
      if (charIdx >= current.query.length) {
        clearInterval(typeTimer)
        setTimeout(() => {
          setPhase('results')
          current.results.forEach((_, i) => {
            setTimeout(() => setVisibleResults(prev => [...prev, i]), i * 220)
          })
        }, 350)
        setTimeout(() => {
          setPhase('clearing')
          setTimeout(() => setSearchIdx(prev => (prev + 1) % GEO_SEARCHES.length), 500)
        }, 4200)
      }
    }, 48)

    return () => clearInterval(typeTimer)
  }, [searchIdx])

  const current = GEO_SEARCHES[searchIdx]

  return (
    <div className={s.panelCard} data-phase={phase}>
      <div className={s.gLogo}>
        <span style={{ color: '#4285F4' }}>G</span>
        <span style={{ color: '#EA4335' }}>o</span>
        <span style={{ color: '#FBBC05' }}>o</span>
        <span style={{ color: '#4285F4' }}>g</span>
        <span style={{ color: '#34A853' }}>l</span>
        <span style={{ color: '#EA4335' }}>e</span>
      </div>
      <div className={s.searchBar}>
        <i className={`fa-solid fa-magnifying-glass ${s.searchIcon}`} />
        <div className={s.searchInput}>
          <span>{typed}</span>
          <span className={s.cursor} />
        </div>
        <i className={`fa-solid fa-microphone ${s.micIcon}`} />
      </div>
      <div className={s.resultsArea}>
        <p className={s.resultCount}>
          {phase !== 'typing' ? <>About <strong>1,87,000</strong> results</> : <>&nbsp;</>}
        </p>
        <div className={s.resultsList}>
          {current.results.map((r, i) => (
            <div
              key={`${searchIdx}-${i}`}
              className={`${s.resultItem} ${visibleResults.includes(i) ? s.resultVisible : ''}`}
            >
              <span className={s.resultFavicon}><i className="fa-solid fa-globe" /></span>
              <div className={s.resultBody}>
                <div className={s.resultTitle}>{r.title}</div>
                <div className={s.resultUrl}>{r.url}</div>
                <div className={s.resultDesc}>{r.desc}</div>
              </div>
            </div>
          ))}
          <div className={s.missingSlot}>
            <span className={s.missingFavicon}><i className="fa-regular fa-circle-question" /></span>
            <div className={s.missingBody}>
              <div className={s.missingTitle}>Your Business?</div>
              <div className={s.missingUrl}>yourbusiness.com</div>
              <div className={s.missingDesc}>Your clients are searching right now…</div>
            </div>
            <span className={s.notFoundBadge}>Not Visible</span>
          </div>
        </div>
      </div>
      <div className={s.panelCallout}>
        <i className="fa-solid fa-triangle-exclamation" style={{ color: '#f97316' }} />
        Clients are finding your competitors. <strong>Are you there?</strong>
      </div>
    </div>
  )
}

// ── Web Dev Panel ───────────────────────────────────────────────────────────
function WebPanel() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveStep(prev => (prev + 1) % WEB_STEPS.length), 1800)
    return () => clearInterval(t)
  }, [])

  const step = WEB_STEPS[activeStep]

  return (
    <div className={s.panelCard}>
      <div className={s.webBrowserBar}>
        <div className={s.browserDots}>
          <span style={{ background: '#ff5f57' }} />
          <span style={{ background: '#ffbd2e' }} />
          <span style={{ background: '#28c840' }} />
        </div>
        <div className={s.browserUrl}>
          <i className="fa-solid fa-lock" style={{ color: '#22c55e', fontSize: '0.6rem' }} />
          yourbusiness.com
        </div>
      </div>

      <div className={s.webStepsRow}>
        {WEB_STEPS.map((ws, i) => (
          <div key={i} className={`${s.webStep} ${activeStep === i ? s.webStepActive : ''} ${activeStep > i ? s.webStepDone : ''}`}>
            <div
              className={s.webStepIcon}
              style={
                activeStep === i
                  ? { background: `${ws.color}22`, color: ws.color, borderColor: ws.color }
                  : activeStep > i
                  ? { background: `${ws.color}15`, color: ws.color, borderColor: `${ws.color}66` }
                  : undefined
              }
            >
              {activeStep > i
                ? <i className="fa-solid fa-check" />
                : <i className={ws.icon} />
              }
            </div>
            <div className={s.webStepLabel}>{ws.label}</div>
            <div className={s.webStepSub}>{ws.sub}</div>
            {i < WEB_STEPS.length - 1 && (
              <div className={`${s.webStepArrow} ${activeStep > i ? s.webStepArrowDone : ''}`}>
                <i className="fa-solid fa-arrow-right" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={s.webMockup}>
        <div className={s.webMockupNav} />
        <div className={s.webMockupHero} style={{ background: `linear-gradient(135deg, ${step.color}20, ${step.color}08)` }}>
          <div className={s.webMockupH} />
          <div className={s.webMockupSub} />
          <div className={s.webMockupBtn} style={{ background: step.color }} />
        </div>
        <div className={s.webMockupCards}>
          <div className={s.webMockupCard} />
          <div className={s.webMockupCard} />
          <div className={s.webMockupCard} />
        </div>
      </div>

      <div className={s.panelCallout}>
        <i className="fa-solid fa-check-circle" style={{ color: '#10b981' }} />
        Wireframe to live website — <strong>delivered in 4 weeks.</strong>
      </div>
    </div>
  )
}

// ── Automation Panel ────────────────────────────────────────────────────────
function AutoPanel() {
  const [activeNode, setActiveNode] = useState(0)
  const [completedNodes, setCompletedNodes] = useState<number[]>([])

  useEffect(() => {
    const t = setInterval(() => {
      setActiveNode(prev => {
        const next = (prev + 1) % AUTO_NODES.length
        if (next === 0) setCompletedNodes([])
        else setCompletedNodes(p => [...p, prev])
        return next
      })
    }, 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className={s.panelCard}>
      <div className={s.autoHeader}>
        <i className="fa-solid fa-bolt" style={{ color: '#8b5cf6' }} />
        <span>Automated Workflow</span>
        <span className={s.autoLive}><span className={s.liveDotSm} />Running</span>
      </div>

      <div className={s.autoFlow}>
        {AUTO_NODES.map((node, i) => (
          <Fragment key={i}>
            <div className={s.autoNodeWrap}>
              <div
                className={`${s.autoNode} ${activeNode === i ? s.autoNodeActive : ''} ${completedNodes.includes(i) ? s.autoNodeDone : ''}`}
                style={
                  activeNode === i
                    ? { background: `${node.color}22`, borderColor: node.color, color: node.color }
                    : completedNodes.includes(i)
                    ? { background: `${node.color}15`, borderColor: `${node.color}66`, color: node.color }
                    : undefined
                }
              >
                <i className={node.icon} />
              </div>
              <div className={s.autoNodeLabel}>{node.label}</div>
            </div>
            {i < AUTO_NODES.length - 1 && (
              <div className={`${s.autoArrow} ${completedNodes.includes(i) ? s.autoArrowDone : ''}`}>
                <i className="fa-solid fa-chevron-right" />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div className={s.autoStats}>
        <div className={s.autoStat}><strong>340+</strong><span>hours saved / month</span></div>
        <div className={s.autoStatDiv} />
        <div className={s.autoStat}><strong>99.9%</strong><span>uptime</span></div>
        <div className={s.autoStatDiv} />
        <div className={s.autoStat}><strong>0</strong><span>manual tasks</span></div>
      </div>

      <div className={s.panelCallout}>
        <i className="fa-solid fa-bolt" style={{ color: '#8b5cf6' }} />
        Your business runs <strong>24/7 on autopilot.</strong>
      </div>
    </div>
  )
}

// ── SaaS Panel ──────────────────────────────────────────────────────────────
function SaasPanel() {
  const [visibleMetrics, setVisibleMetrics] = useState<number[]>([])
  const [barsAnimated, setBarsAnimated] = useState(false)

  useEffect(() => {
    SAAS_METRICS.forEach((_, i) => {
      setTimeout(() => setVisibleMetrics(prev => [...prev, i]), i * 180 + 80)
    })
    setTimeout(() => setBarsAnimated(true), 800)
  }, [])

  return (
    <div className={s.panelCard}>
      <div className={s.saasHeader}>
        <div className={s.saasLogo}><i className="fa-solid fa-cube" /> ThinkSuite SaaS</div>
        <div className={s.saasBadge}><span className={s.liveDotSm} />Live</div>
      </div>

      <div className={s.saasMetrics}>
        {SAAS_METRICS.map((m, i) => (
          <div key={i} className={`${s.saasMetric} ${visibleMetrics.includes(i) ? s.saasMetricVisible : ''}`}>
            <div className={s.saasMetricValue}>{m.value}</div>
            <div className={s.saasMetricLabel}>{m.label}</div>
            <div className={`${s.saasMetricChange} ${m.up ? s.saasUp : s.saasDown}`}>
              <i className={`fa-solid fa-arrow-${m.up ? 'up' : 'down'}`} />
              {m.change}
            </div>
          </div>
        ))}
      </div>

      <div className={s.saasChart}>
        <div className={s.saasChartLabel}>Monthly Revenue Growth</div>
        <div className={s.saasBars}>
          {BAR_HEIGHTS.map((h, i) => (
            <div key={i} className={s.saasBarWrap}>
              <div
                className={s.saasBar}
                data-animated={barsAnimated}
                style={{ '--bar-h': `${h}%`, '--bar-delay': `${i * 80}ms` } as Record<string, string>}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={s.panelCallout}>
        <i className="fa-solid fa-cube" style={{ color: '#8b5cf6' }} />
        We build SaaS products — <strong>and deploy them for you.</strong>
      </div>
    </div>
  )
}

// ── Main export ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveTab(prev => (prev + 1) % TABS.length), 7000)
    return () => clearInterval(t)
  }, [])

  const currentBubbles = BUBBLES[TABS[activeTab].id]

  return (
    <section className={s.hero}>

      <div className={s.heroBg} aria-hidden="true">
        <div className={s.blob1} />
        <div className={s.blob2} />
        <div className={s.blob3} />
      </div>

      <div className={`container ${s.contentLayer}`}>

        {/* Headline */}
        <div className={s.headlineWrap}>
          <p className={s.line1}>Build. Rank. Automate.</p>
          <h1 className={`grad-text ${s.line2}`}>We Do All Three.</h1>
        </div>

        {/* Universe */}
        <div className={s.searchUniverse}>

          <div className={s.liveIndicator}>
            <span className={s.liveDotSm} />
            <span>Live</span>
          </div>

          {/* Tab bar */}
          <div className={s.tabBar}>
            {TABS.map((tab, i) => (
              <button
                key={tab.id}
                className={`${s.tabBtn} ${activeTab === i ? s.tabBtnActive : ''}`}
                onClick={() => setActiveTab(i)}
              >
                <i className={tab.icon} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Floating bubbles */}
          {currentBubbles.map((b, i) => (
            <div
              key={`${activeTab}-${i}`}
              className={`${s.queryBubble} ${s[`bPos${i}`]}`}
              style={{ animationDelay: b.delay }}
            >
              <i className={TABS[activeTab].icon} />
              <span>{b.text}</span>
            </div>
          ))}

          {/* Panel — key forces remount on tab change */}
          <div className={s.panelWrap} key={activeTab}>
            {activeTab === 0 && <GeoPanel />}
            {activeTab === 1 && <WebPanel />}
            {activeTab === 2 && <AutoPanel />}
            {activeTab === 3 && <SaasPanel />}
          </div>

        </div>

        {/* Sub copy */}
        <p className={s.sub}>
          ThinkSuite builds <strong>high-performance websites</strong>, gets your business found in{' '}
          <strong>Google &amp; AI search</strong>, automates operations with{' '}
          <strong>smart workflows</strong>, and ships <strong>SaaS products</strong> — all under one roof.
        </p>

        {/* CTAs */}
        <div className={s.ctaRow}>
          <Link href="/contact" className="btn btn-primary btn-lg">
            <i className="fa-solid fa-calendar-check" />
            Get Free Strategy Call
          </Link>
          <Link href="/services" className="btn btn-outline btn-lg">
            Explore Our Work
            <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>

        {/* Platform stats */}
        <div className={s.platformStrip}>
          <div className={s.platformItem}>
            <div className={s.platformIconWrap} style={{ background: 'rgba(66,133,244,0.1)' }}>
              <i className="fa-brands fa-google" style={{ color: '#4285F4' }} />
            </div>
            <div className={s.platformText}>
              <strong>8.5 Billion</strong>
              <span>Google searches every single day</span>
            </div>
          </div>
          <div className={s.platformDivider} />
          <div className={s.platformItem}>
            <div className={s.platformIconWrap} style={{ background: 'rgba(16,163,127,0.1)' }}>
              <i className="fa-solid fa-robot" style={{ color: '#10a37f' }} />
            </div>
            <div className={s.platformText}>
              <strong>100M+ users</strong>
              <span>ask AI for business recommendations daily</span>
            </div>
          </div>
          <div className={s.platformDivider} />
          <div className={s.platformItem}>
            <div className={s.platformIconWrap} style={{ background: 'rgba(249,115,22,0.1)' }}>
              <i className="fa-solid fa-circle-question" style={{ color: '#f97316' }} />
            </div>
            <div className={s.platformText}>
              <strong className={s.platformQ}>Are you there on both?</strong>
              <span>Most businesses are invisible on both</span>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className={s.trustBar}>
          {[
            { num: '120+', label: 'Projects'    },
            { num: '50+',  label: 'Clients'     },
            { num: '24',   label: 'Services'    },
            { num: '4',    label: 'AI Products' },
          ].map(t => (
            <div key={t.label} className={s.trustStat}>
              <span className={s.trustNum}>{t.num}</span>
              <span className={s.trustLabel}>{t.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Marquee */}
      <div className={s.marqueeWrap}>
        <div className={s.marqueeTrack}>
          {[...MARQUEE_KEYWORDS, ...MARQUEE_KEYWORDS].map((k, i) => (
            <span key={i} className={s.marqueeItem}>
              <span className={s.marqueeDot}>·</span>
              {k}
            </span>
          ))}
        </div>
      </div>

      <i className={`fa-solid fa-chevron-down ${s.scrollHint}`} />
    </section>
  )
}
