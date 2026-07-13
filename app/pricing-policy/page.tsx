import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing Policy | ThinkSuite Digital Agency, Gurgaon',
  description: 'Read ThinkSuite\'s pricing policy covering subscription plans, billing cycles, applicable taxes, price changes, and custom project quotes for our services.',
  keywords: [
    'ThinkSuite pricing policy', 'digital agency pricing India', 'subscription billing policy',
    'custom project quote policy', 'ThinkSuite GST and taxes',
  ],
}

const pricingFaqs = [
  {
    q: 'How is ThinkSuite subscription pricing structured?',
    a: 'Subscription pricing for our tools is listed directly on our website and tool pages. Custom project work, such as software development or marketing campaigns, is priced individually through a formal proposal based on scope.',
  },
  {
    q: 'Will I be notified before a subscription price changes?',
    a: 'Yes. Existing subscribers are notified at least 15 days before any price change takes effect, and the new pricing applies starting from the next billing cycle.',
  },
  {
    q: 'Are taxes included in the listed prices?',
    a: 'All prices are listed in Indian Rupees, and applicable taxes including GST are added at checkout in accordance with Indian law.',
  },
  {
    q: 'Who do I contact for a custom quote?',
    a: 'Email info@thinksuite.in or call +91 93118 21726, and our team will prepare a formal proposal based on your project scope, timeline, and deliverables.',
  },
]

export default function PricingPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>Pricing Policy</span>
          </div>
          <span className="label">Legal</span>
          <h1 className="mt-16">Pricing <span className="grad-text">Policy</span></h1>
          <p className="mt-16" style={{ color: 'var(--text2)' }}>Last updated: January 2025</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="service-card reveal" style={{ padding: '48px 40px' }}>
            {[
              {
                title: '1. Pricing Structure',
                text: 'ThinkSuite offers a mix of subscription-based tools and custom-quoted project services. Subscription pricing is listed on our website and tool pages; project-based pricing is provided through individual proposals based on scope and requirements.',
              },
              {
                title: '2. Currency & Taxes',
                text: 'All prices are listed in Indian Rupees (INR) unless otherwise stated. Applicable taxes, including GST, are added at checkout in accordance with Indian law.',
              },
              {
                title: '3. Price Changes',
                text: 'We reserve the right to change subscription pricing at any time. Existing subscribers will be notified of price changes at least 15 days in advance, and changes will take effect from the next billing cycle.',
              },
              {
                title: '4. Subscription Billing',
                text: 'Subscriptions are billed in advance on a recurring basis (monthly or annually, as selected). Payments are processed automatically via our payment partner. Failed payments may result in suspension of access until resolved.',
              },
              {
                title: '5. Promotional Offers',
                text: 'Discounts, trial periods, and promotional pricing are offered at our discretion and apply only for the stated duration. Promotional pricing cannot be combined with other offers unless explicitly stated.',
              },
              {
                title: '6. Custom Quotes',
                text: 'Pricing for custom development, marketing, and consulting engagements is quoted individually based on project scope, timeline, and deliverables, and is documented in a formal proposal or agreement before work begins.',
              },
              {
                title: '7. Contact Us',
                text: 'For pricing questions or a custom quote, contact us at info@thinksuite.in or call +91 93118 21726.',
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
              mainEntity: pricingFaqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div className="container" style={{ maxWidth: 860 }}>
          <h2 style={{ marginBottom: 24 }}>Frequently Asked Questions</h2>
          {pricingFaqs.map((faq) => (
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
