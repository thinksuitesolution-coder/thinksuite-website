import CustomSoftwarePageContent from './CustomSoftwarePageContent'
import { FAQS } from './faqs'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom Software Development Company | ThinkSuite',
  description: 'Custom software development for businesses worldwide: ERP systems, CRM platforms, automation tools, and enterprise applications engineered around your exact workflows.',
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
    'custom software development company',
    'bespoke software development agency worldwide',
    'enterprise software development company',
    'custom software development',
    'bespoke software solutions',
    'tailored software development',
    'custom software for small business',
    'custom enterprise software',
    'custom software vs off-the-shelf',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildServiceSchema({
              name: 'Custom Software Development',
              description: 'Custom software development for businesses worldwide, including ERP systems, CRM platforms, automation tools, and enterprise applications engineered around your exact workflows.',
              url: 'https://thinksuite.in/custom-software',
              serviceType: 'Custom Software Development',
              keywords: ['custom software development', 'bespoke software solutions', 'tailored software development'],
            })
          ),
        }}
      />
      <CustomSoftwarePageContent />
    </>
  )
}