'use client'
import ComingSoonTool from '@/components/tools/ComingSoonTool'

export default function ImageStudioPage() {
  return (
    <ComingSoonTool
      label="Image Studio"
      icon="✨"
      color="#d97706"
      desc="Remove backgrounds, upscale images 4x, retouch with AI inpainting, and generate bulk posters, professional visuals in seconds."
      tags={['DALL-E 3', '4x Upscale', 'BG Removal', 'Bulk Generate']}
    />
  )
}
