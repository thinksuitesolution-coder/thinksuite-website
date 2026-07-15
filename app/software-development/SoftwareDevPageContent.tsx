'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from '@/components/pages/ServicePageDashboard.module.css'

const CAPABILITIES = [
  { icon: 'fa-cloud',          metric: '40%',       title: 'SaaS Product Architecture',  desc: 'Multi-tenant cloud-native applications built on resilient backend frameworks, from a SaaS development company that knows how to capture recurring market share safely.' },
  { icon: 'fa-database',       metric: 'Real-time', title: 'Database Architecture',       desc: 'Relational and NoSQL database designs, a core part of cloud-native software development, engineered for real-time updates, instant querying velocity, and zero data loss.' },
  { icon: 'fa-arrows-spin',    metric: '200x',      title: 'System Modernization',        desc: 'Refactoring outdated code into flexible microservices, backed by enterprise software development services that scale without structural friction or downtime.' },
  { icon: 'fa-mobile-screen',  metric: 'iOS+Droid', title: 'Mobile App Development',      desc: 'Native and cross-platform mobile apps for iOS and Android engineered for enterprise performance and conversion depth.' },
  { icon: 'fa-plug',           metric: '60%',       title: 'API Development',             desc: 'RESTful and GraphQL APIs that connect your systems and power your digital ecosystem at operational velocity.' },
  { icon: 'fa-shield-halved',  metric: '99.9%',     title: 'Security & Performance',      desc: 'Built-in security practices, performance optimization, and compliance-ready architecture for global deployments.' },
]

const TECH_LAYERS = [
  {
    label: 'Frontend',
    color: '#1a237e',
    glow: 'rgba(26,35,126,0.28)',
    border: 'rgba(26,35,126,0.35)',
    items: [
      { icon: 'react',         name: 'React',       family: 'brands' },
      { icon: 'code',          name: 'Next.js',     family: 'solid'  },
      { icon: 'file-code',     name: 'TypeScript',  family: 'solid'  },
      { icon: 'mobile-screen', name: 'Flutter',     family: 'solid'  },
    ],
  },
  {
    label: 'Backend',
    color: '#00bcd4',
    glow: 'rgba(0,188,212,0.22)',
    border: 'rgba(0,188,212,0.35)',
    items: [
      { icon: 'node-js',  name: 'Node.js',    family: 'brands' },
      { icon: 'python',   name: 'Python',     family: 'brands' },
      { icon: 'database', name: 'PostgreSQL', family: 'solid'  },
      { icon: 'bolt',     name: 'Redis',      family: 'solid'  },
    ],
  },
  {
    label: 'Infrastructure',
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.22)',
    border: 'rgba(124,58,237,0.35)',
    items: [
      { icon: 'aws',         name: 'AWS',    family: 'brands' },
      { icon: 'docker',      name: 'Docker', family: 'brands' },
      { icon: 'code-branch', name: 'CI/CD',  family: 'solid'  },
      { icon: 'server',      name: 'Vercel', family: 'solid'  },
    ],
  },
]

import { FAQS } from './faqs'

function ArchitectureVisual() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(26,35,126,0.18) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '15%', right: '10%', width: 360, height: 360, background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', top: '45%', right: '32%', width: 260, height: 260, background: 'radial-gradient(circle, rgba(0,188,212,0.10) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>Full-Stack Expertise</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            One Team.{' '}
            <span className="grad-text">Every Layer.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            From pixel-perfect frontend to cloud infrastructure, we own the full engineering stack so you never manage a fragmented vendor chain.
          </p>
        </div>

        {/* 3 layer cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 1000, margin: '0 auto' }} className="arch-grid">
          {TECH_LAYERS.map((layer) => (
            <div key={layer.label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${layer.border}`,
              borderRadius: 20,
              padding: '28px 24px',
              boxShadow: `0 16px 48px ${layer.glow}`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${layer.color}, transparent)` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: layer.color, boxShadow: `0 0 12px ${layer.color}` }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: layer.color, fontFamily: 'var(--font-m)', letterSpacing: 2, textTransform: 'uppercase' }}>{layer.label}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {layer.items.map((tech) => (
                  <div key={tech.name} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: '14px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <i className={`fa-${tech.family} fa-${tech.icon}`} style={{ fontSize: 22, color: layer.color }} />
                    <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-m)', letterSpacing: 0.5 }}>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Guarantees strip */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44, gap: 12, flexWrap: 'wrap' }}>
          {[
            { icon: 'fa-gauge-high',    text: '99.9% Uptime SLA'       },
            { icon: 'fa-bolt',          text: '<50ms API Response'      },
            { icon: 'fa-shield-halved', text: 'SOC 2-Aligned Security'  },
            { icon: 'fa-rotate',        text: 'CI/CD on Every Sprint'   },
          ].map((item) => (
            <div key={item.text} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 100,
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-m)',
            }}>
              <i className={`fa-solid ${item.icon}`} style={{ color: '#00bcd4', fontSize: 12 }} />
              {item.text}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .arch-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

export default function SoftwareDevPageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/services">Services</Link><span>/</span>
            <span style={{ color: 'var(--text)' }}>Software Development</span>
          </div>
          <span className="label">Software Development</span>
          <h1 className="mt-8">
            Engineering Robust <span className="grad-text">Digital Foundations</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            From cloud-native SaaS platforms to enterprise mobile apps, we build high-performance systems that scale with your business from day one to global production.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">
              Start Your Project <i className="fa-solid fa-arrow-right" />
            </Link>
            <Link href="#capabilities" className="btn btn-outline">
              See Capabilities <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <div className={s.statsRow}>
        {[
          { number: '100+', label: 'Systems Deployed'  },
          { number: '99.9%', label: 'Uptime Guarantee' },
          { number: '2x',   label: 'Faster Dev Cycles' },
          { number: '50ms', label: 'Avg API Response'  },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── ARCHITECTURE VISUAL ────────────────────────────────────── */}
      <ArchitectureVisual />

      {/* ── CAPABILITIES ───────────────────────────────────────────── */}
      <section id="capabilities" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Build</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">Full-Stack Software Development Capabilities</span>
            </h2>
            <p style={{ color: 'var(--text2)', maxWidth: 480, margin: '12px auto 0', fontSize: 14.5, lineHeight: 1.75 }}>
              From architecture through deployment, every service your engineering roadmap needs, delivered by one team.
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

      {/* ── PROCESS ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">How We Work</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">Custom Software Development Process</span>
            </h2>
          </div>
          <div className={s.processRow}>
            {[
              { title: 'Architect', desc: 'System design, tech stack selection, and scalability planning, we map your full data flow and infrastructure requirements before writing a single line of code.' },
              { title: 'Sprint',    desc: 'Agile development with weekly delivery milestones, working software delivered incrementally so you see real progress, not promises.' },
              { title: 'Test',      desc: 'Rigorous QA across unit, integration, and load testing, plus security audits and Lighthouse performance benchmarking before any production release.' },
              { title: 'Deploy',    desc: 'Zero-downtime production deployment with CI/CD pipelines, monitoring dashboards, and a post-launch support window to ensure a flawless go-live.' },
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
                { label: 'Web Development',        href: '/web-development'        },
                { label: 'Mobile App Development', href: '/mobile-app-development' },
                { label: 'Custom Software',        href: '/custom-software'        },
                { label: 'SaaS Products',          href: '/saas-products'          },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Work Together"
        title="Ready to Build Your"
        titleHighlight="Cloud-Native Platform?"
        subtitle="Let your complex operational logic become a high-performance enterprise system. Our dedicated engineering cells are ready to deploy at velocity."
      />
    </>
  )
}
