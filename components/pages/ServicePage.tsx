'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'

interface HighlightItem { icon: string; title: string; desc: string }
interface SidebarLink { label: string; href: string }
interface StatItem { number: string; label: string }
interface FactItem { icon: string; stat: string; label: string; desc: string }
interface ProcessItem { title: string; desc: string }
interface FaqItem { q: string; a: string }

interface ServicePageProps {
  breadcrumb: string
  breadcrumbHref: string
  label: string
  title: string
  titleHighlight: string
  bannerImg?: string
  bannerAlt?: string
  intro: string
  intro2?: string
  h3: string
  highlights: HighlightItem[]
  sidebarTitle: string
  sidebarLinks: SidebarLink[]
  stats?: StatItem[]
  facts?: FactItem[]
  process?: ProcessItem[]
  faqs?: FaqItem[]
  ctaTitle: string
  ctaTitleHighlight: string
  ctaDesc: string
}

export default function ServicePage({
  breadcrumb, breadcrumbHref, label, title, titleHighlight,
  bannerImg, bannerAlt, intro, intro2, h3, highlights,
  sidebarTitle, sidebarLinks,
  stats, facts, process: steps, faqs,
  ctaTitle, ctaTitleHighlight, ctaDesc,
}: ServicePageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={breadcrumbHref}>{breadcrumb}</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>{title}</span>
          </div>
          <span className="label">{label}</span>
          <h1 className="mt-16">
            {title} <span className="grad-text">{titleHighlight}</span>
          </h1>
          {bannerImg && (
            <div className="page-hero-img-wrap">
              <Image
                src={bannerImg}
                alt={bannerAlt || title}
                width={1200}
                height={400}
                className="page-hero-img"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────── */}
      {stats && stats.length > 0 && (
        <div className="stats-strip">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-item">
                  <span className="stat-num">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT + SIDEBAR ───────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="service-detail-grid">
            <div className="service-detail-main reveal">
              <p>{intro}</p>
              {intro2 && <p>{intro2}</p>}
              <h3>{h3}</h3>
              <div style={{ marginTop: 8 }}>
                {highlights.map((item) => (
                  <div key={item.title} className="highlight-item">
                    <div className="hi-icon sc-blue">
                      <i className={`fa-solid ${item.icon}`} style={{ fontSize: 13 }} />
                    </div>
                    <div className="hi-text">
                      <strong>{item.title}</strong>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal">
              <div className="sidebar-card">
                <h5>{sidebarTitle}</h5>
                {sidebarLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="sidebar-link">{l.label}</Link>
                ))}
              </div>
              <div className="sidebar-card sidebar-card-cta">
                <h5>Ready to Start?</h5>
                <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20, lineHeight: 1.7 }}>
                  Let&apos;s discuss your project and create a custom solution that fits your needs and budget.
                </p>
                <Link href="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Get Free Quote <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INDUSTRY INSIGHTS / INTERESTING FACTS ────────────────── */}
      {facts && facts.length > 0 && (
        <section className="section section-tinted">
          <div className="container">
            <div className="title-block center reveal">
              <span className="label">Industry Insights</span>
              <h2 style={{ marginTop: 12 }}>
                Key <span className="grad-text">Market Facts</span> You Should Know
              </h2>
              <p style={{ marginTop: 14, color: 'var(--text2)', maxWidth: 560, margin: '14px auto 0' }}>
                Data-backed insights that show why investing in this space is a strategic advantage.
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
              marginTop: 8,
            }}>
              {facts.map((fact, i) => (
                <div
                  key={i}
                  className="service-card reveal"
                  style={{ transitionDelay: `${i * 0.08}s`, padding: '32px 28px' }}
                >
                  <div className="service-icon sc-blue" style={{ marginBottom: 18 }}>
                    <i className={`fa-solid ${fact.icon}`} />
                  </div>
                  <div style={{
                    fontSize: 38,
                    fontWeight: 900,
                    background: 'var(--grad1)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1,
                    marginBottom: 8,
                    fontFamily: 'var(--font-h)',
                    letterSpacing: '-1px',
                  }}>
                    {fact.stat}
                  </div>
                  <h4 style={{ marginBottom: 10, fontSize: 16, lineHeight: 1.35 }}>{fact.label}</h4>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, margin: 0 }}>{fact.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW WE WORK / PROCESS ────────────────────────────────── */}
      {steps && steps.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="title-block center reveal">
              <span className="label">How We Work</span>
              <h2 style={{ marginTop: 12 }}>
                Our <span className="grad-text">{steps.length}-Step Process</span>
              </h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(steps.length, 4)}, 1fr)`,
              gap: 24,
            }}>
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="reveal"
                  style={{
                    transitionDelay: `${i * 0.1}s`,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    padding: '32px 24px',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow)',
                  }}
                >
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'var(--grad1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontFamily: 'var(--font-h)',
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#fff',
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <h4 style={{ marginBottom: 12, fontSize: 17 }}>{step.title}</h4>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      {faqs && faqs.length > 0 && (
        <section className="section section-tinted">
          <div className="container">
            <div className="title-block center reveal">
              <span className="label">Common Questions</span>
              <h2 style={{ marginTop: 12 }}>
                Frequently Asked <span className="grad-text">Questions</span>
              </h2>
            </div>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
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
          </div>
        </section>
      )}

      <CTASection
        eyebrow="Let's Work Together"
        title={ctaTitle}
        titleHighlight={ctaTitleHighlight}
        subtitle={ctaDesc}
      />
    </>
  )
}
