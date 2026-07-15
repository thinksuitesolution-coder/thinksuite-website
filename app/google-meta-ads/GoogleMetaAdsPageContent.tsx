'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import s from '@/components/pages/ServicePageDashboard.module.css'

const GOOGLE_CAPS = [
  { icon: 'fa-magnifying-glass',   metric: '#1',     title: 'Search Ads',                desc: 'High-intent keyword campaigns that capture buyers the moment they search. Negative keyword lists, match types, and Quality Score optimization.' },
  { icon: 'fa-display',            metric: 'Reach',  title: 'Display & YouTube',          desc: 'Visual brand campaigns across Google Display Network and YouTube pre-roll. Reach customers who match your ideal buyer profile.' },
  { icon: 'fa-bag-shopping',       metric: 'ROAS',   title: 'Shopping Ads',               desc: 'Product feed optimization and Smart Shopping campaigns for e-commerce brands. Show your products to buyers with purchase intent.' },
  { icon: 'fa-bolt',               metric: 'AI',     title: 'Performance Max',            desc: "Google's AI-driven campaign type that automatically serves ads across Search, Display, YouTube, Gmail and Maps from one campaign." },
  { icon: 'fa-sliders',            metric: 'Live',   title: 'Bid Optimization',           desc: 'Real-time Smart Bidding strategies, Target CPA, Target ROAS, Maximize Conversions, aligned to your specific business goal.' },
  { icon: 'fa-chart-column',       metric: 'Full',   title: 'Conversion Tracking',        desc: 'Pixel setup, GA4 integration, call tracking, and goal verification so every rupee of spend is attributed to a real business outcome.' },
]

const META_CAPS = [
  { icon: 'fa-f',                  metric: 'Precise',   title: 'Facebook Ads',               desc: 'Detailed demographic and interest targeting on the world\'s largest social network. Reach decision-makers, homeowners, and niche audiences with precision.' },
  { icon: 'fa-instagram',          metric: 'Visual', title: 'Instagram Ads',              desc: 'High-impact image and carousel ads in feed and explore. Visual-first format ideal for fashion, lifestyle, food, real estate, and premium brands.' },
  { icon: 'fa-film',               metric: 'Engage', title: 'Reels & Story Ads',          desc: 'Full-screen vertical video ads in Reels and Stories, the highest-engagement placements on Meta with a native feel that doesn\'t look like an ad.' },
  { icon: 'fa-users',              metric: 'LAL',    title: 'Lookalike Audiences',        desc: 'Build audiences that mirror your best customers using Meta\'s AI. Scale campaigns to new prospects who behave like your highest-value buyers.' },
  { icon: 'fa-rotate-left',        metric: 'Retarget',    title: 'Retargeting',                desc: 'Re-engage website visitors, video viewers, and catalog browsers with personalized sequences. Keep your brand visible until the people who did not convert on their first visit come back ready to buy.' },
  { icon: 'fa-flask',              metric: 'Weekly', title: 'Creative Testing',           desc: 'Systematic A/B testing of headlines, visuals, CTAs, and formats. Weekly iteration so your creatives compound in performance every month.' },
]

