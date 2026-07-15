import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions | ThinkSuite Digital Agency',
  description: 'Read ThinkSuite\'s terms and conditions governing the use of our website, project agreements, digital agency services, and in-house AI tools, for customers worldwide.',
  keywords: [
    'ThinkSuite terms and conditions', 'digital agency terms of service', 'project payment terms agency',
    'intellectual property digital agency', 'ThinkSuite governing law', 'digital agency terms of service India',
  ],
}

const termsFaqs = [
  {
    q: 'Who owns the work ThinkSuite delivers?',
    a: 'Upon full payment, clients receive full ownership of custom deliverables created specifically for their project. ThinkSuite retains the right to showcase completed work in our portfolio unless otherwise agreed.',
  },
  {
    q: 'What are the standard payment terms?',
    a: 'Payment terms are defined in individual project agreements. Generally, projects require a deposit before work begins, with the remaining balance due upon completion, and invoices are due within 14 days of issue.',
  },
  {
    q: 'Is my business information kept confidential?',
    a: 'Yes. We treat all client information as strictly confidential and will not disclose your business or project details to third parties without your explicit consent.',
  },
  {
    q: 'Which laws govern these terms?',
    a: 'These Terms are governed by the laws of India, and any disputes are subject to the exclusive jurisdiction of courts in Gurgaon, India.',
  },
]

export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>Terms & Conditions</span>
          </div>
          <span className="label">Legal</span>
          <h1 className="mt-16">Terms & <span className="grad-text">Conditions</span></h1>
          <p className="mt-16" style={{ color: 'var(--text2)' }}>Last updated: January 2025</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="service-card reveal" style={{ padding: '48px 40px' }}>
            {[
              {
                title: '1. Acceptance of Terms',
                text: 'By accessing and using ThinkSuite\'s website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.',
              },
              {
                title: '2. Services',
                text: 'ThinkSuite provides digital agency services including software development, digital marketing, design, AI automation, and consulting. Service details, deliverables, and timelines are defined in individual project agreements.',
              },
              {
                title: '3. Payment Terms',
                text: 'Payment terms are defined in project agreements. Generally, projects require a deposit before work begins, with the remaining balance due upon project completion. Invoices are due within 14 days of issue.',
              },
              {
                title: '4. Intellectual Property',
                text: 'Upon full payment, clients receive full ownership of custom deliverables created specifically for their project. ThinkSuite retains the right to showcase completed work in our portfolio unless explicitly agreed otherwise.',
              },
              {
                title: '5. Confidentiality',
                text: 'We treat all client information as strictly confidential. We will not disclose your business information, project details, or any proprietary information to third parties without your explicit consent.',
              },
              {
                title: '6. Limitation of Liability',
                text: 'ThinkSuite\'s liability is limited to the total amount paid for the specific service in question. We are not liable for indirect, consequential, or incidental damages arising from the use of our services.',
              },
              {
                title: '7. International Customers & Currency',
                text: 'ThinkSuite serves customers worldwide. Customers outside India are billed in USD through our international payment processor, which calculates and collects any applicable VAT, GST, or sales tax for your country at checkout. If you are located in the EEA, UK, or another jurisdiction with a statutory right of withdrawal for digital purchases, you acknowledge that by completing payment and gaining immediate access to a subscription or digital tool, you expressly request immediate performance and waive that withdrawal right, to the extent permitted by applicable law.',
              },
              {
                title: '8. Governing Law',
                text: 'These Terms are governed by the laws of India, regardless of the customer\'s location. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of courts in Gurgaon, India.',
              },
            ].map((section) => (
              <div key={section.title} style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 20, marginBottom: 12, color: 'var(--white)' }}>{section.title}</h3>
                <p style={{ color: 'var(--text2)', lineHeight: 1.85 }}>{section.text}</p>
              </div>
            ))}
            <div>
              <p style={{ color: 'var(--text2)' }}>
                Questions about these terms? Contact us at{' '}
                <a href="mailto:info@thinksuite.in" style={{ color: 'var(--cyan)' }}>info@thinksuite.in</a>
              </p>
            </div>
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
              mainEntity: termsFaqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div className="container" style={{ maxWidth: 860 }}>
          <h2 style={{ marginBottom: 24 }}>Frequently Asked Questions</h2>
          {termsFaqs.map((faq) => (
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

