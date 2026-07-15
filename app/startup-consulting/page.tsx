import ServicePageSplitStory from '@/components/pages/ServicePageSplitStory'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Startup Consulting for Founders | ThinkSuite',
  description: 'ThinkSuite helps early-stage founders worldwide validate ideas, build go-to-market plans, and raise funding, backed by an in-house team that builds the product too.',
  keywords: [
    'startup consulting India',
    'startup advisor Gurgaon',
    'go-to-market strategy consulting for early-stage startups India',
    'pitch deck consulting India',
    'MVP planning for startups',
    'business model validation consulting',
    'startup fundraising advisory India',
    'early stage startup consulting',
    'idea validation consultant India',
    'startup GTM strategy consultant',
    'founder advisory Gurgaon',
    'startup strategy consulting for first-time founders',
    'startup consulting for founders worldwide',
    'startup advisor',
    'founder advisory services',
    'startup consulting firm',
    'startup consultants',
    'startup advisory services',
    'startup consulting for fundraising',
    'startup growth advisory',
  ],
}

const faqs = [
  {
    q: 'What stage of startup do you work with?',
    a: 'We work with founders from pre-idea exploration through to Series A stage. Our sweet spot is pre-seed and seed founders who need structure around their idea before they start building or fundraising.',
  },
  {
    q: 'Do you take equity in startups you advise?',
    a: 'Our standard engagement is fee-based. We consider equity advisory roles selectively for startups we are deeply aligned with, and that is always discussed and decided case by case, not offered as a default.',
  },
  {
    q: 'Can you help with building the product too?',
    a: 'Yes. ThinkSuite has a full technical team, and many consulting clients move straight into product development with us once the strategy is defined. You get continuity from strategy to execution instead of starting over with a new team.',
  },
  {
    q: 'How long does a typical consulting engagement last?',
    a: 'Project-based engagements like pitch deck creation or GTM strategy usually take 2 to 5 weeks. Ongoing advisory retainers run month to month, with a 90-day minimum so there is enough time to see real progress.',
  },
  {
    q: 'Do you help with investor introductions?',
    a: 'Yes. For clients we work with on fundraising preparation, we provide warm introductions to relevant angel networks, family offices, and early-stage investors once the materials are actually ready to be shown.',
  },
  {
    q: 'How much does startup consulting cost?',
    a: 'Project-based engagements like a pitch deck or GTM strategy are priced as a fixed fee, typically scoped after our discovery workshop. Ongoing advisory retainers are billed monthly with a 90-day minimum. We do not have a one-size-fits-all number since pre-seed and Series A engagements differ significantly in depth.',
  },
  {
    q: 'What does a startup consultant actually do?',
    a: 'A startup consultant helps you validate your idea, build a go-to-market plan, get investor-ready, and avoid the expensive mistakes founders make when nobody is checking their assumptions. At ThinkSuite, that also extends to introductions and, if you need it, building the actual product.',
  },
  {
    q: 'Do I need a consultant before raising a funding round?',
    a: 'Not always, but it helps if your pitch deck, financial model, or business case have gaps that investors will notice immediately. Founders who come to us before a raise usually walk into investor meetings with sharper positioning and fewer unanswered questions.',
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
  name: 'Startup Consulting',
  description: 'Startup advisory for early-stage founders worldwide, covering idea validation, go-to-market strategy, fundraising, and MVP planning.',
  url: 'https://thinksuite.in/startup-consulting',
  serviceType: 'Startup Consulting',
  keywords: ['startup consulting firm', 'startup consultants', 'startup advisory services'],
})

