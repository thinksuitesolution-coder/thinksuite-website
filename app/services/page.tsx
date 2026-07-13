import type { Metadata } from 'next'
import Link from 'next/link'
import ServicesGrid from './ServicesGrid'

const servicesFaqs = [
  {
    q: 'What services does ThinkSuite offer?',
    a: 'ThinkSuite offers six core service verticals: software development, digital marketing, branding and design, AI automation, media and advertising, and business consulting. All six are delivered by our own in-house team in Gurgaon, so you never have to juggle separate vendors for each one.',
  },
  {
    q: 'Can I hire ThinkSuite for just one service?',
    a: 'Yes. You can engage us for a single service, such as a website build or an SEO campaign, or combine several verticals into one coordinated engagement. Many clients start with one service and expand into others once they see how the team works.',
  },
  {
    q: 'How much do ThinkSuite services cost?',
    a: 'Pricing depends on the scope, timeline, and complexity of what you need. One-off deliverables like websites or brand identities are quoted as fixed project fees, while ongoing work like SEO or social media management runs on a monthly retainer. Book a free consultation and we will send a custom proposal.',
  },
  {
    q: 'How long does it take to get started?',
    a: 'Most engagements begin with a free discovery call where we understand your goals, followed by a proposal within a few business days. Once you approve scope and timeline, work typically kicks off within a week.',
  },
  {
    q: 'Does ThinkSuite work with businesses outside Gurgaon?',
    a: 'Yes. While our team is based in Gurgaon, we work with clients across India and internationally. Most collaboration happens over calls, shared dashboards, and regular check-ins, so location is rarely a barrier.',
  },
]

export const metadata: Metadata = {
  title: 'Digital Services by ThinkSuite | Web, Marketing, AI, Design',
  description: 'Explore ThinkSuite\'s six service verticals: software development, digital marketing, branding, AI automation, media advertising, and business consulting.',
  keywords: [
    'digital agency services India', 'software development services Gurgaon', 'digital marketing services India',
    'branding and design services', 'AI automation services India', 'media and advertising agency Gurgaon',
    'business consulting services India', 'full stack agency service list', 'website and app development services',
    'SEO and social media marketing services',
  ],
}

export default function ServicesPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: servicesFaqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <section className="sp-section">
        <div className="container">

          {/* Hero */}
          <div className="sp-hero">
            <span className="sp-badge"><span className="sp-badge-dot">✦</span> OUR SERVICES</span>
            <h1 className="sp-hero-title">One Partner.{' '}<span>Six Growth Engines.</span></h1>
            <p className="sp-hero-sub">
              Most businesses end up managing five different vendors just to get a website live,
              rank on Google, and run ads that actually convert. We built ThinkSuite so you only
              have to make one call.
            </p>
          </div>

          {/* Grid + Drawer (client) */}
          <ServicesGrid />

        </div>
      </section>

      <section className="section">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }} className="reveal">
            <span className="label">Common Questions</span>
            <h2 style={{ marginTop: 12 }}>
              Frequently Asked <span className="grad-text">Questions</span>
            </h2>
          </div>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {servicesFaqs.map((faq, i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '28px 32px',
                  marginBottom: 14,
                  boxShadow: 'var(--shadow)',
                }}
              >
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    marginBottom: 12,
                    color: 'var(--white)',
                    lineHeight: 1.45,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                  }}
                >
                  <span style={{ color: 'var(--cyan)', fontSize: 13, fontFamily: 'var(--font-m)', marginTop: 2, flexShrink: 0 }}>Q.</span>
                  {faq.q}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, margin: 0, paddingLeft: 28 }}>{faq.a}</p>
              </div>
            ))}
            <div className="reveal" style={{ marginTop: 32, textAlign: 'center' }}>
              <Link href="/contact" className="btn btn-primary">
                Book Free Consultation <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
