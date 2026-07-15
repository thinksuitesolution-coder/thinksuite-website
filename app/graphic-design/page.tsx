import ServicePageDeviceShowcase from '@/components/pages/ServicePageDeviceShowcase'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Graphic Design Services Agency | ThinkSuite',
  description: 'Professional graphic design for businesses worldwide. Social media graphics, brochures, presentations, packaging, banners, and infographics designed for impact.',
  keywords: ['graphic design agency Gurgaon', 'social media design India', 'brochure design services India', 'presentation design agency', 'infographic design India', 'packaging design India', 'banner and poster design India', 'graphic designer Gurgaon', 'graphic design agency', 'brochure design services worldwide', 'packaging design agency', 'graphic design services', 'graphic design company', 'graphic design agency for small business', 'social media graphic design service', 'print graphic design agency'],
}

const FAQS = [
  {
    q: 'How fast can you deliver graphic design work?',
    a: 'Standard turnaround is 24 to 48 hours for single designs. Complex projects like brochures or presentations take 3 to 5 business days. We offer rush delivery when needed.',
  },
  {
    q: 'Do you work with our existing brand guidelines?',
    a: 'Yes. If you have a brand guide, we follow it precisely. Colors, fonts, logo usage, and tone are all respected. If no guide exists, we infer the style from your existing materials.',
  },
  {
    q: 'What formats do you deliver final files in?',
    a: 'We deliver in any format you need: PDF, PNG, JPG, SVG, EPS, and editable source files (AI, PSD, or PPTX). Print files include crop marks, bleed, and color profiles.',
  },
  {
    q: 'Can we use your designs commercially and on all platforms?',
    a: 'Yes. All rights transfer to you on delivery. You can use the designs commercially on any platform, in any market, without restrictions.',
  },
  {
    q: 'Do you offer ongoing monthly design support?',
    a: 'Yes. Our design retainer packages give you a fixed number of design requests per month at a predictable monthly cost. Ideal for businesses with regular social media and marketing design needs.',
  },
  {
    q: 'How much does graphic design cost?',
    a: 'Single design pieces run on a 24 to 48 hour turnaround at a per-piece rate, while ongoing needs are better served by a monthly design retainer at a fixed cost for a set number of requests. Pricing depends on complexity, from a social post to a full packaging system with die-lines, so we quote after understanding what actually needs to be designed.',
  },
  {
    q: 'How do I hire a graphic designer for my business?',
    a: 'You can hire a freelancer, build an in-house team, or work with a graphic design agency like ours that gives you a full bench of skills (social, print, packaging, motion) without the overhead of separate hires. For most growing businesses, a retainer with an agency covers more ground at a lower total cost than one in-house designer.',
  },
  {
    q: 'In-house designer vs graphic design agency, which is better?',
    a: 'An in-house designer makes sense once your design volume is high and consistent enough to justify a full-time salary. Below that threshold, a graphic design agency gives access to a broader skill set at a fraction of the cost, with no hiring risk or single point of failure if someone leaves.',
  },
  {
    q: 'Do you work with small businesses, or only larger brands?',
    a: "Yes, we're a graphic design agency for small businesses as much as for larger brands. Our retainer packages give a small business a professional design output, social graphics, flyers, presentations, without needing to hire in-house, and scale up as the business grows.",
  },
  {
    q: 'Do you offer social media graphic design as an ongoing service, and do you handle print work too?',
    a: "Yes to both. As a social media graphic design service, we run monthly retainers covering feed posts, stories, and reel thumbnails on a fixed cadence. We're just as much a print graphic design agency for brochures, packaging, and event materials, so one team can cover a campaign end to end, online and off.",
  },
]

