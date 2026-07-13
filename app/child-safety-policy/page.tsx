import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Child Safety Policy | ThinkSuite Digital Agency',
  description: 'Read ThinkSuite\'s child safety policy, our zero-tolerance commitment to preventing child sexual abuse and exploitation across our platforms and tools.',
  keywords: [
    'ThinkSuite child safety policy', 'CSAE prevention policy', 'child sexual abuse material reporting',
    'platform child safety commitment', 'age restriction policy India',
  ],
}

const childSafetyFaqs = [
  {
    q: 'What is ThinkSuite\'s policy on child safety?',
    a: 'ThinkSuite has a zero-tolerance policy toward child sexual abuse and exploitation in any form. We are committed to ensuring our platforms, tools, and services are never used to harm, exploit, or endanger minors.',
  },
  {
    q: 'How do I report a concern?',
    a: 'Report any content or behavior you believe violates this policy immediately to info@thinksuite.in with relevant details. We treat all such reports with urgency and confidentiality.',
  },
  {
    q: 'What happens after a report is received?',
    a: 'Upon identifying or receiving a credible report of CSAE-related activity, we immediately suspend the associated account, preserve relevant evidence, and take appropriate enforcement action, cooperating fully with law enforcement where required.',
  },
]

export default function ChildSafetyPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>Child Safety Policy</span>
          </div>
          <span className="label">Legal</span>
          <h1 className="mt-16">Child Safety <span className="grad-text">Policy</span></h1>
          <p className="mt-16" style={{ color: 'var(--text2)' }}>Last updated: January 2025</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="service-card reveal" style={{ padding: '48px 40px' }}>
            {[
              {
                title: '1. Our Commitment',
                text: 'ThinkSuite has a zero-tolerance policy toward child sexual abuse and exploitation (CSAE) in any form. We are committed to ensuring our platforms, tools, and services are never used to harm, exploit, or endanger minors.',
              },
              {
                title: '2. Age Restrictions',
                text: 'Our services are intended for use by individuals aged 18 and above, or by minors only under the supervision of a parent or legal guardian where applicable. We do not knowingly collect personal information from children under 13.',
              },
              {
                title: '3. Content Standards',
                text: 'Any content generated, uploaded, or shared through our AI tools and platforms that depicts, promotes, or facilitates child sexual abuse material (CSAM) or endangerment of minors is strictly prohibited and will result in immediate account termination.',
              },
              {
                title: '4. Reporting Mechanism',
                text: 'If you encounter content or behavior on our platform that you believe violates this policy, please report it immediately to info@thinksuite.in with relevant details. We treat all such reports with urgency and confidentiality.',
              },
              {
                title: '5. Zero-Tolerance Enforcement',
                text: 'Upon identifying or receiving a credible report of CSAE-related activity, we will immediately suspend the associated account, preserve relevant evidence, and take appropriate enforcement action.',
              },
              {
                title: '6. Cooperation with Authorities',
                text: 'We cooperate fully with law enforcement agencies and relevant child safety organizations, and will report any confirmed instances of CSAM or child exploitation to the appropriate authorities as required by law.',
              },
              {
                title: '7. Contact Us',
                text: 'To report a concern or for questions about this policy, contact us at info@thinksuite.in.',
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
              mainEntity: childSafetyFaqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div className="container" style={{ maxWidth: 860 }}>
          <h2 style={{ marginBottom: 24 }}>Frequently Asked Questions</h2>
          {childSafetyFaqs.map((faq) => (
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
