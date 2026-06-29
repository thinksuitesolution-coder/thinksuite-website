'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from '@/components/pages/ServicePageDashboard.module.css'

const CAPABILITIES = [
  { icon: 'fa-layer-group',    metric: 'Multi-tenant', title: 'Multi-Tenant Architecture',    desc: 'Proper data isolation between tenants from day one, shared database or separate schemas, architected for security and scale.' },
  { icon: 'fa-credit-card',   metric: 'Stripe/RazorPay', title: 'Subscription Billing',      desc: 'Plan management, trial periods, proration, invoicing, and dunning for failed payments, fully automated from day one.' },
  { icon: 'fa-users-gear',    metric: 'Granular',    title: 'User Roles & Permissions',       desc: 'Role-based access control so admins, managers, and team members see and do only what their role allows.' },
  { icon: 'fa-gauge-high',    metric: 'Real-time',   title: 'Admin Dashboard & Analytics',    desc: 'Usage analytics, revenue metrics, customer health scores, and system monitoring built in from launch.' },
  { icon: 'fa-puzzle-piece',  metric: 'API + Zapier', title: 'Third-Party Integrations',      desc: 'Native integrations with popular tools, webhooks, and a public API so your SaaS fits into any customer workflow.' },
  { icon: 'fa-circle-check',  metric: 'Fast', title: 'Onboarding & Activation Flows',        desc: 'Guided onboarding that takes new users from signup to their first value moment quickly, reducing churn from day one.' },
]

const INDUSTRIES = [
  { icon: 'fa-briefcase',     name: 'Agencies',           use: 'Client portal SaaS for project management, reporting, and communication, replacing fragmented email threads.' },
  { icon: 'fa-hospital',      name: 'Healthcare',          use: 'Practice management with appointment scheduling, patient records, billing, and telemedicine integration.' },
  { icon: 'fa-graduation-cap', name: 'EdTech',             use: 'LMS, online examination platforms, admission management software, and student progress tracking SaaS.' },
  { icon: 'fa-industry',      name: 'Manufacturing',       use: 'Inventory management SaaS, supply chain tracking, vendor management systems, and production planning tools.' },
  { icon: 'fa-store',         name: 'Retail',              use: 'Multi-store management SaaS, inventory sync across channels, franchise platforms, and loyalty software.' },
  { icon: 'fa-landmark',      name: 'Finance',             use: 'Expense management SaaS, loan origination platforms, portfolio management, and compliance reporting.' },
]

