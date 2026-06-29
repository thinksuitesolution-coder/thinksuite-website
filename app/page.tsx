import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// Above-fold: load immediately
import HeroSection from '@/components/sections/HeroSection'
import ServiceOrbitSection from '@/components/sections/ServiceOrbitSection'
import StickyStackingSection from '@/components/sections/StickyStackingSection'

// Below-fold: code-split into separate chunks, load on demand
const SixGrowthEnginesSection    = dynamic(() => import('@/components/sections/SixGrowthEnginesSection'))
const IntelligenceTeaserSection  = dynamic(() => import('@/components/sections/IntelligenceTeaserSection'))
const EcosystemSection           = dynamic(() => import('@/components/sections/EcosystemSection'))
const BlurCarouselSection        = dynamic(() => import('@/components/sections/BlurCarouselSection'))
const WhyChooseUsSection         = dynamic(() => import('@/components/sections/WhyChooseUsSection'))
const IndustriesSection          = dynamic(() => import('@/components/sections/IndustriesSection'))
const AboutSection               = dynamic(() => import('@/components/sections/AboutSection'))
const ProcessFlowSection         = dynamic(() => import('@/components/sections/ProcessFlowSection'))
const ResultsSection             = dynamic(() => import('@/components/sections/ResultsSection'))
const TechStackSection           = dynamic(() => import('@/components/sections/TechStackSection'))
const TestimonialsSection        = dynamic(() => import('@/components/sections/TestimonialsSection'))

export const metadata: Metadata = {
  title: 'Web Development, Marketing and Design Agency India | ThinkSuite',
  description: 'ThinkSuite is a full-stack digital agency in India offering web development, digital marketing, AI automation, branding and design, and business consulting.',
  alternates: { canonical: 'https://thinksuite.in' },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceOrbitSection />
      <StickyStackingSection />
      <SixGrowthEnginesSection />
      <IntelligenceTeaserSection />
      <EcosystemSection />
      <ProcessFlowSection />
      <ResultsSection />
      <BlurCarouselSection />
      <WhyChooseUsSection />
      <IndustriesSection />
      <AboutSection />
      <TechStackSection />
      <TestimonialsSection />
    </>
  )
}