export default function GraphicDesignPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildServiceSchema({
              name: 'Graphic Design',
              description: 'Professional graphic design for businesses worldwide: social media graphics, brochures, presentations, packaging, banners, and infographics designed for impact.',
              url: 'https://thinksuite.in/graphic-design',
              serviceType: 'Graphic Design',
              keywords: ['graphic design agency', 'graphic design services', 'graphic design company'],
            })
          ),
        }}
      />
    <ServicePageDeviceShowcase
      breadcrumb="Branding and Design"
      breadcrumbHref="/branding-design"
      label="Visual Design"
      title="Graphic"
      titleHighlight="Design"
      tagline="Good graphic design does not just look nice. It communicates faster than words, guides people to action, and makes your brand look like it belongs in the category you are competing in."
      designType="graphic-design"
      stats={[
        { number: '500+', label: 'Design Pieces Delivered' },
        { number: '48hr', label: 'Avg. Turnaround' },
        { number: '100%', label: 'Client Satisfaction Rate' },
        { number: 'All', label: 'Formats Delivered' },
      ]}
      highlights={[
        {
          icon: 'fa-image',
          title: 'Social Media Graphics',
          desc: 'Feed posts, stories, carousel designs, and reel thumbnails. Consistent templates your team can update easily for ongoing use.',
        },
        {
          icon: 'fa-file-pdf',
          title: 'Brochure and Flyer Design',
          desc: 'Print-ready brochures, product flyers, and sales collateral designed for both digital sharing and physical printing.',
        },
        {
          icon: 'fa-display',
          title: 'Presentation Design',
          desc: 'Investor decks, sales presentations, and pitch decks that look polished and communicate clearly. PowerPoint and Google Slides.',
        },
        {
          icon: 'fa-box',
          title: 'Packaging Design',
          desc: 'Product packaging, labels, and box designs for retail and e-commerce. Print-ready with die-line specs and color profiles.',
        },
        {
          icon: 'fa-rectangle-wide',
          title: 'Banner and Poster Design',
          desc: 'Digital banners for Google Display, event posters, outdoor hoarding designs, and rollup banners. Every size and format.',
        },
        {
          icon: 'fa-chart-pie',
          title: 'Infographic Design',
          desc: 'Data visualizations, process diagrams, and explainer infographics that make complex information easy to understand at a glance.',
        },
      ]}
      industries={[
        {
          icon: 'fa-store',
          name: 'Retail and FMCG',
          useCase: 'Point-of-sale materials, shelf talkers, promotional banners, and seasonal campaign graphics. In-store and e-commerce visual assets designed for high impact.',
          tags: ['POS Materials', 'Promotional Banners', 'Packaging'],
        },
        {
          icon: 'fa-hospital',
          name: 'Healthcare',
          useCase: 'Patient information leaflets, health awareness posters, clinic signage, medical camp banners, and digital health communication graphics.',
          tags: ['Patient Info', 'Awareness Posters', 'Clinic Signage'],
        },
        {
          icon: 'fa-graduation-cap',
          name: 'Education',
          useCase: 'Course brochures, admission season materials, institutional presentations, digital ad creatives, and classroom visual aids.',
          tags: ['Course Brochures', 'Admission Materials', 'Presentations'],
        },
        {
          icon: 'fa-calendar-check',
          name: 'Events and Entertainment',
          useCase: 'Event posters, ticket designs, stage backdrops, social media event creatives, and post-event highlight graphics.',
          tags: ['Event Posters', 'Social Creatives', 'Backdrops'],
        },
        {
          icon: 'fa-building',
          name: 'Corporate and B2B',
          useCase: 'Annual reports, corporate presentations, proposal decks, employee communication graphics, and internal brand collateral.',
          tags: ['Annual Reports', 'Proposals', 'Corporate Decks'],
        },
        {
          icon: 'fa-hotel',
          name: 'Hospitality and F&B',
          useCase: 'Menu design, table cards, room service materials, hotel collateral, and digital assets for booking platform listings.',
          tags: ['Menu Design', 'Hotel Collateral', 'Table Cards'],
        },
      ]}
      process={[
        {
          title: 'Brief',
          desc: 'Understand the project goal, audience, key messages, dimensions, and any brand guidelines to follow.',
        },
        {
          title: 'Concept',
          desc: 'Present initial design concepts with rationale. Two concept directions for most projects.',
        },
        {
          title: 'Refine',
          desc: 'Two rounds of revisions to get every element exactly right. Feedback tracked and resolved clearly.',
        },
        {
          title: 'Deliver',
          desc: 'Final files in all required formats for web, print, and social. Print-ready files include bleed and color profiles.',
        },
      ]}
      faqs={FAQS}
      sidebarLinks={[
        { label: 'Brand Identity', href: '/brand-identity' },
        { label: 'UI/UX Design', href: '/ui-ux-design' },
        { label: 'Social Media Marketing', href: '/social-media-marketing' },
        { label: 'Content Marketing', href: '/content-marketing' },
      ]}
      ctaTitle="Design That"
      ctaTitleHighlight="Makes an Impression"
      ctaDesc="Generic design blends into the noise. Stand-out visuals get attention and build your brand every time someone sees them. Let us create yours."
    />
    </>
  )
}
