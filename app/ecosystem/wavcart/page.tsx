import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'WavCart: eStore and Automation Platform for Local Vendors | ThinkSuite',
  description: 'WavCart is an AI-powered eStore and automation platform built for local vendors and D2C brands. Smart listings, auto marketing, and inventory intelligence.',
  alternates: { canonical: 'https://thinksuite.in/ecosystem/wavcart' },
}

const COLOR = '#059669'
const ACCENT_BG = 'rgba(5,150,105,0.08)'
const BORDER = 'rgba(5,150,105,0.15)'

const features = [
  { icon: 'fa-store', title: 'Instant eStore', desc: 'Set up your online store in under 24 hours with AI-written product listings' },
  { icon: 'fa-robot', title: 'Marketing Automation', desc: 'Campaigns that create, run, and optimize themselves with zero manual work' },
  { icon: 'fa-boxes-stacked', title: 'Inventory Intelligence', desc: 'Predict demand, prevent stockouts, and reorder automatically' },
  { icon: 'fa-list-check', title: 'Smart Product Listings', desc: 'AI-generated titles, descriptions, and SEO tags for every product' },
  { icon: 'fa-envelope', title: 'WhatsApp & Email', desc: 'Automated customer journeys across WhatsApp, email, and SMS' },
  { icon: 'fa-chart-bar', title: 'Analytics Dashboard', desc: 'Real-time sales, conversion, and customer insights in one view' },
]

const stats = [
  { num: '2.5×', label: 'Avg Revenue Lift' },
  { num: '60%', label: 'Marketing Automated' },
  { num: '< 24h', label: 'Setup Time' },
  { num: '500+', label: 'Local Vendors' },
]

const steps = [
  { n: '01', title: 'Set Up Your eStore', desc: 'Add your products and let WavCart\'s AI write all listings, descriptions, and tags instantly.' },
  { n: '02', title: 'Automate Marketing', desc: 'Our system creates and runs ad campaigns, WhatsApp messages, and email flows automatically.' },
  { n: '03', title: 'Track & Scale', desc: 'Monitor sales in real time and let the AI continuously optimize for more conversions.' },
]

export default function WavCartPage() {
  return (
    <main>
      <section style={{
        background: 'linear-gradient(135deg, #07091a 0%, #071a10 50%, #061208 100%)',
        padding: '130px 0 80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(5,150,105,0.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24, background: 'rgba(5,150,105,0.15)',
            border: '1.5px solid rgba(5,150,105,0.35)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 28px',
          }}>
            <i className="fa-solid fa-cart-shopping" style={{ color: COLOR, fontSize: 32 }} />
          </div>
          <span className="label" style={{ marginBottom: 16, display: 'inline-block', color: COLOR }}>THINKSUITE ECOSYSTEM</span>
          <h1 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, color: '#fff', marginBottom: 14, lineHeight: 1.1 }}>WavCart</h1>
          <p style={{ fontSize: 20, fontWeight: 600, color: COLOR, marginBottom: 20 }}>Automation Platform &amp; eStore for Local Vendors</p>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.85 }}>
            An AI-powered eStore and automation platform built for local vendors and D2C brands. Sell smarter, automate your marketing, and grow your business without the complexity.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Join Waitlist <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="/ecosystem" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>All Products</Link>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderLeft: '1px solid var(--border)' }}>
            {stats.map((s) => (
              <div key={s.label} style={{ padding: '28px 20px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: COLOR, fontFamily: 'var(--font-h)', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6, fontWeight: 600, letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="label" style={{ marginBottom: 12, display: 'inline-block' }}>PLATFORM FEATURES</span>
            <h2>Built for Vendors Who Want to <span className="grad-text">Sell &amp; Scale</span></h2>
            <p style={{ color: 'var(--text2)', maxWidth: 500, margin: '16px auto 0', fontSize: 16, lineHeight: 1.7 }}>
              Everything a local vendor needs to sell online, without any tech headaches.
            </p>
          </div>
          <div className="grid-3" style={{ gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} style={{ background: 'var(--surface)', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: ACCENT_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <i className={`fa-solid ${f.icon}`} style={{ color: COLOR, fontSize: 18 }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="label" style={{ marginBottom: 12, display: 'inline-block' }}>HOW IT WORKS</span>
            <h2>From Setup to Sales in <span className="grad-text">3 Steps</span></h2>
          </div>
          <div className="grid-3" style={{ gap: 28 }}>
            {steps.map((s) => (
              <div key={s.n} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '32px 28px' }}>
                <div style={{ fontSize: 48, fontWeight: 900, fontFamily: 'var(--font-h)', lineHeight: 1, marginBottom: 16, color: COLOR, opacity: 0.3 }}>{s.n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--white)', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: ACCENT_BG, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ marginBottom: 16 }}>Start Selling with <span className="grad-text">WavCart</span></h2>
          <p style={{ color: 'var(--text2)', fontSize: 17, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Join hundreds of local vendors already using WavCart to automate their sales and marketing.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Join Waitlist <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="/ecosystem" className="btn btn-outline btn-lg">Explore All Products</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
