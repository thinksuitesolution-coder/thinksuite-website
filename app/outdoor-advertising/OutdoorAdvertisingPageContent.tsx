'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from '@/components/pages/ServicePageDashboard.module.css'

const CAPS = [
  { icon: 'fa-rectangle-ad',       metric: '500+ sites',     title: 'Billboard and Hoarding Campaigns', desc: 'Strategic site selection, negotiation, design brief, print coordination, and live monitoring. We manage the full campaign lifecycle from brief to display.' },
  { icon: 'fa-bus',                metric: '50k+ vehicles',  title: 'Transit and Mobile Advertising',   desc: 'Bus wraps, auto-rickshaw branding, metro panels, and cab advertising that moves with your audience through the city throughout the day.' },
  { icon: 'fa-map-location-dot',   metric: 'Data-backed',    title: 'Location Strategy and GeoPlanning', desc: 'Data-driven site selection using footfall analytics, competitor proximity, catchment area demographics, and traffic flow mapping for maximum impact per rupee.' },
  { icon: 'fa-lightbulb',          metric: 'Dynamic updates', title: 'Digital Out-of-Home (DOOH)',       desc: 'LED screen campaigns with time-of-day scheduling, weather-triggered creatives, and real-time campaign changes without costly reprints.' },
  { icon: 'fa-palette',            metric: '3-second test',  title: 'OOH Creative and Design',          desc: 'Billboard-optimized creative with 3-second readability testing. We design for distance, speed, and ambient light so your message lands every time.' },
  { icon: 'fa-chart-bar',          metric: 'Attribution',    title: 'Campaign Measurement',             desc: 'Mobile foot traffic analysis, brand lift surveys, QR code scan tracking, and correlation with online search volume spikes to quantify outdoor campaign impact.' },
]

const FAQS = [
  { q: 'Which cities do you operate in?', a: 'We currently manage outdoor campaigns across 15+ cities including Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai, Ahmedabad, and Jaipur. For tier-2 cities, we work with our vendor network to source and manage sites.' },
  { q: 'What is the minimum budget for an outdoor campaign?', a: 'A meaningful outdoor campaign typically starts at Rs 2 to 3 lakh for a single city over one month. This covers 3 to 5 premium sites, creative, and printing. Smaller budgets are possible with transit advertising or digital OOH formats.' },
  { q: 'How long does it take to go live?', a: 'From final brief to hoarding going up is typically 10 to 14 days. This includes site confirmation, creative finalization, printing, and mounting. Rush timelines of 7 days are possible with a surcharge.' },
  { q: 'Can you combine outdoor with digital campaigns?', a: 'Yes, and we strongly recommend it. Outdoor builds awareness at scale while digital retargets people who have been exposed. We run integrated OOH plus digital campaigns that improve conversion rates significantly.' },
  { q: 'How do you measure the impact of outdoor advertising?', a: 'We use a combination of mobile footfall data around site locations, brand lift surveys, QR code or landing page tracking on the creative, and monitoring spikes in branded search volume during the campaign period.' },
]

const FORMATS = [
  {
    icon: 'fa-rectangle-ad', name: 'Billboards & Hoardings', size: '20×10 ft to 40×20 ft',
    color: '#0284c7', bgColor: 'rgba(2,132,199,0.12)', borderColor: 'rgba(2,132,199,0.3)',
    placement: 'Arterial roads, highways, junctions', advantage: 'Maximum visibility, brand stature',
    stat: '65% brand recall', formats: ['Flex Hoardings', 'Backlit Panels', 'Gantry Boards'],
  },
  {
    icon: 'fa-bus', name: 'Transit & Mobile OOH', size: 'Bus / Auto / Metro / Cab',
    color: '#059669', bgColor: 'rgba(5,150,105,0.12)', borderColor: 'rgba(5,150,105,0.3)',
    placement: 'Moving through city routes all day', advantage: 'City-wide mobile coverage',
    stat: '50k+ vehicles', formats: ['Bus Wraps', 'Auto Branding', 'Cab Advertising'],
  },
  {
    icon: 'fa-display', name: 'Digital OOH (DOOH)', size: 'LED screens, 10×6 ft+',
    color: '#7c3aed', bgColor: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)',
    placement: 'Premium junctions, malls, airports', advantage: 'Dynamic content, time-of-day ads',
    stat: 'Real-time updates', formats: ['Time-of-Day Ads', 'Weather Triggers', 'Animated Creatives'],
  },
  {
    icon: 'fa-train-subway', name: 'Metro & Station Ads', size: 'Platform panels, concourses',
    color: '#d97706', bgColor: 'rgba(217,119,6,0.12)', borderColor: 'rgba(217,119,6,0.3)',
    placement: 'Platform, concourse, entry gates', advantage: 'Captive commuter audience daily',
    stat: '4.5x dwell time', formats: ['Platform Panels', 'Pillar Wraps', 'Gate Branding'],
  },
]

