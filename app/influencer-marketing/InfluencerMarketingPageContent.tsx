'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from '@/components/pages/ServicePageDashboard.module.css'

const CAPS = [
  { icon: 'fa-user-group',  metric: 'Authentic', title: 'Micro-Influencer Campaigns',    desc: 'Creators with 10,000 to 100,000 followers. Higher engagement rates, more authentic recommendations, and a noticeably lower cost per impression than celebrities.' },
  { icon: 'fa-star',        metric: 'Scale',      title: 'Celebrity & Macro Partnerships', desc: 'Large-scale reach campaigns with macro influencers and celebrities for product launches, brand awareness, and mass market positioning.' },
  { icon: 'fa-box-open',    metric: 'UGC',        title: 'Unboxing & Review Campaigns',   desc: 'Product seeding to relevant creators for authentic unboxing and honest review content, the format that consistently drives the highest purchase intent.' },
  { icon: 'fa-link',        metric: 'Pay-Per-Sale', title: 'Affiliate Marketing Programs',  desc: 'Commission-based influencer programs where creators earn on sales they drive. You pay only for results, perfect for D2C brands scaling without a fixed ad budget.' },
  { icon: 'fa-camera',      metric: 'Yours',      title: 'UGC Content Collection',        desc: 'Campaigns that encourage customers and followers to create content about your brand. Repurposed for your ads, website, and social media channels.' },
  { icon: 'fa-handshake',   metric: 'Long-term',  title: 'Brand Ambassador Programs',     desc: 'Long-term partnerships with a handful of creators who become the recurring face of your brand. Builds deep association, trust, and consistent audience reach.' },
]

const FAQS = [
  { q: 'How do you find the right influencers for our brand?', a: 'We use a combination of manual vetting and influencer discovery tools to find creators whose audience demographics, engagement patterns, and content style genuinely match your brand. We share a shortlist with audience insights before any outreach begins, so you approve the creators before we approach them.' },
  { q: 'Do you work with nano, micro, and macro influencers?', a: 'Yes, and the right tier depends on your goals and budget. Nano and micro influencers, roughly 1,000 to 100,000 followers, tend to deliver higher engagement and more authentic trust. Macro and celebrity partners deliver scale and mass awareness instead. Most campaigns end up using a mix of tiers.' },
  { q: 'How long does a typical campaign take to plan and execute?', a: 'From briefing to live content, most campaigns take 3 to 6 weeks. Rush timelines are possible with early planning, and product seeding campaigns can launch faster, sometimes within 2 weeks, since they need less back and forth negotiation.' },
  { q: 'Can we keep the content the influencer creates?', a: 'Yes, we negotiate content usage rights as standard in every campaign. You can repurpose creator content in your ads, website, and social media. White-labeling and paid media whitelisting are also available if you want to run the content as an ad from your own handle.' },
  { q: 'How do you track ROI from influencer campaigns?', a: 'We use unique UTM links, discount codes, and affiliate tracking to measure direct traffic and conversions coming from each creator. We also track reach, impressions, engagement, and earned media value, so you see the full-funnel impact of a campaign, not just the vanity metrics.' },
  { q: 'How is influencer marketing ROI actually measured for a small budget?', a: 'Even with a modest budget, we assign each creator a unique tracking link or discount code so every sale can be traced back to a specific post. That data tells us honestly which creators and content formats are worth repeating, rather than guessing from likes and comments alone.' },
]

