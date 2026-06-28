'use client'

import Link from 'next/link'

const modules = [
  { icon: '📰', label: 'Live AI News', desc: '50+ sources, updated every 10 min', href: '/blog', badge: 'LIVE' },
  { icon: '💬', label: 'AI Chat', desc: 'Ask anything about AI industry', href: '/intelligence/chat', badge: null },
  { icon: '📈', label: 'Trend Predictions', desc: '90-day AI market forecasts', href: '/intelligence/trends', badge: null },
  { icon: '💰', label: 'Funding Tracker', desc: 'Every major AI investment round', href: '/intelligence/funding', badge: null },
  { icon: '🧠', label: 'Knowledge Graph', desc: 'Visual map of AI ecosystem', href: '/intelligence/graph', badge: 'NEW' },
  { icon: '📊', label: 'Report Generator', desc: 'One-click AI industry reports', href: '/intelligence/report', badge: 'NEW' },
]

export default function IntelligenceTeaserSection() {
  return (
    <section className="section" id="intelligence-teaser">
      <div className="container">
        <div className="intelligence-layout">

          {/* Left, Text */}
          <div>
            <span className="label" style={{ marginBottom: 20, display: 'inline-block' }}>
              THINKSUITE INTELLIGENCE
            </span>
            <h2 style={{ marginBottom: 20 }}>
              Stay Ahead with{' '}
              <span className="grad-text">Real-Time AI</span>{' '}
              Intelligence
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 32 }}>
              ThinkSuite Intelligence monitors 50+ global AI sources, delivering live news,
              trend predictions, funding signals, and competitive insights so your business
              never misses a move.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              {[
                { icon: 'fa-bolt', text: '10-min updates' },
                { icon: 'fa-globe', text: '50+ sources' },
                { icon: 'fa-link', text: 'Source citations' },
                { icon: 'fa-lock-open', text: 'Free to use' },
              ].map(chip => (
                <span
                  key={chip.text}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 12, fontWeight: 600, color: 'var(--cyan)',
                    background: 'rgba(26,35,126,0.07)', border: '1px solid rgba(26,35,126,0.15)',
                    borderRadius: 6, padding: '5px 12px',
                  }}
                >
                  <i className={`fa-solid ${chip.icon}`} style={{ fontSize: 11 }} />
                  {chip.text}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/intelligence" className="btn btn-primary">
                Explore Intelligence Hub <i className="fa-solid fa-arrow-right" />
              </Link>
              <Link href="/blog" className="btn btn-outline">
                Latest AI News
              </Link>
            </div>
          </div>

          {/* Right, Modules Grid */}
          <div>
            <div className="intelligence-modules">
              {modules.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  style={{
                    display: 'block',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: '18px 16px',
                    transition: 'all 0.25s var(--ease)',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = 'translateY(-3px)'
                    el.style.boxShadow = 'var(--shadow)'
                    el.style.borderColor = 'rgba(26,35,126,0.2)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = ''
                    el.style.boxShadow = ''
                    el.style.borderColor = 'var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 24 }}>{m.icon}</span>
                    {m.badge && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: 1,
                        color: m.badge === 'LIVE' ? '#dc2626' : 'var(--cyan)',
                        background: m.badge === 'LIVE' ? 'rgba(220,38,38,0.08)' : 'rgba(26,35,126,0.08)',
                        border: `1px solid ${m.badge === 'LIVE' ? 'rgba(220,38,38,0.2)' : 'rgba(26,35,126,0.15)'}`,
                        borderRadius: 4, padding: '2px 7px',
                      }}>
                        {m.badge === 'LIVE' && <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#dc2626', marginRight: 4, verticalAlign: 'middle' }} />}
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{m.desc}</div>
                </Link>
              ))}
            </div>

            {/* Telegram CTA */}
            <a
              href="https://t.me/thinksuite_ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 14, marginTop: 14,
                background: 'linear-gradient(135deg, rgba(26,35,126,0.05), rgba(0,188,212,0.07))',
                border: '1px solid rgba(26,35,126,0.12)', borderRadius: 12, padding: '14px 18px',
                textDecoration: 'none', transition: 'all 0.25s',
              }}
            >
              <i className="fa-brands fa-telegram" style={{ fontSize: 22, color: '#2AABEE' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>Get AI Alerts on Telegram</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>Breaking AI news, first. @thinksuite_ai</div>
              </div>
              <i className="fa-solid fa-arrow-right" style={{ marginLeft: 'auto', color: 'var(--text2)', fontSize: 12 }} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}