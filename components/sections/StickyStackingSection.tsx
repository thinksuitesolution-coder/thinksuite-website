'use client'
import { useEffect, useRef } from 'react'

const cards = [
  {
    cls: 'ts-s-card-1',
    num: '01',
    icon: 'fa-solid fa-rocket',
    title: 'Rapid Deployment.',
    desc: 'While traditional agencies take months to write code, our AI-assisted workflows let us launch production-ready SaaS, websites, and automation tracks in weeks, not months.',
    deco: '10X',
    metric: '3x Faster Time-to-Market',
  },
  {
    cls: 'ts-s-card-2',
    num: '02',
    icon: 'fa-solid fa-brain',
    title: 'Built for the Generative Era.',
    desc: 'Every piece of software or marketing asset we create is optimized for AI tools. We make sure your brand is native to the ecosystem of ChatGPT, Gemini, and future LLMs.',
    deco: 'AI',
    metric: '100% Future-Proof Frameworks',
  },
  {
    cls: 'ts-s-card-3',
    num: '03',
    icon: 'fa-solid fa-chart-line',
    title: 'Pure Performance Marketing.',
    desc: 'No vanity metrics. No fake likes or empty traffic reports. Every ad dollar is tracked directly against your revenue, customer acquisition cost (CAC), and ultimate business growth.',
    deco: 'ROI',
    metric: 'Average 4.2x ROI on Ad Spend',
  },
  {
    cls: 'ts-s-card-4',
    num: '04',
    icon: 'fa-solid fa-users',
    title: 'No Scattered Vendors.',
    desc: 'Stop talking to 4 different agencies for web, design, marketing, and AI. ThinkSuite gives you one tightly integrated engineering team where nothing gets lost in translation.',
    deco: 'ONE',
    metric: 'Unified Business Control',
  },
]

const SECTION_VH = 80 // scroll space per card (vh)
const MOBILE_BP = 768

export default function StickyStackingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // On mobile: show all cards as a plain list, skip animation
    if (window.innerWidth < MOBILE_BP) {
      cardRefs.current.forEach((card) => {
        if (!card) return
        card.style.position = 'relative'
        card.style.height = 'auto'
        card.style.top = ''
        card.style.left = ''
        card.style.right = ''
        card.style.opacity = '1'
        card.style.transform = 'none'
        card.style.transition = 'none'
        card.style.zIndex = ''
        card.style.marginBottom = '1rem'
        card.style.willChange = 'auto'
      })
      return
    }

    const n = cards.length
    let rafId = 0
    let sectionTop = 0
    let sectionHeight = 0

    // Cache section bounds using offsetTop traversal (stable, not affected by scroll)
    const computeBounds = () => {
      let top = 0
      let el: HTMLElement | null = section
      while (el) {
        top += el.offsetTop
        el = el.offsetParent as HTMLElement | null
      }
      sectionTop = top
      sectionHeight = section.offsetHeight
    }

    computeBounds()
    window.addEventListener('resize', computeBounds, { passive: true })

    const update = () => {
      const vh = window.innerHeight
      const scrollable = sectionHeight - vh
      if (scrollable <= 0) return

      const scrolled = window.scrollY - sectionTop
      const progress = Math.min(Math.max(scrolled / scrollable, 0), 1)
      const active = Math.min(Math.floor(progress * n), n - 1)

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        if (i < active) {
          const depth = active - i
          card.style.transform = `scale(${1 - depth * 0.04}) translateY(${-depth * 14}px)`
          card.style.opacity = '1'
          card.style.zIndex = String(i + 1)
        } else if (i === active) {
          card.style.transform = 'scale(1) translateY(0px)'
          card.style.opacity = '1'
          card.style.zIndex = String(n + 2)
        } else {
          card.style.transform = 'scale(1) translateY(60px)'
          card.style.opacity = '0'
          card.style.zIndex = '0'
        }
      })
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Delay initial update so layout is fully settled after hydration
    rafId = requestAnimationFrame(update)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', computeBounds)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* ── Desktop: scroll-driven stacking ─────────────────────────────── */}
      <section
        ref={sectionRef}
        className="ts-stack-desktop"
        style={{ background: 'var(--bg)', height: `${cards.length * SECTION_VH + 20}vh` }}
      >
        {/* Sticky viewport container — stays on screen while section scrolls */}
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5rem',
          }}>
            {/* Left: stays visible throughout scroll */}
            <div className="ts-left-content" style={{ position: 'static', flex: '0 0 360px' }}>
              <span className="ts-left-eyebrow">Why ThinkSuite</span>
              <h2 className="ts-left-heading">Why brands scale with ThinkSuite.</h2>
              <p className="ts-left-body">
                We don&apos;t just deliver services; we build unfair technical advantages.
                Here is how we move the needle for your business.
              </p>
            </div>

            {/* Right: cards stacked on top of each other */}
            <div style={{ flex: 1, position: 'relative', height: 420 }}>
              {cards.map((c, i) => (
                <div
                  key={c.num}
                  ref={el => { cardRefs.current[i] = el }}
                  className={`ts-s-card ${c.cls}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    margin: 0,
                    opacity: i === 0 ? 1 : 0,
                    transform: i === 0 ? 'scale(1) translateY(0px)' : 'scale(1) translateY(60px)',
                    transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease',
                    willChange: 'transform, opacity',
                  }}
                >
                  <span className="ts-s-card-number">
                    <i className={`${c.icon} ts-s-card-icon`} aria-hidden="true" />
                    {c.num}
                  </span>
                  <div>
                    <div className="ts-s-card-title">{c.title}</div>
                    <p className="ts-s-card-desc">{c.desc}</p>
                  </div>
                  <span className="ts-s-card-metric">{c.metric}</span>
                  <span className="ts-s-card-deco" aria-hidden="true">{c.deco}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile: plain vertical card list ─────────────────────────────── */}
      <section className="ts-stack-mobile" style={{ background: 'var(--bg)', padding: '3rem 1.25rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="ts-left-eyebrow">Why ThinkSuite</span>
          <h2 className="ts-left-heading" style={{ marginTop: '0.75rem' }}>Why brands scale with ThinkSuite.</h2>
          <p className="ts-left-body" style={{ marginTop: '1rem' }}>
            We don&apos;t just deliver services; we build unfair technical advantages.
            Here is how we move the needle for your business.
          </p>
        </div>
        {cards.map((c) => (
          <div key={c.num} className={`ts-s-card ${c.cls}`} style={{ marginBottom: '1rem', height: 'auto', minHeight: 280 }}>
            <span className="ts-s-card-number">
              <i className={`${c.icon} ts-s-card-icon`} aria-hidden="true" />
              {c.num}
            </span>
            <div>
              <div className="ts-s-card-title">{c.title}</div>
              <p className="ts-s-card-desc">{c.desc}</p>
            </div>
            <span className="ts-s-card-metric">{c.metric}</span>
            <span className="ts-s-card-deco" aria-hidden="true">{c.deco}</span>
          </div>
        ))}
      </section>
    </>
  )
}