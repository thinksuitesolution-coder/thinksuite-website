'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from '@/components/pages/ServicePageDashboard.module.css'

const CAPS = [
  { icon: 'fa-robot',              metric: '10x',       title: 'AI Content at Scale',           desc: 'Generate blog posts, ad copy, email subjects, and social captions at scale in your brand voice. 10x content output without building a large team.' },
  { icon: 'fa-filter',             metric: '87%',       title: 'Predictive Lead Scoring',       desc: 'AI scores every incoming lead based on behavior, source, and fit. Your sales team calls only the people most likely to convert, no more cold chasing.' },
  { icon: 'fa-envelope-open-text', metric: '4.2x',      title: 'Email Personalization Engine',  desc: 'Personalized email sequences triggered by user actions. Subject lines, content, and timing adjusted to individual behavior for higher open and click rates.' },
  { icon: 'fa-rectangle-ad',       metric: '-30%',      title: 'AI Ad Optimization',            desc: 'AI continuously adjusts bids, pauses underperforming creatives, and shifts budget toward what is working. Less waste, better ROAS month over month.' },
  { icon: 'fa-face-smile',         metric: 'Live',      title: 'Brand Sentiment Monitoring',    desc: 'Track brand mentions and customer sentiment across social media and reviews in real time. Respond to reputation risks before they escalate.' },
  { icon: 'fa-chart-line',         metric: '2x+',       title: 'Campaign ROI Compounding',      desc: 'AI-powered A/B testing, multi-touch attribution, and simultaneous campaign optimization. Every channel gets smarter the more data it accumulates.' },
]

const FAQS = [
  { q: 'How is AI marketing different from regular marketing automation?', a: 'Standard automation follows fixed rules you set. AI marketing adapts on its own based on patterns it finds in your data. It discovers which audience segment responds to which message without you manually defining every rule, and it keeps improving.' },
  { q: 'Which tools do you integrate with?', a: 'We integrate with HubSpot, Mailchimp, Klaviyo, Google Ads, Meta Ads, Zoho, Salesforce, Shopify, WooCommerce, and most tools that have an API. We also build custom integrations where needed.' },
  { q: 'How long before we see results?', a: 'Automation improvements like reduced manual work and faster follow-ups are visible in the first 2 weeks. ROI improvements from AI optimization typically show in 4 to 8 weeks as the system accumulates enough data to learn from.' },
  { q: 'Do we need a large customer database to start?', a: 'Not necessarily. Even with 1,000 to 5,000 contacts, AI systems can identify patterns and improve campaign performance. The system gets smarter as your database grows, starting early means compounding advantage.' },
  { q: 'What if we already have a marketing team in place?', a: 'AI marketing systems work alongside your existing team, not replace them. Your team focuses on strategy and creative while the system handles execution, testing, and optimization, making your team significantly more productive.' },
]

const PIPELINE_INPUTS = [
  { icon: 'fa-database',        label: 'CRM & Lead Data',     color: '#60a5fa', desc: 'Contacts, deals, interactions' },
  { icon: 'fa-globe',           label: 'Website Behavior',    color: '#a78bfa', desc: 'Pages, sessions, clicks, scroll' },
  { icon: 'fa-envelope',        label: 'Email Engagement',    color: '#34d399', desc: 'Opens, clicks, replies, unsubscribes' },
  { icon: 'fa-rectangle-ad',    label: 'Ad Performance',      color: '#fbbf24', desc: 'Spend, clicks, conversions, ROAS' },
]

const PIPELINE_OUTPUTS = [
  { icon: 'fa-filter',          label: 'Lead Scoring',        color: '#60a5fa', metric: '87% accuracy' },
  { icon: 'fa-envelope-open-text', label: 'Personalized Email', color: '#a78bfa', metric: '4.2x open rate' },
  { icon: 'fa-rectangle-ad',   label: 'Ad Optimization',     color: '#34d399', metric: '-30% wasted spend' },
  { icon: 'fa-robot',           label: 'Content at Scale',    color: '#fbbf24', metric: '10x output' },
]

