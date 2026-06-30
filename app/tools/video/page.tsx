'use client'
import ComingSoonTool from '@/components/tools/ComingSoonTool'

export default function VideoPage() {
  return (
    <ComingSoonTool
      label="AI Video Studio"
      icon="🎬"
      color="#7c3aed"
      desc="Create stunning videos from text, images, or scripts. AI avatars, lip sync, and studio-quality output — no camera needed."
      tags={['Text to Video', 'AI Avatars', 'Lip Sync', '4K Output']}
    />
  )
}
