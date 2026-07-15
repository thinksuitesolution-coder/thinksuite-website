'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from './ServicePageTerminal.module.css'

interface StatItem { number: string; label: string }
interface HighlightItem { icon: string; title: string; desc: string }
interface IndustryItem { icon: string; name: string; useCase: string; tags: string[] }
interface ProcessItem { title: string; desc: string }
interface FaqItem { q: string; a: string }

interface Props {
  breadcrumb: string
  breadcrumbHref: string
  label: string
  title: string
  titleHighlight: string
  tagline: string
  animationType?: 'chat' | 'flow' | 'network'
  stats: StatItem[]
  highlights: HighlightItem[]
  industries: IndustryItem[]
  process: ProcessItem[]
  faqs: FaqItem[]
  sidebarLinks: { label: string; href: string }[]
  ctaTitle: string
  ctaTitleHighlight: string
  ctaDesc: string
  capabilitiesHeading?: React.ReactNode
  processHeading?: React.ReactNode
}

function ChatVisual() {
  return (
    <div className={s.visualWrap}>
      <div className={`${s.floatBadge} ${s.badge1}`}>
        <i className="fa-solid fa-circle" style={{ color: '#22c55e', fontSize: 8 }} />
        <span>AI Online 24/7</span>
      </div>
      <div className={`${s.floatBadge} ${s.badge2}`}>
        <i className="fa-solid fa-bolt" />
        <span>Avg. 1.2s Response</span>
      </div>

      <div className={s.chatFrame}>
        <div className={s.chatHeader}>
          <div className={s.chatAvatar}>
            <i className="fa-solid fa-robot" />
          </div>
          <div>
            <div className={s.chatName}>ThinkBot AI</div>
            <div className={s.chatStatus}>
              <span className={s.chatDot} />
              Online
            </div>
          </div>
        </div>

        <div className={s.chatBody}>
          <div className={`${s.msg} ${s.msgBot} ${s.msg1}`}>
            <div className={s.msgBubble}>
              Hi! I can help with orders, product info, and support. What do you need today?
            </div>
          </div>

          <div className={`${s.msg} ${s.msgUser} ${s.msg2}`}>
            <div className={s.msgBubbleUser}>
              Track my order #TS2847
            </div>
          </div>

          <div className={`${s.msg} ${s.msgBot} ${s.msg3}`}>
            <div className={s.msgBubble}>
              Found it. Your order is out for delivery. Expected today by 6 PM.
              <div className={s.msgChips}>
                <span>Track Live</span>
                <span>Contact Rider</span>
              </div>
            </div>
          </div>

          <div className={`${s.msg} ${s.msgBot} ${s.msg4}`}>
            <div className={s.typingIndicator}>
              <span className={s.typDot} />
              <span className={s.typDot} />
              <span className={s.typDot} />
            </div>
          </div>
        </div>

        <div className={s.chatInput}>
          <div className={s.chatInputField}>Type a message...</div>
          <button className={s.chatSend} aria-label="Send">
            <i className="fa-solid fa-paper-plane" />
          </button>
        </div>
      </div>
    </div>
  )
}

