'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const projects = [
  { num: '01', title: 'AI Sales Intelligence Platform',  tags: 'AI · SaaS · React',           bg: 'linear-gradient(135deg,#1d4ed8 0%,#7c3aed 100%)' },
  { num: '02', title: 'E-Commerce Brand Overhaul',       tags: 'Branding · Shopify · SEO',     bg: 'linear-gradient(135deg,#d97706 0%,#ea580c 100%)' },
  { num: '03', title: 'FinTech Mobile Application',      tags: 'React Native · Node.js · AWS', bg: 'linear-gradient(135deg,#059669 0%,#0ea5e9 100%)' },
  { num: '04', title: 'Marketing Analytics Dashboard',   tags: 'Next.js · D3.js · Firebase',   bg: 'linear-gradient(135deg,#7c3aed 0%,#d97706 100%)' },
]

const TOTAL = projects.length
const ENTER = 0.85
const HOLD  = 0.1
const EXIT  = 0.6
const CYCLE = ENTER + HOLD

export default function FeaturedWorkSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const counterRef  = useRef<HTMLSpanElement>(null)
  const slideRefs   = useRef<(HTMLDivElement | null)[]>([])
  const metaRefs    = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let ctx: any

    const init = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      if (!section) return

      const isMob = window.innerWidth <= 768

      ctx = gsap.context(() => {
        // ── Set initial positions ─────────────────────────────────
        slideRefs.current.forEach((slide, i) => {
          if (!slide) return
          const isLeft = i % 2 === 0
          if (isMob) {
            gsap.set(slide, {
              position: 'absolute',
              top: '50%', left: '50%',
              xPercent: -50, yPercent: -50,
              y: '110vh', opacity: 0, zIndex: i + 1,
            })
          } else {
            gsap.set(slide, {
              position: 'absolute',
              top: '50%',
              left:  isLeft ? '9%'   : 'auto',
              right: isLeft ? 'auto' : '9%',
              yPercent: -50,
              y: '110vh', opacity: 0, zIndex: i + 1,
            })
          }
        })
        metaRefs.current.forEach(m => m && gsap.set(m, { opacity: 0 }))

        // ── Build timeline ────────────────────────────────────────
        const tl = gsap.timeline()

        slideRefs.current.forEach((slide, i) => {
          if (!slide) return
          const meta = metaRefs.current[i]
          const pos  = i * ENTER

          tl.to(slide, { y: 0, opacity: 1, duration: ENTER, ease: 'power3.out' }, pos)
          if (meta) {
            tl.to(meta, { opacity: 1, duration: 0.35, ease: 'power1.out' }, pos + ENTER * 0.65)
          }

          const exitAt = pos + CYCLE
          tl.to(slide, { y: '-110vh', opacity: 0, duration: EXIT, ease: 'power2.in' }, exitAt)
          if (meta) tl.to(meta, { opacity: 0, duration: 0.16 }, exitAt)
        })

        // extend for outro
        tl.to({}, { duration: 2.0 }, (TOTAL - 1) * ENTER + CYCLE + EXIT + 0.1)

        // ── ScrollTrigger ─────────────────────────────────────────
        ScrollTrigger.create({
          trigger:           section,
          animation:         tl,
          start:             'top top',
          end:               () => `+=${window.innerHeight * 6}`,
          pin:               true,
          pinSpacing:        true,
          scrub:             isMob ? 0.45 : 0.6,
          anticipatePin:     1,
          invalidateOnRefresh: true,

          onUpdate(self) {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`
            }
            if (counterRef.current) {
              const idx = Math.min(Math.floor(self.progress * TOTAL), TOTAL - 1)
              counterRef.current.textContent = String(idx + 1).padStart(2, '0')
            }
            if (self.progress >= 0.70) {
              section.classList.remove('fw-cards-active')
              section.classList.add('fw-show-outro')
            } else if (self.progress > 0.04) {
              section.classList.remove('fw-show-outro')
              section.classList.add('fw-cards-active')
            } else {
              section.classList.remove('fw-cards-active', 'fw-show-outro')
            }
          },
        })

        // force recalc after paint so GSAP reads correct dimensions
        requestAnimationFrame(() => ScrollTrigger.refresh())
      }, section)
    }

    init()
    return () => ctx?.revert()
  }, [])

  return (
    <section className="fw-section" ref={sectionRef}>
      <div className="fw-pin-target">

        <div className="fw-heading-wrap">
          <div className="fw-heading">
            <span>FEATURED</span>
            <span>WORK</span>
          </div>
        </div>

        <div className="fw-stack-wrap">
          <div className="fw-stack">
            {projects.map((p, i) => (
              <div
                key={p.num}
                className="fw-slide"
                ref={el => { slideRefs.current[i] = el }}
              >
                <div className="fw-img-wrap" style={{ background: p.bg }} />
                <div
                  className="fw-slide-meta"
                  ref={el => { metaRefs.current[i] = el }}
                >
                  <div className="fw-slide-info">
                    <span className="fw-slide-num">{p.num}</span>
                    <h3 className="fw-slide-title">{p.title}</h3>
                    <p className="fw-slide-tags">{p.tags}</p>
                  </div>
                  <Link href="/work" className="fw-slide-cta" aria-label="View project">
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                      <circle cx="21" cy="21" r="20" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M14 21h14M21 14l7 7-7 7" stroke="currentColor" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link href="/work" className="fw-explore-btn">
          Explore More Projects
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <div className="fw-ui">
          <div className="fw-progress-track">
            <div className="fw-progress-fill" ref={progressRef} />
          </div>
          <span className="fw-counter">
            <b className="fw-counter__current" ref={counterRef}>01</b>
            <span className="fw-counter__sep"> / </span>
            <span className="fw-counter__total">{String(TOTAL).padStart(2, '0')}</span>
          </span>
        </div>

      </div>
    </section>
  )
}
