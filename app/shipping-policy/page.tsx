import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Policy | ThinkSuite Digital Agency, Gurgaon',
  description: 'Read ThinkSuite\'s delivery policy for digital tools, subscriptions, and project deliverables. We are a digital agency and do not ship physical products.',
  keywords: [
    'ThinkSuite shipping policy', 'digital delivery policy India', 'no physical shipping digital agency',
    'subscription activation time India', 'project deliverable timeline agency',
  ],
}

const shippingFaqs = [
  {
    q: 'Does ThinkSuite ship physical products?',
    a: 'No. ThinkSuite provides digital services only, so no shipping charges, carriers, or physical delivery timelines apply to any of our services.',
  },
  {
    q: 'How quickly is subscription access activated?',
    a: 'Access to subscription-based tools is activated immediately upon successful payment. In rare cases of payment verification delays, access is granted within 24 hours.',
  },
  {
    q: 'How are project deliverables sent to me?',
    a: 'For custom projects such as software, design, or marketing assets, deliverables are shared digitally via email, cloud storage links, or the relevant platform, in line with the timelines agreed in your project proposal.',
  },
]

export default function ShippingPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>Shipping Policy</span>
          </div>
          <span className="label">Legal</span>
          <h1 className="mt-16">Shipping <span className="grad-text">Policy</span></h1>
          <p className="mt-16" style={{ color: 'var(--text2)' }}>Last updated: January 2025</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="service-card reveal" style={{ padding: '48px 40px' }}>
            {[
              {
                title: '1. Digital Delivery',
                text: 'ThinkSuite provides digital services and does not ship physical products. All tools, subscriptions, and deliverables are provided electronically through our website and dashboard.',
              },
              {
                title: '2. Service Activation Timelines',
                text: 'Access to subscription-based tools is activated immediately upon successful payment. In rare cases of payment verification delays, access is granted within 24 hours.',
              },
              {
                title: '3. Project Deliverables',
                text: 'For custom projects (software, design, marketing assets), deliverables are shared digitally via email, cloud storage links, or the relevant platform, in line with the timelines agreed in the project proposal.',
              },
              {
                title: '4. No Physical Shipping',
                text: 'As we do not sell or ship any physical goods, no shipping charges, carriers, or physical delivery timelines apply to any of our services.',
              },
              {
                title: '5. Delays',
                text: 'While we aim to meet all agreed timelines, delivery of custom project work may occasionally be delayed due to scope changes, pending client inputs, or unforeseen circumstances. We will communicate any delays proactively.',
              },
              {
                title: '6. Contact Us',
                text: 'For questions about service delivery or access, contact us at info@thinksuite.in or call +91 93118 21726.',
              },
            ].map((section) => (
              <div key={section.title} style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 20, marginBottom: 12, color: 'var(--white)' }}>{section.title}</h3>
                <p style={{ color: 'var(--text2)', lineHeight: 1.85 }}>{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: shippingFaqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div className="container" style={{ maxWidth: 860 }}>
          <h2 style={{ marginBottom: 24 }}>Frequently Asked Questions</h2>
          {shippingFaqs.map((faq) => (
            <div key={faq.q} className="service-card reveal" style={{ padding: '24px 28px', marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, marginBottom: 10, color: 'var(--white)' }}>{faq.q}</h3>
              <p style={{ color: 'var(--text2)', lineHeight: 1.85, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
