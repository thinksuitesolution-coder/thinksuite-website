import type { Metadata } from 'next'
import './tools.css'

export const metadata: Metadata = {
  title: { default: 'AI Tools', template: '%s | ThinkSuite AI Tools' },
  description: 'ThinkSuite AI Tools cover lead generation, content creation, video production, voice synthesis, and image editing, in one monthly subscription.',
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
