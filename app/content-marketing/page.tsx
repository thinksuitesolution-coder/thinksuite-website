import ContentMarketingPageContent from './ContentMarketingPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Marketing Services India | ThinkSuite',
  description: 'Content marketing for Indian brands: SEO blog writing, video scripts, case studies, email newsletters, and website copy that builds authority and organic traffic.',
  keywords: ['content marketing India', 'SEO blog writing', 'content strategy agency India', 'blog writing services', 'content marketing agency', 'email newsletter India'],
}

export default function ContentMarketingPage() {
  return <ContentMarketingPageContent />
}
