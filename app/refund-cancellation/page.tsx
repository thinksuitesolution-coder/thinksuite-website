import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | ThinkSuite',
  description: 'Read ThinkSuite\'s refund and cancellation policy for our subscriptions, tools, and project-based services.',
}

export default function RefundCancellationPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>Refund & Cancellation</span>
          </div>
          <span className="label">Legal</span>
          <h1 className="mt-16">Refund & <span className="grad-text">Cancellation</span></h1>
          <p className="mt-16" style={{ color: 'var(--text2)' }}>Last updated: January 2025</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="service-card reveal" style={{ padding: '48px 40px' }}>
            {[
              {
                title: '1. Overview',
                text: 'This policy outlines the terms under which ThinkSuite handles cancellations and refunds for our subscriptions, AI tools, and project-based services. By purchasing or subscribing to our services, you agree to the terms below.',
              },
              {
                title: '2. Subscription Cancellations',
                text: 'You may cancel your subscription at any time from your account dashboard. Cancellation will stop future billing, but the subscription will remain active until the end of the current billing cycle. No partial refunds are issued for unused time within a billing cycle.',
              },
              {
                title: '3. Refund Eligibility',
                text: 'Refund requests for subscriptions are evaluated on a case-by-case basis and must be raised within 7 days of the charge. Refunds may be granted in cases of duplicate billing, technical failure preventing access to the service, or as required by applicable law.',
              },
              {
                title: '4. Refund Process',
                text: 'Approved refunds are processed to the original payment method within 7-10 business days. To request a refund, email info@thinksuite.in with your account details, transaction ID, and reason for the request.',
              },
              {
                title: '5. Non-Refundable Items',
                text: 'Charges for services already delivered, custom development work that has commenced, one-time setup fees, and usage-based credits already consumed are non-refundable.',
              },
              {
                title: '6. Project-Based Services',
                text: 'For custom projects (software development, design, marketing), cancellation and refund terms are defined in the individual project agreement. Generally, deposits are non-refundable once work has begun, and refunds for remaining milestones are prorated based on work completed.',
              },
              {
                title: '7. Contact Us',
                text: 'For questions about cancellations or refunds, contact us at info@thinksuite.in or call +91 93118 21726.',
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
