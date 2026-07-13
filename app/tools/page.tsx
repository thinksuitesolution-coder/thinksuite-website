'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ALL_TOOLS } from '@/components/tools/ToolLanding'

const TOOLS_FAQS = [
  { q: 'What AI tools does ThinkSuite offer?', a: 'ThinkSuite AI Tools includes five tools: AI Content Generation for writing and captions, AI Image Studio for visuals, AI Video Studio for text-to-video production, AI Lead Generation for finding verified B2B leads, and Voice AI for text-to-speech and voice cloning.' },
  { q: 'Is there one subscription for all the tools?', a: 'Yes. A single monthly subscription unlocks every AI tool on ThinkSuite, there is no separate billing per tool.' },
  { q: 'Can I cancel anytime?', a: 'Yes. The subscription is monthly with no lock-in, and you can cancel at any time from your account settings.' },
  { q: 'Is there a money-back guarantee?', a: 'Yes. Every ThinkSuite AI tool is backed by a 7-day money-back guarantee, so you can try the full suite risk-free.' },
  { q: 'Who is ThinkSuite AI Tools built for?', a: 'The suite is built for founders, marketers, agencies, and sales teams who want to generate content, visuals, and leads without hiring a full production team.' },
]

export default function ToolsHubPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f0f8ff', color: '#1a237e', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>

      {/* Hero */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '100px 20px 40px' : '140px 32px 56px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,35,126,0.07)', border: '1px solid rgba(26,35,126,0.15)', borderRadius: 30, padding: '6px 16px', marginBottom: 24 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1a237e', letterSpacing: 1 }}>ALL AI TOOLS</span>
        </div>
        <h1 style={{ fontSize: isMobile ? 32 : 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 16, letterSpacing: -1, color: '#0f172a' }}>
          The Complete <span style={{ color: '#1a237e' }}>AI Marketing</span> Suite
        </h1>
        <p style={{ fontSize: isMobile ? 15 : 18, color: '#64748b', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 12px' }}>
          ThinkSuite AI Tools is a suite of 5 AI tools to create content, generate images, produce videos, find leads, and clone voices, all in one subscription.
        </p>
        <p style={{ fontSize: 14, color: '#1a237e', fontWeight: 600, opacity: 0.7 }}>
          Monthly subscription · Cancel anytime · 7-day money-back guarantee
        </p>
      </section>

      {/* Tools Grid */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 16px 60px' : '0 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 14 : 20 }}>
          {ALL_TOOLS.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}
              style={{ display: 'flex', flexDirection: 'column', padding: '26px 22px', background: '#ffffff', border: `1px solid ${tool.color}15`, borderRadius: 18, textDecoration: 'none', color: 'inherit', transition: 'all 0.22s', boxShadow: '0 2px 12px rgba(26,35,126,0.06)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${tool.color}04`; e.currentTarget.style.borderColor = `${tool.color}35`; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${tool.color}12` }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = `${tool.color}15`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,35,126,0.06)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${tool.color}12`, border: `1px solid ${tool.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {tool.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{tool.label}</div>
                  <div style={{ fontSize: 11, color: tool.color, fontWeight: 600, marginTop: 2 }}>{tool.tagline}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{tool.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {tool.tags.slice(0, 3).map((tag) => (
                  <span key={tag} style={{ padding: '3px 10px', borderRadius: 20, border: `1px solid ${tool.color}22`, fontSize: 10, color: tool.color, background: `${tool.color}08`, fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ borderTop: '1px solid rgba(26,35,126,0.08)', padding: isMobile ? '40px 20px' : '60px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <div style={{ fontSize: isMobile ? 22 : 30, fontWeight: 900, color: '#0f172a', marginBottom: 12, letterSpacing: -0.5 }}>
            One Subscription. <span style={{ color: '#1a237e' }}>All 5 Tools.</span>
          </div>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, marginBottom: 28 }}>
            No per-tool billing. Subscribe monthly and access every AI tool on ThinkSuite.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/tools/lead-generation"
              style={{ padding: '14px 36px', background: 'linear-gradient(135deg,#1a237e,#00bcd4)', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 28px rgba(26,35,126,0.2)' }}>
              Start Today →
            </Link>
            <Link href="/contact"
              style={{ padding: '14px 28px', background: '#ffffff', border: '1px solid rgba(26,35,126,0.15)', borderRadius: 12, color: '#1a237e', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: isMobile ? '0 20px 60px' : '0 32px 80px' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: TOOLS_FAQS.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 800, color: '#0f172a', marginBottom: 32, textAlign: 'center', letterSpacing: -0.5 }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TOOLS_FAQS.map((faq, i) => (
              <div key={faq.q} className={`faq-item${openFaq === i ? ' open' : ''}`} style={{ background: '#ffffff', border: `1px solid ${openFaq === i ? 'rgba(26,35,126,0.25)' : 'rgba(26,35,126,0.1)'}`, borderRadius: 14 }}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  onKeyDown={(e) => e.key === 'Enter' && setOpenFaq(openFaq === i ? null : i)}
                  style={{ padding: '18px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{ fontSize: 18, color: '#1a237e', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', display: 'block' }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 18px', fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
