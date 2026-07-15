'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from '@/components/pages/ServicePageDashboard.module.css'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'

const CAPS = [
  { icon: 'fa-store',    metric: 'Long Dwell',    title: 'Mall and Retail Space Advertising', desc: 'Food court panels, escalator branding, elevator wraps, floor graphics, and in-store digital screens that engage shoppers at the highest intent moments in their purchase journey.' },
  { icon: 'fa-plane',    metric: 'High Income',   title: 'Airport and Transit Hub Branding',  desc: 'Departure lounge lightboxes, boarding gate panels, baggage belt branding, and aerobridge wraps targeting high-income frequent travelers with extended dwell time.' },
  { icon: 'fa-building', metric: 'B2B targeting',  title: 'Corporate and Office Park Media',   desc: 'Elevator panels, lobby digital screens, cafe advertising, and reception area branding in tech parks and corporate campuses targeting decision-makers at work.' },
  { icon: 'fa-hospital', metric: 'Captive context', title: 'Healthcare Venue Advertising',     desc: 'Waiting room screens, clinic corridor panels, pharmacy counter displays, and diagnostic lab advertising targeting patients and caregivers in a high-attention environment.' },
  { icon: 'fa-star',     metric: 'Trial & social', title: 'Experiential and In-Store Activations', desc: 'Brand zones, product sampling stations, interactive kiosks, and live experience counters inside high-footfall retail environments that drive trial and social sharing.' },
  { icon: 'fa-display',  metric: 'Remote scheduling', title: 'Digital In-Store Display Networks', desc: 'Manage content across distributed screen networks in retail chains or franchise locations. Schedule promotions, update pricing, and run seasonal campaigns remotely.' },
]

const FAQS = [
  { q: 'What types of indoor venues do you cover?', a: 'We cover malls, airports, metro stations, corporate parks, hospitals, clinics, gyms, cinemas, coworking spaces, colleges, and restaurants. We can source inventory across any high-footfall indoor environment where your audience actually spends time.' },
  { q: 'Is indoor advertising more expensive than outdoor?', a: 'Cost per exposure is often lower for indoor because dwell times are much longer. A shopper spends a good stretch of time inside a mall compared to a few seconds glancing at a hoarding from the road, so your brand gets multiple exposures per visit instead of one quick glance.' },
  { q: 'Can you run campaigns in multiple cities simultaneously?', a: 'Yes, we manage multi-city indoor campaigns through our vendor network across major Indian cities. All campaign management, creative distribution, and reporting is centralized through our team so you get one point of contact regardless of how many cities are running.' },
  { q: 'Do you offer digital indoor screens?', a: 'Yes, we have access to digital screen networks in malls, airports, and corporate parks that let you run dynamic content, schedule ads by time of day, and update creatives without reprinting anything.' },
  { q: 'How far in advance do I need to book indoor advertising?', a: 'For premium venues like airports and top-tier malls, 3 to 4 weeks advance booking is advisable. For other venues, 10 to 14 days is usually sufficient, though festival seasons and the start of the year can book up quickly.' },
  { q: 'Why would a brand choose indoor advertising over a billboard?', a: 'Indoor advertising puts your brand in front of someone who is standing still, waiting, or moving slowly through a space, which means they actually have time to read your message rather than glimpse it for a second at a traffic signal. It also lets you show up closer to the actual moment of purchase, inside the mall or store where the decision gets made.' },
  { q: 'How much does mall advertising cost in India?', a: 'Mall advertising in India typically ranges from ₹25,000 to ₹2,00,000+ per month depending on the venue tier, placement (food court panel vs elevator wrap vs digital screen network), and city. Premium malls in metro cities command a higher rate than tier-2 city malls, and digital screen slots are usually priced per rotation rather than a flat monthly fee.' },
  { q: 'What is indoor advertising?', a: 'Indoor advertising is any paid brand placement inside an enclosed, high-footfall venue, malls, airports, corporate parks, hospitals, and similar spaces, as opposed to outdoor hoardings and billboards. It typically takes the form of static panels, digital screens, wraps, or experiential brand zones placed where people naturally spend extended time.' },
  { q: 'What are the best indoor advertising locations for brand visibility?', a: 'Malls and airports generally deliver the best visibility because of long dwell times and a captive, high-intent audience, malls for retail and FMCG brands, airports for premium and B2B brands targeting frequent travelers. Corporate parks work well for B2B and SaaS brands trying to reach decision-makers directly at their workplace.' },
  { q: 'Do you handle indoor advertising in airports?', a: 'Yes. We source inventory across departure lounges, boarding gates, baggage belts, and aerobridges, giving you access to a high-income, frequent-traveler audience with extended dwell time compared to most other indoor venues.' },
  { q: 'Can indoor advertising be combined with outdoor or digital campaigns?', a: 'Yes, and we recommend it. Pairing indoor placements with outdoor hoardings and digital retargeting creates multiple touchpoints across a customer\'s day, someone might see your billboard on the commute, then your mall panel while shopping, reinforcing recall far more than any single channel alone.' },
]

