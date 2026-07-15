'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import s from '@/components/pages/ServicePageDashboard.module.css'

const CAPS = [
  { icon: 'fa-newspaper',      metric: 'Relationship-Led', title: 'Media Relations and Press Coverage',  desc: 'As a startup PR agency at our core, we build genuine relationships with journalists and editors across national, regional, and trade publications. We pitch stories that get placed because we understand what makes news.' },
  { icon: 'fa-file-pen',       metric: 'Publication-ready', title: 'Press Release and Content Writing', desc: 'Compelling press releases, bylined articles, white papers, and opinion pieces written for publication, exactly the toolkit a product launch PR campaign leans on hardest. Content that positions your leadership as credible industry voices.' },
  { icon: 'fa-microphone',     metric: 'Year-round',     title: 'Thought Leadership Programs',         desc: 'Speaking opportunity sourcing at industry conferences, podcast placements, panel nominations, and a consistent editorial calendar that builds founder reputation month over month.' },
  { icon: 'fa-shield-halved',  metric: '48-Hour SLA',    title: 'Crisis Communications',               desc: 'When something goes wrong, speed and message control matter. We provide 48-hour crisis response, media monitoring, holding statement drafting, and spokesperson coaching.' },
  { icon: 'fa-trophy',         metric: 'Curated',        title: 'Award and Recognition Programs',      desc: 'Research, identify, and submit applications for industry awards, startup recognitions, and editorial lists that create third-party validation for your brand.' },
  { icon: 'fa-chart-line',     metric: 'Share of voice', title: 'PR Analytics and Reporting',          desc: 'Media value equivalent tracking, share of voice analysis, sentiment monitoring, and monthly coverage reports with tier-wise breakdown of placements.' },
]

const FAQS = [
  { q: 'Can you guarantee media coverage?', a: 'No ethical PR agency can guarantee specific placements, and you should be skeptical of any that do. What we can guarantee is quality pitching, genuine journalist relationships, and honest reporting on every story we take on, whether it lands or not.' },
  { q: 'How long does it take to see PR results?', a: 'First placements typically happen within 3 to 4 weeks of onboarding. Building a consistent media presence and share of voice takes 3 to 6 months of sustained effort. PR is a long game that compounds over time rather than a one-time spike.' },
  { q: 'Which publications do you pitch stories to?', a: 'We pitch to business publications such as Economic Times, Business Standard, Mint, Forbes India, and Inc42 for startups, depending on what fits your story. We also work with sector-specific trade publications across tech, healthcare, finance, and retail.' },
  { q: 'Do you handle social media PR as well?', a: 'Yes, we work with your social media and marketing team to share earned media coverage further, help founders build personal brand presence on LinkedIn, and coordinate influencer collaborations as part of integrated campaigns.' },
  { q: 'What happens during a PR crisis?', a: 'We activate within 48 hours with a holding statement, media monitoring, and a crisis communications plan. We help you control the narrative, identify the right spokesperson, and manage journalist inquiries so the situation does not spiral further.' },
  { q: 'Is PR worth it for a small business or early-stage startup?', a: 'Yes, a single credible article can do more for trust than months of paid ads, especially for a startup that needs investors, partners, or early customers to take it seriously. The catch is that PR rewards patience: it builds a reputation over months, not a single press release.' },
  { q: 'Do you work specifically with early-stage startups, or mainly established companies?', a: 'We work with both, and a meaningful share of our PR clients are early-stage startups building credibility from scratch. For startups we usually prioritize founder-story angles and product-launch news first, since those are the easiest hooks for journalists when there is not yet a long track record to point to.' },
  { q: 'How do you run PR for a product launch specifically?', a: 'Product launch PR is built around a tight embargo timeline. We brief select journalists ahead of the public date under embargo, coordinate the press release, founder interviews, and any launch-day assets, and time everything to a single coordinated moment rather than a slow trickle of coverage. We also line up follow-on angles, reviews, use cases, milestones, so the story does not die after launch day.' },
  { q: 'Is hiring a PR agency realistic for a small, non-startup business?', a: 'Yes, though the strategy looks different than for a funded startup. Small businesses often get more traction from regional and trade publication coverage, local business awards, and founder thought-leadership than chasing national tech press, and the retainer scope adjusts to match a smaller, steadier drumbeat of coverage rather than a big launch push.' },
  { q: 'How much does a PR agency cost?', a: 'PR retainers in India typically range from ₹40,000 to ₹1,50,000+ a month depending on scope, media relations only versus a full program with thought leadership and crisis readiness, and how competitive your industry\'s press coverage is. We share an exact quote after understanding your goals and the publications you are aiming for.' },
  { q: 'How do I get press coverage for my startup?', a: "Start with a genuinely newsworthy angle, a funding round, a meaningful product launch, or a data point journalists haven't seen, rather than a generic company announcement. Build relationships with a handful of relevant journalists before you need them, and be ready to respond fast when a reporter shows interest, since news cycles move in hours, not weeks." },
]

