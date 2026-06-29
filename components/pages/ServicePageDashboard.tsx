'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from './ServicePageDashboard.module.css'

interface StatItem { number: string; label: string }
interface CapItem { icon: string; metric: string; title: string; desc: string }
interface ProcessItem { title: string; desc: string }
interface IndustryItem { icon: string; name: string; useCase: string; tags: string[] }
interface FaqItem { q: string; a: string }

interface Props {
  breadcrumb: string
  breadcrumbHref: string
  label: string
  title: string
  titleHighlight: string
  tagline: string
  stats: StatItem[]
  chartTitle: string
  chartBadge: string
  intro: string
  introPoints: string[]
  capabilities: CapItem[]
  process: ProcessItem[]
  industries?: IndustryItem[]
  faqs: FaqItem[]
  sidebarLinks: { label: string; href: string }[]
  ctaTitle: string
  ctaTitleHighlight: string
  ctaDesc: string
}

function GrowthChart({ title, badge }: { title: string; badge: string }) {
  return (
    <div className={s.chartCard}>
      <div className={s.chartHeader}>
        <span className={s.chartTitle}>{title}</span>
        <span className={s.chartBadge}>â†‘ {badge}</span>
      </div>
      <div className={s.chartLegend}>
        <div className={s.legendItem}>
          <div className={s.legendDot} style={{ background: '#1a237e' }} />
          <span>After ThinkSuite</span>
        </div>
        <div className={s.legendItem}>
          <div className={s.legendDot} style={{ background: '#cbd5e1' }} />
          <span>Before</span>
        </div>
      </div>
      <svg viewBox="0 0 360 180" fill="none" style={{ width: '100%' }} aria-label="Growth chart showing organic traffic increase">
        <defs>
          <linearGradient id="dashChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a237e" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#00bcd4" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[15, 43, 71, 99, 127].map(y => (
          <line key={y} x1="36" y1={y} x2="340" y2={y} stroke="#f1f5f9" strokeWidth="1" />
        ))}
        <line x1="36" y1="155" x2="340" y2="155" stroke="#e2e8f0" strokeWidth="1" />

        {/* Y labels */}
        {[
          { y: 17,  l: '125' },
          { y: 45,  l: '100' },
          { y: 73,  l: '75'  },
          { y: 101, l: '50'  },
          { y: 129, l: '25'  },
          { y: 157, l: '0'   },
        ].map(({ y, l }) => (
          <text key={l} x="30" y={y} textAnchor="end" fontSize="8" fill="#94a3b8">{l}</text>
        ))}

        {/* Before area */}
        <path
          d="M 36,142 L 97,143 L 158,141 L 219,143 L 280,142 L 340,143 L 340,155 L 36,155 Z"
          fill="rgba(203,213,225,0.22)"
        />
        {/* Before line â€” dashed grey */}
        <path
          d="M 36,142 L 97,143 L 158,141 L 219,143 L 280,142 L 340,143"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />

        {/* After area â€” gradient fill */}
        <path
          d="M 36,142 L 97,125 L 158,103 L 219,80 L 280,53 L 340,26 L 340,155 L 36,155 Z"
          fill="url(#dashChartFill)"
        />
        {/* After line â€” solid blue */}
        <path
          d="M 36,142 L 97,125 L 158,103 L 219,80 L 280,53 L 340,26"
          stroke="#1a237e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* After dots */}
        {([[36,142],[97,125],[158,103],[219,80],[280,53],[340,26]] as [number,number][]).map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="#1a237e" stroke="white" strokeWidth="2" />
        ))}

        {/* Annotation badge on last point */}
        <rect x="292" y="9" width="56" height="19" rx="4" fill="#1a237e" />
        <text x="320" y="21.5" textAnchor="middle" fontSize="9.5" fill="white" fontWeight="700">+120%</text>

        {/* X labels */}
        {(
          [[36,'Jan'],[97,'Feb'],[158,'Mar'],[219,'Apr'],[280,'May'],[340,'Jun']] as [number,string][]
        ).map(([x, month]) => (
          <text key={month} x={x} y="170" textAnchor="middle" fontSize="8.5" fill="#94a3b8">{month}</text>
        ))}
      </svg>
    </div>
  )
}

