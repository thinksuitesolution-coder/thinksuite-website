'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from '@/components/pages/ServicePageDashboard.module.css'

const CAPABILITIES = [
  { icon: 'fa-laptop-code',  metric: '50+',    title: 'Corporate Websites',         desc: 'Professional business websites that establish credibility, generate leads, and reflect your brand with precision.' },
  { icon: 'fa-cart-shopping', metric: '4.9★',  title: 'E-Commerce Platforms',       desc: 'Feature-rich online stores with secure payments, inventory management, and analytics, ready to scale.' },
  { icon: 'fa-gauge-high',   metric: '<2s',    title: 'Landing Pages',              desc: 'Conversion-optimized landing pages designed to maximize campaign ROI and capture qualified leads.' },
  { icon: 'fa-puzzle-piece', metric: 'Live',   title: 'Web Applications',           desc: 'Interactive web apps with real-time features, dashboards, and complex functionality, performant at any scale.' },
  { icon: 'fa-file-code',    metric: 'CMS',    title: 'CMS Development',            desc: 'WordPress, Webflow, and headless CMS solutions for seamless content management and editorial workflows.' },
  { icon: 'fa-bolt',         metric: '98/100', title: 'Performance Optimization',   desc: 'Speed audits, Core Web Vitals tuning, and CDN configuration for blazing-fast load times and top Lighthouse scores.' },
]

import { FAQS } from './faqs'

function CorporatePreview() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ width: 80, height: 10, borderRadius: 4, background: 'linear-gradient(90deg, #1a237e, #00bcd4)' }} />
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {['About', 'Services', 'Contact'].map(n => <div key={n} style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'var(--font-m)' }}>{n}</div>)}
          <div style={{ background: '#1a237e', borderRadius: 5, padding: '3px 9px', fontSize: 9, color: '#fff', fontFamily: 'var(--font-m)' }}>Get Quote</div>
        </div>
      </div>
      <div style={{ padding: '20px 16px 14px', background: 'linear-gradient(135deg, #f0f8ff, #e8f4fd)' }}>
        <div style={{ fontSize: 9, color: '#1a237e', fontFamily: 'var(--font-m)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6, opacity: 0.7 }}>AI-First Digital Agency</div>
        <div style={{ width: '78%', height: 16, borderRadius: 4, background: '#1a237e', marginBottom: 6 }} />
        <div style={{ width: '55%', height: 11, borderRadius: 4, background: '#1a237e', marginBottom: 14, opacity: 0.65 }} />
        <div style={{ width: '90%', height: 8, borderRadius: 3, background: '#94a3b8', marginBottom: 5, opacity: 0.4 }} />
        <div style={{ width: '70%', height: 8, borderRadius: 3, background: '#94a3b8', marginBottom: 18, opacity: 0.3 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: 'linear-gradient(135deg, #1a237e, #00bcd4)', borderRadius: 6, padding: '7px 14px', fontSize: 9.5, color: '#fff', fontFamily: 'var(--font-m)' }}>Get Started</div>
          <div style={{ border: '1px solid #1a237e', borderRadius: 6, padding: '7px 14px', fontSize: 9.5, color: '#1a237e', fontFamily: 'var(--font-m)' }}>See Work</div>
        </div>
      </div>
      <div style={{ display: 'flex', padding: '10px 16px', background: '#fff', gap: 18, borderTop: '1px solid #f1f5f9' }}>
        {['120+ Projects', '50+ Clients', '5★ Rating'].map(str => (
          <div key={str} style={{ fontSize: 9, color: '#64748b', fontFamily: 'var(--font-m)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00bcd4' }} />{str}
          </div>
        ))}
      </div>
    </div>
  )
}