const FAQS = [
  { q: 'What is the minimum monthly ad budget you recommend?', a: 'For Google Search Ads in India, we recommend a minimum of ₹20,000 to ₹30,000 a month to get statistically meaningful data. For Meta Ads, ₹15,000 a month is a workable starting point. These figures are ad spend, separate from our management fees, and we adjust the recommended minimum based on your market and platform costs if you are advertising outside India.' },
  { q: 'How long before we see results from Google Ads?', a: 'Google Search Ads can generate leads within the first week if your landing page and offer are solid. Optimization typically takes 2 to 4 weeks to show compounding improvements as we accumulate real conversion data and refine targeting.' },
  { q: 'What is the difference between Google Ads and Meta Ads?', a: 'Google captures demand: your ads appear when someone is actively searching for what you offer. Meta creates demand: your ads interrupt the scroll and build awareness before someone even knows they need you. Together they cover the full marketing funnel, from first discovery to final decision.' },
  { q: 'Do you manage both Google and Meta Ads or just one?', a: 'We manage both, and running both together is almost always more effective because the two platforms work at different funnel stages. Google closes buyers who are already looking. Meta builds the interest that eventually turns into a Google search.' },
  { q: 'Who owns the ad accounts?', a: 'You always own your Google Ads and Meta Business Manager accounts, we simply request admin access to run campaigns. If you ever stop working with us, your full history, audiences, and conversion data stay in your accounts. There is no lock-in.' },
  { q: 'How do you report results?', a: 'You get a live dashboard connected to both accounts that you can check any time you want. We also send a weekly written report covering spend, impressions, clicks, leads, cost per acquisition, and return on ad spend, along with our analysis and next week\'s plan.' },
  { q: "What's included in your PPC management service?", a: "Our PPC management covers campaign structure and keyword strategy, ad copywriting and creative, bid strategy and budget pacing, conversion tracking setup, negative keyword maintenance, and weekly performance reporting. It's a full management service, not just bid adjustments, we own the account's performance end to end." },
  { q: 'How is Google Ads management different for a small business versus a large enterprise?', a: 'Small business accounts need tighter budget discipline since every rupee of wasted spend matters more proportionally. We focus on narrower, higher-intent keyword sets and stricter negative keyword lists rather than broad-match campaigns built for enterprise budgets that can afford to test wide before narrowing down.' },
  { q: 'How is your management fee structured for Facebook and Instagram ads?', a: 'We quote management fees separately from your ad spend, usually a flat monthly retainer or a percentage of managed spend depending on account size. Your ad budget goes entirely into the platform, we never take a hidden markup on media spend, and we share the exact fee structure after understanding your target budget.' },
  { q: 'What is a good ROAS for Meta ads?', a: 'It depends entirely on your margins, a 2x ROAS might be excellent for a low-margin FMCG brand and unprofitable for a premium product with thin unit economics. As a general benchmark, most e-commerce brands target 3x to 4x ROAS to cover product cost, ad spend, and operations, but we calculate your specific breakeven ROAS before setting any target.' },
  { q: 'Google Ads vs Facebook Ads, which is better for lead generation?', a: "Google Ads generally wins for lead generation because it captures people already searching with intent, someone typing 'best CRM for small business' is closer to converting than someone scrolling Instagram. Meta ads can still generate leads well through lead forms and retargeting, but they usually work best as a complement that builds the awareness Google Search later converts." },
]