const CITIES = [
  { name: 'Mumbai', sites: '120+', icon: 'fa-city' },
  { name: 'Delhi NCR', sites: '95+', icon: 'fa-city' },
  { name: 'Bangalore', sites: '80+', icon: 'fa-city' },
  { name: 'Hyderabad', sites: '65+', icon: 'fa-city' },
  { name: 'Pune', sites: '55+', icon: 'fa-city' },
  { name: 'Chennai', sites: '50+', icon: 'fa-city' },
]

function OOHFormatsVisual() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '10%', left: '5%', width: 480, height: 480, background: 'radial-gradient(circle, rgba(2,132,199,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>OOH Format Types</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            Every Surface.{' '}
            <span className="grad-text">Every Audience. Covered.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            From highway hoardings to metro panels to DOOH screens, we select the formats that match your audience, location, and brand impact goals, not whatever inventory is cheapest.
          </p>
        </div>

        {/* 4 format cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 1020, margin: '0 auto' }} className="format-grid">
          {FORMATS.map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${f.borderColor}`, borderRadius: 20, padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: f.bgColor, border: `1px solid ${f.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`fa-solid ${f.icon}`} style={{ color: f.color, fontSize: 16 }} />
                  </div>
                  <span style={{ background: f.bgColor, border: `1px solid ${f.borderColor}`, color: f.color, borderRadius: 6, padding: '3px 9px', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-m)', letterSpacing: 0.3 }}>{f.stat}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-h)', marginBottom: 4 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: f.color, fontWeight: 700, fontFamily: 'var(--font-m)', marginBottom: 6 }}>{f.size}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{f.placement}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {f.formats.map((fmt, j) => (
                  <div key={j} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '5px 10px', fontSize: 10.5, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: f.color, flexShrink: 0 }} />
                    {fmt}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', background: f.bgColor, border: `1px solid ${f.borderColor}`, borderRadius: 10, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, color: f.color, fontFamily: 'var(--font-m)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Key Advantage</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{f.advantage}</div>
              </div>
            </div>
          ))}
        </div>

        {/* City coverage */}
        <div style={{ maxWidth: 860, margin: '56px auto 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-m)', letterSpacing: 2, textTransform: 'uppercase' }}>Pan-India Coverage, 15+ Cities</div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {CITIES.map((city, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,188,212,0.2)', borderRadius: 12, padding: '12px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 110 }}>
                <i className={`fa-solid ${city.icon}`} style={{ color: '#00bcd4', fontSize: 18 }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-h)' }}>{city.name}</div>
                <div style={{ fontSize: 11, color: '#00bcd4', fontFamily: 'var(--font-m)', fontWeight: 700 }}>{city.sites} sites</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
          <div style={{ background: 'linear-gradient(135deg, #1a237e, #0284c7, #d97706)', color: '#fff', borderRadius: 100, padding: '14px 40px', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-h)', letterSpacing: 0.5, boxShadow: '0 8px 32px rgba(0,188,212,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-location-dot" style={{ fontSize: 13 }} />
            500+ Premium Sites Managed Across India
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) { .format-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .format-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

export default function OutdoorAdvertisingPageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/#services">Advertising</Link><span>/</span>
            <span style={{ color: 'var(--text)' }}>Outdoor Advertising</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Billboards',  color: '#0284c7' },
              { label: 'Transit OOH', color: '#059669' },
              { label: 'DOOH / LED',  color: '#7c3aed' },
            ].map((b, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${b.color}14`, border: `1px solid ${b.color}30`, borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: b.color, fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>
                <i className="fa-solid fa-location-dot" style={{ fontSize: 9 }} /> {b.label}
              </span>
            ))}
          </div>
          <h1 className="mt-8">Outdoor <span className="grad-text">Advertising</span></h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            A well-placed hoarding still stops people in their tracks. Combined with digital tracking and smart location planning, outdoor advertising delivers brand recall no screen can match.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">Book OOH Campaign <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="#what-we-offer" className="btn btn-outline">See Formats <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} /></Link>
          </div>
        </div>
      </section>

      <div className={s.statsRow}>
        {[
          { number: '500+', label: 'Sites Managed'      },
          { number: '15+',  label: 'Cities Pan-India'   },
          { number: '65%',  label: 'Brand Recall Lift'  },
          { number: '3x',   label: 'Footfall Correlation' },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      <OOHFormatsVisual />

      <section id="what-we-offer" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Offer</span>
            <h2 style={{ marginTop: 12 }}>Our <span className="grad-text">Outdoor Advertising Capabilities</span></h2>
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
              { icon: 'fa-building',      name: 'Real Estate Developers', useCase: 'Project launch hoardings near the site, arterial road billboards targeting buyers driving through the area, and transit ads on routes used by target demographics.', tags: ['Project Launch', 'Site Proximity', 'Buyer Targeting'] },
              { icon: 'fa-store',         name: 'Retail and QSR',         useCase: 'Catchment area hoardings within 2km of store locations, mall kiosks, and transit ads to drive footfall with directional messaging and daily offers.', tags: ['Footfall Drive', 'Directional OOH', 'Mall Advertising'] },
              { icon: 'fa-graduation-cap', name: 'Education Institutes',  useCase: 'Admission season campaigns on school and college corridors, metro panels near student commute routes, and university area hoardings during enrollment months.', tags: ['Admission Campaigns', 'Student Corridors', 'Metro Advertising'] },
              { icon: 'fa-heartbeat',     name: 'Healthcare and Hospitals', useCase: 'Hospital proximity hoardings, awareness campaigns on major roads, and transit advertising for specialty clinics targeting specific neighborhoods and catchment areas.', tags: ['Proximity Advertising', 'Awareness Campaigns', 'Specialty Targeting'] },
              { icon: 'fa-utensils',      name: 'Food and Beverage',      useCase: 'New product launch on high-footfall sites, restaurant directional signage, and hunger-timing DOOH ads running meal-time schedules across key city locations.', tags: ['Product Launch', 'Directional Signage', 'Meal-time DOOH'] },
              { icon: 'fa-car',           name: 'Auto and Mobility',      useCase: 'Showroom proximity hoardings, arterial road campaigns during festive buying season, and test drive event OOH with response mechanism to track walk-ins.', tags: ['Showroom Proximity', 'Festive Season', 'Event OOH'] },
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
              { title: 'Brief and Audience Mapping',  desc: 'Understand campaign objectives, target audience locations, and budget to build the optimal OOH media mix and format selection.' },
              { title: 'Site Selection and Booking',  desc: 'GeoPlanning, site visits, rate negotiation, and booking confirmation with printing schedule and go-live timeline.' },
              { title: 'Creative and Print',          desc: 'Billboard-specific creative development, vendor coordination, and display verification with photos on go-live day.' },
              { title: 'Monitor and Report',          desc: 'Regular photo updates, footfall correlation reports, and end-of-campaign brand lift analysis with learnings for the next phase.' },
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
                { label: 'Indoor Advertising',  href: '/indoor-advertising'  },
                { label: 'Media Advertising',   href: '/media-advertising'   },
                { label: 'PR Campaigns',        href: '/pr-campaigns'        },
                { label: 'Google and Meta Ads', href: '/google-meta-ads'     },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Work Together"
        title="Put Your Brand"
        titleHighlight="on the Map"
        subtitle="The right hoarding in the right place at the right time still changes how people see a brand. Let us find those places for you."
      />
    </>
  )
}
