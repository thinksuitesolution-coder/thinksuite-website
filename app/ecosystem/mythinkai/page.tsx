import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MyThinkAI: Targeted Lead Lists by Occupation & City',
  description: 'MyThinkAI delivers verified, ready-to-use lead lists filtered by occupation, city, and industry, so your outreach team can start calling real prospects today.',
  keywords: [
    'MyThinkAI lead generation',
    'targeted lead lists',
    'business leads by occupation',
    'business leads by city',
    'verified contact lists India',
    'B2B lead list provider',
    'lead list by industry',
    'CSV lead export',
    'local business lead generation',
    'cold outreach contact list',
  ],
  alternates: { canonical: 'https://thinksuite.in/ecosystem/mythinkai' },
}

const COLOR = '#d97706'
const ACCENT_BG = 'rgba(217,119,6,0.08)'
const BORDER = 'rgba(217,119,6,0.15)'

const features = [
  { icon: 'fa-briefcase', title: 'Occupation-Based Filters', desc: 'Target leads by exact job title, profession, or business role: doctors, lawyers, retailers, and more' },
  { icon: 'fa-location-dot', title: 'City & Location Targeting', desc: 'Filter leads by city, district, state, or pincode. Get hyper-local or go national' },
  { icon: 'fa-address-card', title: 'Verified Contact Data', desc: 'Name, phone, email, and business address, all verified and ready for outreach' },
  { icon: 'fa-industry', title: 'Industry Segmentation', desc: 'Narrow down by industry, business size, revenue range, and more filters' },
  { icon: 'fa-file-csv', title: 'Bulk CSV Export', desc: 'Download your lead list instantly in CSV or Excel format, CRM-ready' },
  { icon: 'fa-rotate', title: 'Fresh Daily Data', desc: 'Lead database updated daily to ensure accuracy and remove outdated contacts' },
]

const stats = [
  { num: 'Occupation', label: 'Filter by Role' },
  { num: 'City', label: 'Filter by Location' },
  { num: 'CSV', label: 'Instant Export' },
  { num: 'Daily', label: 'Data Refresh' },
]

const steps = [
  { n: '01', title: 'Tell Us Your Target', desc: 'Share the occupation, city, and industry of the customers you want to reach. We handle the rest.' },
  { n: '02', title: 'We Build Your List', desc: 'Our system filters and curates a verified lead list matching your exact requirements.' },
  { n: '03', title: 'Download & Outreach', desc: 'Get your list in CSV format and start calling, emailing, or WhatsApp campaigns immediately.' },
]

const faqs = [
  {
    q: 'What is MyThinkAI used for?',
    a: 'MyThinkAI is used to build targeted business lead lists. Instead of buying a generic database, you tell MyThinkAI the occupation, city, and industry of the customer you want to reach, and it returns a verified, exportable contact list ready for outreach.',
  },
  {
    q: 'Is MyThinkAI only for large businesses?',
    a: 'No. MyThinkAI is built for any business that needs to reach a specific type of customer, from a single sales rep doing local outreach to a marketing team running a multi-city campaign. Lists can be filtered as narrowly as one profession in one city.',
  },
  {
    q: 'What information does a MyThinkAI lead list include?',
    a: 'Each verified contact includes name, phone number, email, and business address where available. Lists can be exported instantly in CSV or Excel format so they drop straight into a CRM or dialer.',
  },
  {
    q: 'How is MyThinkAI different from a generic bought contact list?',
    a: 'A generic list is usually broad and unfiltered. MyThinkAI is built around occupation, location, and industry filters from the start, so every contact in the list actually matches the customer profile a business is trying to reach.',
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

export default function MyThinkAIPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section style={{
        background: 'linear-gradient(135deg, #07091a 0%, #1a1000 50%, #120b00 100%)',
        padding: '130px 0 80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(217,119,6,0.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24, background: 'rgba(217,119,6,0.15)',
            border: '1.5px solid rgba(217,119,6,0.35)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 28px',
          }}>
            <i className="fa-solid fa-crosshairs" style={{ color: COLOR, fontSize: 32 }} />
          </div>
          <span className="label" style={{ marginBottom: 16, display: 'inline-block', color: COLOR }}>THINKSUITE ECOSYSTEM</span>
          <h1 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, color: '#fff', marginBottom: 14, lineHeight: 1.1 }}>MyThinkAI</h1>
          <p style={{ fontSize: 20, fontWeight: 600, color: COLOR, marginBottom: 20 }}>Targeted Lead Lists by Occupation &amp; Location</p>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.85 }}>
            Tell us what kind of customers you need: their profession, city, and industry, and MyThinkAI delivers a verified, ready-to-use lead list so you can start your outreach the same day.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Get Your Lead List <i className="fa-solid fa-arrow-right" /></Link>
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
            <span className="label" style={{ marginBottom: 12, display: 'inline-block' }}>FEATURES</span>
            <h2>Find the Right Customers, <span className="grad-text">Every Time</span></h2>
            <p style={{ color: 'var(--text2)', maxWidth: 500, margin: '16px auto 0', fontSize: 16, lineHeight: 1.7 }}>
              No more cold searches. Get targeted lead data matched exactly to your business needs.
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
            <h2>Leads in Your Inbox <span className="grad-text">in 3 Steps</span></h2>
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
          <h2 style={{ marginBottom: 16 }}>Start Reaching the <span className="grad-text">Right Customers</span></h2>
          <p style={{ color: 'var(--text2)', fontSize: 17, maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Tell us your target customer profile and get a verified lead list delivered to you, ready for outreach.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Get Your Lead List <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="/ecosystem" className="btn btn-outline btn-lg">Explore All Products</Link>
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
