import SaasProductsPageContent from './SaasProductsPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SaaS Product Development India | ThinkSuite',
  description: 'SaaS product development for startups in India. We build MVPs and scale them to production with multi-tenancy, subscription billing, and cloud architecture.',
  keywords: 'SaaS product development India, SaaS MVP development, multi-tenant SaaS India, subscription billing integration, SaaS startup India',
}

export default function SaaSProductsPage() {
  return <SaasProductsPageContent />
}
