import ServicePageDeviceShowcase from '@/components/pages/ServicePageDeviceShowcase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Graphic Design Services India | ThinkSuite',
  description: 'Professional graphic design for Indian businesses. Social media graphics, brochures, presentations, packaging, banners, and infographics designed for impact.',
  keywords: ['graphic design India', 'social media design India', 'brochure design India', 'presentation design', 'infographic design India', 'packaging design India', 'banner design India', 'graphic designer Gurgaon'],
}

export default function GraphicDesignPage() {
  return (
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
      faqs={[
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
      ]}
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
  )
}
