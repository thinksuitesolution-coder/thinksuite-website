import SaasProductsPageContent from './SaasProductsPageContent'
import { FAQS } from './faqs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SaaS Product Development Company | ThinkSuite',
  description: 'SaaS product development for businesses worldwide. ThinkSuite builds MVPs and scales them with multi-tenancy, subscription billing, and cloud-native architecture, in-house.',
  keywords: [
    'SaaS product development company India',
    'SaaS MVP development for startups',
    'multi-tenant SaaS architecture development',
    'subscription billing integration for SaaS',
    'SaaS application development Gurgaon',
    'cloud native SaaS development company',
    'SaaS platform development for startups India',
    'build a SaaS product from scratch',
    'SaaS software development company',
    'SaaS product development company',
    'SaaS platform development for startups worldwide',
    'SaaS application development agency',
  ],
}

export default function SaaSProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />
      <SaasProductsPageContent />
    </>
  )
}
