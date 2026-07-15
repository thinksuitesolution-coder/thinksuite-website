'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from '@/components/pages/ServicePageDashboard.module.css'

const CAPS = [
  { icon: 'fa-pen-nib',     metric: 'Long-Form',  title: 'SEO Blog Content',               desc: 'Long-form articles targeting high-volume, high-intent keywords. Properly researched, well-structured, and optimized for ranking without ever sounding robotic.' },
  { icon: 'fa-video',       metric: 'Scripts',     title: 'Video & Reel Scripts',           desc: 'Short-form and long-form video scripts for YouTube, Instagram Reels, and LinkedIn. Ideas, structure, and hooks that keep viewers watching all the way through.' },
  { icon: 'fa-file-lines',  metric: 'Trust',       title: 'Case Studies',                   desc: 'Documented client success stories with real detail. Before-and-after structure that shows prospects exactly how you solve their specific problem.' },
  { icon: 'fa-file-pdf',    metric: 'Authority',   title: 'Whitepapers & Reports',          desc: 'In-depth reports that establish your brand as the authority in your field. Used for lead generation, PR coverage, and sales enablement collateral.' },
  { icon: 'fa-envelope',    metric: 'Nurture',     title: 'Email Newsletters',              desc: 'Weekly or monthly newsletters that keep your audience warm and coming back. Educational content that converts passive subscribers into active buyers over time.' },
  { icon: 'fa-laptop',      metric: 'Conversions', title: 'Website & Landing Page Copy',   desc: 'Persuasive, benefit-focused copy for homepages, service pages, and landing pages. Written to convert visitors who are already interested in what you offer.' },
]

const FAQS = [
  { q: 'How many pieces of content do you produce per month?', a: 'Our standard content package includes 4 to 8 SEO articles per month. We scale this up based on budget and goals, and some clients run 12 to 16 articles a month alongside newsletter and social distribution.' },
  { q: 'Do you write the content yourselves or use AI tools?', a: 'Our content is written by human writers with real domain expertise in your industry, working out of our in-house studio. We use AI tools for research assistance and outline generation, but every final piece is human written, fact checked, and edited before it reaches you.' },
  { q: 'How long before content starts ranking on Google?', a: 'New content can start ranking within 4 to 12 weeks for less competitive keywords. Competitive terms usually need several months of consistent publishing and link building before they move up meaningfully. We focus on realistic quick wins first while building the long-term authority that compounds later.' },
  { q: 'Do you handle publishing on our website or do we do it?', a: 'Either way works for us. We can publish directly to your CMS, whether that is WordPress, Webflow, or something custom, or hand over ready-to-publish files for your own team to upload. Most clients end up preferring that we handle it end to end.' },
  { q: 'How do you measure content marketing success?', a: 'We track organic traffic, keyword rankings, time on page, leads generated from content, and where possible, revenue attribution. Monthly reporting shows exactly how each piece is performing and what changes we are making to improve it.' },
  { q: 'Is content marketing worth it for a small business?', a: 'Yes, especially because content keeps working long after you stop paying for a single ad click. A well-ranked blog post or guide can bring in inquiries for years, which makes it one of the few marketing investments that compounds instead of resetting to zero every month.' },
]

const FUNNEL_STAGES = [
  {
    stage: '01',
    label: 'Awareness',
    tagline: 'They discover your brand',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.3)',
    icon: 'fa-eye',
    types: ['SEO Blog Articles', 'YouTube Videos', 'Instagram Reels', 'Infographics'],
    metric: 'Grows',
    metricLabel: 'organic search visibility',
  },
  {
    stage: '02',
    label: 'Interest',
    tagline: 'They learn & engage',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.3)',
    icon: 'fa-book-open',
    types: ['Case Studies', 'How-To Guides', 'Email Newsletters', 'Comparison Pages'],
    metric: 'Builds',
    metricLabel: 'trust before the sales call',
  },
  {
    stage: '03',
    label: 'Decision',
    tagline: 'They evaluate you',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
    icon: 'fa-scale-balanced',
    types: ['Whitepapers', 'Testimonials', 'ROI Calculators', 'Landing Pages'],
    metric: 'Wins',
    metricLabel: 'the final comparison',
  },
  {
    stage: '04',
    label: 'Conversion',
    tagline: 'They become customers',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.3)',
    icon: 'fa-circle-check',
    types: ['Email Sequences', 'Onboarding Docs', 'Proposals', 'Follow-up Content'],
    metric: 'Nurtures',
    metricLabel: 'new customers post-purchase',
  },
]

