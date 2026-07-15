import ServicePageSplitStory from '@/components/pages/ServicePageSplitStory'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Growth Planning Services for Businesses | ThinkSuite',
  description: 'ThinkSuite builds growth plans anchored to your real numbers, not industry averages. Revenue strategy, customer acquisition, and 90-day execution sprints.',
  keywords: [
    'growth planning India',
    'revenue growth strategy India',
    'customer acquisition planning India',
    'business growth consultant Gurgaon',
    'growth strategy consulting for SMEs',
    'CAC LTV optimization consulting',
    'market expansion strategy India',
    'KPI dashboard setup for businesses',
    '90 day growth plan for founders',
    'growth consultant for scaling businesses',
    'revenue growth planning services India',
    'growth strategy for e-commerce and SaaS',
    'growth planning services',
    'business growth planning',
    'strategic growth planning consultants',
    'growth planning for startups',
    'revenue growth planning',
    'growth planning workshop',
  ],
}

const faqs = [
  {
    q: 'What size business do you work with on growth planning?',
    a: 'We work with businesses of very different sizes, from early revenue-stage companies to well-established players scaling into new markets. The structure of the engagement changes with size, but the core process stays the same: understand where you are, define where you want to be, and build a realistic path between the two.',
  },
  {
    q: 'How long does growth planning take?',
    a: 'An initial growth plan typically takes 3 to 5 weeks to develop. We start with a discovery session and deliver the full strategy document along with a 90-day sprint plan at the end, so you leave with something you can start acting on immediately.',
  },
  {
    q: 'Do you help with execution or just the planning?',
    a: 'Both. As an integrated digital agency, we can execute the marketing, product, and technology pieces of your growth plan ourselves. You get strategy and execution from one team instead of handing your plan off to someone else to interpret.',
  },
  {
    q: 'What data do you need from us to start?',
    a: 'Monthly revenue history, channel-wise marketing spend and leads, customer acquisition costs if you track them, and churn rates if applicable. We work with whatever you already have and help you start tracking what is currently missing.',
  },
  {
    q: 'How do you measure whether the growth plan is working?',
    a: 'We set up a KPI dashboard at the start, built around your north star metric, weekly leading indicators, and monthly lagging indicators. You always know whether you are on track instead of finding out at the end of the quarter.',
  },
  {
    q: 'What is a growth plan for a business?',
    a: 'A growth plan is a document that lays out where your revenue, customers, and market position are today, where you want them to be, and the specific, prioritized moves that will close that gap. Ours are anchored to your real numbers and broken into 90-day sprints so the plan gets executed, not filed away.',
  },
  {
    q: 'How do I create a business growth plan?',
    a: 'Start with an honest audit of your current revenue, channels, and unit economics, then pick the handful of growth levers most likely to move the needle for your specific business rather than copying a generic list. We run this as a structured process: current state audit, growth model, prioritization, then a 90-day sprint plan.',
  },
  {
    q: "What's the difference between a growth plan and a business plan?",
    a: 'A business plan usually covers the full picture of a company, including its model, funding needs, and long-term vision, often written once for investors. A growth plan is narrower and more operational: it focuses specifically on how you acquire, retain, and grow revenue from where you are right now, and it gets revisited every quarter.',
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
  name: 'Growth Planning Services',
  description: 'Growth plans anchored to real business numbers, covering revenue strategy, customer acquisition, and 90-day execution sprints.',
  url: 'https://thinksuite.in/growth-planning',
  serviceType: 'Growth Planning',
  keywords: ['growth planning services', 'business growth planning', 'strategic growth planning consultants'],
})

