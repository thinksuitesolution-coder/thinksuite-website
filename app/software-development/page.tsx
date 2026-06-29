import SoftwareDevPageContent from './SoftwareDevPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Software Development Services India | ThinkSuite',
  description: 'Full-stack software development in India: SaaS platforms, mobile apps, custom enterprise systems, and cloud-native web applications for startups and businesses.',
  keywords: 'software development India, custom software development, SaaS development India, mobile app development, cloud-native architecture, Next.js development',
}

export default function SoftwareDevelopmentPage() {
  return <SoftwareDevPageContent />
}