function ContentFunnelVisual() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '15%', left: '5%', width: 450, height: 450, background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '15%', right: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>The Content Funnel</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            Right Content.{' '}
            <span className="grad-text">Right Moment. Every Stage.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            Most brands only create content for one stage and wonder why it does not convert. We build content for the full buyer journey, from first search to final decision.
          </p>
        </div>

        {/* Funnel stages, horizontal cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 1040, margin: '0 auto' }} className="funnel-grid">
          {FUNNEL_STAGES.map((stage, i) => (
            <div key={i} style={{ background: stage.bg, border: `1px solid ${stage.border}`, borderRadius: 20, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden' }}>
              {/* Stage number watermark */}
              <div aria-hidden style={{ position: 'absolute', top: -10, right: 12, fontSize: 72, fontWeight: 900, color: 'rgba(255,255,255,0.04)', fontFamily: 'var(--font-h)', lineHeight: 1 }}>{stage.stage}</div>

              {/* Icon + label */}
              <div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: stage.bg, border: `1px solid ${stage.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <i className={`fa-solid ${stage.icon}`} style={{ color: stage.color, fontSize: 17 }} />
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-h)', marginBottom: 4 }}>{stage.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{stage.tagline}</div>
              </div>

              {/* Content types */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-m)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Content Types</div>
                {stage.types.map((type, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: stage.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)' }}>{type}</span>
                  </div>
                ))}
              </div>

              {/* Metric */}
              <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: stage.color, fontFamily: 'var(--font-h)', lineHeight: 1 }}>{stage.metric}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>{stage.metricLabel}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Blog article mockup below */}
        <div style={{ maxWidth: 700, margin: '56px auto 0', background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
          {/* Browser chrome */}
          <div style={{ background: '#f1f5f9', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#64748b', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="fa-solid fa-lock" style={{ fontSize: 9, color: '#22c55e' }} />
              thinksuite.in/blog/how-to-grow-organic-traffic-india
            </div>
          </div>
          {/* Article preview */}
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <span style={{ background: 'rgba(26,35,126,0.08)', border: '1px solid rgba(26,35,126,0.15)', borderRadius: 6, padding: '3px 10px', fontSize: 10.5, fontWeight: 700, color: '#1a237e', fontFamily: 'var(--font-m)' }}>SEO</span>
              <span style={{ background: 'rgba(0,188,212,0.08)', border: '1px solid rgba(0,188,212,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: 10.5, fontWeight: 700, color: '#0284c7', fontFamily: 'var(--font-m)' }}>Content Strategy</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: 10, fontFamily: 'var(--font-h)' }}>
              How to Grow Organic Traffic Without Spending on Ads (A Practical Playbook)
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 16 }}>
              Most businesses treat content as an afterthought. Here is the exact content strategy we use to help B2B SaaS companies turn steady organic traffic into a real pipeline of inbound leads...
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #1a237e, #00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>TS</div>
                <span style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>ThinkSuite</span>
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>·</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>8 min read</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>·</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <i className="fa-brands fa-google" style={{ fontSize: 10, color: '#4285F4' }} />
                <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>Ranking on Google</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981)', color: '#fff', borderRadius: 100, padding: '14px 40px', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-h)', letterSpacing: 0.5, boxShadow: '0 8px 32px rgba(0,188,212,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-bolt" style={{ fontSize: 13 }} />
            Every Piece of Content Built to Rank, Engage & Convert
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .funnel-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .funnel-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

export default function ContentMarketingPageContent() {
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
            <span style={{ color: 'var(--text)' }}>Content Marketing</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'SEO Blog Writing', color: '#3b82f6' },
              { label: 'Video Scripts',    color: '#8b5cf6' },
              { label: 'Email & Copy',     color: '#10b981' },
            ].map((b, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${b.color}14`, border: `1px solid ${b.color}30`, borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: b.color, fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>
                <i className="fa-solid fa-pen-nib" style={{ fontSize: 9 }} /> {b.label}
              </span>
            ))}
          </div>
          <h1 className="mt-8">Content <span className="grad-text">Marketing</span></h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            Content is how your audience finds you long before they are ready to buy. ThinkSuite is an in-house content marketing agency with a team of writers and strategists who research, write, and edit every blog, script, case study, and newsletter we publish, so your brand answers real questions and earns trust before the sales conversation even starts.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">Get Free Content Audit <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="#what-we-offer" className="btn btn-outline">See Capabilities <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} /></Link>
          </div>
        </div>
      </section>

      <div className={s.statsRow}>
        {[
          { number: 'In-House', label: 'Writers & Strategists'   },
          { number: 'Worldwide', label: 'Clients, In-House Team' },
          { number: 'Human',    label: 'Written, Never Robotic'  },
          { number: 'SEO',      label: 'Every Piece Optimized'   },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      <ContentFunnelVisual />

      <section id="what-we-offer" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Offer</span>
            <h2 style={{ marginTop: 12 }}>Our <span className="grad-text">Content Marketing Capabilities</span></h2>
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
              { icon: 'fa-code',           name: 'SaaS & B2B Tech',          useCase: 'Thought leadership articles, comparison pages, product documentation, and case studies that build trust with technical decision-makers over time.', tags: ['Thought Leadership', 'Comparison Pages', 'Case Studies'] },
              { icon: 'fa-hospital',        name: 'Healthcare & Wellness',    useCase: 'Patient education content, symptom guides, doctor-authored articles, and regulatory-compliant health information that builds real credibility.', tags: ['Patient Education', 'Health Guides', 'Doctor Content'] },
              { icon: 'fa-landmark',        name: 'Finance & Legal',          useCase: 'Compliance-aware financial education content, tax guides, investment explainers, and legal FAQ articles that build trust and generate inbound leads.', tags: ['Financial Education', 'Tax Guides', 'FAQ Content'] },
              { icon: 'fa-building',        name: 'Real Estate',              useCase: 'Area guide content, property buying checklists, investment guides, and neighborhood reviews that rank in local searches and attract serious buyers.', tags: ['Area Guides', 'Buying Checklists', 'Local SEO Content'] },
              { icon: 'fa-graduation-cap',  name: 'Education & Training',     useCase: 'Curriculum content, study guides, career articles, and exam preparation resources that attract students at the top of their research journey.', tags: ['Study Guides', 'Career Content', 'Exam Prep'] },
              { icon: 'fa-hotel',           name: 'Travel & Hospitality',     useCase: 'Destination content, travel guides, hotel comparison articles, and experience-focused stories that attract travelers in the inspiration and planning stage.', tags: ['Destination Guides', 'Travel Stories', 'Hotel Content'] },
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
              { title: 'Research',   desc: 'Keyword research, competitor content audit, audience persona development, and content gap analysis to prioritize the highest-impact topics first.' },
              { title: 'Strategy',   desc: 'Content calendar, topic clusters, format mix by channel, and a publishing plan that fits your resources, goals, and competitive landscape.' },
              { title: 'Create',     desc: 'Write, design, and review each piece. Two rounds of feedback built into every piece before it is published, no surprises at your end.' },
              { title: 'Distribute', desc: 'Publish, promote via social and email, and run link building outreach. Content that sits unshared does not grow, distribution is half the job.' },
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
                { label: 'Social Media Marketing',  href: '/social-media-marketing' },
                { label: 'AI Marketing Systems',    href: '/ai-marketing-systems'   },
                { label: 'Google & Meta Ads',       href: '/google-meta-ads'        },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection eyebrow="Let's Work Together" title="Build Content That" titleHighlight="Brings Customers" subtitle="Content that ranks and converts is a long-term asset, not an expense. Start building yours today and own your organic traffic for years to come." />
    </>
  )
}