const TIERS = [
  {
    name: 'Nano',
    range: '1K to 10K',
    engagement: 'Highest',
    icon: '🌱',
    color: '#059669',
    bgColor: 'rgba(5,150,105,0.12)',
    borderColor: 'rgba(5,150,105,0.3)',
    tagline: 'Hyper-local trust',
    best: 'Local businesses, niche products, community brands',
    creators: [
      { handle: 'Local Food Creator', niche: 'Food', followers: '~6K', er: 'Highly Engaged' },
      { handle: 'City Fitness Creator', niche: 'Fitness', followers: '~9K', er: 'Highly Engaged' },
    ],
  },
  {
    name: 'Micro',
    range: '10K to 100K',
    engagement: 'Strong',
    icon: '⭐',
    color: '#0284c7',
    bgColor: 'rgba(2,132,199,0.12)',
    borderColor: 'rgba(2,132,199,0.3)',
    tagline: 'Best value & reach',
    best: 'D2C brands, fashion, beauty, ed-tech',
    creators: [
      { handle: 'Tech Review Creator', niche: 'Tech', followers: '~48K', er: 'Strong' },
      { handle: 'Fashion Styling Creator', niche: 'Fashion', followers: '~72K', er: 'Strong' },
    ],
  },
  {
    name: 'Macro',
    range: '100K to 1M',
    engagement: 'Moderate',
    icon: '🚀',
    color: '#7c3aed',
    bgColor: 'rgba(124,58,237,0.12)',
    borderColor: 'rgba(124,58,237,0.3)',
    tagline: 'Scale & awareness',
    best: 'Brand launches, app installs, wide reach',
    creators: [
      { handle: 'Travel Creator', niche: 'Travel', followers: '~420K', er: 'Moderate' },
      { handle: 'Food Vlogger', niche: 'Food', followers: '~680K', er: 'Moderate' },
    ],
  },
  {
    name: 'Celebrity',
    range: '1M+',
    engagement: 'Lower',
    icon: '👑',
    color: '#d97706',
    bgColor: 'rgba(217,119,6,0.12)',
    borderColor: 'rgba(217,119,6,0.3)',
    tagline: 'Mass market impact',
    best: 'National launches, premium brands, IPO buzz',
    creators: [
      { handle: 'Film & Lifestyle Star', niche: 'Lifestyle', followers: '12M+', er: 'Mass Reach' },
      { handle: 'Sports Personality', niche: 'Sports', followers: '8M+', er: 'Mass Reach' },
    ],
  },
]

function TiersVisual() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '15%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '15%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>The Influencer Tier System</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            Right Creator.{' '}
            <span className="grad-text">Right Audience. Right Results.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            Follower count alone means nothing. We match your brand to creators based on audience fit, engagement quality, and content alignment, not just reach.
          </p>
        </div>

        {/* 4 Tier Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 1000, margin: '0 auto' }} className="tier-grid">
          {TIERS.map((tier, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${tier.borderColor}`, borderRadius: 20, padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Tier header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 22 }}>{tier.icon}</div>
                  <span style={{ background: tier.bgColor, border: `1px solid ${tier.borderColor}`, color: tier.color, borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>
                    {tier.engagement} ER
                  </span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-h)', marginBottom: 4 }}>{tier.name}</div>
                <div style={{ fontSize: 12.5, color: tier.color, fontWeight: 700, fontFamily: 'var(--font-m)' }}>{tier.range} followers</div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 6, lineHeight: 1.5 }}>{tier.tagline}</div>
              </div>

              {/* Sample creators */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-m)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Sample Creators</div>
                {tier.creators.map((c, j) => (
                  <div key={j} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: tier.bgColor, border: `1px solid ${tier.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: tier.color, fontWeight: 700, flexShrink: 0 }}>{c.niche[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.75)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.handle}</div>
                      <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.35)' }}>{c.followers} · {c.niche}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Best for */}
              <div style={{ marginTop: 'auto', background: tier.bgColor, border: `1px solid ${tier.borderColor}`, borderRadius: 10, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, color: tier.color, fontFamily: 'var(--font-m)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Best For</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{tier.best}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Campaign flow */}
        <div style={{ maxWidth: 860, margin: '56px auto 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-m)', letterSpacing: 2, textTransform: 'uppercase' }}>How Every Campaign Runs</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }} className="campaign-flow">
            {[
              { icon: 'fa-bullseye', label: 'Brief & Goals'   },
              { icon: 'fa-magnifying-glass', label: 'Discover Creators' },
              { icon: 'fa-handshake', label: 'Outreach & Contract' },
              { icon: 'fa-camera', label: 'Content & Review' },
              { icon: 'fa-chart-line', label: 'Track & Report' },
            ].map((step, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(26,35,126,0.6), rgba(0,188,212,0.3))', border: '1px solid rgba(0,188,212,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`fa-solid ${step.icon}`} style={{ color: '#00bcd4', fontSize: 16 }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-m)', letterSpacing: 0.3, textAlign: 'center', maxWidth: 80 }}>{step.label}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 36, height: 1, background: 'linear-gradient(to right, rgba(0,188,212,0.4), rgba(26,35,126,0.3))', margin: '0 4px', marginBottom: 24, flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
          <div style={{ background: 'linear-gradient(135deg, #1a237e, #7c3aed, #d97706)', color: '#fff', borderRadius: 100, padding: '14px 40px', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-h)', letterSpacing: 0.5, boxShadow: '0 8px 32px rgba(0,188,212,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-bolt" style={{ fontSize: 13 }} />
            Vetted Creators Across Every Tier, Niche, and Platform
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .tier-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 500px) { .tier-grid { grid-template-columns: 1fr !important; } .campaign-flow { flex-direction: column; } }
      `}</style>
    </section>
  )
}

