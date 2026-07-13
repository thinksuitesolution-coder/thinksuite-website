import ServicePageDeviceShowcase from '@/components/pages/ServicePageDeviceShowcase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UI/UX Design Services in Gurgaon, India | ThinkSuite',
  description: 'Professional UI/UX design in India: user research, wireframing, Figma prototyping, and conversion-focused interface design for web and mobile products.',
  keywords: ['UI UX design company Gurgaon', 'user experience design India', 'Figma design agency India', 'product design agency Gurgaon', 'app UX design India', 'interface design India', 'UX research and testing India', 'mobile app UX design', 'website UX audit services'],
}

const FAQS = [
  {
    q: 'What is the difference between UI and UX design?',
    a: 'UX (User Experience) covers the overall feel, user flows, and how easy something is to use. UI (User Interface) is the visual design, colors, typography, components, and polish. We do both as an integrated process.',
  },
  {
    q: 'Do you design in Figma?',
    a: 'Yes, Figma is our primary design tool. You get full access to the design files, component library, and prototype links throughout the project.',
  },
  {
    q: 'How long does a UI/UX project take?',
    a: 'A typical web product design takes 4 to 8 weeks. This covers research, wireframes, high-fidelity designs, and the design system. Timeline varies based on the number of screens and complexity.',
  },
  {
    q: 'Can you redesign an existing product?',
    a: 'Yes, we do full UX audits and redesigns. We start by identifying pain points in your current design and prioritize improvements based on business impact.',
  },
  {
    q: 'Do you work with our development team?',
    a: 'Absolutely. We provide detailed handoff documentation, respond to developer questions throughout implementation, and review the live build to ensure design fidelity.',
  },
]

export default function UiUxPage() {
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
      breadcrumb="Branding & Design"
      breadcrumbHref="/branding-design"
      label="UI/UX Design"
      title="UI/UX Design"
      titleHighlight="That Converts"
      tagline="Great design is invisible, users just know it works. We create intuitive, research-driven digital experiences that guide users effortlessly toward your desired outcomes."
      designType="ui-ux"
      stats={[
        { number: '50+', label: 'Projects Designed' },
        { number: 'Figma', label: 'Design Tool' },
        { number: '4.9/5', label: 'Client Rating' },
        { number: '100%', label: 'Research-Driven' },
      ]}
      highlights={[
        {
          icon: 'fa-users',
          title: 'User Research & Personas',
          desc: 'In-depth interviews, surveys, and analytics analysis to deeply understand your users and their goals.',
        },
        {
          icon: 'fa-sitemap',
          title: 'Information Architecture',
          desc: 'Logical site maps, user flows, and navigation structures that eliminate friction and reduce cognitive load.',
        },
        {
          icon: 'fa-pencil',
          title: 'Wireframing',
          desc: 'Low-fidelity wireframes that map out all functionality and user journeys before visual design begins.',
        },
        {
          icon: 'fa-object-group',
          title: 'High-Fidelity Prototypes',
          desc: 'Interactive Figma prototypes that feel like the real product, ready for stakeholder review and user testing.',
        },
        {
          icon: 'fa-swatchbook',
          title: 'Design Systems',
          desc: 'Scalable component libraries and style guides that keep design consistent across your entire product.',
        },
        {
          icon: 'fa-flask',
          title: 'Usability Testing',
          desc: 'Structured testing sessions that validate design decisions and surface improvement opportunities before launch.',
        },
      ]}
      process={[
        {
          title: 'Research',
          desc: 'User interviews, competitor audits, and analytics review to define design opportunities.',
        },
        {
          title: 'Wireframe',
          desc: 'User flows and lo-fi wireframes that map out structure and key interaction patterns.',
        },
        {
          title: 'Design',
          desc: 'High-fidelity Figma screens, micro-interactions, and a complete design system.',
        },
        {
          title: 'Handoff',
          desc: 'Developer-ready specs, assets, and prototype links with full annotation.',
        },
      ]}
      faqs={FAQS}
      sidebarLinks={[
        { label: 'Product Design', href: '/product-design' },
        { label: 'Brand Identity', href: '/brand-identity' },
        { label: 'Web Development', href: '/web-development' },
        { label: 'Graphic Design', href: '/graphic-design' },
      ]}
      industries={[
        {
          icon: 'fa-cloud',
          name: 'SaaS & Tech Products',
          useCase: 'Dashboard design, onboarding flows, feature UI, and complex data visualization for software products with multiple user roles.',
          tags: ['Dashboard UI', 'Onboarding', 'Data Viz'],
        },
        {
          icon: 'fa-cart-shopping',
          name: 'E-commerce & Retail',
          useCase: 'Conversion-focused product pages, checkout flow optimization, mobile-first shopping experiences, and loyalty program UX.',
          tags: ['Checkout Flow', 'Mobile UX', 'Conversion CRO'],
        },
        {
          icon: 'fa-heart-pulse',
          name: 'Healthcare & MedTech',
          useCase: 'Patient portal design, appointment booking systems, EMR interfaces, and health app UX built for accessibility and trust.',
          tags: ['Patient Portals', 'Accessibility', 'Health Apps'],
        },
        {
          icon: 'fa-landmark',
          name: 'FinTech & Banking',
          useCase: 'Loan application flows, investment dashboards, KYC screens, and banking apps designed for clarity and regulatory compliance.',
          tags: ['KYC Flows', 'Investment UI', 'Compliance UX'],
        },
        {
          icon: 'fa-graduation-cap',
          name: 'EdTech & Learning Platforms',
          useCase: 'Course players, progress tracking dashboards, live class interfaces, and assessment UX that keeps learners engaged and progressing.',
          tags: ['Course Player', 'Progress Tracking', 'Engagement'],
        },
        {
          icon: 'fa-building',
          name: 'Real Estate & PropTech',
          useCase: 'Property listing UX, virtual tour interfaces, lead capture flows, and CRM dashboards for agents and developers.',
          tags: ['Listing UX', 'Virtual Tours', 'Lead Capture'],
        },
      ]}
      ctaTitle="Design Experiences"
      ctaTitleHighlight="Users Love"
      ctaDesc="Invest in UX that pays back. Great design reduces churn, increases conversions, and makes your product the one users recommend."
    />
    </>
  )
}
