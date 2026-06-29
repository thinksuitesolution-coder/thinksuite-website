'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

/* Drop project screenshots into /public/projects/, filenames match the `img` field below.
   Until images are added, each card shows its gradient as a styled placeholder. */
const slides = [
  {
    num: '01',
    title: 'NGO Website',
    tags: 'Non-Profit · Web Design · CMS',
    desc: 'A clean, donation-ready website for a non-profit organisation, built to build trust, communicate impact, and drive volunteer sign-ups through clear storytelling.',
    bg: 'linear-gradient(135deg,#16a34a 0%,#065f46 100%)',
    img: '/projects/ngo-website.jpg',
    href: '/projects',
  },
  {
    num: '02',
    title: 'Jewellery E-Commerce',
    tags: 'E-Commerce · Branding · SEO',
    desc: 'Full-stack jewellery store with product catalogue, wishlist, and checkout, designed to reflect the brand\'s premium positioning and grow organic traffic.',
    bg: 'linear-gradient(135deg,#b45309 0%,#92400e 100%)',
    img: '/projects/jewellery-ecommerce.jpg',
    href: '/projects',
  },
  {
    num: '03',
    title: 'Medical Static Website',
    tags: 'Healthcare · Web · SEO',
    desc: 'Professional static website for a medical practice, built for fast load times, local SEO, and clear patient-facing information across desktop and mobile.',
    bg: 'linear-gradient(135deg,#1a237e 0%,#0891b2 100%)',
    img: '/projects/medical-website.jpg',
    href: '/projects',
  },
  {
    num: '04',
    title: 'Professional Networking Platform',
    tags: 'Platform · React · Node.js',
    desc: 'LinkedIn-style networking platform with profiles, connection requests, industry feeds, and messaging, built for a niche professional community.',
    bg: 'linear-gradient(135deg,#1a237e 0%,#00bcd4 100%)',
    img: '/projects/networking-platform.jpg',
    href: '/projects',
  },
  {
    num: '05',
    title: 'WhatsApp Automation',
    tags: 'Automation · WhatsApp · AI',
    desc: 'End-to-end WhatsApp automation system covering lead nurturing, appointment booking, and customer support, integrated with CRM and triggered by real business events.',
    bg: 'linear-gradient(135deg,#15803d 0%,#166534 100%)',
    img: '/projects/whatsapp-automation.jpg',
    href: '/projects',
  },
  {
    num: '06',
    title: 'Social Media Management',
    tags: 'Social Media · Strategy · Content',
    desc: 'Full-suite social media handling across Instagram, LinkedIn, and Facebook for brands in fashion, food, and healthcare, covering content, scheduling, and growth.',
    bg: 'linear-gradient(135deg,#7c3aed 0%,#ea580c 100%)',
    img: '/projects/social-media-handling.jpg',
    href: '/projects',
  },
]

/* ── circular offset: how far slide i is from active ─────── */
function circOff(i: number, active: number, total: number): number {
  const raw  = i - active
  const half = Math.floor(total / 2)
  if (raw >  half) return raw - total
  if (raw < -half) return raw + total
  return raw
}

/* ── inline transform per offset position ──────────────────
   offset=0  → center, full size
   offset=±1 → side, 78% scale, 3D tilt inward
   offset=±2 → far, 62% scale, deeper tilt (mostly hidden)
   |offset|>2 → invisible
─────────────────────────────────────────────────────────── */
function covStyle(offset: number): React.CSSProperties {
  const abs  = Math.abs(offset)
  const sign = Math.sign(offset)

  if (abs > 2) {
    return { opacity: 0, transform: 'scale(0)', zIndex: 0, pointerEvents: 'none' }
  }

  const tx = abs === 0 ? 0    : sign * (abs === 1 ? 490 : 810)
  const ry = abs === 0 ? 0    : -sign * (abs === 1 ? 16  : 28)
  const sc = [1, 0.78, 0.62][abs]
  const op = [1, 1,    0.45][abs]
  const zi = [10, 8,    5][abs]

  return {
    transform: `perspective(1200px) translateX(${tx}px) rotateY(${ry}deg) scale(${sc})`,
    opacity:      op,
    zIndex:       zi,
    cursor:       abs > 0 ? 'pointer' : 'default',
    pointerEvents: abs > 2 ? 'none' : 'auto',
  }
}

