import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Visibility — GEO & AI Search Ranking Platform | ThinkSuite',
  description: 'Visibility helps businesses rank on Google and get cited by ChatGPT, Gemini, and Perplexity through GEO (Generative Engine Optimization) strategies.',
  alternates: { canonical: 'https://thinksuite.in/ecosystem/visibility' },
}

const COLOR = '#7c3aed'
const ACCENT_BG = 'rgba(124,58,237,0.08)'
const BORDER = 'rgba(124,58,237,0.15)'

const features = [
  { icon: 'fa-magnifying-glass', title: 'AI Search Optimization', desc: 'Get cited by ChatGPT, Gemini, and Perplexity when users ask about your industry' },
  { icon: 'fa-shield-halved', title: 'E-E-A-T Authority Building', desc: 'Build experience, expertise, authoritativeness, and trust signals that AI models trust' },
  { icon: 'fa-quote-left', title: 'Citation Optimization', desc: 'Structure your content so AI engines naturally quote and recommend your brand' },
  { icon: 'fa-code', title: 'Structured Data for AI', desc: 'Advanced schema markup optimized for AI crawlers and knowledge graphs' },
  { icon: 'fa-bullhorn', title: 'Brand Mention Strategy', desc: 'Proactive mention building across high-authority publications and sites' },
  { icon: 'fa-chart-line', title: 'AI Answer Monitoring', desc: 'Track when, where, and how AI engines mention your brand — in real time' },
]

const stats = [
  { num: '3×', label: 'AI Visibility' },
  { num: '120%', label: 'Traffic Increase' },
  { num: '50+', label: 'Brands Ranked' },
  { num: 'GPT+', label: 'Gemini & Perplexity' },
]

const steps = [
  { n: '01', title: 'AI Visibility Audit', desc: 'We analyze how your business currently appears (or doesn\'t) across Google, ChatGPT, Gemini, and Perplexity.' },
  { n: '02', title: 'Optimize & Build Authority', desc: 'We restructure your content, build E-E-A-T signals, and implement structured data for AI engines.' },
  { n: '03', title: 'Monitor & Grow Citations', desc: 'We track AI mentions of your brand monthly and continuously grow your citations across all platforms.' },
]

export default function VisibilityPage() {
  return (
    <main>
      <section style={{
        background: 'linear-gradient(135deg, #07091a 0%, #100720 50%, #0a0614 100%)',
        padding: '130px 0 80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(124,58,237,0.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24, background: 'rgba(124,58,237,0.15)',
            border: '1.5px solid rgba(124,58,237,0.35)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 28px',
          }}>
            <i className="fa-solid fa-eye" style={{ color: COLOR, fontSize: 32 }} />
          </div>
          <span className="label" style={{ marginBottom: 16, display: 'inline-block', color: COLOR }}>THINKSUITE ECOSYSTEM</span>
          <h1 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, color: '#fff', marginBottom: 14, lineHeight: 1.1 }}>Visibility</h1>
          <p style={{ fontSize: 20, fontWeight: 600, color: COLOR, marginBottom: 20 }}>Help Your Business Rank Through GEO</p>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.85 }}>
            When someone asks ChatGPT or Gemini about businesses in your industry, does your name come up? Visibility makes sure it does — through GEO strategy, AI citation building, and authority optimization.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Get a GEO Audit <i className="fa-solid fa-arrow-right" /></Link>
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
            <span className="label" style={{ marginBottom: 12, display: 'inline-block' }}>WHAT WE DO</span>
            <h2>Rank on Google. <span className="grad-text">Get Cited by AI.</span></h2>
            <p style={{ color: 'var(--text2)', maxWidth: 520, margin: '16px auto 0', fontSize: 16, lineHeight: 1.7 }}>
              Traditional SEO gets you on Google. GEO gets you recommended by the AI engines your customers are already using.
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
            <h2>Your GEO Growth <span className="grad-text">in 3 Phases</span></h2>
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
          <h2 style={{ marginBottom: 16 }}>Make Your Business <span className="grad-text">Visible Everywhere</span></h2>
          <p style={{ color: 'var(--text2)', fontSize: 17, maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Get found on Google, cited by ChatGPT, and recommended by Gemini. Book a free AI Visibility audit today.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Book Free GEO Audit <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="/seo-optimization" className="btn btn-outline btn-lg">SEO &amp; GEO Services</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