const FAQS = [
  { q: 'How long does it take to build a SaaS product?',          a: 'A focused MVP with core features takes 6,10 weeks. A full-featured product with billing, roles, integrations, and admin dashboard typically takes 12,20 weeks. We share a detailed milestone plan after discovery.' },
  { q: 'What tech stack do you use for SaaS development?',        a: 'We primarily build with Next.js for the frontend, Node.js or Python for the backend, PostgreSQL for data, and AWS or Vercel for infrastructure. We adapt to your existing stack if needed.' },
  { q: 'Can you help with the pricing and monetization model?',   a: 'Yes. We have built SaaS products across subscription, usage-based, freemium, and lifetime deal models. We advise on what works for your market and implement the billing infrastructure accordingly.' },
  { q: 'What happens after the MVP launches?',                    a: 'We offer ongoing sprint-based development for new features, performance optimization, and integrations. We also offer managed hosting and SLA-backed support so you\'re never alone after launch.' },
  { q: 'Who owns the source code?',                              a: 'You own 100% of the source code, IP, and infrastructure. Everything we build is transferred upon project completion. We can also hand over to your internal developers at any stage.' },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MRR_DATA = [12, 18, 24, 31, 38, 42, 55, 63, 71, 82, 91, 100]
const USERS_DATA = [120, 180, 280, 380, 490, 580, 740, 890, 1020, 1240, 1480, 1847]

function SaasDashboardVisual() {
  const [activeMetric, setActiveMetric] = useState<'mrr' | 'users'>('mrr')
  const data = activeMetric === 'mrr' ? MRR_DATA : USERS_DATA
  const maxVal = Math.max(...data)

  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(26,35,126,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '20%', right: '10%', width: 360, height: 360, background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>This Is What We Build</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            Your SaaS.{' '}
            <span className="grad-text">Growing Every Month.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            We build the full dashboard, metrics, billing, user management, and integrations, so your product launches fast and scales without breaking.
          </p>
        </div>

        {/* Dashboard card */}
        <div style={{ maxWidth: 920, margin: '0 auto', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
          {/* Dashboard header */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #1a237e, #00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-chart-line" style={{ color: '#fff', fontSize: 12 }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-h)' }}>YourSaaS Admin</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#28c840', boxShadow: '0 0 8px #28c840' }} />
              <span style={{ fontSize: 10, color: '#28c840', fontFamily: 'var(--font-m)' }}>Live</span>
            </div>
          </div>

          {/* Metrics row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid rgba(255,255,255,0.07)' }} className="metrics-row">
            {[
              { label: 'Monthly Revenue',  val: '₹12,40,000', change: '+28%', up: true,  color: '#00bcd4', icon: 'fa-indian-rupee-sign' },
              { label: 'Active Users',     val: '1,847',       change: '+14%', up: true,  color: '#7c3aed', icon: 'fa-users'            },
              { label: 'Churn Rate',       val: '1.2%',        change: '-0.3%', up: false, color: '#d97706', icon: 'fa-arrow-trend-down' },
              { label: 'Uptime',          val: '99.97%',      change: 'This month', up: true, color: '#059669', icon: 'fa-server'      },
            ].map((m, i) => (
              <div key={m.label} style={{
                padding: '20px 22px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                  <i className={`fa-solid ${m.icon}`} style={{ fontSize: 11, color: m.color }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>{m.label}</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-h)', lineHeight: 1, marginBottom: 6 }}>{m.val}</div>
                <div style={{ fontSize: 10.5, color: m.up ? '#34d399' : '#f87171', fontFamily: 'var(--font-m)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <i className={`fa-solid fa-arrow-${m.up ? 'up' : 'down'}`} style={{ fontSize: 8 }} />
                  {m.change}
                </div>
              </div>
            ))}
          </div>

          {/* Chart section */}
          <div style={{ padding: '24px 28px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-h)' }}>
                {activeMetric === 'mrr' ? 'MRR Growth (₹ Lakhs)' : 'Active Users Growth'}
              </span>
              <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 4 }}>
                {([['mrr', 'Revenue'], ['users', 'Users']] as const).map(([key, label]) => (
                  <button key={key} onClick={() => setActiveMetric(key)} style={{
                    padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    fontSize: 10.5, fontFamily: 'var(--font-m)', fontWeight: 700,
                    background: activeMetric === key ? 'linear-gradient(135deg, #1a237e, #00bcd4)' : 'transparent',
                    color: activeMetric === key ? '#fff' : 'rgba(255,255,255,0.35)',
                    transition: 'all 0.2s',
                  }}>{label}</button>
                ))}
              </div>
            </div>

            {/* Bar chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
              {data.map((val, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{
                    width: '100%',
                    height: `${(val / maxVal) * 100}%`,
                    borderRadius: '4px 4px 0 0',
                    background: i === data.length - 1
                      ? 'linear-gradient(to top, #1a237e, #00bcd4)'
                      : 'rgba(26,35,126,0.35)',
                    transition: 'height 0.4s ease',
                    position: 'relative',
                  }}>
                    {i === data.length - 1 && (
                      <div style={{
                        position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                        background: '#00bcd4', color: '#fff', borderRadius: 4,
                        padding: '2px 5px', fontSize: 8.5, fontFamily: 'var(--font-m)', whiteSpace: 'nowrap',
                      }}>
                        {activeMetric === 'mrr' ? `₹${val}L` : val.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Month labels */}
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              {MONTHS.map((m, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-m)' }}>{m}</div>
              ))}
            </div>
          </div>

          {/* Feature pills row */}
          <div style={{ padding: '0 28px 20px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { icon: 'fa-layer-group',  text: 'Multi-Tenant'       },
              { icon: 'fa-credit-card',  text: 'Stripe Billing'     },
              { icon: 'fa-users-gear',   text: 'Role Management'    },
              { icon: 'fa-key',          text: 'SSO / OAuth'        },
              { icon: 'fa-bell',         text: 'Email + SMS'        },
              { icon: 'fa-plug',         text: 'REST API'           },
            ].map(f => (
              <div key={f.text} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, padding: '6px 10px',
                fontSize: 10.5, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-m)',
              }}>
                <i className={`fa-solid ${f.icon}`} style={{ fontSize: 9, color: '#00bcd4' }} />
                {f.text}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a237e, #7c3aed, #00bcd4)',
            color: '#fff', borderRadius: 100, padding: '14px 40px',
            fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-h)',
            boxShadow: '0 8px 32px rgba(0,188,212,0.25)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <i className="fa-solid fa-rocket" style={{ fontSize: 13 }} />
            MVP in 6,10 Weeks · 99.9% Uptime · Scale-Ready Architecture
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .metrics-row { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .metrics-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

export default function SaasProductsPageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/software-development">Software Development</Link><span>/</span>
            <span style={{ color: 'var(--text)' }}>SaaS Products</span>
          </div>
          <span className="label">SaaS Development</span>
          <h1 className="mt-8">
            SaaS Product <span className="grad-text">Development</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            Building a SaaS product requires multi-tenancy, subscription billing, user roles, onboarding flows, analytics, and a system that scales from 10 users to 10,000 without breaking. We build all of it.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">
              Launch Your SaaS <i className="fa-solid fa-arrow-right" />
            </Link>
            <Link href="#capabilities" className="btn btn-outline">
              See Services <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <div className={s.statsRow}>
        {[
          { number: '20+',      label: 'SaaS Products Launched' },
          { number: '99.9%',    label: 'Uptime SLA'             },
          { number: '6-16wk',  label: 'MVP Timeline'            },
          { number: 'Scale-Ready', label: 'Architecture'        },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── SAAS DASHBOARD VISUAL ──────────────────────────────────── */}
      <SaasDashboardVisual />

      {/* ── CAPABILITIES ───────────────────────────────────────────── */}
      <section id="capabilities" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Build</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">SaaS Engineering Stack</span>
            </h2>
            <p style={{ color: 'var(--text2)', maxWidth: 480, margin: '12px auto 0', fontSize: 14.5, lineHeight: 1.75 }}>
              Every infrastructure layer your SaaS needs, from multi-tenancy to billing to onboarding, built to production grade from day one.
            </p>
          </div>
          <div className={s.capGrid}>
            {CAPABILITIES.map((cap, i) => (
              <div key={i} className={s.capCard}>
                <span className={s.capMetric}>{cap.metric}</span>
                <div className={s.capIconWrap}><i className={`fa-solid ${cap.icon}`} /></div>
                <div className={s.capTitle}>{cap.title}</div>
                <p className={s.capDesc}>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ─────────────────────────────────────────────── */}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 20 }} className="ind-grid">
            {INDUSTRIES.map((ind, i) => (
              <div key={i} className="reveal" style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: '24px 20px',
                transition: 'all 0.35s',
                boxShadow: 'var(--shadow)',
                transitionDelay: `${i * 0.07}s`,
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(26,35,126,0.07)', border: '1px solid rgba(26,35,126,0.12)', color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 14 }}>
                  <i className={`fa-solid ${ind.icon}`} />
                </div>
                <div style={{ fontFamily: 'var(--font-h)', fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>{ind.name}</div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>{ind.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ────────────────────────────────────────────────── */}
      <section className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">How We Work</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">SaaS Build Process</span>
            </h2>
          </div>
          <div className={s.processRow}>
            {[
              { title: 'Discovery',         desc: 'Define your target users, core features, pricing model, and go-to-market plan before we write a line of code.' },
              { title: 'Architecture',      desc: 'Design the database schema, API surface, tenancy model, and infrastructure for long-term scale and zero-downtime ops.' },
              { title: 'MVP Build',         desc: 'Build and ship a working product in 6 to 16 weeks. Real demo ready for your first customers and investors.' },
              { title: 'Scale & Iterate',   desc: 'Launch, gather user feedback, and iterate. New features, integrations, and performance improvements sprint by sprint.' },
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

      {/* ── FAQ ────────────────────────────────────────────────────── */}
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
                <div className="faq-q" role="button" tabIndex={0}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  onKeyDown={(e) => e.key === 'Enter' && setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q} <i className="fa-solid fa-chevron-down" />
                </div>
                <div className="faq-a"><div className="faq-a-inner">{faq.a}</div></div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, fontFamily: 'var(--font-m)', letterSpacing: 1 }}>EXPLORE RELATED SERVICES</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Custom Software',        href: '/custom-software'        },
                { label: 'Web Development',        href: '/web-development'        },
                { label: 'AI Tools Development',   href: '/ai-tools-development'   },
                { label: 'Mobile App Development', href: '/mobile-app-development' },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Build Together"
        title="Launch Your"
        titleHighlight="SaaS Product"
        subtitle="The SaaS idea in your head needs a technical team that has done this before. Let us build your product the right way, from architecture to launch."
      />
    </>
  )
}
