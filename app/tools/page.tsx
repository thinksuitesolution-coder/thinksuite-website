'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ALL_TOOLS } from '@/components/tools/ToolLanding'

export default function ToolsHubPage() {
  const [isMobile, setIsMobile] = useState(false)

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
          5 AI tools to create content, generate images, produce videos, find leads, and clone voices — all in one place.
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
    </div>
  )
}