const VENUES = [
  {
    icon: 'fa-store', name: 'Shopping Malls', dwell: '60 to 90 min',
    color: '#0284c7', bgColor: 'rgba(2,132,199,0.12)', borderColor: 'rgba(2,132,199,0.3)',
    audience: 'Urban shoppers, families, millennials',
    formats: ['Food Court Panels', 'Escalator Branding', 'Floor Graphics', 'Digital Screens'],
    stat: 'Malls Nationwide',
  },
  {
    icon: 'fa-plane', name: 'Airports & Lounges', dwell: '45 to 75 min',
    color: '#7c3aed', bgColor: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)',
    audience: 'Frequent flyers, business class',
    formats: ['Departure Lightboxes', 'Boarding Gate Panels', 'Aerobridge Wraps', 'Baggage Belt'],
    stat: 'Major Airports Covered',
  },
  {
    icon: 'fa-building', name: 'Corporate Parks & Offices', dwell: '8 hrs/day',
    color: '#059669', bgColor: 'rgba(5,150,105,0.12)', borderColor: 'rgba(5,150,105,0.3)',
    audience: 'Decision-makers, IT professionals',
    formats: ['Elevator Panels', 'Lobby Screens', 'Cafe Advertising', 'Reception Branding'],
    stat: 'Targeting C-suite to managers',
  },
  {
    icon: 'fa-hospital', name: 'Healthcare Facilities', dwell: '20 to 40 min',
    color: '#d97706', bgColor: 'rgba(217,119,6,0.12)', borderColor: 'rgba(217,119,6,0.3)',
    audience: 'Patients, caregivers, doctors',
    formats: ['Waiting Room Screens', 'Corridor Panels', 'Pharmacy Counters', 'Clinic Posters'],
    stat: 'Captive, receptive audience',
  },
  {
    icon: 'fa-dumbbell', name: 'Gyms & Fitness Centers', dwell: '60 to 90 min',
    color: '#e11d48', bgColor: 'rgba(225,29,72,0.12)', borderColor: 'rgba(225,29,72,0.3)',
    audience: 'Health-conscious, age 20 to 45',
    formats: ['Locker Room Panels', 'Reception Branding', 'Studio Screens', 'Changing Room Ads'],
    stat: 'Fitness Centers Nationwide',
  },
]

