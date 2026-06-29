import ServicePageSplitStory from '@/components/pages/ServicePageSplitStory'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Consulting and Growth Advisory India | ThinkSuite',
  description: 'Strategic business consulting for Indian companies. Growth advisory, digital transformation strategy, operational consulting, and leadership advisory for SMEs and scaling businesses.',
  keywords: ['business consulting India', 'growth advisory India', 'management consulting India', 'SME consulting India', 'digital transformation India', 'operational consulting Gurgaon', 'business growth consultant India', 'strategy consulting India'],
}

export default function ConsultingGrowthPage() {
  return (
    <ServicePageSplitStory
      breadcrumb="Services"
      breadcrumbHref="/#services"
      label="Business Consulting"
      title="Consulting"
      titleHighlight="and Growth"
      tagline="Running a business is hard. Running one without a sounding board and a strategic framework is harder. We serve as your strategic growth partner so decisions get made on data, not guesswork."
      stats={[
        { number: '45+', label: 'Companies Advised' },
        { number: '3.2x', label: 'Avg. Revenue Impact' },
        { number: '8yr+', label: 'Industry Experience' },
        { number: '100%', label: 'Founder-Focused' },
      ]}
      whyUs={[
        {
          icon: 'fa-compass',
          title: 'Strategy Meets Execution',
          desc: 'Most consulting firms hand over a report and leave. We stay engaged through execution, helping you adapt the strategy as the business evolves and new information comes in.',
        },
        {
          icon: 'fa-indian-rupee-sign',
          title: 'Built for Indian Business Reality',
          desc: 'From GST and compliance to vendor negotiations and talent retention, our advice is grounded in how Indian markets actually work, not what an MBA textbook says.',
        },
        {
          icon: 'fa-people-group',
          title: 'Cross-Functional Expertise',
          desc: 'Our team brings experience across product, marketing, finance, and technology. You get integrated advice rather than siloed expertise from consultants who have only ever worked in one function.',
        },
      ]}
      capabilities={[
        {
          icon: 'fa-chess',
          title: 'Business Strategy and Positioning',
          desc: 'Define what you stand for, who you serve best, and how you win against competition. Strategy work that results in clear choices, not just a vision statement.',
          tags: ['Positioning', 'Competitive Strategy', 'Business Model'],
        },
        {
          icon: 'fa-microchip',
          title: 'Digital Transformation Advisory',
          desc: 'Move from spreadsheets and WhatsApp groups to integrated digital operations. Technology selection, process redesign, and change management for teams of any size.',
          tags: ['Tech Selection', 'Process Design', 'Change Management'],
        },
        {
          icon: 'fa-gears',
          title: 'Operational Efficiency Consulting',
          desc: 'Identify waste in your operations, redesign workflows, and build SOPs that allow the business to grow without everything depending on the founder.',
          tags: ['Workflow Design', 'SOP Creation', 'Cost Reduction'],
        },
        {
          icon: 'fa-users-gear',
          title: 'Leadership and Team Advisory',
          desc: 'Organization design, hiring strategy, performance management systems, and founder coaching for businesses navigating the transition from startup to scale-up.',
          tags: ['Org Design', 'Hiring Strategy', 'Founder Coaching'],
        },
        {
          icon: 'fa-file-invoice-dollar',
          title: 'Financial and Fundraising Advisory',
          desc: 'Financial model review, investor readiness assessments, due diligence preparation, and deal structuring advice for debt or equity raises.',
          tags: ['Investor Readiness', 'Financial Models', 'Due Diligence'],
        },
        {
          icon: 'fa-handshake-angle',
          title: 'M and A and Partnership Advisory',
          desc: 'Target identification for acquisitions, strategic partnership structuring, joint venture design, and integration planning for inorganic growth.',
          tags: ['M&A', 'Partnerships', 'Integration Planning'],
        },
      ]}
      testimonial={{
        quote: 'ThinkSuite helped us rethink our entire business model. Within 8 months we had better margins, a clearer market position, and a team that actually knew what to focus on.',
        name: 'Vikram Nair',
        role: 'Managing Director',
        company: 'Nair Logistics Group',
      }}
      industries={[
        {
          icon: 'fa-industry',
          name: 'Manufacturing and Export',
          useCase: 'Operational efficiency, export market strategy, compliance and certification advisory, and digital transformation from factory floor to finance.',
          tags: ['Operations', 'Export Strategy', 'Compliance'],
        },
        {
          icon: 'fa-shop',
          name: 'Retail and Distribution',
          useCase: 'Channel strategy, distributor management, private label development, and the shift from purely offline to omnichannel operations.',
          tags: ['Channel Strategy', 'Omnichannel', 'Private Label'],
        },
        {
          icon: 'fa-hospital',
          name: 'Healthcare and Diagnostics',
          useCase: 'Clinic and hospital chain expansion, NABH accreditation advisory, technology adoption, and patient experience transformation.',
          tags: ['Expansion', 'Accreditation', 'Patient Experience'],
        },
        {
          icon: 'fa-building-columns',
          name: 'Finance and NBFCs',
          useCase: 'Product strategy for new loan segments, digital lending transformation, collection efficiency, and regulatory strategy.',
          tags: ['Product Strategy', 'Digital Lending', 'Compliance'],
        },
        {
          icon: 'fa-laptop',
          name: 'Tech Startups and SaaS',
          useCase: 'Fundraising strategy, go-to-market for new markets, building the first leadership team, and pivoting a product when early assumptions need revision.',
          tags: ['Fundraising', 'GTM Strategy', 'Leadership Hiring'],
        },
        {
          icon: 'fa-graduation-cap',
          name: 'Education and EdTech',
          useCase: 'School and coaching chain expansion, curriculum and product differentiation, B2B vs B2C channel strategy, and franchise model design.',
          tags: ['Chain Expansion', 'Franchise Model', 'Product Differentiation'],
        },
      ]}
      process={[
        {
          title: 'Diagnostic',
          desc: 'Deep-dive assessment of the business covering financials, operations, market position, team, and technology.',
        },
        {
          title: 'Strategy Session',
          desc: 'A structured workshop with leadership to agree on priorities, goals, and the strategic choices that will define the next phase.',
        },
        {
          title: 'Roadmap and Implementation',
          desc: 'A 90-day execution plan with clear owners, milestones, and the metrics that will tell you whether you are moving in the right direction.',
        },
        {
          title: 'Ongoing Advisory',
          desc: 'Monthly strategy reviews, ad-hoc decision support, and course corrections as the business learns and adapts.',
        },
      ]}
      faqs={[
        {
          q: 'How is ThinkSuite different from a traditional management consultancy?',
          a: 'Traditional consultancies do the analysis and leave. We stay through execution, and because we are also a digital agency, we can implement the marketing, technology, and product components of your strategy ourselves. One team, end to end.',
        },
        {
          q: 'What kind of engagement model do you offer?',
          a: 'We work in two modes: a fixed-scope diagnostic and strategy project, or an ongoing monthly retainer where we serve as your strategic advisor and partner. We recommend starting with the diagnostic to understand your situation before committing to ongoing work.',
        },
        {
          q: 'Do you only work with startups?',
          a: 'No. About half our consulting clients are established businesses doing Rs 2Cr to Rs 50Cr in annual revenue that are trying to scale, modernize operations, or navigate a major transition like a leadership change or new market entry.',
        },
        {
          q: 'How do you handle confidentiality?',
          a: 'All engagement details, financial data, and strategic discussions are covered by our standard NDA. We do not share client information with any third party and maintain strict information barriers between clients in similar industries.',
        },
        {
          q: 'Can you help with fundraising?',
          a: 'Yes, though we are strategic advisors rather than investment bankers. We help with investor positioning, financial model preparation, pitch narrative, and due diligence readiness. We are well-networked with angel networks and early-stage VCs in India.',
        },
      ]}
      sidebarLinks={[
        { label: 'Growth Planning', href: '/growth-planning' },
        { label: 'Startup Consulting', href: '/startup-consulting' },
        { label: 'Market Research', href: '/market-research' },
        { label: 'AI Tools Development', href: '/ai-tools-development' },
      ]}
      ctaTitle="Get Your Strategic"
      ctaTitleHighlight="Growth Partner"
      ctaDesc="Stop making big decisions alone. Whether you need a one-time strategy session or an ongoing thought partner, we are here to help you think clearly and move fast."
    />
  )
}
