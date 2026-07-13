import WebDevPageContent from './WebDevPageContent'
import { FAQS } from './faqs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Development Company in Gurgaon, India | ThinkSuite',
  description: 'Custom web development in Gurgaon: corporate sites, e-commerce platforms, and web apps built with Next.js, React, and TypeScript for real business growth.',
  keywords: [
    'web development company Gurgaon',
    'Next.js development company India',
    'custom website development India',
    'e-commerce website development Gurgaon',
    'React web application development',
    'corporate website design India',
    'landing page design and development',
    'website redesign services India',
    'TypeScript web development company',
    'CMS website development India',
    'web app development for startups',
  ],
}

export default function WebDevelopmentPage() {
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
      <WebDevPageContent />
    </>
  )
}