function AIPipelineVisual() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '20%', left: '8%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '20%', right: '8%', width: 420, height: 420, background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>How AI Marketing Works</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            Your Data In.{' '}
            <span className="grad-text">Smarter Marketing Out.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            Traditional campaigns treat every customer the same. Our AI pipeline learns from your actual data and personalizes every touchpoint automatically, getting sharper every week.
          </p>
        </div>

        {/* Pipeline Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 0, alignItems: 'center', maxWidth: 1000, margin: '0 auto' }} className="pipeline-grid">

          {/* LEFT, Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-m)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, textAlign: 'right' }}>Data Inputs</div>
            {PIPELINE_INPUTS.map((inp, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${inp.color}25`, borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto', width: '100%' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${inp.color}18`, border: `1px solid ${inp.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`fa-solid ${inp.icon}`} style={{ color: inp.color, fontSize: 14 }} />
                </div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>{inp.label}</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)' }}>{inp.desc}</div>
                </div>
                {/* Arrow line going right */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 24, height: 1, background: `linear-gradient(to right, ${inp.color}50, ${inp.color})` }} />
                  <i className="fa-solid fa-chevron-right" style={{ color: inp.color, fontSize: 9 }} />
                </div>
              </div>
            ))}
          </div>

          {/* CENTER, AI Brain */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px', gap: 12 }}>
            {/* Connecting dots */}
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(0,188,212,0.4))' }} />

            {/* Brain node */}
            <div style={{ position: 'relative' }}>
              {/* Outer glow ring */}
              <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,188,212,0.2) 0%, transparent 70%)', animation: 'pulse 2.5s ease-in-out infinite' }} />
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #1a237e, #00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(0,188,212,0.4), 0 0 80px rgba(26,35,126,0.3)', position: 'relative', zIndex: 1 }}>
                <i className="fa-solid fa-brain" style={{ color: '#fff', fontSize: 36 }} />
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#00bcd4', fontFamily: 'var(--font-h)', letterSpacing: 0.5 }}>AI ENGINE</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>Learns & Adapts</div>
            </div>

            {/* Real-time badge */}
            <div style={{ background: 'rgba(0,188,212,0.12)', border: '1px solid rgba(0,188,212,0.25)', borderRadius: 8, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00bcd4', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <span style={{ fontSize: 10, color: '#00bcd4', fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>Real-time</span>
            </div>

            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(0,188,212,0.4), transparent)' }} />
          </div>

          {/* RIGHT, Outputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-m)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Personalized Outputs</div>
            {PIPELINE_OUTPUTS.map((out, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${out.color}25`, borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Arrow from left */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <i className="fa-solid fa-chevron-right" style={{ color: out.color, fontSize: 9 }} />
                  <div style={{ width: 24, height: 1, background: `linear-gradient(to right, ${out.color}, ${out.color}50)` }} />
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${out.color}18`, border: `1px solid ${out.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`fa-solid ${out.icon}`} style={{ color: out.color, fontSize: 14 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>{out.label}</div>
                  <div style={{ fontSize: 10.5, color: out.color, fontWeight: 600 }}>{out.metric}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison: Before vs After */}
        <div style={{ maxWidth: 800, margin: '60px auto 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="compare-grid">
          {/* Before */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-m)', letterSpacing: 1, textTransform: 'uppercase' }}>Traditional Marketing</span>
            </div>
            {['Same email to every contact', 'Manual bid adjustments weekly', 'Sales team chases cold leads', 'Guessing what content works', 'Reports reviewed monthly'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <i className="fa-solid fa-xmark" style={{ color: '#ef4444', fontSize: 11, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{item}</span>
              </div>
            ))}
          </div>
          {/* After */}
          <div style={{ background: 'linear-gradient(135deg, rgba(26,35,126,0.3), rgba(0,188,212,0.15))', border: '1px solid rgba(0,188,212,0.2)', borderRadius: 20, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00bcd4' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#00bcd4', fontFamily: 'var(--font-m)', letterSpacing: 1, textTransform: 'uppercase' }}>AI Marketing System</span>
            </div>
            {['Personalized to each contact behavior', 'AI auto-optimizes bids in real time', 'AI scores leads, sales calls hot ones', 'AI tests and finds winners automatically', 'Live dashboard updated continuously'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#00bcd4', fontSize: 11, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
          <div style={{ background: 'linear-gradient(135deg, #1a237e, #0284c7, #00bcd4)', color: '#fff', borderRadius: 100, padding: '14px 40px', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-h)', letterSpacing: 0.5, boxShadow: '0 8px 32px rgba(0,188,212,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-brain" style={{ fontSize: 13 }} />
            Your Marketing Gets Smarter Every Single Week
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) { .pipeline-grid { grid-template-columns: 1fr !important; } .compare-grid { grid-template-columns: 1fr !important; } }
        @keyframes pulse { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.08); } }
      `}</style>
    </section>
  )
}

export default function AIMarketingPageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/ai-automation">AI & Automation</Link><span>/</span>
            <span style={{ color: 'var(--text)' }}>AI Marketing Systems</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Lead Scoring', color: '#60a5fa' },
              { label: 'Personalization', color: '#a78bfa' },
              { label: 'Auto-Optimization', color: '#34d399' },
            ].map((b, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${b.color}14`, border: `1px solid ${b.color}30`, borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: b.color, fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>
                <i className="fa-solid fa-robot" style={{ fontSize: 9 }} /> {b.label}
              </span>
            ))}
          </div>
          <h1 className="mt-8">AI Marketing <span className="grad-text">Systems</span></h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            Traditional campaigns push the same message to everyone. AI marketing systems learn from your customer data, personalize every touchpoint in real time, and keep getting smarter without manual management.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">Get Free AI Audit <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="#what-we-offer" className="btn btn-outline">See Capabilities <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} /></Link>
          </div>
        </div>
      </section>

      <div className={s.statsRow}>
        {[
          { number: '3x',        label: 'Higher Conversion Rates' },
          { number: '210%',      label: 'Average ROAS Lift'       },
          { number: '87%',       label: 'Lead Scoring Accuracy'   },
          { number: 'Real-time', label: 'Campaign Optimization'   },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      <AIPipelineVisual />

      <section id="what-we-offer" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Offer</span>
            <h2 style={{ marginTop: 12 }}>Our <span className="grad-text">AI Marketing Capabilities</span></h2>
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
              { icon: 'fa-shirt',       name: 'D2C Brands',             useCase: 'Product recommendations, abandoned cart recovery, post-purchase upsell sequences, and loyalty program automation. Turn browsers into buyers and buyers into repeat customers.', tags: ['Cart Recovery', 'Personalization', 'Loyalty'] },
              { icon: 'fa-building',    name: 'Real Estate',            useCase: 'Property matching based on search behavior, automated follow-up based on engagement level, and ad spend reallocation by project and location automatically.', tags: ['Property Matching', 'Lead Nurture', 'Area Reports'] },
              { icon: 'fa-laptop',      name: 'EdTech Platforms',       useCase: 'Course recommendations, exam preparation nudges, re-engagement campaigns for inactive learners, and referral program automation that runs without manual oversight.', tags: ['Course Recommendations', 'Re-engagement', 'Referrals'] },
              { icon: 'fa-heart-pulse', name: 'Healthcare Brands',      useCase: 'Appointment reminders, health tip personalization, and preventive care campaign automation. Consent-first and compliance-aware marketing throughout.', tags: ['Appointment Reminders', 'Health Content', 'Automation'] },
              { icon: 'fa-code',        name: 'B2B SaaS Companies',     useCase: 'Trial-to-paid conversion campaigns, churn prevention outreach, feature adoption nudges, and product-led growth sequences that run on autopilot.', tags: ['Trial Conversion', 'Churn Prevention', 'Onboarding'] },
              { icon: 'fa-bag-shopping', name: 'Fashion & Lifestyle',   useCase: 'Season launches, wishlist reminders, size-based recommendations, and influencer campaign performance tracking integrated into one automated system.', tags: ['Launch Campaigns', 'Wishlist', 'Influencer Tracking'] },
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
              { title: 'Audit',    desc: 'Map your current marketing stack, audience data, and campaign performance to identify where AI can have the biggest immediate impact on your business.' },
              { title: 'Setup',    desc: 'Connect your CRM, email platform, ad accounts, and website. Configure AI models and set up data pipelines for real-time learning and optimization.' },
              { title: 'Launch',   desc: 'Activate automated campaigns, AI content generation, and lead scoring. Run controlled tests to validate performance gains before full rollout.' },
              { title: 'Optimize', desc: 'Review results weekly, refine models, expand to new channels, and scale what is working based on real performance data, not assumptions.' },
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
                { label: 'SEO Optimization',       href: '/seo-optimization'       },
                { label: 'Google & Meta Ads',       href: '/google-meta-ads'        },
                { label: 'Content Marketing',       href: '/content-marketing'      },
                { label: 'Social Media Marketing',  href: '/social-media-marketing' },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection eyebrow="Let's Work Together" title="Build Your" titleHighlight="AI Marketing System" subtitle="Your marketing should get smarter every week. Let us build a system that learns your audience, personalizes every touchpoint, and keeps improving without manual effort." />
    </>
  )
}
