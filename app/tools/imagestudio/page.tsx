import type { Metadata } from 'next'
import ComingSoonTool from '@/components/tools/ComingSoonTool'

export const metadata: Metadata = {
  title: 'AI Image Generator & Poster Maker | ThinkSuite Image Studio',
  description: 'Generate professional marketing images, ad creatives, and posters with AI, background removal, 4x upscaling, and bulk generation, powered by DALL-E 3.',
  keywords: [
    'AI image generator', 'AI poster maker', 'AI image generation tool for business',
    'DALL-E image generator tool', 'AI product photo generator', 'AI ad creative generator',
    'can AI generate professional marketing images', 'AI image generator vs hiring a designer',
  ],
  alternates: { canonical: 'https://thinksuite.in/tools/imagestudio' },
}

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
