import WebDevPageContent from './WebDevPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Development Services India | ThinkSuite',
  description: 'Professional web development in India: corporate websites, e-commerce platforms, web apps, and CMS solutions built with Next.js, React, and TypeScript.',
  keywords: 'web development India, Next.js development, React web development, e-commerce website development, corporate website design India',
}

export default function WebDevelopmentPage() {
  return <WebDevPageContent />
}