function FlowVisual() {
  return (
    <div className={s.visualWrap}>
      <div className={`${s.floatBadge} ${s.badge1}`}>
        <i className="fa-solid fa-circle-check" style={{ color: '#22c55e' }} />
        <span>Fully Automated</span>
      </div>
      <div className={`${s.floatBadge} ${s.badge2}`}>
        <i className="fa-solid fa-clock" />
        <span>Save 40hrs/week</span>
      </div>

      <div className={s.flowFrame}>
        <div className={s.flowTitle}>
          <i className="fa-solid fa-diagram-project" />
          Lead Nurture Workflow
        </div>

        <div className={s.flowChart}>
          <div className={`${s.flowNode} ${s.flowNode1}`}>
            <div className={s.nodeIcon} style={{ background: 'rgba(26,35,126,0.1)', color: '#1a237e' }}>
              <i className="fa-solid fa-bolt" />
            </div>
            <div className={s.nodeText}>
              <span className={s.nodeTitle}>New Lead</span>
              <span className={s.nodeSub}>Form submitted</span>
            </div>
            <div className={s.nodeStatus} style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>Live</div>
          </div>

          <div className={`${s.flowConnector} ${s.flowConnector1}`} />

          <div className={`${s.flowNode} ${s.flowNode2}`}>
            <div className={s.nodeIcon} style={{ background: 'rgba(0,188,212,0.1)', color: '#00bcd4' }}>
              <i className="fa-solid fa-envelope" />
            </div>
            <div className={s.nodeText}>
              <span className={s.nodeTitle}>Welcome Email</span>
              <span className={s.nodeSub}>Sent instantly</span>
            </div>
            <div className={s.nodeStatus} style={{ background: 'rgba(0,188,212,0.1)', color: '#00bcd4' }}>Auto</div>
          </div>

          <div className={`${s.flowConnector} ${s.flowConnector2}`} />

          <div className={s.branchRow}>
            <div className={`${s.flowNode} ${s.flowNodeSmall} ${s.flowNode3}`}>
              <div className={s.nodeIcon} style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                <i className="fa-solid fa-phone" />
              </div>
              <div className={s.nodeText}>
                <span className={s.nodeTitle}>Sales Call</span>
                <span className={s.nodeSub}>Email opened</span>
              </div>
            </div>

            <div className={`${s.flowNode} ${s.flowNodeSmall} ${s.flowNode4}`}>
              <div className={s.nodeIcon} style={{ background: 'rgba(217,119,6,0.1)', color: '#d97706' }}>
                <i className="fa-solid fa-rotate" />
              </div>
              <div className={s.nodeText}>
                <span className={s.nodeTitle}>Follow-up</span>
                <span className={s.nodeSub}>No response</span>
              </div>
            </div>
          </div>

          <div className={`${s.flowDone} ${s.flowDone1}`}>
            <i className="fa-solid fa-circle-check" />
            <span>Deal Closed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function NetworkVisual() {
  return (
    <div className={s.visualWrap}>
      <div className={`${s.floatBadge} ${s.badge1}`}>
        <i className="fa-solid fa-brain" />
        <span>Custom AI Model</span>
      </div>
      <div className={`${s.floatBadge} ${s.badge2}`}>
        <i className="fa-solid fa-gauge-high" />
        <span>99.2% Accuracy</span>
      </div>

      <div className={s.networkFrame}>
        <div className={s.networkTitle}>
          <i className="fa-solid fa-microchip" />
          Neural Network Processing
        </div>

        <svg viewBox="0 0 340 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }} aria-label="Neural network diagram">
          {/* Input to hidden connections */}
          {[50, 120, 190].flatMap((y1, i) =>
            [50, 100, 150, 200].map((y2, j) => (
              <line
                key={`ih-${i}-${j}`}
                x1="55" y1={y1} x2="160" y2={y2}
                stroke="#1a237e" strokeWidth="0.8"
                className={s.netLine}
                style={{ animationDelay: `${(i + j) * 0.15}s` }}
              />
            ))
          )}

          {/* Hidden to output connections */}
          {[50, 100, 150, 200].flatMap((y1, i) =>
            [90, 150].map((y2, j) => (
              <line
                key={`ho-${i}-${j}`}
                x1="160" y1={y1} x2="285" y2={y2}
                stroke="#00bcd4" strokeWidth="0.8"
                className={s.netLine}
                style={{ animationDelay: `${(i + j) * 0.2 + 0.4}s` }}
              />
            ))
          )}

          {/* Input nodes */}
          {[50, 120, 190].map((y, i) => (
            <g key={`in-${i}`}>
              <circle cx="55" cy={y} r="18" fill="rgba(26,35,126,0.07)" stroke="#1a237e" strokeWidth="1.5" className={s.netNode} style={{ animationDelay: `${i * 0.1}s` }} />
              <circle cx="55" cy={y} r="8" fill="#1a237e" opacity="0.7" />
            </g>
          ))}

          {/* Hidden nodes */}
          {[50, 100, 150, 200].map((y, i) => (
            <g key={`hid-${i}`}>
              <circle cx="160" cy={y} r="20" fill="rgba(0,188,212,0.07)" stroke="#00bcd4" strokeWidth="1.5" className={s.netNode} style={{ animationDelay: `${0.3 + i * 0.1}s` }} />
              <circle cx="160" cy={y} r="9" fill="#00bcd4" opacity="0.7" />
            </g>
          ))}

          {/* Output nodes */}
          {[90, 150].map((y, i) => (
            <g key={`out-${i}`}>
              <circle cx="285" cy={y} r="22" fill="rgba(124,58,237,0.07)" stroke="#7c3aed" strokeWidth="2" className={s.netNode} style={{ animationDelay: `${0.6 + i * 0.15}s` }} />
              <circle cx="285" cy={y} r="10" fill="#7c3aed" opacity="0.8" />
            </g>
          ))}

          <text x="55" y="218" textAnchor="middle" fontSize="9" fill="#94a3b8">INPUT</text>
          <text x="160" y="228" textAnchor="middle" fontSize="9" fill="#94a3b8">HIDDEN</text>
          <text x="285" y="183" textAnchor="middle" fontSize="9" fill="#94a3b8">OUTPUT</text>
        </svg>

        <div className={s.networkStatus}>
          <div className={s.netStatusItem}>
            <span className={s.netStatusDot} style={{ background: '#22c55e' }} />
            Training Complete
          </div>
          <div className={s.netStatusItem}>
            <span className={s.netStatusDot} style={{ background: '#1a237e' }} />
            Accuracy: 99.2%
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ServicePageTerminal({
  breadcrumb, breadcrumbHref, label, title, titleHighlight, tagline,
  animationType = 'chat',
  stats, highlights, industries, process: steps, faqs, sidebarLinks,
  ctaTitle, ctaTitleHighlight, ctaDesc,
  capabilitiesHeading = <>Every <span className="grad-text">{titleHighlight}</span> We Deliver</>,
  processHeading = <>Our <span className="grad-text">{steps.length}-Step Process</span></>,
}: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={s.heroGrid}>
            <div className={s.heroLeft}>
              <div className="breadcrumb mb-16">
                <Link href="/">Home</Link>
                <span>/</span>
                <Link href={breadcrumbHref}>{breadcrumb}</Link>
                <span>/</span>
                <span style={{ color: 'var(--text)' }}>{title} {titleHighlight}</span>
              </div>
              <span className="label">{label}</span>
              <h1 className="mt-16">
                {title} <span className="grad-text">{titleHighlight}</span>
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 480, lineHeight: 1.78 }}>
                {tagline}
              </p>
              <div className={s.heroCtas}>
                <Link href="/contact" className="btn btn-primary">
                  Get Free Consultation <i className="fa-solid fa-arrow-right" />
                </Link>
                <Link href="#capabilities" className="btn btn-outline">
                  See What We Build <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} />
                </Link>
              </div>
            </div>

            <div className={s.heroRight}>
              {animationType === 'flow'
                ? <FlowVisual />
                : animationType === 'network'
                  ? <NetworkVisual />
                  : <ChatVisual />
              }
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className={s.statsRow}>
        {stats.map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* WHAT WE BUILD */}
      <section id="capabilities" className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What&apos;s Included</span>
            <h2 style={{ marginTop: 12 }}>
              {capabilitiesHeading}
            </h2>
          </div>
          <div className={s.hlGrid}>
            {highlights.map((item, i) => (
              <div
                key={i}
                className={`${s.hlCard} reveal`}
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div className={s.hlIcon}>
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <div>
                  <div className={s.hlTitle}>{item.title}</div>
                  <p className={s.hlDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">Who We Work With</span>
            <h2 style={{ marginTop: 12 }}>
              Any Industry. Any Scale. <span className="grad-text">Any Need.</span>
            </h2>
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
            {industries.map((ind, i) => (
              <div
                key={i}
                className={`${s.indCard} reveal`}
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div className={s.indIcon}>
                  <i className={`fa-solid ${ind.icon}`} />
                </div>
                <div className={s.indName}>{ind.name}</div>
                <p className={s.indUseCase}>{ind.useCase}</p>
                <div className={s.indTags}>
                  {ind.tags.map((tag, j) => (
                    <span key={j} className={s.indTag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ marginTop: 36, padding: '20px 28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--text)', lineHeight: 1.75 }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--cyan)', marginRight: 10 }} />
              Have a unique requirement?{' '}
              <strong>We build fully custom solutions</strong> for any business, any workflow, any scale.{' '}
              <a href="/contact" style={{ color: 'var(--cyan)', fontWeight: 600, textDecoration: 'underline' }}>
                Tell us what you need.
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">How We Work</span>
            <h2 style={{ marginTop: 12 }}>
              {processHeading}
            </h2>
          </div>
          <div className={s.processRow}>
            {steps.map((step, i) => (
              <div
                key={i}
                className={`${s.processItem} reveal`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className={s.processCircle}>{i + 1}</div>
                <div className={s.processTitle}>{step.title}</div>
                <p className={s.processDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">Common Questions</span>
            <h2 style={{ marginTop: 12 }}>
              Frequently Asked <span className="grad-text">Questions</span>
            </h2>
          </div>
          <div className={s.faqInner}>
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <div
                  className="faq-q"
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  onKeyDown={(e) => e.key === 'Enter' && setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <i className="fa-solid fa-chevron-down" />
                </div>
                <div className="faq-a">
                  <div className="faq-a-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, fontFamily: 'var(--font-m)', letterSpacing: 1 }}>
              EXPLORE RELATED SERVICES
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {sidebarLinks.map((l) => (
                <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Ready to Automate?"
        title={ctaTitle}
        titleHighlight={ctaTitleHighlight}
        subtitle={ctaDesc}
      />
    </>
  )
}
