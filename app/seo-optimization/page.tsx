import SeoGeoPageContent from './SeoGeoPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEO and GEO Services India | Rank on Google and AI | ThinkSuite',
  description: 'SEO and Generative Engine Optimization for Indian businesses. Rank on Google and get cited by AI tools like ChatGPT and Gemini through structured content strategy.',
  keywords: 'SEO services India, GEO optimization India, generative engine optimization, AI search optimization, ChatGPT citation strategy, SEO agency India, rank on Google and AI, ThinkSuite SEO',
}

export default function SeoPage() {
  return <SeoGeoPageContent />
}