import MobileAppPageContent from './MobileAppPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mobile App Development India | iOS and Android | ThinkSuite',
  description: 'iOS and Android mobile app development in India. We build React Native, Flutter, and native apps for startups and growing businesses across all industries.',
  keywords: 'mobile app development India, iOS app development, Android app development, React Native India, Flutter app development, cross-platform mobile apps',
}

export default function MobileAppPage() {
  return <MobileAppPageContent />
}