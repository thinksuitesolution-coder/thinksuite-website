'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import s from '@/components/pages/ServicePageDashboard.module.css'

const SEO_CAPS = [
  { icon: 'fa-code',             metric: 'Core Web Vitals', title: 'Technical SEO Audit',    desc: 'Deep crawl fixing site speed, Core Web Vitals, crawlability, structured data, and indexing issues.' },
  { icon: 'fa-file-lines',       metric: 'Intent-Matched',  title: 'On-Page Optimization',   desc: 'Keyword research, meta optimization, content structure, heading hierarchy, and internal linking strategy.' },
  { icon: 'fa-link',             metric: 'White-Hat',       title: 'Link Building',          desc: 'High-authority backlinks via digital PR, guest posting, and white-hat outreach, zero spam, zero risk.' },
  { icon: 'fa-map-location-dot', metric: 'Map Pack',        title: 'Local SEO',              desc: 'Google Business Profile optimization, local citations, review strategy, and map pack visibility.' },
  { icon: 'fa-pen-to-square',    metric: 'Intent-Driven',   title: 'SEO Content Strategy',   desc: 'Keyword-driven content calendars that capture search intent at every stage of the funnel.' },
  { icon: 'fa-chart-line',       metric: 'Monthly',         title: 'Rank Tracking & Reports', desc: 'Detailed monthly rank reports, traffic analytics, and competitor benchmarking, full visibility.' },
]

const GEO_CAPS = [
  { icon: 'fa-robot',                metric: 'AI-First', title: 'AI Search Optimization',   desc: 'Restructure content so ChatGPT, Gemini, Perplexity, and other LLMs surface your brand in answers.' },
  { icon: 'fa-award',                metric: 'E-E-A-T',  title: 'Authority & Trust Signals', desc: 'Build E-E-A-T signals, Experience, Expertise, Authoritativeness, Trustworthiness, that AI engines favor.' },
  { icon: 'fa-quote-left',           metric: 'Cited',    title: 'Citation Optimization',     desc: 'Get your brand cited in AI-generated answers through structured content and authoritative sourcing.' },
  { icon: 'fa-database',             metric: 'Schema',   title: 'Structured Data for AI',    desc: 'Advanced schema markup that helps AI engines understand, trust, and accurately cite your content.' },
  { icon: 'fa-bullhorn',             metric: 'Brand',    title: 'Brand Mention Strategy',    desc: 'Proactive PR and content strategy to increase brand mentions across the web AI models train on.' },
  { icon: 'fa-magnifying-glass-chart', metric: 'Track', title: 'AI Answer Monitoring',       desc: 'Track how AI engines describe your brand and competitors, catch gaps and capitalize on opportunities.' },
]

