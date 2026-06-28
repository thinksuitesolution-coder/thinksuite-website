import ServicePageDeviceShowcase from '@/components/pages/ServicePageDeviceShowcase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand Identity Design India | ThinkSuite',
  description: 'Professional brand identity design for Indian businesses. Logo design, color systems, typography, brand guidelines, and complete visual identity packages.',
}

export default function BrandIdentityPage() {
  return (
    <ServicePageDeviceShowcase
      breadcrumb="Branding and Design"
      breadcrumbHref="/branding-design"
      label="Brand Identity"
      title="Brand Identity"
      titleHighlight="Design"
      tagline="People decide whether to trust a business in seconds. A strong brand identity makes that first impression work for you. We build identities that are memorable, consistent, and built to last."
      designType="brand-identity"
      stats={[
        { number: '80+', label: 'Brands Created' },
        { number: '3wk', label: 'Avg. Delivery Time' },
        { number: '100%', label: 'IP Ownership Yours' },
        { number: 'All', label: 'File Formats Included' },
      ]}
      highlights={[
        {
          icon: 'fa-star',
          title: 'Logo Design',
          desc: 'Primary logo, secondary variations, and icon-only versions in all required formats. SVG, PNG, PDF, and EPS delivered in light and dark variants.',
        },
        {
          icon: 'fa-droplet',
          title: 'Color System',
          desc: 'Primary, secondary, and accent color palettes with exact HEX, RGB, CMYK, and Pantone codes for consistent use across digital and print.',
        },
        {
          icon: 'fa-font',
          title: 'Typography System',
          desc: 'Primary and secondary font selections with hierarchy rules, size scale, and pairing guidelines. Web fonts and print fonts covered.',
        },
        {
          icon: 'fa-book-open',
          title: 'Brand Guidelines',
          desc: 'A comprehensive brand book with logo usage rules, spacing guidelines, color applications, dos and donts, and visual examples.',
        },
        {
          icon: 'fa-id-card',
          title: 'Stationery and Templates',
          desc: 'Business cards, letterheads, email signatures, presentation templates, and social media profile templates. Everything your team needs from day one.',
        },
        {
          icon: 'fa-boxes-stacked',
          title: 'Brand Asset Library',
          desc: 'A complete, organized digital asset library with all brand elements named, categorized, and ready for your team to use immediately.',
        },
      ]}
      industries={[
        {
          icon: 'fa-rocket',
          name: 'Startups and New Ventures',
          useCase: 'First-time brand creation from scratch. A startup brand needs to look credible to investors, customers, and talent. We build it right from the start.',
          tags: ['First Brand', 'Investor Ready', 'Credibility'],
        },
        {
          icon: 'fa-building',
          name: 'Real Estate Developers',
          useCase: 'Premium identity for residential and commercial projects. Site hoardings, brochures, and digital presence need a consistent, trust-building visual language.',
          tags: ['Project Identity', 'Premium Feel', 'Hoardings'],
        },
        {
          icon: 'fa-hospital',
          name: 'Healthcare and Clinics',
          useCase: 'Clean, professional identity that communicates trust and care. Used across clinic signage, prescription pads, patient communication, and digital channels.',
          tags: ['Professional', 'Trust-Building', 'Signage'],
        },
        {
          icon: 'fa-utensils',
          name: 'Food and Beverage',
          useCase: 'Brand identity that extends to packaging, menu design, and restaurant interiors. Every customer touchpoint tells the same visual story.',
          tags: ['Packaging', 'Menu Design', 'Interior Branding'],
        },
        {
          icon: 'fa-shirt',
          name: 'Fashion and Lifestyle',
          useCase: 'Editorial identity that reflects your fashion aesthetic. Logo, tags, packaging, and lookbook design built around a consistent visual world.',
          tags: ['Editorial Identity', 'Tags', 'Lookbook Design'],
        },
        {
          icon: 'fa-graduation-cap',
          name: 'Education Institutes',
          useCase: 'Institutional identity for schools, colleges, and training centers. Crests, communication templates, and a visual system that works across years.',
          tags: ['Institutional', 'Crests', 'Communication'],
        },
      ]}
      process={[
        {
          title: 'Discovery',
          desc: 'Brand questionnaire, competitor audit, audience definition, and positioning workshop to understand what the brand needs to communicate.',
        },
        {
          title: 'Concepts',
          desc: 'Three distinct logo directions presented with rationale. Each rooted in your brand strategy, not just aesthetics.',
        },
        {
          title: 'Develop',
          desc: 'Refine the chosen direction, build the full color system and typography, and extend to brand elements.',
        },
        {
          title: 'Deliver',
          desc: 'Final brand guidelines document, complete asset library, and all file formats handed over with a brand walkthrough session.',
        },
      ]}
      faqs={[
        {
          q: 'How long does brand identity design take?',
          a: 'A standard brand identity package takes 2 to 4 weeks from discovery to final delivery. More complex projects with packaging and environmental branding take 5 to 8 weeks.',
        },
        {
          q: 'Do I own the final logo and all brand files?',
          a: 'Yes. You own 100% of the IP. All source files including AI, EPS, SVG, and PSD are handed over on final payment.',
        },
        {
          q: 'What if I already have a logo but want to refresh the brand?',
          a: 'We handle brand refreshes and complete rebrands. We can modernize an existing identity while preserving equity or build fresh from scratch. We discuss the right approach in discovery.',
        },
        {
          q: 'Do you design the website as well?',
          a: 'Yes. Many clients combine brand identity with website design and development. We can handle both so the digital presence perfectly matches the brand we create.',
        },
        {
          q: 'What formats do you deliver the final logo in?',
          a: 'We deliver in SVG, EPS, AI, PDF, PNG (transparent background), and JPEG. Both light and dark versions, color and black-and-white. Everything your printer, web developer, and social media needs.',
        },
      ]}
      sidebarLinks={[
        { label: 'Graphic Design', href: '/graphic-design' },
        { label: 'UI/UX Design', href: '/ui-ux-design' },
        { label: 'Product Design', href: '/product-design' },
        { label: 'Web Development', href: '/web-development' },
      ]}
      ctaTitle="Build a Brand"
      ctaTitleHighlight="Worth Remembering"
      ctaDesc="Your brand is the first thing people judge you by. Make sure it says exactly what you need it to say. Let us build an identity that grows with your business."
    />
  )
}
