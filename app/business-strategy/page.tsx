import ServicePageSplitStory from '@/components/pages/ServicePageSplitStory'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Strategy Consulting India | ThinkSuite',
  description: 'Business strategy and growth consulting for Indian startups and enterprises. Competitive analysis, roadmapping, digital transformation, and revenue architecture.',
  keywords: ['business strategy consulting India', 'growth consulting India', 'startup strategy India', 'digital transformation consulting', 'business roadmap India', 'revenue growth consulting', 'strategy agency Gurgaon', 'competitive analysis India'],
}

export default function BusinessStrategyPage() {
  return (
    <ServicePageSplitStory
      breadcrumb="Consulting and Growth"
      breadcrumbHref="/consulting-growth"
      label="Business Consulting"
      title="Strategic Roadmaps Calculated"
      titleHighlight="For Market Leadership."
      tagline="Growing a business without a clear plan is expensive. Our consulting team takes a deep look at your operations, finds the gaps, and builds a step-by-step roadmap with measurable milestones so you always know where you are headed."
      stats={[
        { number: '3x', label: 'Average Revenue Growth' },
        { number: '40+', label: 'Enterprises Scaled' },
        { number: '18mo', label: 'Average Scaling Period' },
        { number: '98%', label: 'Strategy Execution Rate' },
      ]}
      whyUs={[
        {
          icon: 'fa-magnifying-glass-chart',
          title: 'Blueprint Before Action',
          desc: 'Every engagement starts with a full technical ecosystem audit. We identify growth blockers, untapped revenue levers, and infrastructure gaps before recommending a single strategic move.',
        },
        {
          icon: 'fa-gears',
          title: 'Strategy Meets Execution',
          desc: 'Unlike advisory firms that hand you a slide deck and disappear, we also build the technology your strategy needs. Custom software, AI tools, and automation, all from the same team that designed your roadmap.',
        },
        {
          icon: 'fa-chart-line',
          title: 'Measurable Milestones, Not Opinions',
          desc: 'Every deliverable is tied to verified conversion milestones, revenue KPIs, and OKR frameworks, so you always know exactly whether your strategy is on track or needs adjustment.',
        },
      ]}
      capabilities={[
        {
          icon: 'fa-chess-king',
          title: 'Competitive Positioning',
          desc: 'Deep technical ecosystem audits and differentiation roadmaps that identify and close the gap to market leadership.',
          tags: ['Ecosystem Audit', 'Differentiation', 'Market Gap Analysis'],
        },
        {
          icon: 'fa-map',
          title: 'Strategic Roadmapping',
          desc: 'Multi-year strategic plans with verified technical conversion milestones, resource allocation frameworks, and scaling thresholds.',
          tags: ['Multi-Year Plan', 'Milestones', 'Resource Allocation'],
        },
        {
          icon: 'fa-coins',
          title: 'Revenue Architecture',
          desc: 'Revenue model optimization, pricing strategy engineering, and new recurring revenue stream identification for enterprise accounts.',
          tags: ['Revenue Model', 'Pricing Strategy', 'ARR Growth'],
        },
        {
          icon: 'fa-handshake',
          title: 'Partnerships and Alliances',
          desc: 'Identifying and structuring strategic technology partnerships that accelerate market penetration and compound growth velocity.',
          tags: ['Tech Partnerships', 'Market Access', 'Growth Alliances'],
        },
        {
          icon: 'fa-building',
          title: 'Digital Transformation',
          desc: 'Legacy infrastructure gap analysis and transformation strategy for adopting high-velocity automation and AI tool ecosystems.',
          tags: ['Legacy Audit', 'AI Integration', 'Transformation'],
        },
        {
          icon: 'fa-chart-pie',
          title: 'Performance Management',
          desc: 'OKR frameworks, KPI dashboards, and B2B automation performance systems that keep scaling strategy on measurable track.',
          tags: ['OKR Frameworks', 'KPI Dashboards', 'Performance Tracking'],
        },
      ]}
      testimonial={{
        quote: 'ThinkSuite audited our entire tech stack and built a 12-month roadmap that restructured how we sell. Revenue doubled in 14 months following the blueprint they engineered.',
        name: 'Vikram Mehta',
        role: 'Founder and CEO',
        company: 'AxisCore Solutions',
      }}
      industries={[
        {
          icon: 'fa-laptop',
          name: 'SaaS and Technology',
          useCase: 'ARR growth architecture, go-to-market strategy redesign, enterprise sales motion setup, and pricing model optimization for moving upmarket from SMB to mid-market.',
          tags: ['ARR Strategy', 'Enterprise GTM', 'Pricing Optimization'],
        },
        {
          icon: 'fa-building',
          name: 'Real Estate Developers',
          useCase: 'Project launch strategy, channel partner network structuring, digital lead generation architecture, and multi-city expansion roadmapping with verified timelines.',
          tags: ['Launch Strategy', 'Channel Network', 'City Expansion'],
        },
        {
          icon: 'fa-hospital',
          name: 'Healthcare Chains',
          useCase: 'Clinic expansion planning, patient acquisition and retention architecture, specialty addition strategy, and franchising model development with financial modeling.',
          tags: ['Expansion Planning', 'Patient Retention', 'Franchise Model'],
        },
        {
          icon: 'fa-store',
          name: 'Retail and QSR',
          useCase: 'Franchise rollout planning, store P&L benchmarking, location selection frameworks, and omnichannel strategy bridging offline to online revenue.',
          tags: ['Franchise Rollout', 'Location Strategy', 'Omnichannel'],
        },
        {
          icon: 'fa-bag-shopping',
          name: 'E-Commerce and D2C',
          useCase: 'Revenue scale strategy from 10L to 1Cr monthly, channel diversification, unit economics optimization, and marketplace vs D2C split strategy.',
          tags: ['Revenue Scale', 'Channel Mix', 'Unit Economics'],
        },
        {
          icon: 'fa-graduation-cap',
          name: 'Education and Coaching',
          useCase: 'Center expansion roadmap, online course revenue modeling, B2B institutional partnerships, and referral program design with retention economics.',
          tags: ['Center Expansion', 'Online Revenue', 'B2B Partnerships'],
        },
      ]}
      process={[
        {
          title: 'Audit',
          desc: 'We conduct a full technical ecosystem and competitive landscape analysis, mapping infrastructure gaps, growth blockers, and untapped revenue levers.',
        },
        {
          title: 'Architect',
          desc: 'A custom scaling roadmap and revenue architecture is built with phased milestones, resource allocation frameworks, and verified technical conversion plans.',
        },
        {
          title: 'Execute',
          desc: 'We support phased implementation with regular milestone reviews, cross-functional alignment sessions, and real-time strategy refinements.',
        },
        {
          title: 'Scale',
          desc: 'Continuous performance monitoring, market expansion planning, and quarterly strategy reviews keep your growth trajectory on a verified upward curve.',
        },
      ]}
      faqs={[
        {
          q: 'How do you measure the success of a consulting engagement?',
          a: 'We define success through mutually agreed revenue KPIs, operational efficiency targets, and milestone completion rates set during the audit phase. Every engagement has quantifiable deliverables, not just advisory decks.',
        },
        {
          q: 'How long before we see measurable results?',
          a: 'Quick wins from operational improvements typically surface in the first 30,60 days. Structural revenue growth from new strategy implementation compounds over a 6,18 month horizon depending on market complexity.',
        },
        {
          q: 'What industries do you serve?',
          a: 'We work across SaaS, fintech, e-commerce, professional services, and manufacturing. Our consulting methodology is industry-agnostic, we adapt the framework to your specific competitive environment and technical stack.',
        },
        {
          q: "What makes ThinkSuite's consulting different from traditional firms?",
          a: 'We combine strategic consulting with in-house engineering execution. When we identify a technology gap or automation opportunity in your roadmap, we can build the solution directly, eliminating the implementation risk that traditional advisory firms leave behind.',
        },
        {
          q: 'Do you work with early-stage startups or only established enterprises?',
          a: 'Both. We have dedicated tracks for early-stage startups needing a go-to-market blueprint and for established enterprises requiring transformation strategy. Engagement scope and depth are calibrated to your stage.',
        },
      ]}
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
  )
}
