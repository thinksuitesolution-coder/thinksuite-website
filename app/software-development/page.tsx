import SoftwareDevPageContent from './SoftwareDevPageContent'
import { FAQS } from './faqs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Software Development Company | ThinkSuite',
  description: 'Full-stack software development for businesses worldwide: SaaS platforms, mobile apps, custom enterprise systems, and cloud-native web applications, built in-house.',
  keywords: [
    'software development company Gurgaon',
    'full stack software development India',
    'custom software development company',
    'SaaS development company India',
    'mobile and web app development company',
    'cloud native software architecture',
    'Next.js and Node.js development company',
    'enterprise software engineering India',
    'software development agency Gurgaon',
    'software development company worldwide',
    'full stack software development agency',
    'enterprise software engineering company',
  ],
}

export default function SoftwareDevelopmentPage() {
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
      <SoftwareDevPageContent />
    </>
  )
}
