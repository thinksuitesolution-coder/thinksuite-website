'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from '@/components/pages/ServicePageDashboard.module.css'

const CAPABILITIES = [
  { icon: 'fa-magnifying-glass-chart', metric: 'Deep Dive',  title: 'Requirements Analysis',   desc: 'Discovery sessions to map workflows, uncover edge cases, and define technical specifications before a line of code is written.' },
  { icon: 'fa-diagram-project',        metric: 'API-First',  title: 'Custom Architecture',      desc: 'We design the data model, system components, API surface, and infrastructure plan, reviewed with you before development.' },
  { icon: 'fa-plug',                   metric: '60%',        title: 'API & System Integration', desc: 'Connect your existing tools, third-party services, and databases into a unified system that eliminates data silos.' },
  { icon: 'fa-vial-circle-check',      metric: '100%',       title: 'QA & Automated Testing',   desc: 'Unit, integration, and end-to-end tests ship alongside every feature. Bugs caught in staging, not production.' },
  { icon: 'fa-server',                 metric: 'Auto-scale', title: 'Scalable Infrastructure',  desc: 'Cloud-native deployments with auto-scaling, zero-downtime deploys, monitoring dashboards, and automated backups.' },
  { icon: 'fa-headset',               metric: 'SLA-backed', title: 'Dedicated Support',         desc: 'Post-launch support, proactive monitoring, and quarterly roadmap reviews, your software keeps improving after go-live.' },
]

import { FAQS } from './faqs'

const SPRINT_PHASES = [
  {
    week: 'Week 1-2',
    phase: 'Discovery',
    color: '#1a237e',
    accent: 'rgba(26,35,126,0.2)',
    icon: 'fa-magnifying-glass',
    status: 'done',
    tasks: ['Stakeholder interviews', 'Workflow mapping', 'Technical spec doc', 'Architecture review'],
  },
  {
    week: 'Week 3-4',
    phase: 'Architecture',
    color: '#7c3aed',
    accent: 'rgba(124,58,237,0.2)',
    icon: 'fa-diagram-project',
    status: 'done',
    tasks: ['Database schema design', 'API contract definition', 'Tech stack selection', 'Infra planning'],
  },
  {
    week: 'Week 5-10',
    phase: 'Build',
    color: '#00bcd4',
    accent: 'rgba(0,188,212,0.2)',
    icon: 'fa-code',
    status: 'active',
    tasks: ['Sprint 1: Core modules', 'Sprint 2: Integrations', 'Sprint 3: Admin + roles', 'Weekly demos'],
  },
  {
    week: 'Week 11-12',
    phase: 'QA & Deploy',
    color: '#059669',
    accent: 'rgba(5,150,105,0.2)',
    icon: 'fa-rocket',
    status: 'pending',
    tasks: ['Automated test suite', 'Security audit', 'Load testing', 'Production deployment'],
  },
]