function VenueDwellVisual() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '12%', right: '10%', width: 420, height: 420, background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '12%', left: '10%', width: 380, height: 380, background: 'radial-gradient(circle, rgba(2,132,199,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>Venue Categories</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            Where Your Audience{' '}
            <span className="grad-text">Spends Their Time.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            Indoor advertising works because of dwell time. When your audience is already inside, they actually read what is in front of them. We place your brand at those exact moments across every major venue category.
          </p>
        </div>

        {/* Venue cards, 5 in a row, wrap to 3+2 on tablet */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, maxWidth: 1060, margin: '0 auto' }} className="venue-grid">
          {VENUES.map((v, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${v.borderColor}`, borderRadius: 20, padding: '22px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: v.bgColor, border: `1px solid ${v.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`fa-solid ${v.icon}`} style={{ color: v.color, fontSize: 15 }} />
                  </div>
                  <span style={{ background: v.bgColor, border: `1px solid ${v.borderColor}`, color: v.color, borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-m)' }}>{v.dwell}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-h)', marginBottom: 4 }}>{v.name}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{v.audience}</div>
              </div>

              {/* Format list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {v.formats.map((fmt, j) => (
                  <div key={j} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 7, padding: '4px 9px', fontSize: 10, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: v.color, flexShrink: 0 }} />
                    {fmt}
                  </div>
                ))}
              </div>

              {/* Stat badge */}
              <div style={{ marginTop: 'auto', background: v.bgColor, border: `1px solid ${v.borderColor}`, borderRadius: 10, padding: '7px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 10.5, color: v.color, fontWeight: 700, fontFamily: 'var(--font-m)' }}>{v.stat}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Dwell time comparison bar */}
        <div style={{ maxWidth: 760, margin: '56px auto 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-m)', letterSpacing: 2, textTransform: 'uppercase' }}>Dwell Time Advantage vs Outdoor</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Corporate Park (all day)', value: 95, time: '8 hrs', color: '#059669' },
              { label: 'Mall / Airport',           value: 70, time: '75 min', color: '#0284c7' },
              { label: 'Gym / Fitness',            value: 65, time: '70 min', color: '#e11d48' },
              { label: 'Healthcare Waiting',       value: 35, time: '30 min', color: '#d97706' },
              { label: 'Roadside Billboard',       value: 3,  time: '3 sec',  color: 'rgba(255,255,255,0.2)' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 160, fontSize: 11.5, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-m)', textAlign: 'right', flexShrink: 0 }}>{row.label}</div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 100, height: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${row.value}%`, height: '100%', background: `linear-gradient(to right, ${row.color}, ${row.color}88)`, borderRadius: 100, transition: 'width 1s ease' }} />
                </div>
                <div style={{ width: 52, fontSize: 11.5, color: row.color, fontWeight: 700, fontFamily: 'var(--font-m)', flexShrink: 0 }}>{row.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
          <div style={{ background: 'linear-gradient(135deg, #1a237e, #7c3aed, #0284c7)', color: '#fff', borderRadius: 100, padding: '14px 40px', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-h)', letterSpacing: 0.5, boxShadow: '0 8px 32px rgba(0,188,212,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-building" style={{ fontSize: 13 }} />
            Venues Across Malls, Airports, Offices, Clinics, and Gyms
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .venue-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 580px) { .venue-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </section>
  )
}

export default function IndoorAdvertisingPageContent() {
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
          __html: JSON.stringify(buildServiceSchema({
            name: 'Indoor Advertising',
            description: 'Mall, airport, corporate park, and healthcare venue advertising across India, static panels, digital screens, and experiential activations.',
            url: 'https://thinksuite.in/indoor-advertising',
            serviceType: 'Indoor Advertising',
            keywords: ['indoor advertising agency', 'mall advertising agency', 'indoor media advertising India'],
          })),
        }}
      />
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/#services">Advertising</Link><span>/</span>
            <span style={{ color: 'var(--text)' }}>Indoor Advertising</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Malls & Airports', color: '#0284c7' },
              { label: 'Corporate Parks',  color: '#059669' },
              { label: 'Healthcare',       color: '#d97706' },
            ].map((b, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${b.color}14`, border: `1px solid ${b.color}30`, borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: b.color, fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>
                <i className="fa-solid fa-building" style={{ fontSize: 9 }} /> {b.label}
              </span>
            ))}
          </div>
          <h1 className="mt-8">Indoor <span className="grad-text">Advertising</span></h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            Indoor spaces are where purchase decisions actually happen. ThinkSuite is an in-house indoor advertising agency that places your brand inside malls, airports, corporate parks, and clinics, exactly where someone is standing still with time to notice you, so a browser becomes a buyer before they even walk out the door.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">Explore Indoor Options <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="#what-we-offer" className="btn btn-outline">See Venue Types <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} /></Link>
          </div>
        </div>
      </section>

      <div className={s.statsRow}>
        {[
          { number: 'Multi-Venue', label: 'Malls to Corporate Parks' },
          { number: 'In-House',    label: 'Site Sourcing Team'       },
          { number: 'High-Intent', label: 'Point-of-Purchase Placement' },
          { number: 'Long',        label: 'Dwell Time Exposure'      },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      <VenueDwellVisual />

      <section id="what-we-offer" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Offer</span>
            <h2 style={{ marginTop: 12 }}>Our <span className="grad-text">Indoor Advertising Capabilities</span></h2>
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
              { icon: 'fa-gem',         name: 'Fashion and Luxury Retail', useCase: 'Premium in-store visual merchandising, luxury mall corridor branding, and airport lightboxes targeting the international traveler segment with high purchase intent.', tags: ['Visual Merchandising', 'Luxury Mall', 'Airport OOH'] },
              { icon: 'fa-pills',       name: 'Pharma and Healthcare Brands', useCase: 'Pharmacy counter displays, clinic poster programs, hospital network advertising, and OTC product visibility at point of purchase within healthcare settings.', tags: ['Pharmacy Counter', 'Clinic Posters', 'Hospital Network'] },
              { icon: 'fa-laptop',      name: 'B2B Tech and SaaS',         useCase: 'Tech park lobby screens, conference room displays, and coworking space advertising reaching CTOs, product managers, and procurement heads at their desks.', tags: ['Tech Park', 'Coworking Spaces', 'B2B Decision Makers'] },
              { icon: 'fa-utensils',    name: 'Food and Beverage',         useCase: 'Food court panel advertising near vendor stalls, new product launch activations in QSR locations, and sampling campaigns in grocery retail to drive first trial.', tags: ['Food Court', 'Product Sampling', 'QSR Advertising'] },
              { icon: 'fa-graduation-cap', name: 'Education and Coaching', useCase: 'Campus notice board advertising, exam center proximity branding, and coaching institute displays near competitive exam prep hubs and libraries.', tags: ['Campus Advertising', 'Exam Center', 'Library Proximity'] },
              { icon: 'fa-dumbbell',    name: 'Health, Fitness and Wellness', useCase: 'Gym locker room panels, yoga studio reception branding, and sports complex advertising reaching fitness-conscious audiences during high-engagement activity.', tags: ['Gym Panels', 'Yoga Studio', 'Sports Complex'] },
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
              { title: 'Venue and Audience Mapping',  desc: 'Identify the indoor venues where your target audience spends time and map the best touchpoints within each venue.' },
              { title: 'Format Selection and Booking', desc: 'Choose the right formats for each venue, negotiate packages, and book slots with confirmed floor plans and display positions.' },
              { title: 'Creative Production',          desc: 'Design and produce format-specific creatives optimized for indoor viewing distance, dwell time, and the purchase moment context.' },
              { title: 'Install, Monitor, Evaluate',   desc: 'Coordinate installation, collect photo and video proof of display, and gather audience exposure reports with post-campaign analysis.' },
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
                { label: 'Outdoor Advertising', href: '/outdoor-advertising'  },
                { label: 'Media Advertising',   href: '/media-advertising'    },
                { label: 'PR Campaigns',        href: '/pr-campaigns'         },
                { label: 'Social Media Marketing', href: '/social-media-marketing' },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Work Together"
        title="Reach Buyers"
        titleHighlight="at the Right Moment"
        subtitle="The best time to be in front of a customer is when they are already in buying mode. Indoor advertising puts you exactly there."
      />
    </>
  )
}
