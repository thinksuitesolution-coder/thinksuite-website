'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from '@/components/pages/ServicePageDashboard.module.css'

const CAPABILITIES = [
  { icon: 'fa-apple',       metric: '4.8★',     title: 'iOS App Development',     desc: 'Native Swift apps optimized for iPhone and iPad with full App Store submission and deployment support.' },
  { icon: 'fa-android',     metric: 'Play Store', title: 'Android App Development', desc: 'Native Kotlin apps for the Android ecosystem with Google Play publishing and device optimization.' },
  { icon: 'fa-layer-group', metric: '1 Codebase', title: 'Cross-Platform Apps',     desc: 'React Native and Flutter apps that work beautifully on both iOS and Android from a single codebase.' },
  { icon: 'fa-chart-bar',   metric: 'Built-in',   title: 'Analytics & Optimization', desc: 'Built-in analytics, crash reporting, and A/B testing for data-driven continuous improvement.' },
  { icon: 'fa-bell',        metric: '40%',        title: 'Push & Engagement',       desc: 'Smart notification systems, deep linking, and re-engagement campaigns that bring users back.' },
  { icon: 'fa-rotate',      metric: 'SLA-backed', title: 'Maintenance & Updates',   desc: 'Ongoing support, OS compatibility updates, and feature additions to keep your app competitive.' },
]

import { FAQS } from './faqs'

const SCREENS = [
  {
    name: 'Onboarding',
    icon: 'fa-hand-wave',
    iosContent: (
      <div style={{ padding: '16px 14px' }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #1a237e, #00bcd4)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fa-solid fa-bolt" style={{ color: '#fff', fontSize: 20 }} />
        </div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-h)', marginBottom: 4 }}>Welcome to ThinkApp</div>
          <div style={{ fontSize: 9.5, color: '#64748b', lineHeight: 1.6 }}>Your all-in-one business dashboard</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: 'linear-gradient(135deg, #1a237e, #00bcd4)', borderRadius: 10, padding: '10px', fontSize: 11, color: '#fff', textAlign: 'center', fontFamily: 'var(--font-m)', fontWeight: 700 }}>Get Started</div>
          <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px', fontSize: 11, color: '#1a237e', textAlign: 'center', fontFamily: 'var(--font-m)', fontWeight: 700 }}>Sign In</div>
        </div>
        <div style={{ marginTop: 14, fontSize: 8.5, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>By continuing, you agree to our Terms & Privacy Policy</div>
      </div>
    ),
    androidContent: (
      <div style={{ padding: '16px 14px' }}>
        <div style={{ height: 64, background: 'linear-gradient(135deg, #1a237e, #00bcd4)', borderRadius: 12, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <i className="fa-solid fa-bolt" style={{ color: '#fff', fontSize: 20 }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-h)' }}>ThinkApp</span>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>Your all-in-one business dashboard, built for Android</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: '#1a237e', borderRadius: 8, padding: '10px', fontSize: 11, color: '#fff', textAlign: 'center', fontFamily: 'var(--font-m)', fontWeight: 700 }}>Get Started</div>
          <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '10px', fontSize: 11, color: '#1a237e', textAlign: 'center', fontFamily: 'var(--font-m)', fontWeight: 700 }}>Sign In</div>
        </div>
      </div>
    ),
  },
  {
    name: 'Dashboard',
    icon: 'fa-gauge-high',
    iosContent: (
      <div style={{ padding: '12px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'var(--font-m)' }}>Good morning,</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-h)' }}>Rahul 👋</div>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #1a237e, #00bcd4)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          {[
            { label: 'Revenue', val: '₹4.2L', up: true },
            { label: 'Orders',  val: '248',   up: true },
            { label: 'Users',   val: '1,847', up: false },
            { label: 'Rating',  val: '4.9★',  up: true },
          ].map(m => (
            <div key={m.label} style={{ background: '#f8fafc', borderRadius: 10, padding: '8px 8px' }}>
              <div style={{ fontSize: 8, color: '#94a3b8', fontFamily: 'var(--font-m)', marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-h)', lineHeight: 1 }}>{m.val}</div>
              <div style={{ fontSize: 8, color: m.up ? '#059669' : '#d97706', marginTop: 2 }}>{m.up ? '↑ 12%' : '↓ 2%'}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '8px 10px', height: 36, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
          {[40, 55, 45, 70, 60, 85, 75].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '2px 2px 0 0', background: 'linear-gradient(to top, #1a237e, #00bcd4)' }} />
          ))}
        </div>
      </div>
    ),
    androidContent: (
      <div style={{ padding: '12px 12px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a237e, #00bcd4)', borderRadius: 12, padding: '10px 12px', marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>Total Revenue</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-h)', lineHeight: 1 }}>₹12.4L</div>
          <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>↑ 28% from last month</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            { label: 'Orders',  val: '248',   color: '#1a237e' },
            { label: 'Users',   val: '1,847', color: '#00bcd4' },
            { label: 'Rating',  val: '4.9★',  color: '#059669' },
            { label: 'Uptime',  val: '99.9%', color: '#7c3aed' },
          ].map(m => (
            <div key={m.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 8px' }}>
              <div style={{ fontSize: 8, color: '#94a3b8', fontFamily: 'var(--font-m)', marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: m.color, fontFamily: 'var(--font-h)', lineHeight: 1 }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    name: 'Profile',
    icon: 'fa-user',
    iosContent: (
      <div style={{ padding: '12px 14px' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1a237e, #00bcd4)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 20, color: '#fff' }}>R</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-h)' }}>Rahul Mehta</div>
          <div style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'var(--font-m)' }}>rahul@company.in · Pro Plan</div>
        </div>
        {['Account Settings', 'Notifications', 'Payment Methods', 'Help & Support'].map((item) => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 10.5, color: '#334155', fontFamily: 'var(--font-m)' }}>{item}</span>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: 9, color: '#94a3b8' }} />
          </div>
        ))}
        <div style={{ marginTop: 10, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.12)', borderRadius: 8, padding: '8px', fontSize: 10, color: '#dc2626', textAlign: 'center', fontFamily: 'var(--font-m)' }}>Sign Out</div>
      </div>
    ),
    androidContent: (
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, padding: '10px 10px', background: '#f8fafc', borderRadius: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #1a237e, #00bcd4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16, color: '#fff' }}>R</span>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-h)' }}>Rahul Mehta</div>
            <div style={{ fontSize: 8.5, color: '#94a3b8', fontFamily: 'var(--font-m)' }}>Pro Plan · 30 days left</div>
          </div>
        </div>
        {['Account Settings', 'Notifications', 'Billing', 'Sign Out'].map((item, idx) => (
          <div key={item} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 6px', borderBottom: idx < 3 ? '1px solid #f1f5f9' : 'none',
          }}>
            <span style={{ fontSize: 10.5, color: idx === 3 ? '#dc2626' : '#334155', fontFamily: 'var(--font-m)' }}>{item}</span>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: 9, color: '#94a3b8' }} />
          </div>
        ))}
      </div>
    ),
  },
]

