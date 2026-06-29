'use client'

import { useEffect, useRef } from 'react'

const SC_SERVICES = [
  { abbr: 'WEB', name: 'Web Development',     desc: 'Fast, accessible websites built with React, Next.js & modern stacks.',        accent: '#2563eb' },
  { abbr: 'UI',  name: 'UI / UX Design',      desc: 'Human-centred interfaces that delight users and drive conversion.',            accent: '#7c3aed' },
  { abbr: 'AI',  name: 'AI Integration',      desc: 'Embed LLMs and ML pipelines directly into your product experience.',          accent: '#d97706' },
  { abbr: 'DEV', name: 'Software Development', desc: 'Custom web apps, mobile and SaaS products engineered for scale.',            accent: '#059669' },
  { abbr: 'MKT', name: 'Digital Marketing',   desc: 'SEO, performance ads and content strategies that compound growth.',           accent: '#ea580c' },
  { abbr: 'BRD', name: 'Branding & Design',   desc: 'Brand identities and UI systems that make you instantly recognizable.',       accent: '#0ea5e9' },
]

const SC_SCROLL_VH   = 6
const SC_FRONT_ANGLE = 90   // right (3 o'clock) is the featured position
const TOTAL          = SC_SERVICES.length
const STEP           = 360 / TOTAL

export default function ServiceCarouselSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const ringRef    = useRef<HTMLDivElement>(null)
  const screenRef  = useRef<HTMLDivElement>(null)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let cleanup: (() => void) | undefined

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) return

    const init = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      const ring    = ringRef.current
      const screen  = screenRef.current
      if (!section || !ring || !screen) return

      // Orbital radius scales with viewport so cards never clip
      const SC_RADIUS = Math.min(window.innerWidth * 0.26, 260)

      // Position each card on the ring, identical to reference script
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const angleDeg = SC_FRONT_ANGLE + i * STEP
        const angleRad = (angleDeg - 90) * (Math.PI / 180) // -90° so 0° points up
        ;(card as any)._baseDeg = angleDeg

        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x: Math.cos(angleRad) * SC_RADIUS,
          y: Math.sin(angleRad) * SC_RADIUS,
          rotation: 0,
          scale: i === 0 ? 1.15 : 0.82,
        })
      })

      // Seed initial screen content
      updateScreen(0, screen)
      cardRefs.current[0]?.classList.add('is-active')

      let currentActive = 0

      // Timeline: rotate the entire ring -360° (counter-clockwise)
      const tl = gsap.timeline()
      tl.to(ring, { rotation: -360, ease: 'none', duration: 1 })

      const st = ScrollTrigger.create({
        trigger:           section,
        animation:         tl,
        start:             'top top',
        end:               `+=${window.innerHeight * SC_SCROLL_VH}`,
        pin:               true,
        scrub:             0.9,
        anticipatePin:     1,
        invalidateOnRefresh: true,

        onUpdate(self) {
          const ringRot = -360 * self.progress

          // Find card closest to SC_FRONT_ANGLE
          let minDist  = Infinity
          let activeIdx = 0

          cardRefs.current.forEach((card, i) => {
            if (!card) return
            const baseDeg = (card as any)._baseDeg as number
            const cur  = ((baseDeg + ringRot) % 360 + 360) % 360
            let dist   = Math.abs(cur - SC_FRONT_ANGLE)
            if (dist > 180) dist = 360 - dist
            if (dist < minDist) { minDist = dist; activeIdx = i }
          })

          // Counter-rotate each card so text stays upright
          cardRefs.current.forEach((card, i) => {
            if (!card) return
            gsap.set(card, {
              rotation: -ringRot,
              scale: i === activeIdx ? 1.15 : 0.82,
            })
            card.classList.toggle('is-active', i === activeIdx)
          })

          if (activeIdx !== currentActive) {
            currentActive = activeIdx
            gsap.killTweensOf(screen)
            gsap.to(screen, {
              opacity: 0, duration: 0.15, ease: 'power1.in',
              onComplete() {
                updateScreen(activeIdx, screen)
                gsap.to(screen, { opacity: 1, duration: 0.25, ease: 'power1.out' })
              },
            })
          }
        },
      })

      cleanup = () => st.kill()
    }

    init()
    return () => cleanup?.()
  }, [])

  function updateScreen(idx: number, screen: HTMLDivElement) {
    const svc   = SC_SERVICES[idx]
    const abbr  = screen.querySelector('.sc-screen__abbr') as HTMLElement | null
    const name  = screen.querySelector('.sc-screen__name') as HTMLElement | null
    const desc  = screen.querySelector('.sc-screen__desc') as HTMLElement | null
    if (abbr) { abbr.textContent = svc.abbr; abbr.style.background = svc.accent + '28'; abbr.style.color = svc.accent }
    if (name) name.textContent = svc.name
    if (desc) desc.textContent = svc.desc
  }

  const first = SC_SERVICES[0]

  return (
    <div className="sc-section-wrap">
      {/* Header scrolls normally above the pinned section */}
      <div className="sc-header">
        <span className="sc-eyebrow">What We Build</span>
        <h2 className="sc-heading">Our<br />Services</h2>
      </div>

      <section className="sc-section" ref={sectionRef}>

        {/* Desktop, pinned 100vh orbital scene */}
        <div className="sc-pin-target">

          <div className="sc-pin-heading">
            <span className="sc-pin-eyebrow">What We Build</span>
            <p className="sc-pin-title">Our Services</p>
          </div>

          <div className="sc-orbit-wrap">
            {/* Center laptop */}
            <div className="sc-laptop-wrap">
              <div className="sc-laptop">
                <div className="sc-screen">
                  <div className="sc-screen__content" ref={screenRef}>
                    <span className="sc-screen__abbr" style={{ background: first.accent + '28', color: first.accent }}>
                      {first.abbr}
                    </span>
                    <p className="sc-screen__name">{first.name}</p>
                    <p className="sc-screen__desc">{first.desc}</p>
                  </div>
                </div>
                <div className="sc-keyboard">
                  <div className="sc-keyboard__trackpad" />
                </div>
              </div>
            </div>

            {/* Rotating ring, GSAP rotates this div, cards counter-rotate */}
            <div className="sc-ring" ref={ringRef}>
              {SC_SERVICES.map((svc, i) => (
                <div
                  key={svc.abbr}
                  className={`sc-card${i === 0 ? ' is-active' : ''}`}
                  ref={el => { cardRefs.current[i] = el }}
                  style={{ position: 'absolute', left: '50%', top: '50%' }}
                >
                  <span className="sc-card__abbr">{svc.abbr}</span>
                  <span className="sc-card__name">{svc.name}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="sc-hint">↓ scroll to orbit</p>
        </div>

        {/* Mobile, horizontal scroll-snap slider */}
        <div className="sc-mobile">
          <div className="sc-mobile__track">
            {SC_SERVICES.map(svc => (
              <div key={svc.abbr} className="sc-mobile-card">
                <span className="sc-mobile-card__abbr" style={{ background: svc.accent + '22', color: svc.accent }}>
                  {svc.abbr}
                </span>
                <p className="sc-mobile-card__name">{svc.name}</p>
                <p className="sc-mobile-card__desc">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  )
}
