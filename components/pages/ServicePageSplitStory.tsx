'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from './ServicePageSplitStory.module.css'

interface StatItem { number: string; label: string }
interface WhyItem { icon: string; title: string; desc: string }
interface CapItem { icon: string; title: string; desc: string; tags?: string[] }
interface TestimonialItem { quote: string; name: string; role: string; company: string }
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
  visualType?: 'growth'
  stats: StatItem[]
  whyUs: WhyItem[]
  capabilities: CapItem[]
  testimonial: TestimonialItem
  process: ProcessItem[]
  industries?: IndustryItem[]
  faqs: FaqItem[]
  sidebarLinks: { label: string; href: string }[]
  ctaTitle: string
  ctaTitleHighlight: string
  ctaDesc: string
}

const ordinals = ['01', '02', '03', '04', '05', '06']

function GrowthDashVisual() {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(26,35,126,0.12)',
      width: '100%',
      maxWidth: 460,
      position: 'relative',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', display: 'block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E', display: 'block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840', display: 'block' }} />
          </div>
          <span style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>Growth Dashboard</span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
          background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontFamily: 'var(--font-m)',
        }}>LIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid var(--border)' }}>
        {[
          { label: 'MRR', value: '₹18.4L', delta: '+34%', up: true },
          { label: 'CAC', value: '₹1,240', delta: '-18%', up: false },
          { label: 'LTV', value: '₹42K', delta: '+22%', up: true },
        ].map((m, i) => (
          <div key={i} style={{ padding: '16px 14px', borderRight: i < 2 ? '1px solid var(--border)' : 'none', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--text2)', fontFamily: 'var(--font-m)', letterSpacing: 1, marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 900, fontFamily: 'var(--font-h)', color: 'var(--text)', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4, color: m.up ? '#22c55e' : '#ef4444' }}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 20px 8px' }}>
        <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--font-m)', letterSpacing: 0.8, marginBottom: 12 }}>REVENUE TRAJECTORY, 12 MONTHS</div>
        <svg viewBox="0 0 420 130" fill="none" style={{ width: '100%' }} aria-label="Revenue growth chart">
          <defs>
            <linearGradient id="gpFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a237e" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#00bcd4" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[20, 46, 72, 98].map(y => (
            <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="#e2e8f0" strokeWidth="1" />
          ))}
          <path d="M 0,115 L 38,110 L 76,106 L 114,100 L 152,91 L 190,78 L 228,64 L 266,50 L 304,35 L 342,22 L 380,12 L 420,6 L 420,120 L 0,120 Z" fill="url(#gpFill)" />
          <path d="M 0,115 L 38,110 L 76,106 L 114,100 L 152,91 L 190,78 L 228,64 L 266,50 L 304,35 L 342,22 L 380,12 L 420,6"
            stroke="#1a237e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {([[0,115],[114,100],[228,64],[342,22],[420,6]] as [number,number][]).map(([x,y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="#1a237e" stroke="white" strokeWidth="2" />
          ))}
          <rect x="368" y="-4" width="52" height="18" rx="4" fill="#1a237e" />
          <text x="394" y="8" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">+2.8x</text>
        </svg>
        <div style={{ display: 'flex', gap: 10, marginTop: 4, justifyContent: 'space-between', padding: '0 2px' }}>
          {['Jan','Mar','May','Jul','Sep','Nov'].map(m => (
            <span key={m} style={{ fontSize: 9, color: 'var(--text2)', fontFamily: 'var(--font-m)' }}>{m}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 20px 18px' }}>
        <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--font-m)', letterSpacing: 0.8, marginBottom: 10 }}>90-DAY SPRINT MILESTONES</div>
        {[
          { label: 'Channel diversification', done: true },
          { label: 'CAC optimization', done: true },
          { label: 'Retention program launch', done: false },
          { label: 'Market expansion, Phase 2', done: false },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
              background: item.done ? 'var(--grad1)' : 'var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {item.done && <i className="fa-solid fa-check" style={{ fontSize: 8, color: '#fff' }} />}
            </div>
            <span style={{ fontSize: 12, color: item.done ? 'var(--text)' : 'var(--text2)', fontWeight: item.done ? 600 : 400 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{
        position: 'absolute', top: 64, right: -10,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '8px 12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: 'var(--text)',
      }}>
        <i className="fa-solid fa-bullseye" style={{ color: '#00bcd4' }} />
        North Star Tracked
      </div>
    </div>
  )
}

export default function ServicePageSplitStory({
  breadcrumb, breadcrumbHref, label, title, titleHighlight, tagline,
  visualType,
  stats, whyUs, capabilities, testimonial, process: steps, faqs, industries, sidebarLinks,
  ctaTitle, ctaTitleHighlight, ctaDesc,
}: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {visualType ? (
            <div className={s.heroGrid}>
              <div className={s.heroLeft}>
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
                <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 480, lineHeight: 1.78 }}>
                  {tagline}
                </p>
                <div className={s.heroCtas}>
                  <Link href="/contact" className="btn btn-primary">
                    Start Your Project <i className="fa-solid fa-arrow-right" />
                  </Link>
                  <Link href="#why-us" className="btn btn-outline">
                    Why ThinkSuite <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} />
                  </Link>
                </div>
              </div>
              <div className={s.heroRight}>
                {visualType === 'growth' && <GrowthDashVisual />}
              </div>
            </div>
          ) : (
            <>
              <div className="breadcrumb mb-16">
                <Link href="/">Home</Link>
                <span>/</span>
                <Link href={breadcrumbHref}>{breadcrumb}</Link>
                <span>/</span>
                <span style={{ color: 'var(--text)' }}>{title} {titleHighlight}</span>
              </div>
              <span className="label">{label}</span>
              <h1 className="mt-16" style={{ maxWidth: 700 }}>
                {title} <span className="grad-text">{titleHighlight}</span>
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 540, lineHeight: 1.78 }}>
                {tagline}
              </p>
              <div className={s.heroCtas}>
                <Link href="/contact" className="btn btn-primary">
                  Start Your Project <i className="fa-solid fa-arrow-right" />
                </Link>
                <Link href="#why-us" className="btn btn-outline">
                  Why ThinkSuite <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} />
                </Link>
              </div>
            </>
          )}
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

      {/* â”€â”€ WHY US â€” 3-col with large gradient ordinals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="why-us" className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">Why ThinkSuite</span>
            <h2 style={{ marginTop: 12 }}>
              Built for <span className="grad-text">Serious Outcomes</span>
            </h2>
          </div>
          <div className={s.whyGrid}>
            {whyUs.map((item, i) => (
              <div key={i} className={`${s.whyCard} reveal`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className={s.whyNum}>{ordinals[i]}</span>
                <div className={s.whyIconWrap}>
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <h3 className={s.whyTitle}>{item.title}</h3>
                <p className={s.whyDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ CAPABILITIES â€” staggered 3-col â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="capabilities" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">Capabilities</span>
            <h2 style={{ marginTop: 12 }}>
              What We <span className="grad-text">Deliver</span>
            </h2>
          </div>
          <div className={s.capGrid}>
            {capabilities.map((cap, i) => (
              <div
                key={i}
                className={`${s.capCard} reveal`}
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div className={s.capIconWrap}>
                  <i className={`fa-solid ${cap.icon}`} />
                </div>
                <h4 className={s.capTitle}>{cap.title}</h4>
                <p className={s.capDesc}>{cap.desc}</p>
                {cap.tags && cap.tags.length > 0 && (
                  <div className={s.capTags}>
                    {cap.tags.map((tag) => (
                      <span key={tag} className={s.capTag}>{tag}</span>
                    ))}
                  </div>
                )}
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
      {/* â”€â”€ TESTIMONIAL STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className={s.testiSection}>
        <div className="container">
          <div className={s.testiInner}>
            <span className={s.testiQuoteMark} aria-hidden="true">&ldquo;</span>
            <blockquote className={s.testiQuote}>{testimonial.quote}</blockquote>
            <div className={s.testiAuthor}>
              <span className={s.testiName}>{testimonial.name}</span>
              <span className={s.testiSep}>â€”</span>
              <span className={s.testiRole}>{testimonial.role}, {testimonial.company}</span>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ PROCESS â€” vertical timeline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">How We Work</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">Delivery Process</span>
            </h2>
          </div>
          <div className={s.timeline}>
            {steps.map((step, i) => (
              <div key={i} className={`${s.timelineItem} reveal`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className={s.timelineLeft}>
                  <div className={s.timelineCircle}>{ordinals[i]}</div>
                  {i < steps.length - 1 && <div className={s.timelineLine} />}
                </div>
                <div className={s.timelineRight}>
                  <h3 className={s.timelineTitle}>{step.title}</h3>
                  <p className={s.timelineDesc}>{step.desc}</p>
                </div>
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
              <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
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
        eyebrow="Let's Build Together"
        title={ctaTitle}
        titleHighlight={ctaTitleHighlight}
        subtitle={ctaDesc}
      />
    </>
  )
}
