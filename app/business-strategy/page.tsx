import ServicePageSplitStory from '@/components/pages/ServicePageSplitStory'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Strategy Consulting in Gurgaon | ThinkSuite',
  description: 'ThinkSuite helps Indian founders and enterprises build clear growth roadmaps, backed by competitive audits, revenue architecture, and in-house execution.',
  keywords: [
    'business strategy consulting India',
    'business strategy consultant Gurgaon',
    'growth consulting India',
    'startup strategy consulting India',
    'digital transformation consulting India',
    'business roadmap consulting',
    'revenue growth strategy consulting',
    'strategy agency Gurgaon',
    'competitive analysis consulting India',
    'go-to-market strategy for enterprises',
    'business consulting firm Gurgaon',
    'strategic planning for scaling companies',
  ],
}

const faqs = [
  {
    q: 'How do you measure the success of a consulting engagement?',
    a: 'We agree on revenue KPIs, operational efficiency targets, and milestone completion rates during the audit phase, before any work begins. Every engagement has quantifiable deliverables attached to it, not just an advisory deck that sits in a folder.',
  },
  {
    q: 'How long before we see measurable results?',
    a: 'Quick wins from operational fixes usually show up within the first 30 to 60 days. Structural revenue growth from a new strategy compounds over a longer horizon, often 6 to 18 months, depending on how complex your market and organization are.',
  },
  {
    q: 'What industries do you serve?',
    a: 'We work across SaaS, fintech, e-commerce, real estate, healthcare, retail, and professional services. Our consulting approach is industry-agnostic. We adapt the framework to your specific competitive environment rather than forcing a generic playbook onto your business.',
  },
  {
    q: "What makes ThinkSuite's consulting different from traditional strategy firms?",
    a: 'We combine strategic consulting with in-house engineering execution. When we spot a technology gap or an automation opportunity while building your roadmap, we can go build the actual solution, closing the gap that most advisory firms leave for you to figure out alone.',
  },
  {
    q: 'Do you work with early-stage startups or only established enterprises?',
    a: 'Both. We run dedicated tracks for early-stage founders who need a go-to-market blueprint and for established enterprises that need a transformation strategy. The depth and pace of the engagement is calibrated to whichever stage you are actually at.',
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

export default function BusinessStrategyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ServicePageSplitStory
        breadcrumb="Consulting and Growth"
        breadcrumbHref="/consulting-growth"
        label="Business Consulting"
        title="Strategic Roadmaps Built"
        titleHighlight="For Market Leadership."
        tagline="Growing a business without a clear plan is expensive, and most founders only realize how expensive after the money is already spent. Our consulting team takes a hard look at your operations, finds the gaps nobody's talking about, and builds a step-by-step roadmap with milestones so you always know exactly where you stand."
        stats={[
          { number: 'In-House', label: 'Strategy and Engineering, One Team' },
          { number: 'Audit-First', label: 'Every Roadmap Starts With Real Data' },
          { number: 'Milestone-Led', label: 'Execution Tied to KPIs, Not Opinions' },
          { number: 'Gurgaon HQ', label: 'Serving Founders and Enterprises Pan-India' },
        ]}
        whyUs={[
          {
            icon: 'fa-magnifying-glass-chart',
            title: 'We Look Before We Leap',
            desc: 'Every engagement starts with a full operational and technical audit. We identify growth blockers, untapped revenue levers, and infrastructure gaps before we ever recommend a single strategic move, so nothing is built on a guess.',
          },
          {
            icon: 'fa-gears',
            title: 'Strategy Meets Execution',
            desc: 'Unlike advisory firms that hand you a slide deck and disappear, we also build the technology your strategy needs. Custom software, AI tools, and automation, all from the same team that designed your roadmap in the first place.',
          },
          {
            icon: 'fa-chart-line',
            title: 'Milestones, Not Opinions',
            desc: 'Every deliverable ties back to a conversion milestone, a revenue KPI, or an OKR you helped define. That means you always know whether the strategy is working or needs adjusting, instead of waiting a year to find out.',
          },
        ]}
        capabilities={[
          {
            icon: 'fa-chess-king',
            title: 'Competitive Positioning',
            desc: 'A close look at your market and your closest competitors, so you know exactly where the gap to market leadership is and what it will take to close it.',
            tags: ['Ecosystem Audit', 'Differentiation', 'Market Gap Analysis'],
          },
          {
            icon: 'fa-map',
            title: 'Strategic Roadmapping',
            desc: 'Multi-year plans with real milestones, resource allocation, and scaling thresholds you can hold your team accountable to.',
            tags: ['Multi-Year Plan', 'Milestones', 'Resource Allocation'],
          },
          {
            icon: 'fa-coins',
            title: 'Revenue Architecture',
            desc: 'Revenue model review, pricing strategy work, and identifying new recurring revenue streams your business hasn\'t tapped yet.',
            tags: ['Revenue Model', 'Pricing Strategy', 'ARR Growth'],
          },
          {
            icon: 'fa-handshake',
            title: 'Partnerships and Alliances',
            desc: 'Finding and structuring the technology partnerships that get you into new markets faster than building alone ever could.',
            tags: ['Tech Partnerships', 'Market Access', 'Growth Alliances'],
          },
          {
            icon: 'fa-building',
            title: 'Digital Transformation',
            desc: 'An honest look at your legacy infrastructure and a practical plan for adopting the automation and AI tools that actually move the needle.',
            tags: ['Legacy Audit', 'AI Integration', 'Transformation'],
          },
          {
            icon: 'fa-chart-pie',
            title: 'Performance Management',
            desc: 'OKR frameworks and KPI dashboards that keep your scaling strategy honest and visible, not buried in a quarterly review deck.',
            tags: ['OKR Frameworks', 'KPI Dashboards', 'Performance Tracking'],
          },
        ]}
        testimonial={{
          quote: 'ThinkSuite audited our entire tech stack and built a roadmap that restructured how we sell. We finally had a plan the whole team could rally behind instead of everyone pulling in different directions.',
          name: 'Vikram Mehta',
          role: 'Founder and CEO',
          company: 'AxisCore Solutions',
        }}
        industries={[
          {
            icon: 'fa-laptop',
            name: 'SaaS and Technology',
            useCase: 'Go-to-market strategy redesign, enterprise sales motion setup, and pricing model work for teams moving upmarket from SMB to mid-market.',
            tags: ['Enterprise GTM', 'Sales Motion', 'Pricing Strategy'],
          },
          {
            icon: 'fa-building',
            name: 'Real Estate Developers',
            useCase: 'Project launch strategy, channel partner network structuring, digital lead generation architecture, and multi-city expansion roadmapping.',
            tags: ['Launch Strategy', 'Channel Network', 'City Expansion'],
          },
          {
            icon: 'fa-hospital',
            name: 'Healthcare Chains',
            useCase: 'Clinic expansion planning, patient acquisition and retention architecture, specialty addition strategy, and franchising model development.',
            tags: ['Expansion Planning', 'Patient Retention', 'Franchise Model'],
          },
          {
            icon: 'fa-store',
            name: 'Retail and QSR',
            useCase: 'Franchise rollout planning, store-level benchmarking, location selection frameworks, and omnichannel strategy bridging offline to online.',
            tags: ['Franchise Rollout', 'Location Strategy', 'Omnichannel'],
          },
          {
            icon: 'fa-bag-shopping',
            name: 'E-Commerce and D2C',
            useCase: 'Revenue scale strategy, channel diversification, unit economics work, and marketplace versus D2C split strategy for growing brands.',
            tags: ['Revenue Scale', 'Channel Mix', 'Unit Economics'],
          },
          {
            icon: 'fa-graduation-cap',
            name: 'Education and Coaching',
            useCase: 'Center expansion roadmap, online course revenue modeling, B2B institutional partnerships, and referral program design.',
            tags: ['Center Expansion', 'Online Revenue', 'B2B Partnerships'],
          },
        ]}
        process={[
          {
            title: 'Audit',
            desc: 'We conduct a full operational and competitive landscape analysis, mapping infrastructure gaps, growth blockers, and untapped revenue levers.',
          },
          {
            title: 'Architect',
            desc: 'A custom scaling roadmap and revenue architecture is built with phased milestones and resource allocation you can actually staff against.',
          },
          {
            title: 'Execute',
            desc: 'We support phased implementation with regular milestone reviews, cross-functional alignment sessions, and real-time strategy refinements.',
          },
          {
            title: 'Scale',
            desc: 'Continuous performance monitoring, market expansion planning, and quarterly strategy reviews keep your growth trajectory on track.',
          },
        ]}
        faqs={faqs}
        sidebarLinks={[
          { label: 'Consulting and Growth', href: '/consulting-growth' },
          { label: 'Startup Consulting', href: '/startup-consulting' },
          { label: 'Growth Planning', href: '/growth-planning' },
          { label: 'Market Research', href: '/market-research' },
          { label: 'Custom SaaS Products', href: '/saas-products' },
          { label: 'AI Automation', href: '/ai-automation' },
        ]}
        ctaTitle="Define Your"
        ctaTitleHighlight="Market Leadership Strategy"
        ctaDesc="Every business that scales does it with a clear plan. Let our team look at your operations and build a growth roadmap with milestones you can actually track and measure."
      />
    </>
  )
}
