'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from '@/components/pages/ServicePageDashboard.module.css'

const CAPS = [
  { icon: 'fa-tv',               metric: 'TRP-optimized',  title: 'TV Commercial Planning and Buying', desc: 'Channel selection, prime time vs off-peak scheduling, TRP analysis, regional vs national mix, and ad spot negotiation for the most competitive rates in the market.' },
  { icon: 'fa-radio',            metric: 'City-level',     title: 'Radio Advertising',                 desc: 'FM station selection, RJ endorsement programs, jingle production, and geo-targeted campaigns that work for local retail, events, and city-specific launches.' },
  { icon: 'fa-newspaper',        metric: 'Print + Mag',    title: 'Print Media Advertising',           desc: 'National and regional newspaper insertions, magazine placements, supplements, and classifieds. Full-page impact for launches, half-page for recall.' },
  { icon: 'fa-video',            metric: 'Unskippable',    title: 'OTT and Streaming Advertising',     desc: 'Pre-roll, mid-roll, and connected TV placements on JioCinema, Hotstar, and YouTube. Demographic and interest targeting at scale with unskippable formats.' },
  { icon: 'fa-chart-pie',        metric: 'Audience-first', title: 'Programmatic and Display Media',    desc: 'Audience-first media buying through DSPs, behavioral targeting, contextual placements, and retargeting across the premium web inventory your audience browses daily.' },
  { icon: 'fa-arrows-to-circle', metric: 'Unified view',   title: 'Integrated Media Planning',         desc: 'Cross-channel media plans with reach and frequency optimization, sequenced storytelling across screens, and a single view of budget allocation, delivery, and ROI.' },
]

const FAQS = [
  { q: 'Do you handle production of TV and radio ads as well?', a: 'Yes, we have in-house creative and production capabilities for TV commercials, radio jingles, and digital video. We can take a concept from script to final edit, or work with your existing creative if you already have assets.' },
  { q: 'What is the minimum budget for a multi-channel media campaign?', a: 'A focused regional campaign can start at around Rs 10 to 15 lakh covering radio, regional newspaper, and digital. National TV campaigns require significantly higher budgets. We design plans that make the most of whatever budget you actually have.' },
  { q: 'How do you negotiate better rates than going directly to media houses?', a: 'Volume aggregation. Because we buy media across multiple clients, we can negotiate bulk rates that an individual brand booking directly usually cannot access on its own, which typically brings your CPM down compared to a direct booking.' },
  { q: 'Can you run campaigns in regional languages?', a: 'Yes, we run campaigns in Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, and Gujarati across regional TV channels, FM stations, and newspapers. Regional language campaigns often deliver noticeably better engagement for brands targeting specific states.' },
  { q: 'How do you measure media campaign effectiveness?', a: 'We track GRPs for TV, listenership for radio, circulation and readership data for print, and viewability plus completion rate for digital. We also run brand lift studies to measure awareness and consideration shifts attributable to the campaign.' },
  { q: 'How much should I budget for traditional media versus digital?', a: 'It depends on what the campaign needs to do: traditional media like TV and print builds broad awareness and credibility, while digital lets you retarget and measure down to the click. Most brands get the best return from splitting budget across both rather than betting everything on one channel.' },
]

const CHANNELS = [
  {
    icon: 'fa-tv', name: 'Television', cpm: '₹80 to 120',
    format: '10s / 20s / 30s spots', color: '#0284c7',
    bgColor: 'rgba(2,132,199,0.12)', borderColor: 'rgba(2,132,199,0.3)',
    reach: 'Mass Reach', best: 'Mass awareness, festive launches, national brands',
    formats: ['Prime Time', 'News Breaks', 'Show Sponsorships'],
  },
  {
    icon: 'fa-radio', name: 'Radio / FM', cpm: '₹25 to 45',
    format: '30s / 60s / RJ mentions', color: '#059669',
    bgColor: 'rgba(5,150,105,0.12)', borderColor: 'rgba(5,150,105,0.3)',
    reach: 'City-Level Reach', best: 'City-level targeting, retail, events',
    formats: ['Spot Ads', 'RJ Live Reads', 'Show Sponsorships'],
  },
  {
    icon: 'fa-newspaper', name: 'Print Media', cpm: '₹40 to 80',
    format: 'Full page / half page / inserts', color: '#d97706',
    bgColor: 'rgba(217,119,6,0.12)', borderColor: 'rgba(217,119,6,0.3)',
    reach: 'Wide Readership', best: 'Launches, credibility, senior audiences',
    formats: ['Jacket Ads', 'Half Pages', 'Supplements'],
  },
  {
    icon: 'fa-video', name: 'OTT / Streaming', cpm: '₹100 to 200',
    format: 'Pre-roll / mid-roll / CTV', color: '#7c3aed',
    bgColor: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)',
    reach: 'Growing Urban Reach', best: 'Urban audience, unskippable impact',
    formats: ['Pre-roll', 'Connected TV', 'Branded Content'],
  },
  {
    icon: 'fa-chart-pie', name: 'Programmatic', cpm: '₹8 to 25',
    format: 'Display / native / video', color: '#e11d48',
    bgColor: 'rgba(225,29,72,0.12)', borderColor: 'rgba(225,29,72,0.3)',
    reach: 'Precision Reach', best: 'Retargeting, audience precision, performance',
    formats: ['Display', 'Native', 'In-app Video'],
  },
]

