import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing Policy | ThinkSuite',
  description: 'Read ThinkSuite\'s pricing policy covering our subscription plans, billing, taxes, and custom project quotes.',
}

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
    </>
  )
}
