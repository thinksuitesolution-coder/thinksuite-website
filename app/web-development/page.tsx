import WebDevPageContent from './WebDevPageContent'
import { FAQS } from './faqs'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Development Company | ThinkSuite',
  description: 'Custom web development for businesses worldwide: corporate sites, e-commerce platforms, and web apps built with Next.js, React, and TypeScript for real business growth.',
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
    'web development company',
    'custom website development company worldwide',
    'e-commerce website development agency',
    'Next.js development company',
    'custom website development',
    'e-commerce website development',
    'corporate website design',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildServiceSchema({
              name: 'Web Development',
              description: 'Custom web development for businesses worldwide, including corporate sites, e-commerce platforms, and web apps built with Next.js, React, and TypeScript.',
              url: 'https://thinksuite.in/web-development',
              serviceType: 'Web Development',
              keywords: ['web development company', 'custom website development', 'Next.js development company'],
            })
          ),
        }}
      />
      <WebDevPageContent />
    </>
  )
}