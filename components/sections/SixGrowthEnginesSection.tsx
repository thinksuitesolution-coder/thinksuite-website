'use client'
import { useEffect, useRef } from 'react'

const cards = [
  {
    num: '01',
    title: '10x Deployment Velocity',
    desc: 'Traditional development cycles take months of planning. Our engineering cell breaks bottlenecks using advanced automation pipelines to build and live-test custom systems in weeks.',
    stat: '3x Faster Time-to-Market',
    icon: 'fa-code',
    iconBg: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
    cardBg: '#f5f3ff',
    img: '/assets/img/software%20development.png',
  },
  {
    num: '02',
    title: 'Generative Search Dominance',
    desc: 'As search patterns evolve, we optimize your data models via Generative Engine Optimization. We ensure your brand is cited directly as the top calculated answer on ChatGPT and Gemini.',
    stat: '85% AI Search Discoverability',
    icon: 'fa-bullhorn',
    iconBg: 'linear-gradient(135deg,#d97706,#fbbf24)',
    cardBg: '#fffbeb',
    img: '/assets/img/Digital%20Marketing.png',
  },
  {
    num: '03',
    title: 'Zero Retainer Leakage',
    desc: 'We eliminate superficial vanity metrics and empty digital noise. Every performance marketing asset is cross-tracked natively against hard closed revenue metrics and real customer acquisition costs.',
    stat: '4.2x Average Ad ROI',
    icon: 'fa-pen-nib',
    iconBg: 'linear-gradient(135deg,#be185d,#f472b6)',
    cardBg: '#fdf2f8',
    img: '/assets/img/Branding%26design.png',
  },
  {
    num: '04',
    title: 'Consolidated Architecture',
    desc: 'Stop managing scattered software shops, separate design consultants, and isolated marketing vendors. ThinkSuite acts as your unified technical execution team.',
    stat: '100% Workflow Continuity',
    icon: 'fa-brain',
    iconBg: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
    cardBg: '#eff6ff',
    img: '/assets/img/aI%20%26%20Automation.png',
  },
  {
    num: '05',
    title: 'Operational Automation',
    desc: 'We locate manual backend friction points and replace them with intelligent custom workflows, custom CRM tools, and automated operational microservices.',
    stat: '60% Overhead Reduction',
    icon: 'fa-tower-broadcast',
    iconBg: 'linear-gradient(135deg,#059669,#34d399)',
    cardBg: '#f0fdf4',
    img: '/assets/img/Media%20%26%20Advertising.png',
  },
  {
    num: '06',
    title: 'Cloud Infrastructure Resilience',
    desc: 'Building enterprise grade custom SaaS applications that scale safely. Every product features secure multi-tenant cloud logic and high infrastructure runtime specs.',
    stat: '99.9% Production Runtime',
    icon: 'fa-cloud',
    iconBg: 'linear-gradient(135deg,#0d9488,#2dd4bf)',
    cardBg: '#f0fdfa',
    img: '/assets/img/aI%20%26%20Automation.png',
  },
]

// px advanced per requestAnimationFrame tick (~60 fps → ~45 px/s)
const SPEED = 0.75

export default function SixGrowthEnginesSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const dotsRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track  = trackRef.current
    const dotsEl = dotsRef.current
    if (!track) return

    const mobile = () => window.innerWidth < 768

    let x       = 0
    let raf     = 0
    let paused  = false
    let singleW = 0

    // Defer measurement by one rAF so the browser has finished layout.
    // offsetLeft is 0 if read synchronously in useEffect.
    const measure = () => {
      if (mobile()) { singleW = 0; track.style.transform = 'none'; return }
      const children = Array.from(track.children) as HTMLElement[]
      const newW = (children[cards.length] as HTMLElement)?.offsetLeft ?? 0
      if (newW > 0) singleW = newW
    }

    const animate = () => {
      if (!paused && !mobile() && singleW > 0) {
        x = (x + SPEED) % singleW
        track.style.transform = `translateX(-${x}px)`

        if (dotsEl) {
          const idx = Math.min(cards.length - 1, Math.floor((x / singleW) * cards.length))
          Array.from(dotsEl.children).forEach((dot, i) =>
            dot.classList.toggle('hss-dot--active', i === idx),
          )
        }
      }
      raf = requestAnimationFrame(animate)
    }

    // Wait one frame so layout is computed, then start the loop
    requestAnimationFrame(() => {
      measure()
      window.addEventListener('resize', measure)
      raf = requestAnimationFrame(animate)
    })

    // Pause on hover so users can read a card
    const pause  = () => { paused = true }
    const resume = () => { paused = false }
    track.addEventListener('mouseenter', pause)
    track.addEventListener('mouseleave', resume)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      if (track) {
        track.removeEventListener('mouseenter', pause)
        track.removeEventListener('mouseleave', resume)
      }
    }
  }, [])

  return (
    <div className="hss-wrapper" id="services">
      <div className="hss-sticky">

        {/* Left panel, solid bg + z-index:20, cards slide behind it */}
        <div className="hss-left">
          <span className="hss-eyebrow">OUR METRICS</span>
          <h2 className="hss-title">
            One Partner.<br />
            <span>Infinite Scale.</span>
          </h2>
          <p className="hss-subtitle">
            From scalable business automation solutions to future-ready software infrastructures, we build the technical advantages that position modern brands at the top of search intent.
          </p>

          {/* Dot indicator, highlights active card */}
          <div ref={dotsRef} className="hss-dots">
            {cards.map((_, i) => (
              <span key={i} className={`hss-dot${i === 0 ? ' hss-dot--active' : ''}`} />
            ))}
          </div>
        </div>

        {/* Right panel, cards × 2 for seamless infinite loop */}
        <div className="hss-right">
          <div ref={trackRef} className="hss-track">
            {[...cards, ...cards].map((card, idx) => (
              <div
                key={idx}
                className="hss-card"
                style={{ background: card.cardBg }}
              >
                <span className="hss-card-num">{card.num}</span>
                <div className="hss-card-icon" style={{ background: card.iconBg }}>
                  <i className={`fa-solid ${card.icon}`} />
                </div>
                <h3 className="hss-card-title">{card.title}</h3>
                <p className="hss-card-desc">{card.desc}</p>
                <span className="hss-card-stat">{card.stat} →</span>
                <div className="hss-card-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.img} alt={card.title} className="hss-card-img" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
