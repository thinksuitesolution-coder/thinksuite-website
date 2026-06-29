'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from '@/components/pages/ServicePageDashboard.module.css'

const ORGANIC_CAPS = [
  { icon: 'fa-calendar-days',  metric: '30d',   title: 'Content Calendar & Strategy',  desc: 'Monthly content plans with trending topics, brand voice, and platform-specific formats planned and approved 30 days in advance, no last-minute scrambling.' },
  { icon: 'fa-image',          metric: 'Daily',  title: 'Creative Content Production',  desc: 'Professional graphics, reels, carousels, and video content produced in-house. Platform-native formats designed to stop the scroll on every feed.' },
  { icon: 'fa-film',           metric: '#1',     title: 'Reels & Short-Form Video',     desc: 'The highest-reach format on every platform. We script, shoot, edit, and publish reels aligned to trending sounds and formats for maximum organic reach.' },
  { icon: 'fa-comments',       metric: '2hr',    title: 'Community Management',         desc: 'Daily engagement, comment replies, DM management, and audience relationship building. Response time under 2 hours on business days, every business day.' },
  { icon: 'fa-hashtag',        metric: 'Trend',  title: 'Hashtag & Trend Strategy',     desc: 'Research-backed hashtag sets updated monthly. We identify and tap trending moments relevant to your brand before they peak so you ride waves, not miss them.' },
  { icon: 'fa-chart-simple',   metric: 'Weekly', title: 'Analytics & Reporting',        desc: 'Reach, engagement, follower growth, and conversion tracking with detailed weekly reports. No vanity metrics, only numbers that connect to business outcomes.' },
]

const PAID_CAPS = [
  { icon: 'fa-rectangle-ad',   metric: '2.8x',  title: 'Instagram & Facebook Ads',     desc: 'Targeted campaigns with advanced audience segmentation, lookalike audiences, and systematic creative testing to find what converts at the lowest cost.' },
  { icon: 'fa-briefcase',      metric: 'B2B',   title: 'LinkedIn Sponsored Ads',       desc: 'Reach decision-makers, HR professionals, and C-suite by job title, company size, and industry. The most precise B2B targeting available on social media.' },
  { icon: 'fa-video',          metric: 'Video', title: 'YouTube Video Ads',            desc: 'Pre-roll, mid-roll, and Shorts ads on YouTube. Reach audiences based on what they watch, intent-based targeting that complements Google Search.' },
  { icon: 'fa-rotate-left',    metric: '60%',   title: 'Social Retargeting',           desc: 'Re-engage people who visited your website, watched your videos, or engaged with posts. Keep your brand visible until they are ready to convert.' },
  { icon: 'fa-users',          metric: 'LAL',   title: 'Lookalike Audiences',          desc: 'Build audiences that mirror your best customers using platform AI. Scale campaigns to thousands of new prospects who behave like your highest-value buyers.' },
  { icon: 'fa-flask',          metric: 'Weekly', title: 'Creative A/B Testing',        desc: 'Systematic testing of visuals, copy, CTAs, and formats every week. Every iteration makes your campaigns smarter, compound performance month over month.' },
]

const FAQS = [
  { q: 'How many posts do you create per month?', a: 'Our base package includes 12 to 15 posts per month across your chosen platforms. Premium packages include daily posting, reels, stories, and paid campaign management.' },
  { q: 'Do you create content in-house or do we need to provide photos?', a: 'We create everything in-house including graphics, captions, and video editing. For product-based businesses we request product shots or a photoshoot. We can also coordinate professional photography if needed.' },
  { q: 'Which platforms do you manage?', a: 'Instagram, Facebook, LinkedIn, YouTube, Twitter/X, and Pinterest. We recommend focusing on 2 to 3 platforms based on where your target audience actually spends time, not just the most popular ones.' },
  { q: 'How long before we see growth?', a: 'Most clients see measurable engagement improvements within 30 days. Significant follower growth and lead generation typically takes 3 to 6 months of consistent, quality content published on schedule.' },
  { q: 'Do you handle paid social ads as well?', a: 'Yes. Organic management and paid campaigns are offered together or separately. Organic builds long-term authority and trust. Paid accelerates growth and conversions in the short term. Both together is always more effective.' },
]