const FAQS = [
  { q: 'What is GEO and how is it different from SEO?', a: 'GEO, Generative Engine Optimization, is the practice of structuring your brand\'s content and data so AI tools like ChatGPT, Gemini, and Perplexity cite you directly in their answers. Traditional SEO targets Google\'s blue-link results instead. A fast-growing share of searches now happen through AI assistants rather than a search bar, so a brand invisible to GEO is invisible to that entire audience.' },
  { q: 'Do I need both SEO and GEO, or can I choose one?', a: 'You need both. SEO and GEO reach different moments in the customer journey. Google searches happen when people are ready to compare and buy, while AI assistants get used earlier, for research and recommendations. Missing either channel means handing those customers straight to a competitor who shows up in both places.' },
  { q: 'How long does SEO take to show results?', a: 'SEO results typically start becoming visible in 3 to 4 months, with more significant traffic growth building over 6 to 12 months. GEO visibility can emerge faster, often in 1 to 3 months, since AI models refresh their training and retrieval sources more frequently, though the exact timeline depends on your brand\'s existing authority online.' },
  { q: 'How do you optimize a website for ChatGPT, Gemini, and Perplexity?', a: 'GEO involves creating authoritative, well-structured content that AI engines can understand and trust. We focus on E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness), structured data markup, brand mention campaigns, and making sure your content is discoverable on the sources AI models draw from, like Wikipedia, Reddit, and major publications.' },
  { q: 'Can you guarantee first-page rankings or AI citations?', a: 'No ethical agency can guarantee specific rankings, because search and AI algorithms change constantly and no agency controls them. What we do commit to is a transparent, proven methodology and honest monthly reporting on your Google rankings, organic traffic, and AI brand visibility so you always know where things stand.' },
  { q: 'How much do your SEO and GEO packages cost?', a: 'Our combined SEO and GEO packages start from ₹20,000 per month, depending on industry competitiveness, website size, and goals. Contact us for a free audit and a custom quote tailored to your business.' },
  { q: 'What does a technical SEO audit actually check?', a: 'A technical SEO audit checks Core Web Vitals and page speed, crawlability and indexing status, mobile usability, structured data and schema markup, XML sitemaps, and internal linking structure. We flag every issue by priority so you know exactly what is costing you rankings versus what is a minor cleanup.' },
  { q: 'Do you handle local SEO for businesses with a physical location?', a: 'Yes. Local SEO is one of our core SEO capabilities: Google Business Profile optimization, local citation building, review strategy, and map pack visibility. It is especially valuable for service businesses and multi-location brands competing for "near me" searches.' },
  { q: 'Is GEO a replacement for SEO, or does it work alongside it?', a: "GEO doesn't replace SEO, it works alongside it. SEO earns you visibility on Google's search results page, while GEO earns you citations inside ChatGPT, Gemini, and Perplexity answers. Both rely on overlapping fundamentals, quality content, structured data, and topical authority, but success in one doesn't automatically transfer to the other, which is why we run them as parallel workstreams." },
  { q: 'How long does SEO take to work?', a: 'It depends heavily on your starting point. A brand with zero online history takes longer than one refreshing an already-indexed, reasonably authoritative site. As a rule of thumb, expect initial movement in 6 to 10 weeks for easier keywords, with the bulk of ranking gains landing in the 3 to 6 month range once backlinks and content depth build up.' },
  { q: 'Do you work with early-stage startups on SEO?', a: 'Yes, a good share of our SEO and GEO clients are early-stage startups building organic visibility from scratch. We prioritize differently for a startup than for an established brand: quicker-win, lower-competition keywords first, alongside GEO groundwork so the brand starts appearing in AI answers even before Google rankings mature.' },
]