export default function BlurCarouselSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const bgARef  = useRef<HTMLDivElement>(null)
  const bgBRef  = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const isAnim  = useRef(false)
  const autoRef = useRef<ReturnType<typeof setInterval>>()
  const currBg  = useRef<'a' | 'b'>('a')

  const goTo = useCallback(async (idx: number) => {
    if (isAnim.current || idx === activeIdx) return
    isAnim.current = true

    const gsap = (await import('gsap')).default

    const incoming = currBg.current === 'a' ? bgBRef.current : bgARef.current
    const outgoing = currBg.current === 'a' ? bgARef.current : bgBRef.current

    if (incoming) {
      const bg = slides[idx].bg
      incoming.style.backgroundImage = bg.includes('gradient') ? bg : `url(${bg})`
    }

    gsap.timeline({
      onComplete: () => {
        currBg.current = currBg.current === 'a' ? 'b' : 'a'
        isAnim.current = false
        setActiveIdx(idx)
      },
    })
      .to(incoming, { opacity: 1, duration: 0.7, ease: 'power2.inOut' })
      .to(outgoing, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 0)

    if (infoRef.current) {
      gsap.timeline()
        .to(infoRef.current, { opacity: 0, y: 12, duration: 0.22, ease: 'power2.in' })
        .set(infoRef.current, { y: -12 })
        .to(infoRef.current, { opacity: 1, y: 0,  duration: 0.32, ease: 'power2.out' })
    }
  }, [activeIdx])

  const prev = useCallback(
    () => goTo((activeIdx - 1 + slides.length) % slides.length),
    [activeIdx, goTo],
  )
  const next = useCallback(
    () => goTo((activeIdx + 1) % slides.length),
    [activeIdx, goTo],
  )

  /* auto-advance */
  useEffect(() => {
    autoRef.current = setInterval(next, 4500)
    return () => clearInterval(autoRef.current)
  }, [next])

  /* seed first bg */
  useEffect(() => {
    if (bgARef.current) {
      const bg = slides[0].bg
      bgARef.current.style.backgroundImage = bg.includes('gradient') ? bg : `url(${bg})`
    }
  }, [])

  return (
    <section className="bc-section">
      {/* ── blurred background ── */}
      <div className="bc-bg">
        <div className="bc-bg__layer" id="bc-bg-a" ref={bgARef} style={{ background: slides[0].bg }} />
        <div className="bc-bg__layer" id="bc-bg-b" ref={bgBRef} style={{ background: slides[1].bg, opacity: 0 }} />
        <div className="bc-bg__overlay" />
      </div>

      {/* ── header ── */}
      <div className="bc-header">
        <span className="bc-eyebrow">Featured Work</span>
        <h2 className="bc-heading">
          Projects we&apos;re<br />proud of.
        </h2>
      </div>

      {/* ── coverflow stage ── */}
      <div className="bc-cov-outer">
        {/* nav arrows, sit at the container edges, vertically centred on stage */}
        <button className="bc-btn bc-btn--prev" onClick={prev} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="bc-btn bc-btn--next" onClick={next} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* cards, all share the same origin point, spread by transform */}
        <div className="bc-cov-stage">
          {slides.map((slide, i) => {
            const offset = circOff(i, activeIdx, slides.length)
            return (
              <div
                key={slide.num}
                className="bc-cov-card"
                style={covStyle(offset)}
                onClick={() => offset !== 0 && goTo(i)}
              >
                {/* image if available, gradient placeholder otherwise */}
                <div className="bc-cov-card__bg" style={{ background: slide.bg }}>
                  <Image
                    src={slide.img}
                    alt={slide.title}
                    fill
                    sizes="(max-width:768px) 84vw, 620px"
                    className="bc-cov-card__img"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                </div>

                {/* bottom info strip */}
                <div className="bc-cov-card__foot">
                  <span className="bc-cov-card__num">{slide.num}</span>
                  <span className="bc-cov-card__ftags">{slide.tags}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── dots ── */}
      <div className="bc-dots">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`bc-dot${i === activeIdx ? ' is-active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* ── info block ── */}
      <div className="bc-info">
        <div className="bc-info__inner" ref={infoRef}>
          <span className="bc-info__num">{slides[activeIdx].num}</span>
          <h3 className="bc-info__title">{slides[activeIdx].title}</h3>
          <p className="bc-info__tags">{slides[activeIdx].tags}</p>
          <p className="bc-info__desc">{slides[activeIdx].desc}</p>
          <Link href={slides[activeIdx].href} className="bc-info__cta">
            View Case Study
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}