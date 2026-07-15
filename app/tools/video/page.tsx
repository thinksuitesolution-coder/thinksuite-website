import type { Metadata } from 'next'
import ComingSoonTool from '@/components/tools/ComingSoonTool'

export const metadata: Metadata = {
  title: 'AI Video Generator with Avatars & Lip Sync | ThinkSuite Video Studio',
  description: 'Create videos from text, images, or scripts with AI avatars, lip sync, and studio-quality output, no camera or crew needed.',
  keywords: [
    'AI video generator', 'text to video AI tool', 'AI avatar video generator',
    'AI video generator for marketing', 'AI talking avatar tool', 'AI video ads generator',
    'how realistic are AI generated videos', 'AI video generator vs traditional video production cost',
  ],
  alternates: { canonical: 'https://thinksuite.in/tools/video' },
}

export default function VideoPage() {
  return (
    <ComingSoonTool
      label="AI Video Studio"
      icon="🎬"
      color="#7c3aed"
      desc="Create videos from text, images, or scripts, with AI avatars, lip sync, and studio quality output, no camera needed."
      tags={['Text to Video', 'AI Avatars', 'Lip Sync', '4K Output']}
    />
  )
}