function EcommercePreview() {
  const products = [
    { name: 'Premium Plan', price: '₹2,999', badge: 'Best Seller' },
    { name: 'Growth Pack',  price: '₹4,499', badge: ''            },
    { name: 'Enterprise',   price: '₹9,999', badge: 'New'         },
  ]
  return (
    <div>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 10px', fontSize: 9, color: '#94a3b8', fontFamily: 'var(--font-m)' }}>
          🔍  Search products...
        </div>
        <div style={{ background: '#1a237e', borderRadius: 6, padding: '5px 10px', fontSize: 9, color: '#fff', fontFamily: 'var(--font-m)', flexShrink: 0 }}>Cart (3)</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, padding: '12px 16px' }}>
        {products.map((p) => (
          <div key={p.name} style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
            <div style={{ height: 48, background: 'linear-gradient(135deg, #e8f4fd, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <i className="fa-solid fa-box" style={{ color: '#1a237e', fontSize: 18, opacity: 0.25 }} />
              {p.badge && <div style={{ position: 'absolute', top: 5, right: 5, background: '#1a237e', color: '#fff', fontSize: 7, padding: '2px 5px', borderRadius: 4, fontFamily: 'var(--font-m)' }}>{p.badge}</div>}
            </div>
            <div style={{ padding: '8px 8px 10px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#1a237e', marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#0f172a', marginBottom: 6, fontFamily: 'var(--font-h)' }}>{p.price}</div>
              <div style={{ background: 'linear-gradient(135deg, #1a237e, #00bcd4)', borderRadius: 4, padding: '4px', fontSize: 8.5, color: '#fff', textAlign: 'center', fontFamily: 'var(--font-m)' }}>Add to Cart</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 16px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12 }}>
        {['🔒 Secure Checkout', '🚚 Free Shipping', '↩ Easy Returns'].map(t => (
          <div key={t} style={{ fontSize: 8.5, color: '#64748b', fontFamily: 'var(--font-m)' }}>{t}</div>
        ))}
      </div>
    </div>
  )
}

function WebAppPreview() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['Dashboard', 'Analytics', 'Users', 'Reports'].map((t, i) => (
            <div key={t} style={{ fontSize: 9, padding: '4px 9px', borderRadius: 5, background: i === 0 ? '#1a237e' : 'transparent', color: i === 0 ? '#fff' : '#94a3b8', fontFamily: 'var(--font-m)' }}>{t}</div>
          ))}
        </div>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #1a237e, #00bcd4)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, padding: '12px 16px 8px' }}>
        {[
          { label: 'Revenue', val: '₹12.4L', color: '#059669' },
          { label: 'Users',   val: '2,847',  color: '#1a237e' },
          { label: 'Churn',   val: '1.2%',   color: '#d97706' },
          { label: 'Uptime',  val: '99.9%',  color: '#00bcd4' },
        ].map(m => (
          <div key={m.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 8px' }}>
            <div style={{ fontSize: 8, color: '#94a3b8', fontFamily: 'var(--font-m)', marginBottom: 3 }}>{m.label}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: m.color, fontFamily: 'var(--font-h)', lineHeight: 1 }}>{m.val}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: '0 16px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', height: 52, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
        {[30, 45, 35, 55, 70, 60, 80, 65, 90, 75, 85, 95].map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0', background: `linear-gradient(to top, #1a237e, #00bcd4)`, opacity: 0.55 + (i / 12) * 0.45 }} />
        ))}
      </div>
    </div>
  )
}

const BROWSER_TABS = [
  { id: 'corporate', label: 'Corporate Site', icon: 'fa-building',      url: 'yourcompany.in' },
  { id: 'ecommerce', label: 'E-Commerce',     icon: 'fa-cart-shopping', url: 'store.brand.in' },
  { id: 'webapp',    label: 'Web App',        icon: 'fa-gauge-high',    url: 'app.platform.io' },
]

