import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | ThinkSuite Digital Agency',
  description: 'Read ThinkSuite\'s privacy policy to understand how we collect, use, store, and protect your personal data, including GDPR and CCPA rights for international customers.',
  keywords: [
    'ThinkSuite privacy policy', 'digital agency data privacy', 'how ThinkSuite uses your data',
    'website cookies policy', 'personal information rights', 'GDPR rights ThinkSuite', 'CCPA rights ThinkSuite',
    'digital agency data privacy India', 'personal information rights India',
  ],
}

const privacyFaqs = [
  {
    q: 'What personal information does ThinkSuite collect?',
    a: 'We collect information you provide directly, such as your name, email, phone number, and project details, along with usage data, analytics, and cookies collected through our website.',
  },
  {
    q: 'Does ThinkSuite sell my data to third parties?',
    a: 'No. We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers who assist our operations, and only under confidentiality agreements.',
  },
  {
    q: 'Can I ask ThinkSuite to delete my personal data?',
    a: 'Yes. You have the right to access, correct, or delete your personal information, and you can opt out of marketing communications at any time by contacting us at info@thinksuite.in.',
  },
  {
    q: 'How does ThinkSuite protect my information?',
    a: 'We use industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your data from unauthorized access, disclosure, or destruction.',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>Privacy Policy</span>
          </div>
          <span className="label">Legal</span>
          <h1 className="mt-16">Privacy <span className="grad-text">Policy</span></h1>
          <p className="mt-16" style={{ color: 'var(--text2)' }}>Last updated: January 2025</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="service-card reveal" style={{ padding: '48px 40px' }}>
            {[
              {
                title: '1. Information We Collect',
                text: 'We collect information you provide directly, such as your name, email, phone number, and project details when you contact us or use our services. We also collect usage data, analytics, and cookies to improve our website experience.',
              },
              {
                title: '2. How We Use Your Information',
                text: 'We use your information to provide and improve our services, communicate with you about your projects, send relevant updates and marketing communications (with your consent), and comply with legal obligations.',
              },
              {
                title: '3. Information Sharing',
                text: 'We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist in our operations, subject to confidentiality agreements.',
              },
              {
                title: '4. Data Security',
                text: 'We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information from unauthorized access, disclosure, or destruction.',
              },
              {
                title: '5. Cookies',
                text: 'Our website uses cookies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.',
              },
              {
                title: '6. Your Rights',
                text: 'You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. Contact us at info@thinksuite.in to exercise these rights.',
              },
              {
                title: '7. International Users — GDPR & CCPA Rights',
                text: 'If you are located in the EEA, UK, or Switzerland, you have additional rights under the GDPR: the right to access, rectify, erase, or port your data, restrict or object to processing, and lodge a complaint with your local data protection authority. If you are a California resident, you have rights under the CCPA/CPRA to know what personal information we collect, request deletion, and opt out of its sale (we do not sell personal information). Where we transfer data outside your region, we use reasonable contractual and technical safeguards. To exercise any of these rights, contact us at info@thinksuite.in — we respond to all verified requests regardless of where you are located.',
              },
              {
                title: '8. Contact Us',
                text: 'If you have questions about this Privacy Policy, please contact us at info@thinksuite.in or write to us at our registered office in Gurgaon, India.',
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
              mainEntity: privacyFaqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div className="container" style={{ maxWidth: 860 }}>
          <h2 style={{ marginBottom: 24 }}>Frequently Asked Questions</h2>
          {privacyFaqs.map((faq) => (
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