const TIERS = [
  {
    name: 'Tier 1 National', icon: 'fa-newspaper',
    color: '#0284c7', bgColor: 'rgba(2,132,199,0.12)', borderColor: 'rgba(2,132,199,0.3)',
    audience: 'Large national readership', impact: 'Brand credibility, investor trust',
    pubs: ['Economic Times', 'Hindustan Times', 'Business Standard', 'Mint'],
  },
  {
    name: 'Startup & Business', icon: 'fa-rocket',
    color: '#7c3aed', bgColor: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)',
    audience: 'Founders, VCs, early adopters', impact: 'Funding buzz, talent recruitment',
    pubs: ['Inc42', 'YourStory', 'Forbes India', 'The Ken'],
  },
  {
    name: 'Trade & Sector Media', icon: 'fa-industry',
    color: '#059669', bgColor: 'rgba(5,150,105,0.12)', borderColor: 'rgba(5,150,105,0.3)',
    audience: 'Industry professionals, buyers', impact: 'Thought leadership, B2B trust',
    pubs: ['ETCFO', 'MediaNama', 'ETPHARMA', 'Autocar India'],
  },
  {
    name: 'Regional Media', icon: 'fa-map-location-dot',
    color: '#d97706', bgColor: 'rgba(217,119,6,0.12)', borderColor: 'rgba(217,119,6,0.3)',
    audience: 'Regional market audiences', impact: 'Tier-2/3 city brand reach',
    pubs: ['Dainik Bhaskar', 'Eenadu', 'Ananda Bazar', 'Divya Bhaskar'],
  },
]