function PhoneShowcase() {
  const [activeScreen, setActiveScreen] = useState(0)

  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '15%', left: '10%', width: 380, height: 380, background: 'radial-gradient(circle, rgba(26,35,126,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '15%', right: '10%', width: 340, height: 340, background: 'radial-gradient(circle, rgba(0,188,212,0.14) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>One Codebase. Two Platforms.</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            Built for{' '}
            <span className="grad-text">iOS & Android.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            React Native apps that feel native on both platforms, same sprint, same quality, half the cost. Click to preview different screens.
          </p>
        </div>

        {/* Screen tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48 }}>
          {SCREENS.map((screen, i) => (
            <button key={screen.name} onClick={() => setActiveScreen(i)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 100, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-m)', fontSize: 12, fontWeight: 700,
              background: activeScreen === i ? 'linear-gradient(135deg, #1a237e, #00bcd4)' : 'rgba(255,255,255,0.07)',
              color: activeScreen === i ? '#fff' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s',
              boxShadow: activeScreen === i ? '0 4px 16px rgba(26,35,126,0.35)' : 'none',
            }}>
              <i className={`fa-solid ${screen.icon}`} style={{ fontSize: 10 }} />
              {screen.name}
            </button>
          ))}
        </div>

        {/* Dual phones */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 40 }} className="phones-row">
          {/* iOS Phone */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="fa-brands fa-apple" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-m)', letterSpacing: 1 }}>iOS</span>
            </div>
            <div style={{
              width: 180,
              background: '#1a1a2e',
              borderRadius: 36,
              padding: '8px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1)',
              position: 'relative',
            }}>
              {/* Notch */}
              <div style={{ width: 60, height: 20, background: '#1a1a2e', borderRadius: '0 0 12px 12px', margin: '0 auto', position: 'relative', zIndex: 2 }} />
              {/* Screen */}
              <div style={{
                background: '#fff',
                borderRadius: 28,
                overflow: 'hidden',
                marginTop: -20,
                minHeight: 260,
              }}>
                {/* Status bar */}
                <div style={{ background: '#fff', padding: '8px 14px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-h)' }}>9:41</span>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <i className="fa-solid fa-signal" style={{ fontSize: 8, color: '#0f172a' }} />
                    <i className="fa-solid fa-wifi" style={{ fontSize: 8, color: '#0f172a' }} />
                    <i className="fa-solid fa-battery-full" style={{ fontSize: 8, color: '#0f172a' }} />
                  </div>
                </div>
                {SCREENS[activeScreen].iosContent}
              </div>
              {/* Home bar */}
              <div style={{ width: 50, height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 2, margin: '8px auto 0' }} />
            </div>
          </div>

          {/* Android Phone */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="fa-brands fa-android" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-m)', letterSpacing: 1 }}>Android</span>
            </div>
            <div style={{
              width: 176,
              background: '#0f172a',
              borderRadius: 24,
              padding: '6px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)',
            }}>
              {/* Camera punch hole */}
              <div style={{ height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1e293b' }} />
              </div>
              {/* Screen */}
              <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', minHeight: 260 }}>
                {/* Status bar */}
                <div style={{ background: '#fff', padding: '4px 14px 2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-h)' }}>9:41</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <i className="fa-solid fa-signal" style={{ fontSize: 8, color: '#0f172a' }} />
                    <i className="fa-solid fa-wifi" style={{ fontSize: 8, color: '#0f172a' }} />
                    <i className="fa-solid fa-battery-three-quarters" style={{ fontSize: 8, color: '#0f172a' }} />
                  </div>
                </div>
                {SCREENS[activeScreen].androidContent}
              </div>
              {/* Nav bar */}
              <div style={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                {['◁', '○', '□'].map(c => <span key={c} style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{c}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a237e, #00bcd4)',
            color: '#fff', borderRadius: 100, padding: '14px 40px',
            fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-h)',
            boxShadow: '0 8px 32px rgba(0,188,212,0.25)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <i className="fa-solid fa-mobile-screen" style={{ fontSize: 13 }} />
            iOS + Android · 30+ Apps Delivered · 4.8★ Avg Rating
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .phones-row { flex-direction: column !important; align-items: center !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  )
}

export default function MobileAppPageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/software-development">Software Development</Link><span>/</span>
            <span style={{ color: 'var(--text)' }}>Mobile App Development</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i className="fa-brands fa-apple" style={{ fontSize: 11 }} /> iOS
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(26,35,126,0.07)', border: '1px solid rgba(26,35,126,0.18)',
              borderRadius: 100, padding: '4px 14px',
              fontSize: 11, fontWeight: 700, color: '#059669',
              fontFamily: 'var(--font-m)', letterSpacing: 1.5, textTransform: 'uppercase',
            }}>
              <i className="fa-brands fa-android" style={{ fontSize: 11 }} /> Android
            </span>
          </div>
          <h1>
            Mobile App <span className="grad-text">Development</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            We build intuitive, high-performance mobile applications for iOS and Android that users love, from MVP to enterprise-grade apps that drive engagement and retention.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">
              Build My App <i className="fa-solid fa-arrow-right" />
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
          { number: '30+',     label: 'Apps Launched'      },
          { number: '4.8★',    label: 'Avg App Rating'     },
          { number: 'iOS+',    label: 'Android Support'    },
          { number: 'RN/Flutter', label: 'Tech Stack'      },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── PHONE SHOWCASE ─────────────────────────────────────────── */}
      <PhoneShowcase />

      {/* ── CAPABILITIES ───────────────────────────────────────────── */}
      <section id="capabilities" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Build</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">Mobile Development Services</span>
            </h2>
          </div>
          <div className={s.capGrid}>
            {CAPABILITIES.map((cap, i) => (
              <div key={i} className={s.capCard}>
                <span className={s.capMetric}>{cap.metric}</span>
                <div className={s.capIconWrap}><i className={`fa-${i < 2 ? 'brands' : 'solid'} ${cap.icon}`} /></div>
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
              Our <span className="grad-text">App Development Process</span>
            </h2>
          </div>
          <div className={s.processRow}>
            {[
              { title: 'Discovery', desc: 'We define user personas, core features, and the technical architecture for your app before any design or code begins.' },
              { title: 'Design',    desc: 'Mobile-first UI/UX designs with interactive prototypes, tested with real users before we write a single line of code.' },
              { title: 'Develop',   desc: 'Clean, modular code with CI/CD pipelines, built for performance, long-term scalability, and platform guidelines.' },
              { title: 'Launch',    desc: 'App Store & Play Store submission, beta testing, and post-launch monitoring to ensure a flawless go-live.' },
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
                { label: 'Web Development',    href: '/web-development'    },
                { label: 'UI/UX Design',       href: '/ui-ux-design'       },
                { label: 'Custom Software',    href: '/custom-software'    },
                { label: 'SaaS Products',      href: '/saas-products'      },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Build Together"
        title="Build Your"
        titleHighlight="Mobile App"
        subtitle="Got a great app idea? Let's build it. Our mobile development team delivers apps that users download, use, and recommend."
      />
    </>
  )
}
