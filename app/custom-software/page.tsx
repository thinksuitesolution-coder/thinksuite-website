import CustomSoftwarePageContent from './CustomSoftwarePageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom Software Development India | ThinkSuite',
  description: 'Custom software development for Indian businesses: ERP systems, CRM platforms, automation tools, and enterprise applications built to your exact specifications.',
  keywords: 'custom software development India, bespoke software development, enterprise software India, ERP development, CRM development, API development India',
}

export default function CustomSoftwarePage() {
  return <CustomSoftwarePageContent />
}