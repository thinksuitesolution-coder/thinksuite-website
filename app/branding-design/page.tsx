import ServicePageDeviceShowcase from '@/components/pages/ServicePageDeviceShowcase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Branding and Design Services India | ThinkSuite',
  description: 'Professional branding and design services in India: brand identity design, UI/UX design, graphic design, and product design for startups and growing businesses.',
}

export default function BrandingDesignPage() {
  return (
    <ServicePageDeviceShowcase
      breadcrumb="Services"
      breadcrumbHref="/services"
      label="Branding & Design"
      title="Design That Builds"
      titleHighlight="Brand Authority"
      tagline="Before a prospect reads your pitch, they have already judged your business by how it looks. We build visual systems, logo, identity, UI, graphics, that make that first impression earn your trust."
      designType="brand-identity"
      stats={[
        { number: '5+', label: 'Years of Experience' },
        { number: '80+', label: 'Brands Built' },
        { number: '0', label: 'Templates Used' },
        { number: '100%', label: 'Brand Guidelines Included' },
      ]}
      highlights={[
        { icon: 'fa-palette', title: 'Brand Identity Design', desc: 'Visual identity systems engineered to command market recognition and communicate enterprise authority at first contact.' },
        { icon: 'fa-desktop', title: 'UI/UX Design', desc: 'Conversion-optimized interface design for web and mobile platforms that transforms visitor behavior into measurable revenue outcomes.' },
        { icon: 'fa-pen-ruler', title: 'Graphic Design', desc: 'Strategic print and digital graphics, marketing collateral, presentations, and precision social assets that perform.' },
        { icon: 'fa-layer-group', title: 'Product Design', desc: 'End-to-end product design from rapid wireframes to high-fidelity prototypes validated against real user acquisition data.' },
        { icon: 'fa-wand-magic-sparkles', title: 'Motion and Animation', desc: 'Micro-animations, explainer videos, and motion graphics that accelerate attention capture and brand recall velocity.' },
        { icon: 'fa-book-open', title: 'Brand Guidelines', desc: 'Comprehensive brand books and enterprise style guides ensuring conversion-consistent visual execution across all market touchpoints.' },
      ]}
      process={[
        {
          title: 'Discovery',
          desc: 'Brand audit, competitive landscape analysis, and audience profiling to establish the creative direction and market positioning before any design begins.',
        },
        {
          title: 'Concept',
          desc: 'Initial creative concepts are developed across logo, color, typography, and layout, presented with strategic rationale for each creative decision.',
        },
        {
          title: 'Refine',
          desc: 'Collaborative iteration through structured feedback rounds, each revision cycle sharpens the brand system until it performs exactly as intended.',
        },
        {
          title: 'Deliver',
          desc: 'Full asset delivery in all required formats, plus a comprehensive brand guidelines document ensuring consistent execution across every touchpoint.',
        },
      ]}
      faqs={[
        {
          q: 'What is included in a brand identity package?',
          a: 'A full brand identity package includes logo design (primary and variants), color system, typography selection, icon style, brand voice guidelines, and a comprehensive brand guidelines document. We also provide all source files in AI, SVG, PNG, and PDF formats.',
        },
        {
          q: 'How long does a branding project take?',
          a: 'A focused brand identity project typically takes 2,4 weeks from discovery to final delivery. Comprehensive brand systems including UI design language, marketing collateral templates, and motion guidelines take 5,8 weeks.',
        },
        {
          q: 'Will we own the final brand assets?',
          a: 'Yes, 100%. All final brand assets, source files, and design rights transfer to you upon project completion. There are no licensing restrictions or ongoing usage fees.',
        },
        {
          q: 'Can you redesign or evolve an existing brand?',
          a: 'Absolutely. Brand evolution is one of our most common engagements, modernizing legacy visual systems while preserving existing brand equity. We audit current brand assets and audience perception before recommending the right level of change.',
        },
        {
          q: 'Do you create assets for both digital and print use?',
          a: 'Yes. Every brand system we develop is print-ready (CMYK, bleed-safe) and digital-optimized (web-resolution, dark/light variants, accessibility-compliant contrast ratios). One brand, every medium.',
        },
      ]}
      sidebarLinks={[
        { label: 'UI/UX Design', href: '/ui-ux-design' },
        { label: 'Brand Identity', href: '/brand-identity' },
        { label: 'Graphic Design', href: '/graphic-design' },
        { label: 'Product Design', href: '/product-design' },
        { label: 'Web Development', href: '/web-development' },
        { label: 'Digital Marketing', href: '/digital-marketing' },
      ]}
      ctaTitle="Build a Brand That"
      ctaTitleHighlight="Gets Remembered"
      ctaDesc="Strong design is a business asset. Let our creative team build a visual identity that earns trust, drives recognition, and scales with your growth."
    />
  )
}
