import type { Metadata } from 'next'
import ToolLanding from '@/components/tools/ToolLanding'

export const metadata: Metadata = {
  title: 'AI Content Generator for Blogs, Ads & Email | ThinkSuite',
  description: 'Generate SEO-optimized blog posts, ad copy, email campaigns, and social captions instantly with AI, trained on thousands of top-performing marketing pieces.',
  keywords: [
    'AI content generator', 'AI writing tool for business', 'AI blog writing tool',
    'AI ad copy generator', 'AI social media caption generator', 'AI SEO content generator',
    'is AI generated content good for SEO', 'can AI content rank on Google', 'AI content generator vs human copywriter',
  ],
  alternates: { canonical: 'https://thinksuite.in/tools/content' },
}

export default function ContentPage() {
  return <ToolLanding slug="content" />
}