function ChannelMixVisual() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '15%', left: '8%', width: 450, height: 450, background: 'radial-gradient(circle, rgba(2,132,199,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '15%', right: '8%', width: 380, height: 380, background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>Media Mix Planning</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            Five Channels.{' '}
            <span className="grad-text">One Unified Strategy.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            We plan and buy across every medium your audience uses, with negotiated rates individual brands cannot access and cross-channel measurement that ties every rupee to results.
          </p>
        </div>

        {/* 5 channel cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, maxWidth: 1060, margin: '0 auto' }} className="channel-grid">
          {CHANNELS.map((ch, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${ch.borderColor}`, borderRadius: 20, padding: '22px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: ch.bgColor, border: `1px solid ${ch.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`fa-solid ${ch.icon}`} style={{ color: ch.color, fontSize: 15 }} />
                  </div>
                  <span style={{ background: ch.bgColor, border: `1px solid ${ch.borderColor}`, color: ch.color, borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-m)' }}>
                    {ch.cpm}
                  </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-h)', marginBottom: 3 }}>{ch.name}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-m)', marginBottom: 6 }}>{ch.format}</div>
                <div style={{ fontSize: 11.5, color: ch.color, fontWeight: 700 }}>{ch.reach}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {ch.formats.map((f, j) => (
                  <div key={j} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '5px 9px', fontSize: 10.5, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: ch.color, flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', background: ch.bgColor, border: `1px solid ${ch.borderColor}`, borderRadius: 10, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, color: ch.color, fontFamily: 'var(--font-m)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Best For</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{ch.best}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Planning flow */}
        <div style={{ maxWidth: 860, margin: '56px auto 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-m)', letterSpacing: 2, textTransform: 'uppercase' }}>How Every Campaign is Planned</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }} className="media-flow">
            {[
              { icon: 'fa-bullseye',      label: 'Brief & Audience'  },
              { icon: 'fa-chart-pie',     label: 'Channel Mix Plan'  },
              { icon: 'fa-handshake',     label: 'Rate Negotiation'  },
              { icon: 'fa-rocket',        label: 'Campaign Go-Live'  },
              { icon: 'fa-chart-line',    label: 'Measure & Optimize' },
            ].map((step, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(26,35,126,0.6), rgba(0,188,212,0.3))', border: '1px solid rgba(0,188,212,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`fa-solid ${step.icon}`} style={{ color: '#00bcd4', fontSize: 16 }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-m)', textAlign: 'center', maxWidth: 80 }}>{step.label}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 36, height: 1, background: 'linear-gradient(to right, rgba(0,188,212,0.4), rgba(26,35,126,0.3))', margin: '0 4px', marginBottom: 24, flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
          <div style={{ background: 'linear-gradient(135deg, #1a237e, #0284c7, #00bcd4)', color: '#fff', borderRadius: 100, padding: '14px 40px', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-h)', letterSpacing: 0.5, boxShadow: '0 8px 32px rgba(0,188,212,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-bolt" style={{ fontSize: 13 }} />
            Media Partners Across TV, Radio, Print, OTT, and Programmatic
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .channel-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 580px) { .channel-grid { grid-template-columns: 1fr 1fr !important; } .media-flow { flex-direction: column; } }
      `}</style>
    </section>
  )
}

export default function MediaAdvertisingPageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/#services">Advertising</Link><span>/</span>
            <span style={{ color: 'var(--text)' }}>Media Advertising</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'TV & Radio',   color: '#0284c7' },
              { label: 'Print & OTT',  color: '#7c3aed' },
              { label: 'Programmatic', color: '#d97706' },
            ].map((b, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${b.color}14`, border: `1px solid ${b.color}30`, borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: b.color, fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>
                <i className="fa-solid fa-signal" style={{ fontSize: 9 }} /> {b.label}
              </span>
            ))}
          </div>
          <h1 className="mt-8">Media <span className="grad-text">Advertising</span></h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            Great brands rarely get built on a single channel. ThinkSuite is a Gurgaon-based media advertising agency that plans and buys across TV, radio, print, OTT, and programmatic in-house, negotiating rates through volume buying so your budget stretches further across every channel your audience actually watches, listens to, and reads.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">Get Media Plan <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="#what-we-offer" className="btn btn-outline">See Channels <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} /></Link>
          </div>
        </div>
      </section>

      <div className={s.statsRow}>
        {[
          { number: 'Multi-Channel', label: 'TV, Radio, Print, OTT'   },
          { number: 'In-House',      label: 'Media Planning Team'     },
          { number: 'Negotiated',    label: 'Rates via Volume Buying' },
          { number: '360°',          label: 'Campaign View'           },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      <ChannelMixVisual />

      <section id="what-we-offer" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Offer</span>
            <h2 style={{ marginTop: 12 }}>Our <span className="grad-text">Media Advertising Capabilities</span></h2>
          </div>
          <div className={s.capGrid}>
            {CAPS.map((cap, i) => (
              <div key={i} className={`${s.capCard} reveal`} style={{ transitionDelay: `${i * 0.07}s` }}>
                <span className={s.capMetric}>{cap.metric}</span>
                <div className={s.capIconWrap}><i className={`fa-solid ${cap.icon}`} /></div>
                <div className={s.capTitle}>{cap.title}</div>
                <p className={s.capDesc}>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">Who We Work With</span>
            <h2 style={{ marginTop: 12 }}>Any Industry. Any Scale. <span className="grad-text">Any Need.</span></h2>
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
            {[
              { icon: 'fa-bag-shopping',  name: 'FMCG and Consumer Goods',  useCase: 'Mass reach TV campaigns during cricket and prime time, regional language radio for tier-2 rollouts, and OTT targeting urban millennials for premium products.', tags: ['TV Mass Reach', 'Regional Radio', 'OTT Targeting'] },
              { icon: 'fa-building',      name: 'Real Estate',               useCase: 'Sunday newspaper full-pages during project launch, FM radio geo-targeting near project locations, and OTT video ads targeting investors and home buyer segments.', tags: ['Newspaper Launch', 'FM Geo-targeting', 'OTT Investors'] },
              { icon: 'fa-graduation-cap', name: 'Education and Coaching',   useCase: 'Admission season newspaper inserts, radio reminders around exam periods, and YouTube pre-roll targeting students by interest and location ahead of enrollment.', tags: ['Admission Season', 'Radio Reminders', 'YouTube Students'] },
              { icon: 'fa-hospital',      name: 'Healthcare and Pharma',     useCase: 'OTC product radio campaigns, health publication print placements, and OTT health content targeting reaching caregivers and patients in a relevant media context.', tags: ['OTC Radio', 'Health Publications', 'OTT Health Context'] },
              { icon: 'fa-car',           name: 'Auto and Mobility',         useCase: 'TV campaigns during sport and business shows targeting buyers aged 25 to 45, digital radio for in-car listening, and programmatic retargeting of car comparison website visitors.', tags: ['TV Sports Shows', 'Digital Radio', 'In-Market Retargeting'] },
              { icon: 'fa-mobile-screen', name: 'Telecom and Consumer Tech', useCase: 'Prime time TV for product launches, cricket IPL spots for maximum national reach, OTT connected TV for urban households, and programmatic for performance campaigns.', tags: ['IPL Spots', 'Prime Time Launch', 'Connected TV'] },
            ].map((ind, i) => (
              <div key={i} className={`${s.indCard} reveal`} style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className={s.indIcon}><i className={`fa-solid ${ind.icon}`} /></div>
                <div className={s.indName}>{ind.name}</div>
                <p className={s.indUseCase}>{ind.useCase}</p>
                <div className={s.indTags}>{ind.tags.map((tag, j) => <span key={j} className={s.indTag}>{tag}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">How We Work</span>
            <h2 style={{ marginTop: 12 }}>Our <span className="grad-text">4-Step Process</span></h2>
          </div>
          <div className={s.processRow}>
            {[
              { title: 'Brief and Audience Definition', desc: 'Understand campaign goals, target demographics, geography, budget, and timing to create the right media mix.' },
              { title: 'Media Plan and Negotiation',    desc: 'Build a reach-frequency optimized media plan and negotiate the best rates across selected channels and vendors.' },
              { title: 'Creative Coordination and Go-Live', desc: 'Coordinate creative assets for each medium, ensure format compliance, schedule campaigns, and confirm go-live.' },
              { title: 'Monitor and Optimize',          desc: 'Track delivery, audience exposure, and response metrics. Shift budgets mid-campaign to the channels outperforming the plan.' },
            ].map((step, i) => (
              <div key={i} className={`${s.processItem} reveal`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className={s.processCircle}>{i + 1}</div>
                <div className={s.processTitle}>{step.title}</div>
                <p className={s.processDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">Common Questions</span>
            <h2 style={{ marginTop: 12 }}>Frequently Asked <span className="grad-text">Questions</span></h2>
          </div>
          <div className={s.faqInner}>
            {FAQS.map((faq, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <div className="faq-q" role="button" tabIndex={0} onClick={() => setOpenFaq(openFaq === i ? null : i)} onKeyDown={(e) => e.key === 'Enter' && setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}<i className="fa-solid fa-chevron-down" />
                </div>
                <div className="faq-a"><div className="faq-a-inner">{faq.a}</div></div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, fontFamily: 'var(--font-m)', letterSpacing: 1 }}>EXPLORE RELATED SERVICES</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Outdoor Advertising', href: '/outdoor-advertising' },
                { label: 'Indoor Advertising',  href: '/indoor-advertising'  },
                { label: 'Google and Meta Ads', href: '/google-meta-ads'     },
                { label: 'PR Campaigns',        href: '/pr-campaigns'        },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Work Together"
        title="Make Your Brand"
        titleHighlight="Impossible to Ignore"
        subtitle="The best media plans reach the right people at the right time across the channels they actually use. We build those plans and manage them from start to results."
      />
    </>
  )
}
