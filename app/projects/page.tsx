import type { Metadata } from 'next'
import ProjectsContent from './ProjectsContent'

export const metadata: Metadata = {
  title: 'Projects | ThinkSuite — Real Work, Real Results',
  description: 'Explore real client projects by ThinkSuite — from e-commerce websites and brand identities to social media growth. Clients include Laghima Jewelry, AKLR Foundation, Bliss Foundation, VibéStyl, Shri Surbhi Kripa, A2Z Graphics, WavCart, and more.',
  keywords: [
    'ThinkSuite projects',
    'portfolio',
    'website design India',
    'social media management Gurgaon',
    'e-commerce website development',
    'brand identity design',
    'Laghima Jewelry website',
    'AKLR Foundation',
    'WavCart social media',
    'organic products website',
    'clothing store website',
    'printing design website',
  ],
}

export default function ProjectsPage() {
  return <ProjectsContent />
}
