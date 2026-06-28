import ServicePageDeviceShowcase from '@/components/pages/ServicePageDeviceShowcase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Design Services India | ThinkSuite',
  description: 'End-to-end product design in India: discovery, wireframing, Figma prototyping, design systems, and developer handoff for web and mobile products.',
  keywords: ['product design India', 'UX product design', 'Figma prototyping India', 'design system India', 'SaaS product design', 'wireframing India', 'mobile product design', 'product designer Gurgaon'],
}

export default function ProductDesignPage() {
  return (
    <ServicePageDeviceShowcase
      breadcrumb="Branding & Design"
      breadcrumbHref="/branding-design"
      label="Product Design"
      title="Product"
      titleHighlight="Design"
      tagline="Great products are designed before they're built. We bridge the gap between business goals and user needs to create digital products people love to use, from zero to launch."
      designType="product-design"
      stats={[
        { number: '40+', label: 'Products Built' },
        { number: '0→1', label: 'Product Builds' },
        { number: '92%', label: 'User Retention' },
        { number: 'Figma', label: 'Dev Handoff' },
      ]}
      highlights={[
        {
          icon: 'fa-magnifying-glass',
          title: 'Product Discovery',
          desc: 'User research, competitive analysis, and problem framing to define exactly the right product to build.',
        },
        {
          icon: 'fa-diagram-project',
          title: 'User Journey Mapping',
          desc: 'End-to-end customer journey maps that surface friction points and reveal opportunities to delight users.',
        },
        {
          icon: 'fa-pen-ruler',
          title: 'Wireframes & Prototypes',
          desc: 'From rough sketches to interactive Figma prototypes validated with real users before a line of code is written.',
        },
        {
          icon: 'fa-swatchbook',
          title: 'Design Systems',
          desc: 'Scalable component libraries that keep every screen consistent and cut development time significantly.',
        },
        {
          icon: 'fa-code',
          title: 'Developer Handoff',
          desc: 'Precise specifications, exported assets, and annotated documentation for a smooth, fast implementation.',
        },
        {
          icon: 'fa-rotate',
          title: 'Iterative Design',
          desc: 'Continuous improvement cycles based on user feedback, heatmaps, and A/B test results post-launch.',
        },
      ]}
      process={[
        {
          title: 'Discover',
          desc: 'User research, stakeholder interviews, and market analysis to define the right problem to solve.',
        },
        {
          title: 'Define',
          desc: 'Personas, journey maps, and a prioritized feature roadmap aligned to business outcomes.',
        },
        {
          title: 'Design',
          desc: 'Wireframes, high-fidelity UI, and a complete design system, all tested with real users.',
        },
        {
          title: 'Deliver',
          desc: 'Developer handoff with full specs, assets, and ongoing design support through implementation.',
        },
      ]}
      faqs={[
        {
          q: 'What is the difference between Product Design and UI/UX Design?',
          a: 'UI/UX focuses on screens and interactions. Product Design is broader, it includes strategy, roadmap definition, business model alignment, and end-to-end ownership of the product experience from concept to launch.',
        },
        {
          q: 'Do you help with 0-to-1 product development?',
          a: 'Yes, this is our speciality. We work with founders and teams to go from an idea to a validated, investor-ready prototype or MVP. We cover discovery, design, and design-to-dev handoff.',
        },
        {
          q: 'How long does a product design engagement take?',
          a: 'Discovery and definition typically takes 2,3 weeks. Full design (wireframes + high-fidelity + design system) takes 6,12 weeks depending on scope and number of user roles.',
        },
        {
          q: 'What deliverables do we get?',
          a: 'You receive Figma files (editable), a component library, interactive prototypes, user flow diagrams, and a handoff package with all specs and assets ready for developers.',
        },
        {
          q: 'Can you work alongside our in-house team?',
          a: 'Absolutely. We embed as design partners, collaborating in your Figma workspace, attending sprints, and syncing with your product managers and engineers throughout the engagement.',
        },
      ]}
      sidebarLinks={[
        { label: 'UI/UX Design', href: '/ui-ux-design' },
        { label: 'Brand Identity', href: '/brand-identity' },
        { label: 'Web Development', href: '/web-development' },
        { label: 'Graphic Design', href: '/graphic-design' },
      ]}
      industries={[
        {
          icon: 'fa-rocket',
          name: 'SaaS & Software Startups',
          useCase: 'Zero-to-one product design for SaaS founders: discovery, MVP scoping, design system creation, and investor-ready prototypes.',
          tags: ['MVP Design', '0→1 Builds', 'Investor Decks'],
        },
        {
          icon: 'fa-bag-shopping',
          name: 'E-commerce & D2C Brands',
          useCase: 'Custom storefront design, product configurators, subscription flows, and post-purchase experience design for direct-to-consumer brands.',
          tags: ['Storefront Design', 'Subscriptions', 'Post-Purchase UX'],
        },
        {
          icon: 'fa-stethoscope',
          name: 'Healthcare & MedTech',
          useCase: 'Clinical workflow tools, patient-facing apps, telehealth platforms, and diagnostic interfaces designed for speed and zero errors.',
          tags: ['Clinical Tools', 'Telehealth', 'Diagnostics'],
        },
        {
          icon: 'fa-coins',
          name: 'FinTech & BFSI',
          useCase: 'Wealth management platforms, insurance products, lending apps, and compliance-safe financial product design.',
          tags: ['Wealth Management', 'Insurance UX', 'Lending Apps'],
        },
        {
          icon: 'fa-chalkboard-user',
          name: 'EdTech & Learning',
          useCase: 'Learning management systems, cohort-based platforms, live teaching tools, and skill assessment products.',
          tags: ['LMS', 'Cohort Platforms', 'Assessment Tools'],
        },
        {
          icon: 'fa-briefcase',
          name: 'Enterprise & B2B Tools',
          useCase: 'Internal tools, ops dashboards, multi-tenant SaaS platforms, and enterprise software redesigns that improve team productivity.',
          tags: ['Internal Tools', 'Multi-Tenant SaaS', 'Ops Dashboards'],
        },
      ]}
      ctaTitle="Design Products"
      ctaTitleHighlight="People Love"
      ctaDesc="From MVP to enterprise product, our design team creates products that users adopt, recommend, and keep coming back to."
    />
  )
}
