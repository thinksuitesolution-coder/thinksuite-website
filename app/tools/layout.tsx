import type { Metadata } from 'next'
import './tools.css'

export const metadata: Metadata = {
  title: { default: 'AI Tools', template: '%s — ThinkSuite AI Tools' },
  description: 'Powerful AI tools for lead generation, content creation, video production, voice synthesis and image editing.',
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
