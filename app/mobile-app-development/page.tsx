import MobileAppPageContent from './MobileAppPageContent'
import { FAQS } from './faqs'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mobile App Development Company | ThinkSuite',
  description: 'iOS and Android app development for startups and growing businesses worldwide. ThinkSuite builds native Swift, Kotlin, React Native, and Flutter apps.',
  keywords: [
    'mobile app development company Gurgaon',
    'iOS app development India',
    'Android app development company India',
    'React Native app development India',
    'Flutter app development company',
    'cross platform mobile app development',
    'custom mobile app development for startups',
    'app development company near me',
    'native mobile app development India',
    'mobile app maintenance and support',
    'mobile app development company',
    'iOS app development agency worldwide',
    'Android app development company',
    'iOS and Android app development',
    'custom mobile app development',
    'cross-platform app development',
    'React Native app development company',
    'mobile app development cost',
  ],
}

export default function MobileAppPage() {
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
              name: 'Mobile App Development',
              description: 'iOS and Android app development for startups and growing businesses worldwide, including native Swift, Kotlin, React Native, and Flutter apps.',
              url: 'https://thinksuite.in/mobile-app-development',
              serviceType: 'Mobile App Development',
              keywords: ['mobile app development company', 'iOS and Android app development', 'custom mobile app development'],
            })
          ),
        }}
      />
      <MobileAppPageContent />
    </>
  )
}