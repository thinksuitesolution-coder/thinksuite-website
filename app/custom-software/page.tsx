import CustomSoftwarePageContent from './CustomSoftwarePageContent'
import { FAQS } from './faqs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom Software Development Company Gurgaon | ThinkSuite',
  description: 'Custom software development in Gurgaon: ERP systems, CRM platforms, automation tools, and enterprise applications engineered around your exact workflows.',
  keywords: [
    'custom software development company Gurgaon',
    'bespoke software development India',
    'enterprise software development company',
    'ERP software development India',
    'CRM software development company',
    'business process automation software',
    'API development and integration India',
    'legacy system modernization services',
    'workflow automation software development',
    'software development for enterprises India',
  ],
}

export default function CustomSoftwarePage() {
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
      <CustomSoftwarePageContent />
    </>
  )
}