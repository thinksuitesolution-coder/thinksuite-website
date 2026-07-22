'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

const services = [
  {
    id: 'software',
    short: 'SOFTWARE',
    icon: 'fa-solid fa-code',
    color: '#1a237e',
    title: 'Custom SaaS Platforms and Enterprise Software',
    desc: 'We engineer scalable SaaS platforms, cloud-native web applications, and custom CRM systems that replace slow, outdated workflows with fast and reliable digital infrastructure built for growth.',
    href: '/software-development',
    cta: 'Explore Engineering Stack',
    sub: [
      { label: 'SaaS Product Engineering and Cloud Infrastructure', href: '/saas-products' },
      { label: 'High-Performance Web Apps with Optimized UI/UX', href: '/web-development' },
      { label: 'Scalable Databases and API Core Systems', href: '/custom-software' },
    ],
    angle: 0,
  },
  {
    id: 'marketing',
    short: 'MARKETING',
    icon: 'fa-solid fa-chart-bar',
    color: '#0288d1',
    title: 'Performance Marketing and AI Search Visibility',
    desc: 'We drive qualified traffic and measurable revenue through ROI-focused ad campaigns and Generative Engine Optimization, ensuring your brand appears where buyers actually search today, not just on Google.',
    href: '/digital-marketing',
    cta: 'Maximize Ad ROI',
    sub: [
      { label: 'Generative Engine Optimization (GEO) for AI Search', href: '/seo-optimization' },
      { label: 'ROI-Driven Google and Meta Ad Campaigns', href: '/google-meta-ads' },
      { label: 'Omnichannel Digital Strategy and Analytics', href: '/digital-marketing' },
    ],
    angle: 60,
  },
  {
    id: 'branding',
    short: 'BRANDING',
    icon: 'fa-solid fa-pen-nib',
    color: '#00bcd4',
    title: 'Brand Identity and Premium UI/UX Design',
    desc: 'Great design builds instant trust. We craft clean brand identities and intuitive product interfaces that make your business look premium, feel consistent, and convert visitors into loyal customers.',
    href: '/branding-design',
    cta: 'Review Design Systems',
    sub: [
      { label: 'Product UI/UX Design and Component Systems', href: '/ui-ux-design' },
      { label: 'Corporate Identity, Logo and Visual Standards', href: '/brand-identity' },
      { label: 'Interactive Prototypes and Front-End Frameworks', href: '/branding-design' },
    ],
    angle: 120,
  },
  {
    id: 'ai',
    short: 'AI',
    icon: 'fa-solid fa-brain',
    color: '#7c3aed',
    title: 'AI Integration and Intelligent Workflow Automation',
    desc: 'We replace your manual bottlenecks with intelligent automation. From custom RAG pipelines and LLM-powered tools to autonomous backend agents that cut costs and work around the clock without human input.',
    href: '/ai-automation',
    cta: 'Deploy Automation',
    sub: [
      { label: 'Custom AI Tools and LLM Fine-Tuning', href: '/ai-tools-development' },
      { label: 'RAG Pipelines and Knowledge Workflow Systems', href: '/workflow-automation' },
      { label: 'Autonomous Backend Agents and Microservices', href: '/ai-automation' },
    ],
    angle: 180,
  },
  {
    id: 'media',
    short: 'MEDIA',
    icon: 'fa-solid fa-bullhorn',
    color: '#059669',
    title: 'Media Production and Strategic Brand Placement',
    desc: 'Reach your audience across every channel they use. We produce high-impact advertising content and place your brand through outdoor, indoor, digital, and PR media formats that build lasting authority.',
    href: '/media-advertising',
    cta: 'Launch Media Campaign',
    sub: [
      { label: 'Outdoor and Indoor Advertising Campaigns', href: '/outdoor-advertising' },
      { label: 'Digital PR and Influencer Communications', href: '/influencer-marketing' },
      { label: 'Brand Content Production and Visual Assets', href: '/indoor-advertising' },
    ],
    angle: 240,
  },
  {
    id: 'consulting',
    short: 'CONSULTING',
    icon: 'fa-solid fa-users',
    color: '#ea580c',
    title: 'Business Strategy and Scalable Growth Planning',
    desc: 'Scaling without a roadmap burns money. We audit your tech stack and market position, identify revenue gaps, and build a clear action plan so every rupee you invest moves you toward measurable growth.',
    href: '/consulting-growth',
    cta: 'Schedule a Strategy Call',
    sub: [
      { label: 'Tech Stack Audit and Architecture Review', href: '/business-strategy' },
      { label: 'Market Research and Revenue Projection', href: '/market-research' },
      { label: 'Growth Roadmap and Scaling Strategy', href: '/growth-planning' },
    ],
    angle: 300,
  },
]

const R = 175
const CX = 240
const CY = 240

