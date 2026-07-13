import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Visibility: GEO Platform to Get Cited by AI Search',
  description: 'Visibility is ThinkSuite\'s GEO product, built to get your business cited by ChatGPT, Gemini, and Perplexity, through E-E-A-T authority and structured data.',
  keywords: [
    'Visibility GEO platform',
    'generative engine optimization',
    'get cited by ChatGPT',
    'AI search visibility',
    'rank in AI Overviews',
    'E-E-A-T authority building',
    'AI search optimization service',
    'GEO vs SEO',
    'brand mentions in AI answers',
    'Perplexity AI citation strategy',
  ],
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
  { icon: 'fa-chart-line', title: 'AI Answer Monitoring', desc: 'Track when, where, and how AI engines mention your brand, all in real time' },
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

const faqs = [
  {
    q: 'What is Visibility used for?',
    a: 'Visibility is used to get a business cited and recommended by AI search tools like ChatGPT, Gemini, and Perplexity, not just ranked on Google. It audits how a brand currently appears across these engines, then builds the authority signals and structured data needed to get mentioned in AI-generated answers.',
  },
  {
    q: 'How is GEO different from traditional SEO?',
    a: 'Traditional SEO optimizes a page to rank in a list of blue links. GEO optimizes content so an AI model can confidently lift a fact, a quote, or a recommendation from it and cite the brand by name in its answer. Visibility runs both, since most buyers still use both Google and AI tools during research.',
  },
  {
    q: 'Do I need Visibility if I already do SEO?',
    a: 'SEO and GEO overlap but reward different things: SEO rewards backlinks and keyword structure, GEO rewards clear, well-sourced, citable statements and strong E-E-A-T signals. A site can rank well on Google and still be invisible to ChatGPT, which is the gap Visibility is built to close.',
  },
  {
    q: 'How long does it take to see AI citations improve?',
    a: 'It depends on how much authority content and structured data already exists on a site. Visibility starts with an audit to set a realistic baseline, then tracks AI mentions monthly so the improvement is measured, not guessed at.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function VisibilityPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
            When someone asks ChatGPT or Gemini about businesses in your industry, does your name come up? Visibility makes sure it does, through GEO strategy, AI citation building, and authority optimization.
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

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="label" style={{ marginBottom: 12, display: 'inline-block' }}>FAQ</span>
            <h2>Frequently Asked <span className="grad-text">Questions</span></h2>
          </div>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '24px 28px', marginBottom: 14 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: 'var(--white)', lineHeight: 1.45, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: COLOR, fontSize: 13, fontFamily: 'var(--font-m)', marginTop: 2, flexShrink: 0 }}>Q.</span>
                  {faq.q}
                </h3>
                <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.7, margin: 0, paddingLeft: 26 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
