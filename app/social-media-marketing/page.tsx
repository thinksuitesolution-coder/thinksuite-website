import SocialMediaPageContent from './SocialMediaPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social Media Marketing Agency India | ThinkSuite',
  description: 'Social media marketing for Indian brands on Instagram, LinkedIn, Facebook, and YouTube. Content creation, paid campaigns, and community management.',
  keywords: ['social media marketing India', 'Instagram marketing agency', 'LinkedIn marketing India', 'social media management', 'content creation agency', 'paid social campaigns India'],
}

export default function SocialMediaPage() {
  return <SocialMediaPageContent />
}