export default function InfluencerMarketingPageContent() {
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
            <Link href="/digital-marketing">Digital Marketing</Link><span>/</span>
            <span style={{ color: 'var(--text)' }}>Influencer Marketing</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Nano · Micro', color: '#059669' },
              { label: 'Macro · Celebrity', color: '#7c3aed' },
              { label: 'UGC & Affiliate', color: '#d97706' },
            ].map((b, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${b.color}14`, border: `1px solid ${b.color}30`, borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: b.color, fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>
                <i className="fa-solid fa-star" style={{ fontSize: 9 }} /> {b.label}
              </span>
            ))}
          </div>
          <h1 className="mt-8">Influencer <span className="grad-text">Marketing</span></h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            People trust a recommendation from a creator they already follow far more than an ad from a brand they have never heard of. ThinkSuite is a Gurgaon-based influencer marketing agency that vets creators across nano, micro, macro, and celebrity tiers, handles outreach and contracts, and manages every campaign end to end, so the post your customer sees feels like a genuine recommendation, not a paid script.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">Plan Your Campaign <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="#what-we-offer" className="btn btn-outline">See Capabilities <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} /></Link>
          </div>
        </div>
      </section>

      <div className={s.statsRow}>
        {[
          { number: 'In-House', label: 'Creator Vetting Team'   },
          { number: 'Gurgaon',  label: 'Based, Working Pan-India' },
          { number: '4',        label: 'Creator Tiers Covered'  },
          { number: 'Nano-Celeb', label: 'Full Tier Coverage'   },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      <TiersVisual />

      <section id="what-we-offer" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Offer</span>
            <h2 style={{ marginTop: 12 }}>Our <span className="grad-text">Influencer Marketing Capabilities</span></h2>
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
              { icon: 'fa-shirt',       name: 'Fashion & Beauty',        useCase: 'Outfit styling reels, makeup tutorials, product reviews, and seasonal lookbook content. Instagram and YouTube creators with audiences matching your target age and geography.', tags: ['Instagram', 'YouTube', 'Styling Content'] },
              { icon: 'fa-utensils',    name: 'Food & Beverage',         useCase: 'Recipe content, restaurant visits, product taste tests, and food photography. Food influencers drive genuine purchase decisions and real restaurant footfall.', tags: ['Food Reels', 'Restaurant Reviews', 'Recipe Content'] },
              { icon: 'fa-plane',       name: 'Travel & Hospitality',    useCase: 'Destination content, hotel stay reviews, travel itinerary videos, and experience storytelling that puts your property in front of active travelers.', tags: ['Destination Content', 'Hotel Reviews', 'Travel Stories'] },
              { icon: 'fa-graduation-cap', name: 'Education & EdTech',   useCase: 'Study tips creators, career coaching influencers, and student content creators who naturally reach young learners and working professionals across platforms.', tags: ['Study Tips', 'Career Content', 'Student Creators'] },
              { icon: 'fa-heart-pulse', name: 'Health & Fitness',        useCase: 'Fitness influencers, wellness creators, yoga instructors, and nutrition experts with highly engaged audiences in health and lifestyle niches.', tags: ['Fitness', 'Wellness', 'Nutrition'] },
              { icon: 'fa-gamepad',     name: 'Gaming & Tech',           useCase: 'Gaming influencers on YouTube and Discord, tech reviewers on Instagram and Twitter/X, and hardware creators for product launches and honest reviews.', tags: ['Gaming YouTube', 'Tech Reviews', 'Discord'] },
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
              { title: 'Discovery',  desc: 'Define campaign goals, target audience, content format, and budget. Research and shortlist creators based on audience demographics and engagement quality.' },
              { title: 'Outreach',   desc: 'Contact and negotiate with selected influencers. Handle contracts, content rights, deliverables, timelines, and payment terms on your behalf.' },
              { title: 'Campaign',   desc: 'Brief creators, review content before publishing, and coordinate timing across all influencer posts for maximum simultaneous impact.' },
              { title: 'Report',     desc: 'Track reach, engagement, clicks, conversions, and earned media value. Full campaign report with learnings to make the next campaign even stronger.' },
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
                { label: 'Social Media Marketing', href: '/social-media-marketing' },
                { label: 'Content Marketing',       href: '/content-marketing'     },
                { label: 'Google & Meta Ads',       href: '/google-meta-ads'       },
                { label: 'Brand Identity',          href: '/brand-identity'        },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection eyebrow="Let's Work Together" title="Reach New Audiences" titleHighlight="Through Creators" subtitle="The right influencer partnership introduces your brand to thousands of perfectly targeted customers. Let us find the creators and manage everything from start to finish." />
    </>
  )
}