export default function StartupConsultingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ServicePageSplitStory
        breadcrumb="Consulting and Growth"
        breadcrumbHref="/consulting-growth"
        label="Startup Strategy"
        title="Startup"
        titleHighlight="Consulting"
        tagline="Most startups don't fail because the idea was bad. They fail because of avoidable mistakes made under pressure, with no one around to catch them in time. We work with founders to validate faster, build smarter, and dodge the traps that quietly sink most early-stage companies."
        stats={[
          { number: 'Pre-Seed to Series A', label: 'Founders We Work With' },
          { number: 'Validate First', label: 'Real Customers Before You Build' },
          { number: 'Warm Intros', label: 'Founders, Investors and Accelerators' },
          { number: 'Decision-Ready', label: 'Strategy You Can Act On Monday' },
        ]}
        whyUsHeading={{ lead: 'Why Choose a', highlight: 'Startup Consulting Firm' }}
        capabilitiesHeading={{ lead: 'What Our', highlight: 'Startup Advisory Services Deliver' }}
        processHeading={{ lead: 'How Our', highlight: 'Startup Consultants Work' }}
        whyUs={[
          {
            icon: 'fa-flask',
            title: 'Validate Before You Build',
            desc: 'Most founders spend months building something before talking to a single potential customer. We help you test your assumptions with real people first, before you spend the budget on development you can\'t take back.',
          },
          {
            icon: 'fa-map',
            title: 'Strategy Built for Execution',
            desc: 'Strategy documents that sit in folders help no one. Everything we produce is decision-ready, a GTM plan you can act on Monday morning, not one that needs another workshop just to interpret it.',
          },
          {
            icon: 'fa-people-group',
            title: 'A Network That Opens Doors',
            desc: 'Years spent working alongside founders, investors, and accelerators across India and internationally mean we can introduce you to the right people when you actually need them, warm introductions instead of cold emails into the void.',
          },
        ]}
        capabilities={[
          {
            icon: 'fa-flask',
            title: 'Idea and Market Validation',
            desc: 'Problem interviews, customer discovery surveys, and competitive landscape analysis, the first step in any early stage startup consulting engagement, to confirm there is a real market before you invest heavily.',
            tags: ['Customer Interviews', 'Market Sizing', 'Competitor Analysis'],
          },
          {
            icon: 'fa-diagram-project',
            title: 'Business Model Design',
            desc: 'Revenue model, pricing architecture, unit economics modeling, and breakeven analysis. Know your numbers before you pitch anyone.',
            tags: ['Revenue Model', 'Pricing', 'Unit Economics'],
          },
          {
            icon: 'fa-rocket',
            title: 'Go-to-Market Strategy',
            desc: 'Channel selection, a customer acquisition plan, launch sequencing, and a playbook for your first 100 customers. Practical, not theoretical.',
            tags: ['GTM Plan', 'Channel Strategy', 'Launch Plan'],
          },
          {
            icon: 'fa-chart-line',
            title: 'Pitch Deck and Fundraising',
            desc: 'Investor-ready pitch decks, financial models, data room preparation, and warm introductions to relevant angels and VCs, the full stack of startup consulting for fundraising in one engagement.',
            tags: ['Pitch Deck', 'Financial Model', 'Investor Intros'],
          },
          {
            icon: 'fa-mobile-screen',
            title: 'MVP Definition and Planning',
            desc: 'Feature prioritization using the MoSCoW framework, user story mapping, and technical scoping so your first version solves the right problem.',
            tags: ['MoSCoW', 'User Stories', 'Tech Scoping'],
          },
          {
            icon: 'fa-chart-pie',
            title: 'KPI and Metrics Framework',
            desc: 'Define the right metrics for your stage: activation, retention, revenue, and growth. Build dashboards that tell you whether things are actually working.',
            tags: ['North Star Metric', 'OKRs', 'Dashboards'],
          },
        ]}
        testimonial={{
          quote: 'ThinkSuite helped us go from an idea to a funded product in under a year. Their GTM strategy got us our first paying customers before we even had a mobile app.',
          name: 'Priya Mehrotra',
          role: 'Co-Founder',
          company: 'EduStack India',
        }}
        industries={[
          {
            icon: 'fa-shirt',
            name: 'D2C and Consumer Brands',
            useCase: 'Brand positioning, channel strategy (D2C vs marketplaces), CAC benchmarking, and unit economics modeling for physical product businesses.',
            tags: ['Brand Positioning', 'Channel Strategy', 'Unit Economics'],
          },
          {
            icon: 'fa-laptop',
            name: 'SaaS and B2B Tech',
            useCase: 'ICP definition, pricing strategy, pilot program design, and go-to-market for enterprise sales. Land-and-expand playbooks that hold up.',
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
            useCase: 'Curriculum strategy, B2C versus B2B2C model evaluation, content monetization, and school partnership go-to-market.',
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
            useCase: 'RBI and SEBI compliance framework guidance, partnership strategy with banks and NBFCs, and trust-building for financial products.',
            tags: ['RBI Compliance', 'Bank Partnerships', 'Trust Building'],
          },
        ]}
        process={[
          {
            title: 'Discovery Workshop',
            desc: 'A structured 90-minute session to understand your idea, current stage, target customer, and the biggest uncertainties you\'re facing.',
          },
          {
            title: 'Research and Analysis',
            desc: 'Customer interviews, market research, competitive analysis, and business model stress-testing over 2 to 3 weeks.',
          },
          {
            title: 'Strategy Delivery',
            desc: 'We deliver your GTM plan, business model, pitch deck, or MVP scope as a clear, decision-ready document with the reasoning behind it.',
          },
          {
            title: 'Ongoing Advisory',
            desc: 'Monthly advisory calls, milestone reviews, warm introductions, and on-demand support as you execute.',
          },
        ]}
        faqs={faqs}
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
    </>
  )
}
