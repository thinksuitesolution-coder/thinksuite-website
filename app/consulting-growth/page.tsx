import ServicePageSplitStory from '@/components/pages/ServicePageSplitStory'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Consulting & Growth Advisory | ThinkSuite',
  description: 'Business consulting for companies worldwide who want a strategic partner, not just a report. Growth advisory, operations, and leadership guidance.',
  keywords: [
    'business consulting India',
    'growth advisory India',
    'management consulting Gurgaon',
    'SME consulting India',
    'digital transformation advisory India',
    'operational consulting Gurgaon',
    'business growth consultant India',
    'strategy consulting for scaling businesses',
    'founder advisory services India',
    'leadership consulting for startups',
    'fundraising advisory India',
    'business consultant for SMEs',
    'business consulting worldwide',
    'growth advisory agency',
    'business growth consultant',
    'growth consulting agency',
    'business growth consulting',
    'growth strategy consultants',
    'startup growth consulting',
    'growth consulting for SaaS',
    'revenue growth consulting agency',
  ],
}

const faqs = [
  {
    q: 'How is ThinkSuite different from a traditional management consultancy?',
    a: 'Traditional consultancies do the analysis and leave. We stay through execution, and because we are also a digital agency, we can implement the marketing, technology, and product pieces of your strategy ourselves. One team, start to finish, instead of handing you off to someone else.',
  },
  {
    q: 'What kind of engagement model do you offer?',
    a: 'We work in two modes: a fixed-scope diagnostic and strategy project, or an ongoing monthly retainer where we act as your strategic advisor and thinking partner. We usually recommend starting with the diagnostic so you understand your situation before committing to ongoing work.',
  },
  {
    q: 'Do you only work with startups?',
    a: 'No. A large share of our consulting clients are established businesses trying to scale, modernize their operations, or navigate a major transition like a leadership change or entry into a new market. Founders and legacy business owners face very different problems, and we adapt to both.',
  },
  {
    q: 'How do you handle confidentiality?',
    a: 'Every engagement, financial detail, and strategic discussion is covered under our standard NDA. We do not share client information with any third party, and we keep strict information barriers between clients operating in similar industries.',
  },
  {
    q: 'Can you help with fundraising?',
    a: 'Yes, though we work as strategic advisors rather than investment bankers. We help with investor positioning, financial model preparation, pitch narrative, and due diligence readiness, and we are well-connected with angel networks and early-stage investors across India and internationally.',
  },
  {
    q: 'What does a growth consultant actually do?',
    a: 'A growth consultant audits your current acquisition, retention, and revenue numbers, then builds a prioritized plan to move the metrics that matter most. At ThinkSuite that means we diagnose the bottleneck, whether it is positioning, funnel conversion, or operations, and then help you execute the fix instead of just naming it.',
  },
  {
    q: 'How much does growth consulting cost?',
    a: 'It depends on scope. A fixed diagnostic and strategy project is typically a one-time fee, while ongoing growth advisory runs as a monthly retainer. We scope pricing after understanding your stage and goals in an initial call rather than quoting a flat number upfront.',
  },
  {
    q: 'When should a startup hire a growth consultant?',
    a: 'The right time is usually once you have product-market fit signals and need to figure out which channels and levers to scale, not before you have any customer traction. Hiring too early, before there is real data to work with, tends to waste the engagement.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const serviceSchema = buildServiceSchema({
  name: 'Business Consulting and Growth Advisory',
  description: 'Strategic growth advisory for companies worldwide, covering business strategy, operations, digital transformation, and leadership guidance.',
  url: 'https://thinksuite.in/consulting-growth',
  serviceType: 'Growth Consulting',
  keywords: ['growth consulting agency', 'business growth consulting', 'growth strategy consultants'],
})

export default function ConsultingGrowthPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ServicePageSplitStory
        breadcrumb="Services"
        breadcrumbHref="/#services"
        label="Business Consulting"
        title="Consulting"
        titleHighlight="and Growth"
        tagline="Running a business is hard. Running one without a sounding board and a real strategic framework is harder, and lonelier. We work as your strategic growth partner, so the big decisions get made on data and honest conversation, not guesswork made at midnight."
        stats={[
          { number: 'Founder-Led', label: 'Advice Built Around How You Work' },
          { number: 'Cross-Functional', label: 'Product, Marketing, Finance, Tech' },
          { number: '2 Engagement Modes', label: 'Diagnostic Project or Ongoing Retainer' },
          { number: 'Market-Grounded', label: 'Advice Built for Real-World Business Reality' },
        ]}
        whyUs={[
          {
            icon: 'fa-compass',
            title: 'Strategy Meets Execution',
            desc: 'Most consulting firms hand over a report and leave. We stay engaged through execution, helping you adapt the plan as the business evolves and new information comes in, because no strategy survives contact with reality unchanged.',
          },
          {
            icon: 'fa-indian-rupee-sign',
            title: 'Built for Real Business Reality',
            desc: 'From compliance and regulatory nuance (including India\'s GST) to vendor negotiations and talent retention, our advice is grounded in how markets actually work, not what a textbook case study says should happen.',
          },
          {
            icon: 'fa-people-group',
            title: 'Cross-Functional Expertise',
            desc: 'Our team brings experience across product, marketing, finance, and technology. You get integrated advice instead of the siloed opinion of a consultant who has only ever worked in one function.',
          },
        ]}
        capabilities={[
          {
            icon: 'fa-chess',
            title: 'Business Strategy and Positioning',
            desc: 'Define what you stand for, who you serve best, and how you win against competition. Work that results in clear choices, not just a vision statement nobody can act on.',
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
            desc: 'Find the waste in your operations, redesign the workflows around it, and build SOPs that let the business grow without everything depending on the founder alone.',
            tags: ['Workflow Design', 'SOP Creation', 'Cost Reduction'],
          },
          {
            icon: 'fa-users-gear',
            title: 'Leadership and Team Advisory',
            desc: 'Organization design, hiring strategy, performance management systems, and founder coaching for businesses navigating the shift from startup to scale-up.',
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
            title: 'M&A and Partnership Advisory',
            desc: 'Target identification for acquisitions, strategic partnership structuring, joint venture design, and integration planning for inorganic growth.',
            tags: ['M&A', 'Partnerships', 'Integration Planning'],
          },
        ]}
        testimonial={{
          quote: 'ThinkSuite helped us rethink our entire business model. We came out of it with better margins, a clearer market position, and a team that finally knew what to focus on instead of everything at once.',
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
            desc: 'A deep-dive assessment of the business covering financials, operations, market position, team, and technology.',
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
        faqs={faqs}
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
    </>
  )
}
