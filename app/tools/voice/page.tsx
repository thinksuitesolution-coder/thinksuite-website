import type { Metadata } from 'next'
import ComingSoonTool from '@/components/tools/ComingSoonTool'

export const metadata: Metadata = {
  title: 'AI Voice Generator & Text-to-Speech | ThinkSuite Voice AI',
  description: 'Turn any text into natural, human-like speech with AI voice cloning and emotion control, 500+ voices across 30+ languages.',
  keywords: [
    'AI voice generator', 'text to speech AI tool', 'AI voice cloning tool',
    'AI voiceover generator for business', 'multilingual AI voice generator', 'AI voice generator for ads',
    'how accurate is AI voice cloning', 'best AI voice generator for marketing',
  ],
  alternates: { canonical: 'https://thinksuite.in/tools/voice' },
}

export default function VoicePage() {
  return (
    <ComingSoonTool
      label="Voice AI"
      icon="🎙️"
      color="#059669"
      desc="Turn any text into natural, human-like speech with voice cloning and emotion control, choose from 500+ voices across 30+ languages."
      tags={['500+ Voices', '30+ Languages', 'Voice Clone', 'ElevenLabs']}
    />
  )
}
