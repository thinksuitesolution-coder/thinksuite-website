import ServicePageDeviceShowcase from '@/components/pages/ServicePageDeviceShowcase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Branding and Design Agency in Gurgaon, India | ThinkSuite',
  description: 'Professional branding and design services in India: brand identity design, UI/UX design, graphic design, and product design for startups and growing businesses.',
  keywords: ['branding and design agency Gurgaon', 'brand identity design India', 'logo design company India', 'UI UX design agency India', 'graphic design agency Gurgaon', 'product design company India', 'brand design agency Gurgaon', 'visual identity design India', 'creative agency for startups India'],
}

const FAQS = [
  {
    q: 'What is included in a brand identity package?',
    a: 'A full brand identity package includes logo design (primary and variants), color system, typography selection, icon style, brand voice guidelines, and a comprehensive brand guidelines document. We also provide all source files in AI, SVG, PNG, and PDF formats.',
  },
  {
    q: 'How long does a branding project take?',
    a: 'A focused brand identity project typically takes 2 to 4 weeks from discovery to final delivery. Comprehensive brand systems including UI design language, marketing collateral templates, and motion guidelines take 5 to 8 weeks.',
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
]

export default function BrandingDesignPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />
    <ServicePageDeviceShowcase
      breadcrumb="Services"
      breadcrumbHref="/services"
      label="Branding & Design"
      title="Design That Builds"
      titleHighlight="Brand Authority"
      tagline="Before a potential client reads a single word of your pitch, they have already judged your business by how it looks. We build the visual identity, logo, UI, and design system that makes that first impression count."
      designType="brand-identity"
      stats={[
        { number: '5+', label: 'Years of Experience' },
        { number: '80+', label: 'Brands Built' },
        { number: '0', label: 'Templates Used' },
        { number: '100%', label: 'Brand Guidelines Included' },
      ]}
      highlights={[
        { icon: 'fa-palette', title: 'Brand Identity Design', desc: 'Logo, color palette, typography, and brand system designed to make people recognize and trust your business at first glance.' },
        { icon: 'fa-desktop', title: 'UI/UX Design', desc: 'Interface design for web and mobile that makes it simple and enjoyable for visitors to take the next step and become paying customers.' },
        { icon: 'fa-pen-ruler', title: 'Graphic Design', desc: 'Print and digital graphics, marketing materials, presentations, and social content designed to look professional and work hard for your brand.' },
        { icon: 'fa-layer-group', title: 'Product Design', desc: 'Full product design from early wireframes to polished, interactive prototypes, tested with real users before a single line of code is written.' },
        { icon: 'fa-wand-magic-sparkles', title: 'Motion and Animation', desc: 'Micro-animations, explainer videos, and motion graphics that grab attention and make your brand more memorable across any platform.' },
        { icon: 'fa-book-open', title: 'Brand Guidelines', desc: 'A clear brand book and style guide so your visual identity stays consistent whether it appears on a business card, a website, or a billboard.' },
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
      faqs={FAQS}
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
    </>
  )
}