function PlatformsVisual() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(225,48,108,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(10,102,194,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>Where We Grow You</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            4 Platforms.{' '}
            <span className="grad-text">One Unified Strategy.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            Your customers are on Instagram, LinkedIn, YouTube, and Facebook. We create platform-native content for each, so your brand looks like it belongs everywhere.
          </p>
        </div>

        {/* 2x2 Platform Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 880, margin: '0 auto' }} className="social-grid-2x2">

          {/* Instagram */}
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>TS</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>thinksuite.official</div>
                <div style={{ fontSize: 10, color: '#8e8e8e' }}>Sponsored</div>
              </div>
              <i className="fa-brands fa-instagram" style={{ color: '#bc1888', fontSize: 16 }} />
            </div>
            <div style={{ height: 120, background: 'linear-gradient(135deg, #f09433 0%, #e6683c 30%, #dc2743 60%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-h)' }}>3.2x</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-m)', letterSpacing: 1 }}>ENGAGEMENT LIFT</div>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ display: 'flex', gap: 14, marginBottom: 7, fontSize: 15, color: '#262626' }}>
                <span>♥</span><span>💬</span><span>↗</span><span style={{ marginLeft: 'auto' }}>🔖</span>
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#111', marginBottom: 3 }}>1,284 likes</div>
              <div style={{ fontSize: 11, color: '#262626', lineHeight: 1.5 }}><strong>thinksuite.official</strong> Stop posting and hoping. Build a content system that actually grows your business. 🚀</div>
            </div>
          </div>

          {/* LinkedIn */}
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f2ef', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 8, background: 'linear-gradient(135deg, #1a237e, #00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff', flexShrink: 0 }}>TS</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#000000e5' }}>ThinkSuite</div>
                <div style={{ fontSize: 11, color: '#00000099' }}>Digital Agency · Sponsored</div>
                <div style={{ fontSize: 10, color: '#00000066' }}>🌐 Posted to everyone</div>
              </div>
              <i className="fa-brands fa-linkedin" style={{ color: '#0a66c2', fontSize: 20 }} />
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: 12.5, color: '#000000cc', lineHeight: 1.65, marginBottom: 10 }}>
                We helped a B2B SaaS startup go from 200 to 8,400 LinkedIn followers in 90 days, without paid ads.<br /><br />
                <span style={{ color: '#0a66c2' }}>Here is the exact content strategy we used 👇</span>
              </div>
              <div style={{ fontSize: 11, color: '#00000060', borderTop: '1px solid #f3f2ef', paddingTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span>👍❤️ 342 reactions</span><span>28 comments</span><span>4 reposts</span>
              </div>
            </div>
          </div>

          {/* YouTube */}
          <div style={{ background: '#0f0f0f', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ height: 120, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #c4302b 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-play" style={{ color: '#fff', fontSize: 14, marginLeft: 3 }} />
              </div>
              <div style={{ position: 'absolute', bottom: 8, right: 10, background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-m)' }}>0:58</div>
              <div style={{ position: 'absolute', top: 10, left: 10, background: '#c4302b', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>SHORTS</div>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #1a237e, #00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>TS</div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', lineHeight: 1.45 }}>How We Got 320% More Reach in 60 Days (Without Ads)</div>
                <div style={{ fontSize: 10.5, color: '#aaa', marginTop: 4 }}>ThinkSuite · 12K views · 3 days ago</div>
              </div>
              <i className="fa-brands fa-youtube" style={{ color: '#c4302b', fontSize: 18, marginLeft: 'auto', flexShrink: 0 }} />
            </div>
          </div>

          {/* Facebook */}
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #1a237e, #00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>TS</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#050505' }}>ThinkSuite</div>
                <div style={{ fontSize: 10, color: '#65676b' }}>Sponsored · <i className="fa-solid fa-earth-asia" style={{ fontSize: 9 }} /></div>
              </div>
              <i className="fa-brands fa-facebook" style={{ color: '#1877f2', fontSize: 20 }} />
            </div>
            <div style={{ padding: '0 14px 10px', fontSize: 13, color: '#050505', lineHeight: 1.6 }}>
              Tired of social media that generates likes but no leads? We help brands build a content system that actually drives business. 👇
            </div>
            <div style={{ height: 72, background: 'linear-gradient(135deg, #1a237e, #1565c0, #00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-h)', letterSpacing: 0.3 }}>Book a Free Strategy Call →</span>
            </div>
            <div style={{ padding: '8px 14px', borderTop: '1px solid #e4e6eb' }}>
              <div style={{ fontSize: 11, color: '#65676b', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span>👍❤️😮 1.2K</span><span style={{ marginLeft: 'auto' }}>84 comments · 32 shares</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
          <div style={{ background: 'linear-gradient(135deg, #bc1888, #dc2743, #0a66c2, #1877f2)', color: '#fff', borderRadius: 100, padding: '14px 40px', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-h)', letterSpacing: 0.5, boxShadow: '0 8px 32px rgba(0,188,212,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-bolt" style={{ fontSize: 13 }} />
            Your Brand, Active on Every Platform That Matters
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 620px) { .social-grid-2x2 { grid-template-columns: 1fr !important; } }
        @keyframes capFadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </section>
  )
}

function CapabilityTabs() {
  const [active, setActive] = useState<'organic' | 'paid'>('organic')
  const caps = active === 'organic' ? ORGANIC_CAPS : PAID_CAPS

  return (
    <section id="what-we-offer" className="section section-tinted">
      <div className="container">
        <div className="title-block center">
          <span className="label">What We Offer</span>
          <h2 style={{ marginTop: 12 }}>Our <span className="grad-text">Full Social Media Stack</span></h2>
          <p style={{ color: 'var(--text2)', maxWidth: 480, margin: '12px auto 0', fontSize: 14.5, lineHeight: 1.75 }}>
            Switch views, explore our organic content services and paid social capabilities.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36, marginBottom: 4 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 100, padding: 5, display: 'flex', gap: 4, boxShadow: 'var(--shadow)' }}>
            {(['organic', 'paid'] as const).map(tab => (
              <button key={tab} onClick={() => setActive(tab)} style={{
                padding: '10px 28px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 13, letterSpacing: 0.5,
                transition: 'all 0.3s ease',
                background: active === tab ? (tab === 'organic' ? 'linear-gradient(135deg, #dc2743, #bc1888)' : 'linear-gradient(135deg, #0a66c2, #1877f2)') : 'transparent',
                color: active === tab ? '#fff' : 'var(--text2)',
                boxShadow: active === tab ? '0 4px 16px rgba(26,35,126,0.25)' : 'none',
              }}>
                {tab === 'organic'
                  ? <><i className="fa-solid fa-seedling" style={{ marginRight: 7, fontSize: 12 }} />Organic Content</>
                  : <><i className="fa-solid fa-rectangle-ad" style={{ marginRight: 7, fontSize: 12 }} />Paid Social</>}
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--text2)', fontFamily: 'var(--font-m)', letterSpacing: 0.5, marginBottom: 0 }}>
          {active === 'organic' ? 'Content creation, community management, reels, and analytics' : 'Targeted paid campaigns on Instagram, Facebook, LinkedIn, and YouTube'}
        </p>

        <div className={s.capGrid}>
          {caps.map((cap, i) => (
            <div key={`${active}-${i}`} className={s.capCard} style={{
              animation: 'capFadeUp 0.45s ease both', animationDelay: `${i * 0.07}s`,
              borderTop: active === 'paid' ? '2px solid rgba(10,102,194,0.3)' : '2px solid rgba(220,39,67,0.3)',
            }}>
              <span className={s.capMetric} style={{
                background: active === 'paid' ? 'linear-gradient(135deg, #0a66c2, #1877f2)' : 'linear-gradient(135deg, #dc2743, #bc1888)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{cap.metric}</span>
              <div className={s.capIconWrap} style={active === 'paid'
                ? { background: 'rgba(10,102,194,0.08)', borderColor: 'rgba(10,102,194,0.2)', color: '#0a66c2' }
                : { background: 'rgba(220,39,67,0.08)', borderColor: 'rgba(220,39,67,0.2)', color: '#dc2743' }}>
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

export default function SocialMediaPageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/digital-marketing">Digital Marketing</Link><span>/</span>
            <span style={{ color: 'var(--text)' }}>Social Media Marketing</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { icon: 'fa-instagram', label: 'Instagram', color: '#bc1888' },
              { icon: 'fa-linkedin',  label: 'LinkedIn',  color: '#0a66c2' },
              { icon: 'fa-youtube',   label: 'YouTube',   color: '#c4302b' },
              { icon: 'fa-facebook',  label: 'Facebook',  color: '#1877f2' },
            ].map((p, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${p.color}14`, border: `1px solid ${p.color}30`, borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: p.color, fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>
                <i className={`fa-brands ${p.icon}`} style={{ fontSize: 11 }} /> {p.label}
              </span>
            ))}
          </div>
          <h1 className="mt-8">Social Media <span className="grad-text">Marketing</span></h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            Your audience is already on social media. The question is whether they are seeing your brand or your competitor&#39;s. We create content that stops the scroll and builds a community that actually buys.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">Get Free Strategy Call <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="#what-we-offer" className="btn btn-outline">See Capabilities <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} /></Link>
          </div>
        </div>
      </section>

      <div className={s.statsRow}>
        {[
          { number: '3.2x', label: 'Avg Engagement Lift' },
          { number: '50+',  label: 'Brands Managed'      },
          { number: '4',    label: 'Platforms Covered'   },
          { number: '30d',  label: 'Results Timeline'    },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      <PlatformsVisual />
      <CapabilityTabs />

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
              { icon: 'fa-shirt',       name: 'Fashion & Apparel',       useCase: 'Instagram-first strategy with product photography, styling reels, and influencer collaborations. Build aspiration and drive direct purchases from social.',                     tags: ['Instagram', 'Reels', 'Influencers'] },
              { icon: 'fa-briefcase',   name: 'B2B & SaaS',              useCase: 'LinkedIn thought leadership, case study content, founder storytelling, and lead generation campaigns targeted to decision-makers and business owners.',                          tags: ['LinkedIn', 'Thought Leadership', 'Lead Gen'] },
              { icon: 'fa-utensils',    name: 'Food & Restaurant',        useCase: 'Reels showing food prep, behind-the-scenes content, seasonal menus, customer UGC campaigns, and location-tagged posts that drive real footfall.',                              tags: ['Reels', 'UGC', 'Location Tags'] },
              { icon: 'fa-building',    name: 'Real Estate',              useCase: 'Property tour videos, area walkthrough reels, client testimonials, and construction update posts. Build trust with buyers before the first site visit.',                        tags: ['Property Tours', 'Video', 'Testimonials'] },
              { icon: 'fa-graduation-cap', name: 'Education & EdTech',   useCase: 'Educator thought leadership, student success stories, and free value posts that drive enrollment inquiries and course signups from organic social reach.',                       tags: ['Thought Leadership', 'Student Stories', 'Organic Growth'] },
              { icon: 'fa-heart-pulse', name: 'Healthcare & Wellness',   useCase: 'Health tip content, doctor Q&A posts, myth-busting reels, and patient education campaigns that build authority and drive appointment bookings.',                               tags: ['Health Tips', 'Authority Building', 'Awareness'] },
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
              { title: 'Audit',              desc: 'Review your current social presence, competitor landscape, and audience insights. Define what success looks like in measurable numbers.' },
              { title: 'Strategy',           desc: 'Build a platform-by-platform content strategy with content pillars, posting frequency, format mix, and paid social plan.' },
              { title: 'Create & Publish',   desc: 'Produce content in batch, get your approval, and publish on schedule. Community management happens every single day.' },
              { title: 'Review & Improve',   desc: 'Weekly performance review to identify top-performing content and double down. Monthly strategy refinement based on real data.' },
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
                { label: 'Google & Meta Ads',    href: '/google-meta-ads'       },
                { label: 'Content Marketing',     href: '/content-marketing'     },
                { label: 'Influencer Marketing',  href: '/influencer-marketing'  },
                { label: 'SEO Optimization',      href: '/seo-optimization'      },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection eyebrow="Let's Work Together" title="Grow Your" titleHighlight="Social Presence" subtitle="Social media that actually drives business requires consistency, creativity, and strategy. Let us manage yours so you can focus on running the business." />
    </>
  )
}