export default function ServicePageDashboard({
  breadcrumb, breadcrumbHref, label, title, titleHighlight, tagline,
  stats, chartTitle, chartBadge,
  intro, introPoints,
  capabilities, process: steps, faqs, industries,
  sidebarLinks,
  ctaTitle, ctaTitleHighlight, ctaDesc,
}: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={breadcrumbHref}>{breadcrumb}</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>{title} {titleHighlight}</span>
          </div>
          <span className="label">{label}</span>
          <h1 className="mt-16">
            {title} <span className="grad-text">{titleHighlight}</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 540, lineHeight: 1.78 }}>
            {tagline}
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">
              Get Free Audit <i className="fa-solid fa-arrow-right" />
            </Link>
            <Link href="#what-we-offer" className="btn btn-outline">
              See Services <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* â”€â”€ STATS STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className={s.statsRow}>
        {stats.map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* â”€â”€ DASHBOARD VISUAL + INTRO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="section">
        <div className="container">
          <div className={s.dashGrid}>
            <div className="reveal">
              <GrowthChart title={chartTitle} badge={chartBadge} />
            </div>
            <div className="reveal reveal-d1">
              <span className="label">Why It Works</span>
              <h2 style={{ marginTop: 14, marginBottom: 16 }}>
                Strategies That <span className="grad-text">Deliver Results</span>
              </h2>
              <p style={{ color: 'var(--text2)', lineHeight: 1.85, fontSize: '15px' }}>
                {intro}
              </p>
              <div className={s.introPoints}>
                {introPoints.map((point, i) => (
                  <div key={i} className={s.introPoint}>
                    <i className="fa-solid fa-circle-check" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn btn-primary">
                Start Growing Today <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ CAPABILITIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="what-we-offer" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Offer</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">{title} {titleHighlight}</span> Capabilities
            </h2>
          </div>
          <div className={s.capGrid}>
            {capabilities.map((cap, i) => (
              <div
                key={i}
                className={`${s.capCard} reveal`}
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <span className={s.capMetric}>{cap.metric}</span>
                <div className={s.capIconWrap}>
                  <i className={`fa-solid ${cap.icon}`} />
                </div>
                <div className={s.capTitle}>{cap.title}</div>
                <p className={s.capDesc}>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* -- INDUSTRIES --------------------------------------------------------- */}
      {industries && industries.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="title-block center reveal">
              <span className="label">Who We Work With</span>
              <h2 style={{ marginTop: 12 }}>
                Any Industry. Any Scale. <span className="grad-text">Any Need.</span>
              </h2>
              <p style={{ color: 'var(--text2)', marginTop: 12, maxWidth: 640, margin: '12px auto 0', lineHeight: 1.85, fontSize: 15 }}>
                From a local business to a pan-India brand, from a bootstrapped startup to an established enterprise -
                we adapt completely to your goals, market, and budget. If you have customers, we can build for you.
              </p>
            </div>

            <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', margin: '36px auto 0', maxWidth: 820 }}>
              {['E-Commerce', 'Healthcare', 'Real Estate', 'Education', 'Finance & BFSI',
                'Hospitality', 'Food & Beverage', 'Logistics', 'Fashion', 'Manufacturing',
                'Legal Services', 'Automotive', 'Media & Entertainment', 'Travel & Tourism',
                'Agriculture', 'Non-Profit', 'IT & SaaS', 'Consulting', 'Retail', 'Startups'].map((ind) => (
                <span key={ind} style={{
                  padding: '7px 16px',
                  borderRadius: 999,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  fontSize: 13,
                  color: 'var(--text2)',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}>{ind}</span>
              ))}
              <span style={{
                padding: '7px 16px',
                borderRadius: 999,
                background: 'var(--grad1)',
                fontSize: 13,
                color: '#fff',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}>+ Many More</span>
            </div>

            <div style={{ textAlign: 'center', marginTop: 48, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--text2)', fontFamily: 'var(--font-m)' }}>
                EXAMPLE USE CASES
              </span>
            </div>
            <div className={s.indGrid}>
              {industries.map((ind, i) => (
                <div
                  key={i}
                  className={`${s.indCard} reveal`}
                  style={{ transitionDelay: `${i * 0.07}s` }}
                >
                  <div className={s.indIcon}>
                    <i className={`fa-solid ${ind.icon}`} />
                  </div>
                  <div className={s.indName}>{ind.name}</div>
                  <p className={s.indUseCase}>{ind.useCase}</p>
                  <div className={s.indTags}>
                    {ind.tags.map((tag, j) => (
                      <span key={j} className={s.indTag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal" style={{ marginTop: 36, padding: '20px 28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 15, color: 'var(--text)', lineHeight: 1.75 }}>
                <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--cyan)', marginRight: 10 }} />
                Have a unique requirement?{' '}
                <strong>We build fully custom solutions</strong> for any business, any workflow, any scale.{' '}
                <a href="/contact" style={{ color: 'var(--cyan)', fontWeight: 600, textDecoration: 'underline' }}>
                  Tell us what you need.
                </a>
              </p>
            </div>
          </div>
        </section>
      )}
      {/* â”€â”€ PROCESS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">How We Work</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">4-Step Process</span>
            </h2>
          </div>
          <div className={s.processRow}>
            {steps.map((step, i) => (
              <div
                key={i}
                className={`${s.processItem} reveal`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className={s.processCircle}>{i + 1}</div>
                <div className={s.processTitle}>{step.title}</div>
                <p className={s.processDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">Common Questions</span>
            <h2 style={{ marginTop: 12 }}>
              Frequently Asked <span className="grad-text">Questions</span>
            </h2>
          </div>
          <div className={s.faqInner}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item${openFaq === i ? ' open' : ''}`}
              >
                <div
                  className="faq-q"
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  onKeyDown={(e) => e.key === 'Enter' && setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <i className="fa-solid fa-chevron-down" />
                </div>
                <div className="faq-a">
                  <div className="faq-a-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Related services */}
          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, fontFamily: 'var(--font-m)', letterSpacing: 1 }}>
              EXPLORE RELATED SERVICES
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {sidebarLinks.map((l) => (
                <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Work Together"
        title={ctaTitle}
        titleHighlight={ctaTitleHighlight}
        subtitle={ctaDesc}
      />
    </>
  )
}