function PlatformVisual() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Ambient glows */}
      <div aria-hidden style={{
        position: 'absolute', top: '20%', left: '12%',
        width: 420, height: 420,
        background: 'radial-gradient(circle, rgba(66,133,244,0.14) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: '20%', right: '12%',
        width: 380, height: 380,
        background: 'radial-gradient(circle, rgba(24,119,242,0.14) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>
            How It Works
          </span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            One Strategy.{' '}
            <span className="grad-text">Two Powerful Platforms.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 540, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            <strong style={{ color: 'rgba(255,255,255,0.75)' }}>Google Ads</strong> captures buyers who are ready.{' '}
            <strong style={{ color: 'rgba(255,255,255,0.75)' }}>Meta Ads</strong> creates awareness in those who will be.
            We run both, so you own the full funnel.
          </p>
        </div>

        {/* Two Platform Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 64px 1fr',
            gap: 0,
            alignItems: 'stretch',
            maxWidth: 980,
            margin: '0 auto',
          }}
          className="platform-grid"
        >
          {/* ── Google Ads Card ───────────────────────────────── */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '28px 28px 24px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          }}>
            {/* Platform label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #4285F4, #34A853)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 900, color: '#fff',
              }}>G</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Google Ads</div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'var(--font-m)', letterSpacing: 1, textTransform: 'uppercase' }}>Search · Display · YouTube</div>
              </div>
              <div style={{
                marginLeft: 'auto', background: '#e8f0fe', borderRadius: 6,
                padding: '3px 8px', fontSize: 10, fontWeight: 700, color: '#1967d2',
                fontFamily: 'var(--font-m)',
              }}>Certified Partner</div>
            </div>

            {/* Mock Google search bar */}
            <div style={{
              border: '1.5px solid #e2e8f0', borderRadius: 100,
              padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="10.5" cy="10.5" r="6.5" stroke="#4285F4" strokeWidth="2.2" />
                <path d="M15.5 15.5l3.5 3.5" stroke="#4285F4" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 12, color: '#3c4043', flex: 1 }}>best digital marketing agency india</span>
              <span style={{ fontSize: 10, color: '#4285F4', fontWeight: 700, fontFamily: 'var(--font-m)' }}>Search</span>
            </div>

            {/* Sponsored Results */}
            {[
              { domain: 'thinksuite.in › ads', title: 'ThinkSuite, Google Certified PPC Agency', snippet: 'In-house team managing Google and Meta Ads for brands worldwide. Free campaign audit.', sponsored: true, highlight: true },
              { domain: 'competitor.co › ppc',  title: 'PPC Management Services, Competitor Co', snippet: 'Run Google Ads campaigns for your business...', sponsored: true, highlight: false },
              { domain: 'anotherco.in › ads',   title: 'Google Ads Management, AnotherCo',      snippet: 'Expert paid search campaigns for startups...', sponsored: false, highlight: false },
            ].map((r, i) => (
              <div key={i} style={{
                marginBottom: 12, paddingBottom: 12,
                borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none',
                opacity: i === 0 ? 1 : 0.45,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  {r.sponsored && (
                    <span style={{ fontSize: 9, border: '1px solid #70757a', borderRadius: 3, padding: '1px 4px', color: '#70757a', fontFamily: 'var(--font-m)' }}>Sponsored</span>
                  )}
                  <span style={{ fontSize: 10.5, color: '#00802a', fontFamily: 'var(--font-m)' }}>{r.domain}</span>
                </div>
                <div style={{ fontSize: 13, color: '#1a0dab', fontWeight: 600, marginBottom: 3 }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: '#4d5156', lineHeight: 1.55 }}>{r.snippet}</div>
              </div>
            ))}

            {/* Outcome */}
            <div style={{
              marginTop: 8, background: 'linear-gradient(135deg, rgba(66,133,244,0.06), rgba(52,168,83,0.06))',
              border: '1px solid rgba(66,133,244,0.15)', borderRadius: 10, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <i className="fa-solid fa-arrow-trend-up" style={{ color: '#059669', fontSize: 13 }} />
              <span style={{ fontSize: 12, color: '#1967d2', fontWeight: 600 }}>High-Intent Clicks → Your Landing Page</span>
            </div>
          </div>

          {/* ── Center Connector ─────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div aria-hidden style={{ flex: 1, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(0,188,212,0.4))', minHeight: 40 }} />
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a237e, #00bcd4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 22, fontWeight: 900,
              boxShadow: '0 0 24px rgba(0,188,212,0.35)', flexShrink: 0,
            }}>+</div>
            <div aria-hidden style={{ flex: 1, width: 1, background: 'linear-gradient(to bottom, rgba(24,119,242,0.4), transparent)', minHeight: 40 }} />
          </div>

          {/* ── Meta Ads Card ─────────────────────────────────── */}
          <div style={{
            background: 'linear-gradient(145deg, #0a1628, #0f1f3d)',
            border: '1px solid rgba(24,119,242,0.3)',
            borderRadius: 20, padding: '28px 28px 24px',
            boxShadow: '0 24px 64px rgba(24,119,242,0.15)',
          }}>
            {/* Platform label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #1877f2, #e1306c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="fa-brands fa-meta" style={{ color: '#fff', fontSize: 16 }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Meta Ads</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-m)', letterSpacing: 1, textTransform: 'uppercase' }}>Facebook · Instagram · Reels</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
                {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                  <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                ))}
              </div>
            </div>

            {/* Mock Facebook feed ad */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, overflow: 'hidden', marginBottom: 14,
            }}>
              {/* Ad header */}
              <div style={{ padding: '12px 14px 0', display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a237e, #00bcd4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0,
                }}>TS</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>ThinkSuite</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>Sponsored</span>
                    <i className="fa-solid fa-earth-asia" style={{ fontSize: 9 }} />
                  </div>
                </div>
                <i className="fa-solid fa-ellipsis" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }} />
              </div>

              {/* Ad copy */}
              <div style={{ padding: '10px 14px 10px', fontSize: 12.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
                Stop wasting your ad budget. Our PPC specialists build <strong style={{ color: '#fff' }}>Google & Meta</strong> campaigns with full spend transparency. 🚀
              </div>

              {/* Ad creative placeholder */}
              <div style={{
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 40%, #1565c0 70%, #00bcd4 100%)',
                height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 4,
              }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-h)' }}>Every Rupee, Tracked</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-m)', letterSpacing: 1 }}>GOOGLE · META · CERTIFIED</div>
              </div>

              {/* Ad footer */}
              <div style={{
                padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>THINKSUITE.IN</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>Stop Wasting Ad Budget →</div>
                </div>
                <div style={{
                  background: '#1877f2', borderRadius: 6, padding: '7px 14px',
                  fontSize: 11.5, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>Book a Call</div>
              </div>
            </div>

            {/* Audience targeting pill */}
            <div style={{
              display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12,
            }}>
              {['Age 25 to 45', 'Business Owners', 'India', 'Lookalike'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(24,119,242,0.15)', border: '1px solid rgba(24,119,242,0.25)',
                  borderRadius: 6, padding: '3px 9px', fontSize: 10, color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-m)', letterSpacing: 0.3,
                }}>{tag}</span>
              ))}
            </div>

            {/* Outcome */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(24,119,242,0.15), rgba(225,48,108,0.08))',
              border: '1px solid rgba(24,119,242,0.3)', borderRadius: 10, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <i className="fa-solid fa-users" style={{ color: '#60a5fa', fontSize: 13 }} />
              <span style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600 }}>Brand Discovery → Lead Generation</span>
            </div>
          </div>
        </div>

        {/* Convergence pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a237e, #1565c0, #00bcd4)',
            color: '#fff', borderRadius: 100, padding: '14px 40px',
            fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-h)',
            letterSpacing: 0.5, boxShadow: '0 8px 32px rgba(0,188,212,0.25)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <i className="fa-solid fa-bolt" style={{ fontSize: 13 }} />
            Full-Funnel Coverage, Search Intent + Social Discovery
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .platform-grid { grid-template-columns: 1fr !important; }
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
  const [active, setActive] = useState<'google' | 'meta'>('google')
  const caps = active === 'google' ? GOOGLE_CAPS : META_CAPS

  return (
    <section id="what-we-offer" className="section section-tinted">
      <div className="container">
        <div className="title-block center">
          <span className="label">What We Offer</span>
          <h2 style={{ marginTop: 12 }}>
            Our <span className="grad-text">Full Ads Management Stack</span>
          </h2>
          <p style={{ color: 'var(--text2)', maxWidth: 480, margin: '12px auto 0', fontSize: 14.5, lineHeight: 1.75 }}>
            Switch platforms to explore every capability, from search to social.
          </p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36, marginBottom: 4 }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 100, padding: 5, display: 'flex', gap: 4, boxShadow: 'var(--shadow)',
          }}>
            {(['google', 'meta'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                style={{
                  padding: '10px 28px', borderRadius: 100, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 13, letterSpacing: 0.5,
                  transition: 'all 0.3s ease',
                  background: active === tab
                    ? tab === 'google'
                      ? 'linear-gradient(135deg, #4285F4, #34A853)'
                      : 'linear-gradient(135deg, #1877f2, #e1306c)'
                    : 'transparent',
                  color: active === tab ? '#fff' : 'var(--text2)',
                  boxShadow: active === tab ? '0 4px 16px rgba(26,35,126,0.25)' : 'none',
                }}
              >
                {tab === 'google' ? (
                  <><i className="fa-brands fa-google" style={{ marginRight: 7, fontSize: 12 }} />Google Ads</>
                ) : (
                  <><i className="fa-brands fa-meta" style={{ marginRight: 7, fontSize: 12 }} />Meta Ads</>
                )}
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--text2)', fontFamily: 'var(--font-m)', letterSpacing: 0.5, marginBottom: 0 }}>
          {active === 'google'
            ? 'Capture buyers on Google Search, Display, YouTube & Shopping'
            : 'Build awareness & generate leads on Facebook, Instagram & Reels'}
        </p>

        <div className={s.capGrid}>
          {caps.map((cap, i) => (
            <div
              key={`${active}-${i}`}
              className={s.capCard}
              style={{
                animation: 'capFadeUp 0.45s ease both',
                animationDelay: `${i * 0.07}s`,
                borderTop: active === 'meta' ? '2px solid rgba(24,119,242,0.3)' : undefined,
              }}
            >
              <span
                className={s.capMetric}
                style={active === 'meta' ? {
                  background: 'linear-gradient(135deg, #1877f2, #e1306c)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                } : undefined}
              >{cap.metric}</span>
              <div
                className={s.capIconWrap}
                style={active === 'meta' ? {
                  background: 'rgba(24,119,242,0.08)',
                  borderColor: 'rgba(24,119,242,0.2)',
                  color: '#60a5fa',
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

export default function GoogleMetaAdsPageContent() {
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
              name: 'Google & Meta Ads Management',
              description: "Google Ads and Meta Ads management from ThinkSuite's in-house team: search, shopping, display, Facebook, and Instagram campaigns built for real ROI, worldwide.",
              url: 'https://thinksuite.in/google-meta-ads',
              serviceType: 'PPC Advertising',
              keywords: ['Google Ads agency', 'Meta ads agency', 'Google and Facebook ads management'],
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
            <span style={{ color: 'var(--text)' }}>Google & Meta Ads</span>
          </div>

          {/* Dual badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i className="fa-brands fa-google" style={{ fontSize: 11 }} /> Google Ads
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg, rgba(24,119,242,0.1), rgba(225,48,108,0.1))',
              border: '1px solid rgba(24,119,242,0.25)',
              borderRadius: 100, padding: '4px 14px',
              fontSize: 11, fontWeight: 700, color: '#1877f2',
              fontFamily: 'var(--font-m)', letterSpacing: 1.5, textTransform: 'uppercase',
            }}>
              <i className="fa-brands fa-meta" style={{ fontSize: 11 }} /> Meta Ads
            </span>
          </div>

          <h1 className="mt-8">
            Google & <span className="grad-text">Meta Ads Management</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            You know the feeling: watching the ad spend tick down in real time while the leads column stays empty. Most budgets get burned on poor targeting, weak creative, and campaigns nobody is actually watching. ThinkSuite is an in-house, Google certified PPC agency that builds and manages full-funnel campaigns across Google and Meta, so every dollar you spend is working toward a lead you can actually follow up on.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">
              Get Free Ads Audit <i className="fa-solid fa-arrow-right" />
            </Link>
            <Link href="#what-we-offer" className="btn btn-outline">
              See Capabilities <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────── */}
      <div className={s.statsRow}>
        {[
          { number: 'In-House', label: 'PPC Specialist Team'  },
          { number: 'Worldwide', label: 'Campaigns, Managed In-House' },
          { number: 'Full',     label: 'Funnel Coverage'      },
          { number: 'Google',   label: 'Certified Partner'    },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── PLATFORM VISUAL ──────────────────────────────────────── */}
      <PlatformVisual />

      {/* ── CAPABILITIES TABS ────────────────────────────────────── */}
      <CapabilityTabs />

      {/* ── PLATFORM COMPARISON TABLE ────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">Google vs Meta</span>
            <h2 style={{ marginTop: 12 }}>
              Understanding the <span className="grad-text">Difference</span>
            </h2>
          </div>

          <div style={{
            maxWidth: 820, margin: '48px auto 0',
            border: '1px solid var(--border)', borderRadius: 20,
            overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
          }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              {['', 'Google Ads', 'Meta Ads'].map((h, i) => (
                <div key={i} style={{
                  padding: '16px 20px', fontFamily: 'var(--font-h)', fontSize: 13, fontWeight: 700,
                  color: i === 0 ? 'var(--text2)' : i === 1 ? '#4285F4' : '#1877f2',
                  borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}>
                  {i === 1 && <i className="fa-brands fa-google" style={{ fontSize: 12 }} />}
                  {i === 2 && <i className="fa-brands fa-meta" style={{ fontSize: 12 }} />}
                  {h}
                </div>
              ))}
            </div>

            {[
              ['User Intent',      'High, actively searching',         'Low to medium, passive browsing'],
              ['Ad Formats',       'Text, Display, Video, Shopping',    'Image, Video, Reels, Stories, Carousel'],
              ['Audience Method',  'Keyword & intent-based',            'Interest, demographic & behaviour'],
              ['Best Funnel Stage','Bottom-funnel (ready to buy)',      'Top & mid-funnel (awareness → interest)'],
              ['Result Timeline',  'Leads within days',                 'Brand impact in 1 to 3 weeks'],
              ['Min Budget',       '₹20,000/month (recommended)',       '₹15,000/month (workable start)'],
            ].map(([label, google, meta], i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                borderBottom: i < 5 ? '1px solid var(--border)' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(26,35,126,0.015)',
              }}>
                <div style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text2)', borderRight: '1px solid var(--border)', fontFamily: 'var(--font-m)' }}>{label}</div>
                <div style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text)', borderRight: '1px solid var(--border)', lineHeight: 1.5 }}>{google}</div>
                <div style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ───────────────────────────────────────────── */}
      <section className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">Who We Work With</span>
            <h2 style={{ marginTop: 12 }}>Any Industry. Any Scale. <span className="grad-text">Any Need.</span></h2>
            <p style={{ color: 'var(--text2)', marginTop: 12, maxWidth: 640, margin: '12px auto 0', lineHeight: 1.85, fontSize: 15 }}>
              From a local business to a global brand, from a bootstrapped startup to an established enterprise -
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
              {
                icon: 'fa-bag-shopping', name: 'E-Commerce & D2C',
                useCase: 'Google Shopping ads, product feed optimization, dynamic remarketing for abandoned carts, and Meta catalog campaigns. Scale revenue without scaling headcount.',
                tags: ['Shopping Ads', 'Catalog Ads', 'Cart Recovery'],
              },
              {
                icon: 'fa-building', name: 'Real Estate',
                useCase: 'Location-targeted search ads for property buyers, lead form ads on Meta, and video ads for new project launches. Qualified site visit bookings at scale.',
                tags: ['Location Targeting', 'Lead Forms', 'Project Launch'],
              },
              {
                icon: 'fa-hospital', name: 'Healthcare & Clinics',
                useCase: 'Appointment booking ads on Google Search, local service ads for clinic visibility, and awareness campaigns for specialized procedures or health checkups.',
                tags: ['Appointment Ads', 'Local Ads', 'Awareness'],
              },
              {
                icon: 'fa-graduation-cap', name: 'Education & Coaching',
                useCase: 'Course promotion ads, exam season campaigns, lead generation for consultations, and YouTube ads for academic content creators.',
                tags: ['Course Promotion', 'Lead Gen', 'YouTube Ads'],
              },
              {
                icon: 'fa-code', name: 'B2B & SaaS',
                useCase: 'LinkedIn-style targeting on Meta for decision-makers, Google ads for high-intent software keywords, and demo booking campaigns.',
                tags: ['Demo Ads', 'B2B Targeting', 'High Intent'],
              },
              {
                icon: 'fa-utensils', name: 'Food & Hospitality',
                useCase: 'Location-based ads targeting nearby customers, Google Maps visibility, event promotion ads, and seasonal campaigns around peak booking periods.',
                tags: ['Local Ads', 'Maps', 'Seasonal Campaigns'],
              },
            ].map((ind, i) => (
              <div key={i} className={`${s.indCard} reveal`} style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className={s.indIcon}><i className={`fa-solid ${ind.icon}`} /></div>
                <div className={s.indName}>{ind.name}</div>
                <p className={s.indUseCase}>{ind.useCase}</p>
                <div className={s.indTags}>
                  {ind.tags.map((tag, j) => <span key={j} className={s.indTag}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">How We Work</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">4-Step Process</span>
            </h2>
          </div>
          <div className={s.processRow}>
            {[
              { title: 'Audit', desc: 'Review your existing ad accounts, audience targeting, historical performance, and landing pages to identify quick wins and structural issues.' },
              { title: 'Strategy', desc: 'Define campaign structure, budget allocation, audience strategy, and creative brief. Set KPI targets before a single rupee is spent.' },
              { title: 'Launch', desc: 'Build and launch campaigns with conversion tracking verified, audiences segmented, and creative variations ready to test from day one.' },
              { title: 'Optimize', desc: 'Weekly bid adjustments, creative rotation, negative keyword updates, and budget reallocation to continuously improve ROAS and lower CPA.' },
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
      <section className="section section-tinted">
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
                { label: 'SEO Optimization',      href: '/seo-optimization'       },
                { label: 'Social Media Marketing', href: '/social-media-marketing' },
                { label: 'AI Marketing Systems',   href: '/ai-marketing-systems'   },
                { label: 'Content Marketing',      href: '/content-marketing'      },
              ].map(l => (
                <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Work Together"
        title="Stop Wasting"
        titleHighlight="Your Ad Budget"
        subtitle="Every rupee your ads waste is a rupee that didn't buy a customer. Let our certified PPC specialists build campaigns that generate qualified leads and measurable revenue."
      />
    </>
  )
}
