import MobileAppPageContent from './MobileAppPageContent'
import { FAQS } from './faqs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mobile App Development Company Gurgaon | ThinkSuite',
  description: 'iOS and Android app development in Gurgaon. ThinkSuite builds native Swift, Kotlin, React Native, and Flutter apps for startups and growing businesses.',
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
      <MobileAppPageContent />
    </>
  )
}