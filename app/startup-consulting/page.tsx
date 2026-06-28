import ServicePageSplitStory from '@/components/pages/ServicePageSplitStory'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Startup Consulting India | ThinkSuite',
  description: 'Expert startup consulting for Indian founders. Business model validation, go-to-market strategy, pitch deck creation, fundraising support, and MVP planning.',
}

export default function StartupConsultingPage() {
  return (
    <ServicePageSplitStory
      breadcrumb="Consulting and Growth"
      breadcrumbHref="/consulting-growth"
      label="Startup Strategy"
      title="Startup"
      titleHighlight="Consulting"
      tagline="Most startups fail not because the idea was bad but because of avoidable mistakes in execution. We work with founders to validate faster, build smarter, and avoid the traps that sink most early-stage companies."
      stats={[
        { number: '40+', label: 'Startups Advised' },
        { number: '3x', label: 'Faster to First Revenue' },
        { number: '8yr', label: 'Startup Ecosystem Experience' },
        { number: '15+', label: 'Sectors Covered' },
      ]}
      whyUs={[
        {
          icon: 'fa-flask',
          title: 'Validate Before You Build',
          desc: 'Most founders spend months building something before talking to a single potential customer. We help you validate your assumptions with real people before spending budget on development.',
        },
        {
          icon: 'fa-map',
          title: 'Strategy Built for Execution',
          desc: 'Strategy documents that sit in folders are not useful. Everything we produce is decision-ready. A GTM plan you can act on Monday morning, not one that requires another workshop to interpret.',
        },
        {
          icon: 'fa-people-group',
          title: 'Network That Opens Doors',
          desc: 'Eight years working with founders, investors, and accelerators across India means we can introduce you to the right people when you need them. Warm introductions, not cold emails.',
        },
      ]}
      capabilities={[
        {
          icon: 'fa-flask',
          title: 'Idea and Market Validation',
          desc: 'Problem interviews, customer discovery surveys, and competitive landscape analysis to confirm there is a real market before you invest significantly.',
          tags: ['Customer Interviews', 'Market Sizing', 'Competitor Analysis'],
        },
        {
          icon: 'fa-diagram-project',
          title: 'Business Model Design',
          desc: 'Revenue model, pricing architecture, unit economics modeling, and breakeven analysis. Know your numbers before you pitch to anyone.',
          tags: ['Revenue Model', 'Pricing', 'Unit Economics'],
        },
        {
          icon: 'fa-rocket',
          title: 'Go-to-Market Strategy',
          desc: 'Channel selection, customer acquisition plan, launch sequencing, and first 100 customer playbook. Practical and actionable, not theoretical.',
          tags: ['GTM Plan', 'Channel Strategy', 'Launch Plan'],
        },
        {
          icon: 'fa-chart-line',
          title: 'Pitch Deck and Fundraising',
          desc: 'Investor-ready pitch decks, financial models, data room preparation, and warm introductions to relevant angels and VCs.',
          tags: ['Pitch Deck', 'Financial Model', 'Investor Intros'],
        },
        {
          icon: 'fa-mobile-screen',
          title: 'MVP Definition and Planning',
          desc: 'Feature prioritization using MoSCoW framework, user story mapping, and technical scoping so your first version solves the right problem.',
          tags: ['MoSCoW', 'User Stories', 'Tech Scoping'],
        },
        {
          icon: 'fa-chart-pie',
          title: 'KPI and Metrics Framework',
          desc: 'Define the right metrics for your stage: activation, retention, revenue, and growth. Build dashboards that tell you whether things are working.',
          tags: ['North Star Metric', 'OKRs', 'Dashboards'],
        },
      ]}
      testimonial={{
        quote: 'ThinkSuite helped us go from an idea to a funded product in 9 months. Their GTM strategy got us our first 50 paying customers before we had a mobile app.',
        name: 'Priya Mehrotra',
        role: 'Co-Founder',
        company: 'EduStack India',
      }}
      industries={[
        {
          icon: 'fa-shirt',
          name: 'D2C and Consumer Brands',
          useCase: 'Brand positioning, channel strategy (D2C vs marketplaces), CAC benchmarks, and unit economics modeling for physical product businesses.',
          tags: ['Brand Positioning', 'Channel Strategy', 'Unit Economics'],
        },
        {
          icon: 'fa-laptop',
          name: 'SaaS and B2B Tech',
          useCase: 'ICP definition, pricing strategy, pilot program design, and go-to-market for enterprise sales. Land-and-expand playbooks.',
          tags: ['ICP Definition', 'Pilot Programs', 'Enterprise GTM'],
        },
        {
          icon: 'fa-heart-pulse',
          name: 'HealthTech and MedTech',
          useCase: 'Regulatory pathway advisory, clinical validation planning, hospital sales strategy, and insurance reimbursement research.',
          tags: ['Regulatory', 'Hospital Sales', 'Clinical Validation'],
        },
        {
          icon: 'fa-graduation-cap',
          name: 'EdTech',
          useCase: 'Curriculum strategy, B2C vs B2B2C model evaluation, content monetization, and school partnership GTM.',
          tags: ['Curriculum Strategy', 'B2B2C', 'School Partnerships'],
        },
        {
          icon: 'fa-seedling',
          name: 'AgriTech and CleanTech',
          useCase: 'Farmer adoption strategy, government partnership frameworks, impact measurement, and grant funding identification.',
          tags: ['Farmer Adoption', 'Gov Partnerships', 'Impact Metrics'],
        },
        {
          icon: 'fa-landmark',
          name: 'FinTech and BFSI',
          useCase: 'RBI and SEBI compliance framework, partnership strategy with banks and NBFCs, and customer trust-building for financial products.',
          tags: ['RBI Compliance', 'Bank Partnerships', 'Trust Building'],
        },
      ]}
      process={[
        {
          title: 'Discovery Workshop',
          desc: 'A structured 90-minute session to understand your idea, current stage, target customer, and biggest uncertainties.',
        },
        {
          title: 'Research and Analysis',
          desc: 'Customer interviews, market research, competitive analysis, and business model stress-testing over 2 to 3 weeks.',
        },
        {
          title: 'Strategy Delivery',
          desc: 'Deliver your GTM plan, business model, pitch deck, or MVP scope as a clear, decision-ready document with rationale.',
        },
        {
          title: 'Ongoing Advisory',
          desc: 'Monthly advisory calls, milestone reviews, warm introductions, and on-demand support as you execute.',
        },
      ]}
      faqs={[
        {
          q: 'What stage of startup do you work with?',
          a: 'We work with founders from pre-idea exploration through to Series A stage. Our sweet spot is pre-seed to seed founders who need structure around their idea before building or fundraising.',
        },
        {
          q: 'Do you take equity in startups you advise?',
          a: 'Our standard engagement is fee-based. We do consider equity advisory roles selectively for startups we are deeply aligned with. This is discussed case by case.',
        },
        {
          q: 'Can you help with building the product too?',
          a: 'Yes. ThinkSuite has a full technical team. Many consulting clients move to product development with us once the strategy is defined. You get continuity from strategy to execution.',
        },
        {
          q: 'How long does a typical consulting engagement last?',
          a: 'Project-based engagements like pitch deck creation or GTM strategy take 2 to 5 weeks. Ongoing advisory retainers run month-to-month with a 90-day minimum.',
        },
        {
          q: 'Do you help with investor introductions?',
          a: 'Yes. For clients we work with on fundraising preparation, we provide warm introductions to relevant angel networks, family offices, and early-stage VCs once the materials are ready.',
        },
      ]}
      sidebarLinks={[
        { label: 'Growth Planning', href: '/growth-planning' },
        { label: 'Market Research', href: '/market-research' },
        { label: 'Custom Software', href: '/custom-software' },
        { label: 'AI Tools Development', href: '/ai-tools-development' },
      ]}
      ctaTitle="Build Your Startup"
      ctaTitleHighlight="the Right Way"
      ctaDesc="Every startup makes mistakes. The ones that succeed make fewer expensive ones. Let us help you validate faster, build smarter, and grow with a strategy that actually fits your market."
    />
  )
}