function getPos(angle: number) {
  const rad = (angle - 90) * Math.PI / 180
  return {
    x: Math.round(CX + R * Math.cos(rad)),
    y: Math.round(CY + R * Math.sin(rad)),
  }
}

export default function ServiceOrbitSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const transitioningRef = useRef(false)
  const userPausedRef = useRef(false)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mobileNodeRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Keep the active mobile-strip icon fully in view as it auto-rotates
  useEffect(() => {
    mobileNodeRefs.current[activeIdx]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [activeIdx])

  const advance = useCallback((toIdx?: number) => {
    if (transitioningRef.current) return
    transitioningRef.current = true
    setVisible(false)
    setTimeout(() => {
      setActiveIdx(prev => toIdx !== undefined ? toIdx : (prev + 1) % services.length)
      setVisible(true)
      transitioningRef.current = false
    }, 260)
  }, [])

  // Auto-rotate every 3s (syncs with the 18s comet: 6 services × 3s = 18s full orbit)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!userPausedRef.current) advance()
    }, 3000)
    return () => clearInterval(interval)
  }, [advance])

  const handleSelect = (idx: number) => {
    if (idx === activeIdx || transitioningRef.current) return
    userPausedRef.current = true
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      userPausedRef.current = false
    }, 8000)
    advance(idx)
  }

  const svc = services[activeIdx]

  return (
    <section className="soi-section">
      <div className="soi-inner">

        {/* LEFT: Static headline + dynamic service detail */}
        <div className="soi-left-panel">

          {/* Static, answers the hero's question */}
          <div className="soi-header">
            <span className="soi-static-eyebrow">THE THINKSUITE SYSTEM</span>
            <h2 className="soi-main-title">
              Six Growth Engines.<br />
              <span className="grad-text">One Team. Zero Gaps.</span>
            </h2>
            <p className="soi-main-desc">
              Your clients are already searching, on Google, Instagram, and ChatGPT.
              We make sure you show up and win across every channel, with six fully
              integrated services working as one system.
            </p>
          </div>

          {/* Dynamic, fades when active service changes */}
          <div className={`soi-info${visible ? ' soi-visible' : ''}`}>
            <div className="soi-tag">
              <i className={svc.icon} style={{ color: svc.color }} />
              {svc.short}
            </div>

            <h3 className="soi-service-title">{svc.title}</h3>

            <ul className="soi-list">
              {svc.sub.map(s => (
                <li key={s.href}>
                  <Link href={s.href} className="soi-link">
                    <span className="soi-dot" style={{ background: svc.color }} />
                    {s.label}
                    <i className="fa-solid fa-arrow-right soi-arrow" />
                  </Link>
                </li>
              ))}
            </ul>

            <Link href={svc.href} className="btn btn-primary soi-cta">
              {svc.cta}
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>

        {/* RIGHT: Orbit Wheel (desktop) */}
        <div className="soi-wheel">
          <div className="soi-orbit-wrap">

            {/* Dashed ring + orbiting comet arc */}
            <svg className="soi-ring-svg" viewBox="0 0 480 480" fill="none">
              <circle
                cx="240" cy="240" r="175"
                stroke="rgba(26,35,126,0.13)"
                strokeWidth="1.5"
                strokeDasharray="6 5"
              />
              {/* Comet arc, 60° sweep, rotates once every 18s */}
              <circle
                cx="240" cy="240" r="175"
                stroke="rgba(0,188,212,0.55)"
                strokeWidth="2.5"
                strokeDasharray="183 917"
                strokeLinecap="round"
                className="soi-comet"
              />
            </svg>

            {/* Center TS logo */}
            <div className="soi-center">
              <span className="soi-center-ts">TS</span>
              <span className="soi-center-name">ThinkSuite Ecosystem</span>
            </div>

            {/* 6 orbit nodes */}
            {services.map((s, idx) => {
              const { x, y } = getPos(s.angle)
              const isActive = idx === activeIdx
              return (
                <button
                  key={s.id}
                  className={`soi-node${isActive ? ' soi-node-active' : ''}`}
                  style={{ left: x, top: y, '--nc': s.color } as React.CSSProperties}
                  onClick={() => handleSelect(idx)}
                  aria-label={s.title}
                >
                  <i className={s.icon} />
                  <span className="soi-node-name">{s.short}</span>
                </button>
              )
            })}

          </div>
        </div>

        {/* Mobile: horizontal icon strip */}
        <div className="soi-mobile-strip">
          {services.map((s, idx) => (
            <button
              key={s.id}
              ref={el => { mobileNodeRefs.current[idx] = el }}
              className={`soi-mobile-node${idx === activeIdx ? ' soi-node-active' : ''}`}
              style={{ '--nc': s.color } as React.CSSProperties}
              onClick={() => handleSelect(idx)}
            >
              <i className={s.icon} />
              <span>{s.short}</span>
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}