function EngineVisual() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Ambient glow blobs */}
      <div aria-hidden style={{
        position: 'absolute', top: '20%', left: '15%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(26,35,126,0.18) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: '20%', right: '15%',
        width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>
            How It Works
          </span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            One Goal.{' '}
            <span className="grad-text">Two Discovery Engines.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            Today, your customers find you on <strong style={{ color: 'rgba(255,255,255,0.75)' }}>Google</strong> AND through{' '}
            <strong style={{ color: 'rgba(255,255,255,0.75)' }}>AI assistants</strong>. We optimize for both, so you&apos;re never invisible.
          </p>
        </div>

        {/* Two Engine Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 64px 1fr',
          gap: 0,
          alignItems: 'stretch',
          maxWidth: 960,
          margin: '0 auto',
        }}
          className="engine-grid"
        >
          {/* ── SEO Engine ─────────────────────────────────── */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '28px 28px 24px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          }}>
            {/* Engine label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #4285F4, #34A853)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 900, color: '#fff',
              }}>G</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Search Engine</div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'var(--font-m)', letterSpacing: 1, textTransform: 'uppercase' }}>Traditional SEO</div>
              </div>
            </div>

            {/* Mock Google search bar */}
            <div style={{
              border: '1.5px solid #e2e8f0',
              borderRadius: 100,
              padding: '9px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="10.5" cy="10.5" r="6.5" stroke="#4285F4" strokeWidth="2.2" />
                <path d="M15.5 15.5l3.5 3.5" stroke="#4285F4" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 12, color: '#3c4043', flex: 1 }}>best digital marketing agency india</span>
              <span style={{ fontSize: 10, color: '#4285F4', fontWeight: 700, fontFamily: 'var(--font-m)' }}>Search</span>
            </div>

            {/* Mock search results */}
            {[
              { domain: 'thinksuite.in › services', title: 'ThinkSuite, Digital Agency India', snippet: 'In-house SEO, AI automation, and ad strategy built for businesses ready to scale their organic presence.', highlighted: true },
              { domain: 'competitor.co › marketing', title: 'Best Agency Services, Competitor Co', snippet: 'Digital marketing for startups and enterprises...' },
              { domain: 'anotherco.in › digital', title: 'Full-Service Digital Marketing India', snippet: 'SEO, PPC and social media management services...' },
            ].map((r, i) => (
              <div key={i} style={{
                marginBottom: 14,
                paddingBottom: 14,
                borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none',
                opacity: i === 0 ? 1 : 0.55,
              }}>
                <div style={{ fontSize: 10.5, color: '#00802a', marginBottom: 1, fontFamily: 'var(--font-m)' }}>{r.domain}</div>
                <div style={{ fontSize: 13, color: '#1a0dab', fontWeight: 600, marginBottom: 3 }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: '#4d5156', lineHeight: 1.55 }}>{r.snippet}</div>
              </div>
            ))}

            {/* Outcome pill */}
            <div style={{
              marginTop: 8,
              background: 'linear-gradient(135deg, rgba(26,35,126,0.06), rgba(0,188,212,0.06))',
              border: '1px solid rgba(26,35,126,0.12)',
              borderRadius: 10,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <i className="fa-solid fa-arrow-trend-up" style={{ color: '#059669', fontSize: 13 }} />
              <span style={{ fontSize: 12, color: '#1a237e', fontWeight: 600 }}>Organic Traffic → Your Website</span>
            </div>
          </div>

          {/* ── Center Connector ───────────────────────────── */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}>
            <div aria-hidden style={{ flex: 1, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(0,188,212,0.4))', minHeight: 40 }} />
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a237e, #00bcd4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 22, fontWeight: 900,
              boxShadow: '0 0 24px rgba(0,188,212,0.35)',
              flexShrink: 0,
            }}>+</div>
            <div aria-hidden style={{ flex: 1, width: 1, background: 'linear-gradient(to bottom, rgba(139,92,246,0.4), transparent)', minHeight: 40 }} />
          </div>

          {/* ── GEO Engine ─────────────────────────────────── */}
          <div style={{
            background: 'linear-gradient(145deg, #130b2e, #0d1630)',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: 20,
            padding: '28px 28px 24px',
            boxShadow: '0 24px 64px rgba(139,92,246,0.15)',
          }}>
            {/* Engine label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>✨</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>AI Assistant</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-m)', letterSpacing: 1, textTransform: 'uppercase' }}>Generative Engine (GEO)</div>
              </div>
              {/* Traffic lights */}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
                {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                  <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                ))}
              </div>
            </div>

            {/* User chat bubble */}
            <div style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px 14px 14px 4px',
              padding: '10px 14px',
              fontSize: 12,
              color: 'rgba(255,255,255,0.65)',
              marginBottom: 12,
              lineHeight: 1.6,
            }}>
              Which marketing agency should I use for SEO?
            </div>

            {/* AI response bubble */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: '4px 14px 14px 14px',
              padding: '12px 14px',
              fontSize: 12,
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.75,
              marginBottom: 14,
            }}>
              Based on authority signals and structured content,{' '}
              <strong style={{ color: '#c4b5fd' }}>ThinkSuite</strong> is an
              in-house agency offering SEO and GEO services for
              businesses worldwide, handling strategy and execution end to end.
              <div style={{
                marginTop: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 10,
                color: 'rgba(167,139,250,0.7)',
                borderTop: '1px solid rgba(124,58,237,0.15)',
                paddingTop: 8,
              }}>
                <i className="fa-solid fa-link" style={{ fontSize: 9 }} />
                <span>Source: thinksuite.in</span>
              </div>
            </div>

            {/* AI engines row */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {['ChatGPT', 'Gemini', 'Perplexity', 'Claude'].map(ai => (
                <div key={ai} style={{
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: 9.5,
                  color: 'rgba(196,181,253,0.8)',
                  fontFamily: 'var(--font-m)',
                  letterSpacing: 0.5,
                }}>
                  {ai}
                </div>
              ))}
            </div>

            {/* Outcome pill */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 10,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <i className="fa-solid fa-brain" style={{ color: '#a78bfa', fontSize: 13 }} />
              <span style={{ fontSize: 12, color: '#c4b5fd', fontWeight: 600 }}>AI Citation → Brand Authority</span>
            </div>
          </div>
        </div>

        {/* Convergence node */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a237e, #7c3aed, #00bcd4)',
            backgroundSize: '200% 200%',
            color: '#fff',
            borderRadius: 100,
            padding: '14px 40px',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: 'var(--font-h)',
            letterSpacing: 0.5,
            boxShadow: '0 8px 32px rgba(0,188,212,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <i className="fa-solid fa-bolt" style={{ fontSize: 13 }} />
            Your Brand Gets Found, Everywhere, Every Time
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .engine-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes capFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

function CapabilityTabs() {
  const [active, setActive] = useState<'seo' | 'geo'>('seo')
  const caps = active === 'seo' ? SEO_CAPS : GEO_CAPS

  return (
    <section id="what-we-offer" className="section section-tinted">
      <div className="container">
        <div className="title-block center">
          <span className="label">What We Offer</span>
          <h2 style={{ marginTop: 12 }}>
            Our <span className="grad-text">Full Optimization Stack</span>
          </h2>
          <p style={{ color: 'var(--text2)', maxWidth: 480, margin: '12px auto 0', fontSize: 14.5, lineHeight: 1.75 }}>
            Choose your view, switch between our traditional SEO capabilities and our AI-search GEO strategies.
          </p>
        </div>

        {/* Toggle pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36, marginBottom: 4 }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 100,
            padding: 5,
            display: 'flex',
            gap: 4,
            boxShadow: 'var(--shadow)',
          }}>
            {(['seo', 'geo'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                style={{
                  padding: '10px 28px',
                  borderRadius: 100,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-h)',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 0.5,
                  transition: 'all 0.3s ease',
                  background: active === tab
                    ? tab === 'seo'
                      ? 'linear-gradient(135deg, #1a237e, #00bcd4)'
                      : 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                    : 'transparent',
                  color: active === tab ? '#fff' : 'var(--text2)',
                  boxShadow: active === tab ? '0 4px 16px rgba(26,35,126,0.25)' : 'none',
                }}
              >
                {tab === 'seo' ? (
                  <><i className="fa-brands fa-google" style={{ marginRight: 7, fontSize: 12 }} />SEO</>
                ) : (
                  <><i className="fa-solid fa-robot" style={{ marginRight: 7, fontSize: 12 }} />GEO</>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Subtitle under toggle */}
        <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--text2)', fontFamily: 'var(--font-m)', letterSpacing: 0.5, marginBottom: 0 }}>
          {active === 'seo'
            ? 'Rank higher on Google & Bing, drive organic traffic'
            : 'Get cited by ChatGPT, Gemini & Perplexity, build AI authority'}
        </p>

        <div className={s.capGrid}>
          {caps.map((cap, i) => (
            <div
              key={`${active}-${i}`}
              className={s.capCard}
              style={{
                animation: 'capFadeUp 0.45s ease both',
                animationDelay: `${i * 0.07}s`,
                borderTop: active === 'geo' ? '2px solid rgba(124,58,237,0.3)' : undefined,
              }}
            >
              <span className={s.capMetric}
                style={active === 'geo' ? {
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                } : undefined}
              >{cap.metric}</span>
              <div className={s.capIconWrap}
                style={active === 'geo' ? {
                  background: 'rgba(124,58,237,0.08)',
                  borderColor: 'rgba(124,58,237,0.18)',
                  color: '#a78bfa',
                } : undefined}
              >
                <i className={`fa-solid ${cap.icon}`} />
              </div>
              <div className={s.capTitle}>{cap.title}</div>
              <p className={s.capDesc}>{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function SeoGeoPageContent() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildServiceSchema({
              name: 'SEO and GEO Optimization',
              description: 'SEO and Generative Engine Optimization for businesses worldwide, ranking on Google and getting cited by ChatGPT, Gemini, and Perplexity.',
              url: 'https://thinksuite.in/seo-optimization',
              serviceType: 'SEO Agency',
              keywords: ['SEO agency', 'SEO services', 'SEO and GEO optimization agency'],
            })
          ),
        }}
      />
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/digital-marketing">Digital Marketing</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>SEO + GEO Optimization</span>
          </div>

          {/* Dual badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i className="fa-brands fa-google" style={{ fontSize: 11 }} /> SEO
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.1))',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 100, padding: '4px 14px',
              fontSize: 11, fontWeight: 700, color: '#7c3aed',
              fontFamily: 'var(--font-m)', letterSpacing: 1.5, textTransform: 'uppercase',
            }}>
              <i className="fa-solid fa-robot" style={{ fontSize: 11 }} /> GEO
            </span>
          </div>

          <h1 className="mt-8">
            SEO & <span className="grad-text">GEO Optimization</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            Rank on Google. Get cited by AI. Two discovery engines, one unified strategy, built for the way people actually search today.
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

      {/* ── STATS STRIP ──────────────────────────────────────────── */}
      <div className={s.statsRow}>
        {[
          { number: 'SEO + GEO', label: 'Combined Strategy'      },
          { number: '4+',        label: 'AI Engines We Target'   },
          { number: 'In-House',  label: 'Team, Working Worldwide' },
          { number: '2',         label: 'Discovery Engines Covered' },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── CREATIVE TWO ENGINES VISUAL ──────────────────────────── */}
      <EngineVisual />

      {/* ── CAPABILITIES (TABBED: SEO / GEO) ─────────────────────── */}
      <CapabilityTabs />

      {/* ── COMPARISON TABLE ─────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">SEO vs GEO</span>
            <h2 style={{ marginTop: 12 }}>
              Understanding the <span className="grad-text">Difference</span>
            </h2>
          </div>

          <div style={{
            maxWidth: 800, margin: '48px auto 0',
            border: '1px solid var(--border)',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
          }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
            }}>
              {['', 'SEO', 'GEO'].map((h, i) => (
                <div key={i} style={{
                  padding: '16px 20px',
                  fontFamily: 'var(--font-h)',
                  fontSize: 13, fontWeight: 700,
                  color: i === 0 ? 'var(--text2)' : i === 1 ? 'var(--cyan)' : '#a78bfa',
                  borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}>
                  {i === 1 && <i className="fa-brands fa-google" style={{ fontSize: 12 }} />}
                  {i === 2 && <i className="fa-solid fa-robot" style={{ fontSize: 12 }} />}
                  {h}
                </div>
              ))}
            </div>

            {/* Table rows */}
            {[
              ['Target Platform',  'Google, Bing, Yahoo',           'ChatGPT, Gemini, Perplexity'],
              ['Visibility Type',  'Blue-link search results',      'AI-generated answers'],
              ['Success Metric',   'Rankings & organic traffic',    'Citations & brand mentions'],
              ['Timeline',         '3 to 6 months typical',         '1 to 3 months (emerging fast)'],
              ['Core Technique',   'Keywords + backlinks + tech',   'Authority + structure + E-E-A-T'],
              ['Why It Matters',   'Still the majority of searches', 'Fast-growing share of searches'],
            ].map(([label, seo, geo], i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                borderBottom: i < 5 ? '1px solid var(--border)' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(26,35,126,0.015)',
              }}>
                <div style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text2)', borderRight: '1px solid var(--border)', fontFamily: 'var(--font-m)' }}>
                  {label}
                </div>
                <div style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text)', borderRight: '1px solid var(--border)', lineHeight: 1.5 }}>
                  {seo}
                </div>
                <div style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                  {geo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────── */}
      <section className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">How We Work</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">Unified 4-Step Process</span>
            </h2>
          </div>
          <div className={s.processRow}>
            {[
              { title: 'Audit Both Channels', desc: 'Technical SEO crawl + AI visibility snapshot, we baseline your current presence on Google and AI search engines.' },
              { title: 'Keyword & Prompt Strategy', desc: 'Keyword research for Google rankings alongside query and topic mapping for AI assistant answers.' },
              { title: 'Optimize & Create', desc: 'On-page SEO fixes, structured data, content written for both human readers and AI comprehension.' },
              { title: 'Track & Dominate', desc: 'Monthly reports on Google rankings, organic traffic, and AI citation frequency, with continuous refinement.' },
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

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">Common Questions</span>
            <h2 style={{ marginTop: 12 }}>
              Frequently Asked <span className="grad-text">Questions</span>
            </h2>
          </div>
          <div className={s.faqInner}>
            {FAQS.map((faq, i) => (
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
              {[
                { label: 'Social Media Marketing', href: '/social-media-marketing' },
                { label: 'Google & Meta Ads',       href: '/google-meta-ads'        },
                { label: 'Content Marketing',        href: '/content-marketing'      },
                { label: 'AI Marketing Systems',     href: '/ai-marketing-systems'   },
              ].map(l => (
                <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Work Together"
        title="Dominate Google"
        titleHighlight="& AI Search"
        subtitle="Stop being invisible, on Google and in AI answers. Our SEO + GEO strategy puts your brand in front of customers wherever they search."
      />
    </>
  )
}