export default function GrowthPlanningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ServicePageSplitStory
        breadcrumb="Consulting and Growth"
        breadcrumbHref="/consulting-growth"
        label="Growth Strategy"
        title="Growth"
        visualType="growth"
        titleHighlight="Planning"
        tagline="Getting from where you are to where you want to be takes more than ambition. It takes a plan with real numbers, prioritized bets, and someone holding the team accountable to it. We build growth plans that survive contact with a busy Monday morning, not ones that get filed away and forgotten."
        stats={[
          { number: '90-Day Sprints', label: 'Plans Built Around Real Execution' },
          { number: 'Top 5 Bets', label: 'Prioritized Over Fifty-Item Wish Lists' },
          { number: 'CAC + LTV', label: 'Tracked From Day One' },
          { number: 'Numbers-First', label: 'Plans Built On Your Actual Data' },
        ]}
        whyUs={[
          {
            icon: 'fa-chart-line',
            title: 'Numbers-First Approach',
            desc: 'Every growth plan we build starts with your actual current numbers, not industry benchmarks pulled from someone else\'s business. We define what growth means specifically for your margins and your market, not a generic template.',
          },
          {
            icon: 'fa-bullseye',
            title: 'Prioritized Bets, Not Wish Lists',
            desc: 'Most growth plans list fifty things to do and leave you paralyzed. We identify the handful that will actually move the needle and help you say no to everything else, on purpose.',
          },
          {
            icon: 'fa-repeat',
            title: 'Built for Execution',
            desc: 'A growth plan that gathers dust is worthless. We build quarterly execution plans with weekly check-ins and accountability structures that actually get followed, week after week.',
          },
        ]}
        capabilities={[
          {
            icon: 'fa-chart-line',
            title: 'Revenue Growth Strategy',
            desc: 'Model different growth scenarios, identify the revenue levers that matter most, and build a 12-month revenue plan with clear milestones and honest assumptions.',
            tags: ['Revenue Model', 'Scenario Planning', 'Milestones'],
          },
          {
            icon: 'fa-user-plus',
            title: 'Customer Acquisition Planning',
            desc: 'Define your most efficient acquisition channels, set CAC targets by channel, and build a budget allocation model across paid and organic.',
            tags: ['CAC Analysis', 'Channel Mix', 'Budget Allocation'],
          },
          {
            icon: 'fa-arrow-trend-up',
            title: 'Retention and LTV Optimization',
            desc: 'Understand why customers actually churn, build retention programs around the real reasons, and grow lifetime value through upsell and cross-sell strategy.',
            tags: ['Churn Analysis', 'Retention Programs', 'LTV'],
          },
          {
            icon: 'fa-map-location-dot',
            title: 'Market Expansion Strategy',
            desc: 'A new city, a new customer segment, or a new product line. We build the expansion playbook with realistic timing, resource requirements, and expected returns.',
            tags: ['City Expansion', 'New Segments', 'Expansion Playbook'],
          },
          {
            icon: 'fa-handshake',
            title: 'Partnership and Channel Strategy',
            desc: 'Identify and structure partnerships that accelerate growth: reseller networks, white-label opportunities, and distribution partnerships worth pursuing.',
            tags: ['Resellers', 'White-label', 'Distribution'],
          },
          {
            icon: 'fa-gauge-high',
            title: 'Growth Dashboard Setup',
            desc: 'Define your north star metric, build a KPI hierarchy around it, and set up live dashboards so leadership always knows whether the business is on track.',
            tags: ['North Star Metric', 'KPI Hierarchy', 'Live Dashboards'],
          },
        ]}
        testimonial={{
          quote: 'The growth plan ThinkSuite built for us finally gave the whole team a shared sense of direction. The 90-day sprint model kept us focused instead of chasing ten priorities at once.',
          name: 'Arjun Malhotra',
          role: 'CEO',
          company: 'UrbanFinds',
        }}
        industries={[
          {
            icon: 'fa-bag-shopping',
            name: 'E-Commerce and D2C',
            useCase: 'Scaling monthly revenue sustainably, channel diversification, CAC reduction, retention programs, and marketplace versus D2C split optimization.',
            tags: ['Revenue Scale', 'CAC Reduction', 'Marketplace Mix'],
          },
          {
            icon: 'fa-laptop',
            name: 'SaaS and Tech Products',
            useCase: 'ARR growth planning, trial-to-paid optimization, expansion revenue from upsells, and moving upmarket from SMB to mid-market.',
            tags: ['ARR Growth', 'Trial Conversion', 'Expansion Revenue'],
          },
          {
            icon: 'fa-building',
            name: 'Real Estate',
            useCase: 'New project launch strategy, city expansion planning, channel partner network building, and digital lead generation for sales teams.',
            tags: ['Launch Strategy', 'Channel Partners', 'City Expansion'],
          },
          {
            icon: 'fa-hospital',
            name: 'Healthcare Chains',
            useCase: 'Clinic expansion planning, patient acquisition and retention strategy, specialty addition roadmap, and franchising model development.',
            tags: ['Clinic Expansion', 'Patient Acquisition', 'Franchise Model'],
          },
          {
            icon: 'fa-store',
            name: 'Retail and QSR',
            useCase: 'Franchise rollout planning, store-level benchmarks, location selection criteria, and omnichannel strategy from offline to online.',
            tags: ['Franchise Rollout', 'Location Strategy', 'Omnichannel'],
          },
          {
            icon: 'fa-graduation-cap',
            name: 'Education and Coaching',
            useCase: 'Center expansion planning, online course revenue modeling, B2B school and college partnerships, and referral program design.',
            tags: ['Center Expansion', 'Online Revenue', 'B2B Partnerships'],
          },
        ]}
        process={[
          {
            title: 'Current State Audit',
            desc: 'A deep dive into your current revenue, channels, unit economics, customer data, and team capacity.',
          },
          {
            title: 'Growth Model',
            desc: 'We build a financial growth model with scenarios, assumptions, and milestone-based targets for 6 and 12 months.',
          },
          {
            title: 'Strategic Prioritization',
            desc: 'We identify the top 3 to 5 growth bets with the highest expected return and build 90-day sprint plans for each.',
          },
          {
            title: 'Track and Adapt',
            desc: 'Monthly growth reviews, dashboard monitoring, and plan adjustments based on what is and isn\'t working.',
          },
        ]}
        faqs={faqs}
        sidebarLinks={[
          { label: 'Startup Consulting', href: '/startup-consulting' },
          { label: 'Market Research', href: '/market-research' },
          { label: 'AI Marketing Systems', href: '/ai-marketing-systems' },
          { label: 'Digital Marketing', href: '/digital-marketing' },
        ]}
        ctaTitle="Plan Your Path"
        ctaTitleHighlight="to Growth"
        ctaDesc="Every business wants to grow. The ones that actually do it have a clear plan, the right metrics, and someone to hold them accountable. Let us build yours."
      />
    </>
  )
}