function SprintVisual() {
  const [activePhase, setActivePhase] = useState(2)

  return (
    <section style={{
      background: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #07091a 100%)',
      padding: '96px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(26,35,126,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '20%', right: '10%', width: 360, height: 360, background: 'radial-gradient(circle, rgba(0,188,212,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="label" style={{ borderColor: 'rgba(0,188,212,0.3)', color: 'var(--cyan)' }}>Transparent Process</span>
          <h2 style={{ color: '#fff', marginTop: 14, marginBottom: 16 }}>
            You See Every{' '}
            <span className="grad-text">Sprint. Every Step.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
            No black boxes. No surprises. Every phase is visible, every milestone is demoed, and you can reprioritize at any sprint boundary.
          </p>
        </div>

        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          {/* Phase selector tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 28 }} className="phase-tabs">
            {SPRINT_PHASES.map((phase, i) => (
              <button key={phase.phase} onClick={() => setActivePhase(i)} style={{
                background: activePhase === i ? `linear-gradient(135deg, ${phase.color}22, ${phase.color}11)` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activePhase === i ? phase.color + '55' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 14,
                padding: '14px 12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'left',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8,
                    background: activePhase === i ? phase.color : 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s',
                  }}>
                    <i className={`fa-solid ${phase.icon}`} style={{ fontSize: 11, color: activePhase === i ? '#fff' : 'rgba(255,255,255,0.3)' }} />
                  </div>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: phase.status === 'done' ? '#059669' : phase.status === 'active' ? '#00bcd4' : 'rgba(255,255,255,0.2)',
                    boxShadow: phase.status === 'active' ? '0 0 8px #00bcd4' : 'none',
                  }} />
                </div>
                <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-m)', letterSpacing: 1, marginBottom: 3 }}>{phase.week}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: activePhase === i ? '#fff' : 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-h)' }}>{phase.phase}</div>
              </button>
            ))}
          </div>

          {/* Active phase detail card */}
          <div style={{
            background: `linear-gradient(135deg, ${SPRINT_PHASES[activePhase].color}15, rgba(255,255,255,0.03))`,
            border: `1px solid ${SPRINT_PHASES[activePhase].color}40`,
            borderRadius: 20,
            padding: '32px 36px',
            boxShadow: `0 16px 48px ${SPRINT_PHASES[activePhase].color}20`,
            transition: 'all 0.4s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: SPRINT_PHASES[activePhase].color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 24px ${SPRINT_PHASES[activePhase].color}50`,
                }}>
                  <i className={`fa-solid ${SPRINT_PHASES[activePhase].icon}`} style={{ fontSize: 20, color: '#fff' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-m)', letterSpacing: 1, marginBottom: 3 }}>{SPRINT_PHASES[activePhase].week}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-h)' }}>Phase {activePhase + 1}: {SPRINT_PHASES[activePhase].phase}</div>
                </div>
              </div>
              <div style={{
                padding: '5px 14px', borderRadius: 100, fontSize: 10.5, fontWeight: 700, fontFamily: 'var(--font-m)',
                background: SPRINT_PHASES[activePhase].status === 'done' ? 'rgba(5,150,105,0.15)' : SPRINT_PHASES[activePhase].status === 'active' ? 'rgba(0,188,212,0.15)' : 'rgba(255,255,255,0.07)',
                color: SPRINT_PHASES[activePhase].status === 'done' ? '#34d399' : SPRINT_PHASES[activePhase].status === 'active' ? '#00bcd4' : 'rgba(255,255,255,0.4)',
                border: `1px solid ${SPRINT_PHASES[activePhase].status === 'done' ? 'rgba(5,150,105,0.3)' : SPRINT_PHASES[activePhase].status === 'active' ? 'rgba(0,188,212,0.3)' : 'rgba(255,255,255,0.1)'}`,
              }}>
                {SPRINT_PHASES[activePhase].status === 'done' ? '✓ Complete' : SPRINT_PHASES[activePhase].status === 'active' ? '● In Progress' : '○ Upcoming'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }} className="tasks-grid">
              {SPRINT_PHASES[activePhase].tasks.map((task, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10, padding: '12px 14px',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    background: SPRINT_PHASES[activePhase].status === 'done'
                      ? '#059669'
                      : SPRINT_PHASES[activePhase].status === 'active' && i < 2
                        ? '#00bcd4'
                        : 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {(SPRINT_PHASES[activePhase].status === 'done' || (SPRINT_PHASES[activePhase].status === 'active' && i < 2)) && (
                      <i className="fa-solid fa-check" style={{ fontSize: 8, color: '#fff' }} />
                    )}
                  </div>
                  <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-m)' }}>{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-m)', flexShrink: 0 }}>Project Progress</span>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                width: `${(activePhase / (SPRINT_PHASES.length - 1)) * 75 + 25}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${SPRINT_PHASES[activePhase].color}, #00bcd4)`,
                borderRadius: 3,
                transition: 'width 0.4s ease',
              }} />
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-m)', flexShrink: 0 }}>Phase {activePhase + 1}/{SPRINT_PHASES.length}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a237e, #00bcd4)',
            color: '#fff', borderRadius: 100, padding: '14px 40px',
            fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-h)',
            boxShadow: '0 8px 32px rgba(0,188,212,0.25)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <i className="fa-solid fa-shield-halved" style={{ fontSize: 13 }} />
            98% On-Time Delivery · 100% IP Ownership · Full Transparency
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .phase-tabs { grid-template-columns: repeat(2,1fr) !important; }
          .tasks-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .phase-tabs { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

export default function CustomSoftwarePageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/software-development">Software Development</Link><span>/</span>
            <span style={{ color: 'var(--text)' }}>Custom Software</span>
          </div>
          <span className="label">Custom Solutions</span>
          <h1 className="mt-8">
            Custom Software <span className="grad-text">Development</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 560, lineHeight: 1.78 }}>
            Off-the-shelf software slows you down. We build systems engineered exactly for your workflows, your data, and your growth, from day one to enterprise scale.
          </p>
          <div className={s.heroCtas}>
            <Link href="/contact" className="btn btn-primary">
              Start Discovery Call <i className="fa-solid fa-arrow-right" />
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
          { number: '100+', label: 'Projects Delivered' },
          { number: '98%',  label: 'On-Time Delivery'   },
          { number: '8yr',  label: 'Engineering Depth'  },
          { number: '100%', label: 'IP Ownership'       },
        ].map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── SPRINT VISUAL ──────────────────────────────────────────── */}
      <SprintVisual />

      {/* ── CAPABILITIES ───────────────────────────────────────────── */}
      <section id="capabilities" className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Deliver</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">Engineering Capabilities</span>
            </h2>
            <p style={{ color: 'var(--text2)', maxWidth: 480, margin: '12px auto 0', fontSize: 14.5, lineHeight: 1.75 }}>
              Every capability you need to go from idea to production-ready software, under one roof.
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
              Our <span className="grad-text">Development Process</span>
            </h2>
          </div>
          <div className={s.processRow}>
            {[
              { title: 'Discovery',      desc: 'We map your business workflows, interview key stakeholders, and produce a detailed technical specification and project roadmap before any code is written.' },
              { title: 'Architecture',   desc: 'Our architects design the data model, system components, API surface, and infrastructure plan, reviewed with you before development begins.' },
              { title: 'Build',          desc: 'Agile two-week sprints with working demos, code reviews, automated testing, and a live staging environment so you see progress every step of the way.' },
              { title: 'Deploy & Scale', desc: 'Production launch with performance monitoring, automated backups, runbooks, and an ongoing support retainer to handle growth and new features.' },
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
                { label: 'SaaS Products',          href: '/saas-products'          },
                { label: 'Workflow Automation',     href: '/workflow-automation'    },
                { label: 'AI Tools Development',   href: '/ai-tools-development'   },
                { label: 'Mobile App Development', href: '/mobile-app-development' },
              ].map(l => <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Build Together"
        title="Get Software Built"
        titleHighlight="Just for You"
        subtitle="Stop adapting your business to fit generic software. Let's build exactly what you need, on time, on spec, and ready to scale."
      />
    </>
  )
}