function BrowserVisual() {
  const [activeTab, setActiveTab] = useState(0)
  const previews = [<CorporatePreview key="c" />, <EcommercePreview key="e" />, <WebAppPreview key="w" />]

  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(26,35,126,0.18) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '20%', right: '15%', width: 360, height: 360, background: 'radial-gradient(circle, rgba(0,188,212,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>What We Build</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            Every Type of{' '}
            <span className="grad-text">Web Experience.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            Corporate sites, e-commerce stores, or complex web apps, built with the same obsession for performance and detail. Click a tab to preview.
          </p>
        </div>

        {/* Browser window */}
        <div style={{ maxWidth: 820, margin: '0 auto', background: '#1e2640', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
          {/* Browser chrome */}
          <div style={{ background: '#161d30', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ display: 'flex', gap: 4, flex: 1, flexWrap: 'wrap' }}>
              {BROWSER_TABS.map((tab, i) => (
                <button key={tab.id} onClick={() => setActiveTab(i)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 10.5, fontFamily: 'var(--font-m)',
                  background: activeTab === i ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: activeTab === i ? '#fff' : 'rgba(255,255,255,0.38)',
                  transition: 'all 0.2s',
                }}>
                  <i className={`fa-solid ${tab.icon}`} style={{ fontSize: 9 }} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {/* Address bar */}
          <div style={{ background: '#1a2235', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-lock" style={{ fontSize: 10, color: '#28c840' }} />
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '5px 10px', fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-m)' }}>
              https://{BROWSER_TABS[activeTab].url}
            </div>
            <i className="fa-solid fa-rotate-right" style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }} />
          </div>
          {/* Page preview */}
          <div style={{ background: '#fff', minHeight: 210 }}>
            {previews[activeTab]}
          </div>
          {/* Status bar */}
          <div style={{ background: '#161d30', padding: '6px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-m)' }}>Next.js · TypeScript · Vercel</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ fontSize: 9, color: '#28c840', fontFamily: 'var(--font-m)' }}>Lighthouse 98</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a237e, #00bcd4)',
            color: '#fff', borderRadius: 100, padding: '14px 40px',
            fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-h)',
            boxShadow: '0 8px 32px rgba(0,188,212,0.25)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <i className="fa-solid fa-bolt" style={{ fontSize: 13 }} />
            Sub-2s Load · 90+ Lighthouse · 100% Responsive
          </div>
        </div>
      </div>
    </section>
  )
}

export default function WebDevPageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/software-development">Software Development</Link><span>/</span>
            <span style={{ color: 'var(--text)' }}>Web Development</span>
          </div>
          <span className="label">Web Development</span>
          <h1 className="mt-8">
            Professional Web <span className="grad-text">Development</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            We craft stunning, high-performance websites and web applications that drive conversions, engage visitors, and grow your business, built with Next.js and TypeScript.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">
              Start Your Project <i className="fa-solid fa-arrow-right" />
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
          { number: '50+',    label: 'Websites Delivered' },
          { number: '<2s',    label: 'Load Time'          },
          { number: '98%',    label: 'On-Time Delivery'   },
          { number: 'Next.js', label: 'Tech Stack'        },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── BROWSER VISUAL ─────────────────────────────────────────── */}
      <BrowserVisual />

      {/* ── CAPABILITIES ───────────────────────────────────────────── */}
      <section id="capabilities" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Offer</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">Web Development Services</span>
            </h2>
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

      {/* ── PROCESS ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">How We Work</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">Development Process</span>
            </h2>
          </div>
          <div className={s.processRow}>
            {[
              { title: 'Discovery', desc: 'We audit your goals, audience, and competitors to define a clear technical and design strategy before any design work begins.' },
              { title: 'Design',    desc: 'Wireframes and high-fidelity UI designs aligned with your brand and conversion goals, approved before development starts.' },
              { title: 'Develop',   desc: 'Clean, scalable code built with Next.js, optimized for SEO, Core Web Vitals, speed, and accessibility from day one.' },
              { title: 'Launch',    desc: 'Rigorous testing, deployment, and post-launch monitoring to ensure a flawless go-live and blazing performance in production.' },
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
                { label: 'Mobile App Development', href: '/mobile-app-development' },
                { label: 'UI/UX Design',           href: '/ui-ux-design'           },
                { label: 'Custom Software',        href: '/custom-software'        },
                { label: 'SaaS Products',          href: '/saas-products'          },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Work Together"
        title="Launch Your"
        titleHighlight="Dream Website"
        subtitle="Ready for a website that drives real business growth? Our web development team builds it fast, beautiful, and optimized to convert."
      />
    </>
  )
}
