import type { Metadata } from 'next'
import LeadGenerationClient from './LeadGenerationClient'

export const metadata: Metadata = {
  title: 'AI B2B Lead Generation Tool for India | ThinkSuite',
  description: 'Find 100+ verified B2B leads from any city and industry in India, Google Maps, websites, LinkedIn, and government tenders, with AI-written outreach and one-click CSV export.',
  keywords: [
    'B2B lead generation tool India', 'AI lead generation software', 'lead generation tool for agencies',
    'GeM tender leads tool', 'MCA company data tool', 'verified business leads India',
    'how does AI lead generation work', 'best lead generation tool for India', 'how accurate is AI generated B2B lead data',
  ],
  alternates: { canonical: 'https://thinksuite.in/tools/lead-generation' },
}

export default function LeadGenerationPage() {
  return <LeadGenerationClient />
}