function MediaCoverageVisual() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '15%', left: '8%', width: 440, height: 440, background: 'radial-gradient(circle, rgba(2,132,199,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '15%', right: '8%', width: 380, height: 380, background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>Media Network</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            Your Media Relations Agency.{' '}
            <span className="grad-text">Real Placements. Real Reach.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            Earned media is the most credible form of marketing. We have spent years building genuine relationships with journalists and editors across every major publication tier in India, and we're extending that network internationally as we take on clients worldwide.
          </p>
        </div>

        {/* 4 publication tier cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 1020, margin: '0 auto' }} className="tier-grid">
          {TIERS.map((tier, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${tier.borderColor}`, borderRadius: 20, padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: tier.bgColor, border: `1px solid ${tier.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`fa-solid ${tier.icon}`} style={{ color: tier.color, fontSize: 16 }} />
                  </div>
                  <span style={{ background: tier.bgColor, border: `1px solid ${tier.borderColor}`, color: tier.color, borderRadius: 6, padding: '3px 9px', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-m)', letterSpacing: 0.3 }}>
                    {tier.name}
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: tier.color, fontWeight: 700, fontFamily: 'var(--font-m)', marginBottom: 4 }}>{tier.audience}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{tier.impact}</div>
              </div>

              {/* Publication list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-m)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Key Publications</div>
                {tier.pubs.map((pub, j) => (
                  <div key={j} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, background: tier.bgColor, border: `1px solid ${tier.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: tier.color, fontWeight: 800, flexShrink: 0 }}>
                      {pub[0]}
                    </div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{pub}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Story development flow */}
        <div style={{ maxWidth: 860, margin: '56px auto 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-m)', letterSpacing: 2, textTransform: 'uppercase' }}>How Every Story is Placed</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }} className="pr-flow">
            {[
              { icon: 'fa-lightbulb',       label: 'Story Angle' },
              { icon: 'fa-pen-nib',         label: 'Write & Draft' },
              { icon: 'fa-address-book',    label: 'Target Journalist' },
              { icon: 'fa-paper-plane',     label: 'Pitch & Follow-up' },
              { icon: 'fa-newspaper',       label: 'Place & Amplify' },
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

        {/* Coverage stats row */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 44 }}>
          {[
            { stat: 'Multi-Tier', label: 'Publication Coverage', color: '#0284c7' },
            { stat: 'Genuine',   label: 'Journalist Relationships', color: '#7c3aed' },
            { stat: 'In-House',  label: 'PR & Comms Team',    color: '#059669' },
            { stat: '48hr',      label: 'Crisis Response',    color: '#d97706' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${item.color}30`, borderRadius: 14, padding: '14px 24px', textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: item.color, fontFamily: 'var(--font-h)' }}>{item.stat}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-m)', marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) { .tier-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .tier-grid { grid-template-columns: 1fr !important; } .pr-flow { flex-direction: column; } }
      `}</style>
    </section>
  )
}

export default function PRCampaignsPageContent() {
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
              name: 'PR & Media Relations',
              description: "PR campaigns from ThinkSuite's in-house team: media coverage, press releases, journalist outreach, crisis communications, and thought leadership programs for brands worldwide.",
              url: 'https://thinksuite.in/pr-campaigns',
              serviceType: 'Public Relations',
              keywords: ['PR agency', 'public relations agency', 'media relations agency'],
            })
          ),
        }}
      />
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/#services">Advertising</Link><span>/</span>
            <span style={{ color: 'var(--text)' }}>PR Campaigns</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Earned Media',      color: '#0284c7' },
              { label: 'Thought Leadership', color: '#7c3aed' },
              { label: 'Crisis Comms',      color: '#d97706' },
            ].map((b, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${b.color}14`, border: `1px solid ${b.color}30`, borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: b.color, fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>
                <i className="fa-solid fa-newspaper" style={{ fontSize: 9 }} /> {b.label}
              </span>
            ))}
          </div>
          <h1 className="mt-8">PR <span className="grad-text">Campaigns</span></h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            An honest article in the right publication does more for your credibility than a thousand ads ever will. ThinkSuite is an in-house PR agency that builds genuine journalist relationships, writes the pitch, handles the follow-up, and gets your story into the media your customers already read and trust.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">Start Your PR Program <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="#what-we-offer" className="btn btn-outline">See Capabilities <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} /></Link>
          </div>
        </div>
      </section>

      <div className={s.statsRow}>
        {[
          { number: 'In-House',   label: 'PR & Comms Team'       },
          { number: 'Worldwide',  label: 'Media Relationships'   },
          { number: '48hr',       label: 'Crisis Response Time'   },
          { number: 'Multi-Tier', label: 'Publication Coverage'   },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      <MediaCoverageVisual />

      <section id="what-we-offer" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Offer</span>
            <h2 style={{ marginTop: 12 }}>Our <span className="grad-text">Public Relations Agency</span> Capabilities</h2>
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
              { icon: 'fa-laptop',            name: 'Tech Startups and SaaS',  useCase: 'Funding announcement coverage, product launch media buzz, founder profiling in startup media, and building visibility ahead of investor meetings or acquisition discussions.', tags: ['Funding PR', 'Product Launch', 'Founder Profiling'] },
              { icon: 'fa-building-columns',  name: 'Finance and BFSI',        useCase: 'Regulatory-compliant communications, thought leadership in financial media, product milestone announcements, and managing reputation during compliance or market events.', tags: ['Regulatory Comms', 'Financial Media', 'Reputation Management'] },
              { icon: 'fa-hospital',          name: 'Healthcare and Pharma',   useCase: 'Medical research coverage, hospital expansion announcements, doctor and specialist profiling, and patient success stories with ethical communications compliance.', tags: ['Research Coverage', 'Hospital Expansion', 'Ethics Compliance'] },
              { icon: 'fa-shop',              name: 'Retail and Consumer Brands', useCase: 'New product launch coverage, festive season brand stories, retail expansion announcements, and influencer media tie-ins for launch amplification at scale.', tags: ['Product Launch', 'Festive PR', 'Retail Expansion'] },
              { icon: 'fa-industry',          name: 'Manufacturing and B2B',   useCase: 'Trade publication coverage, export milestone press releases, sustainability and CSR coverage, and manufacturing capacity announcements for investor and customer audiences.', tags: ['Trade Coverage', 'CSR PR', 'Export Milestones'] },
              { icon: 'fa-graduation-cap',    name: 'Education and EdTech',    useCase: 'Institute ranking announcements, faculty expertise coverage, student placement milestone stories, and new course or campus launches with education media placement.', tags: ['Rankings PR', 'Faculty Coverage', 'Placement Announcements'] },
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
              { title: 'Brand Story and Message House', desc: 'Define your core narrative, key messages, and the proof points that make your brand story credible and newsworthy to journalists.' },
              { title: 'Media List and Pitch Strategy',  desc: 'Build a targeted media list, develop angle-specific pitches for different publications, and identify the right journalists for each story.' },
              { title: 'Outreach and Follow Through',   desc: 'Pitch, follow up, provide supporting material, coordinate interviews, and manage the publication process through to live coverage.' },
              { title: 'Track, Share, Report',          desc: 'Monitor all coverage, share it further across owned channels, measure media value and sentiment, and report monthly with recommendations.' },
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
                { label: 'Content Marketing',      href: '/content-marketing'       },
                { label: 'Social Media Marketing', href: '/social-media-marketing'  },
                { label: 'Influencer Marketing',   href: '/influencer-marketing'    },
                { label: 'Media Advertising',      href: '/media-advertising'       },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Work Together"
        title="Your PR Agency Gets"
        titleHighlight="Your Story in the News"
        subtitle="Your brand has a story worth telling. We make sure the right people read it in the publications they trust."
      />
    </>
  )
}
