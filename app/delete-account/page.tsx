import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delete Your ThinkSuite Account | Account Help Center',
  description: 'Learn how to delete your ThinkSuite account, what happens to your data afterward, and what to check before requesting permanent deletion.',
  keywords: [
    'delete ThinkSuite account', 'how to delete my account', 'ThinkSuite account deletion policy',
    'cancel subscription before deleting account', 'account data retention policy',
  ],
}

const deleteAccountFaqs = [
  {
    q: 'How do I delete my ThinkSuite account?',
    a: 'Email info@thinksuite.in from your registered email address with the subject line "Delete Account Request", including your registered phone number or username so we can verify your identity.',
  },
  {
    q: 'How long does account deletion take?',
    a: 'Once we verify your request, your account and associated data are permanently deleted within 7 business days, and you will receive a confirmation email once it is complete.',
  },
  {
    q: 'Will deleting my account cancel my subscription?',
    a: 'No, active subscriptions are not automatically cancelled when you delete your account. Cancel any active subscription separately before requesting deletion to avoid further billing.',
  },
  {
    q: 'What data is retained after deletion?',
    a: 'Certain information, such as billing records and transaction history, may be retained for a limited period as required by applicable tax, accounting, and legal obligations, even after your account is deleted.',
  },
]

export default function DeleteAccountPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>Delete Account</span>
          </div>
          <span className="label">Legal</span>
          <h1 className="mt-16">Delete <span className="grad-text">Account</span></h1>
          <p className="mt-16" style={{ color: 'var(--text2)' }}>Last updated: January 2025</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="service-card reveal" style={{ padding: '48px 40px' }}>
            {[
              {
                title: '1. How to Delete Your Account',
                text: 'You can request account deletion by emailing info@thinksuite.in from your registered email address with the subject line "Delete Account Request". Include your registered phone number or username so we can verify your identity.',
              },
              {
                title: '2. Verification & Processing Time',
                text: 'Once we verify your request, your account and associated data will be permanently deleted within 7 business days. You will receive a confirmation email once the deletion is complete.',
              },
              {
                title: '3. What Gets Deleted',
                text: 'Deleting your account permanently removes your profile information, saved preferences, tool usage history, and any content you have generated through our platform.',
              },
              {
                title: '4. Data Retention',
                text: 'Certain information, such as billing records and transaction history, may be retained for a limited period as required by applicable tax, accounting, and legal obligations, even after account deletion.',
              },
              {
                title: '5. Before You Delete',
                text: 'Account deletion is permanent and cannot be undone. Active subscriptions are not automatically cancelled by deleting your account, please cancel any active subscription separately before requesting deletion to avoid further billing.',
              },
              {
                title: '6. Need Help?',
                text: 'If you have questions about deleting your account or want to cancel a subscription first, contact us at info@thinksuite.in or call +91 93118 21726.',
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
              mainEntity: deleteAccountFaqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div className="container" style={{ maxWidth: 860 }}>
          <h2 style={{ marginBottom: 24 }}>Frequently Asked Questions</h2>
          {deleteAccountFaqs.map((faq) => (
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
