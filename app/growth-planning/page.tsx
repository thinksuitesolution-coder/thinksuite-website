import ServicePageSplitStory from '@/components/pages/ServicePageSplitStory'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Growth Planning Services India | ThinkSuite',
  description: 'Strategic growth planning for Indian businesses. Revenue growth strategy, customer acquisition planning, market expansion, and growth dashboards for SMEs and scaling businesses.',
}

export default function GrowthPlanningPage() {
  return (
    <ServicePageSplitStory
      breadcrumb="Consulting and Growth"
      breadcrumbHref="/consulting-growth"
      label="Growth Strategy"
      title="Growth"
      visualType="growth"
      titleHighlight="Planning"
      tagline="Growing from where you are to where you want to be requires a plan with real numbers, prioritized bets, and clear accountability. We build growth plans that actually get executed."
      stats={[
        { number: '2.8x', label: 'Average Revenue Growth' },
        { number: '45+', label: 'Businesses Scaled' },
        { number: '90d', label: 'First Milestone Sprint' },
        { number: 'CAC+LTV', label: 'Always Tracked' },
      ]}
      whyUs={[
        {
          icon: 'fa-chart-line',
          title: 'Numbers-First Approach',
          desc: 'Every growth plan we build starts with your actual current numbers, not industry averages. We define what growth means specifically for your business, your margins, and your market.',
        },
        {
          icon: 'fa-bullseye',
          title: 'Prioritized Bets, Not Wish Lists',
          desc: 'Most growth plans list 50 things to do. We identify the 5 that will drive 80% of the growth and help you say no to everything else.',
        },
        {
          icon: 'fa-repeat',
          title: 'Built for Execution',
          desc: 'Growth plans that gather dust are worthless. We build quarterly execution plans with weekly check-ins, KPI dashboards, and accountability structures that actually get followed.',
        },
      ]}
      capabilities={[
        {
          icon: 'fa-chart-line',
          title: 'Revenue Growth Strategy',
          desc: 'Model different growth scenarios, identify revenue levers, and build a 12-month revenue plan with clear milestones and assumptions.',
          tags: ['Revenue Model', 'Scenario Planning', 'Milestones'],
        },
        {
          icon: 'fa-user-plus',
          title: 'Customer Acquisition Planning',
          desc: 'Define your most efficient customer acquisition channels, set CAC targets by channel, and build a budget allocation model for paid and organic.',
          tags: ['CAC Analysis', 'Channel Mix', 'Budget Allocation'],
        },
        {
          icon: 'fa-arrow-trend-up',
          title: 'Retention and LTV Optimization',
          desc: 'Analyze churn drivers, build retention programs, and increase customer lifetime value through upsell and cross-sell strategy.',
          tags: ['Churn Analysis', 'Retention Programs', 'LTV'],
        },
        {
          icon: 'fa-map-location-dot',
          title: 'Market Expansion Strategy',
          desc: 'New city entry, new customer segment, or new product line. We build the expansion playbook with timing, resource requirements, and expected returns.',
          tags: ['City Expansion', 'New Segments', 'Expansion Playbook'],
        },
        {
          icon: 'fa-handshake',
          title: 'Partnership and Channel Strategy',
          desc: 'Identify and structure partnerships that accelerate growth. Reseller networks, white-label opportunities, and distribution partnerships.',
          tags: ['Resellers', 'White-label', 'Distribution'],
        },
        {
          icon: 'fa-gauge-high',
          title: 'Growth Dashboard Setup',
          desc: 'Define your north star metric, build a KPI hierarchy, and set up live dashboards so leadership always knows whether the business is on track.',
          tags: ['North Star Metric', 'KPI Hierarchy', 'Live Dashboards'],
        },
      ]}
      testimonial={{
        quote: 'We doubled revenue in 11 months following the growth plan ThinkSuite built for us. The 90-day sprint model kept us focused and moving.',
        name: 'Arjun Malhotra',
        role: 'CEO',
        company: 'UrbanFinds',
      }}
      industries={[
        {
          icon: 'fa-bag-shopping',
          name: 'E-Commerce and D2C',
          useCase: 'Scale from 10L to 1Cr monthly revenue. Channel diversification, CAC reduction, retention programs, and marketplace vs D2C split optimization.',
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
          useCase: 'Franchise rollout planning, store P&L benchmarks, location selection criteria, and omnichannel strategy from offline to online.',
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
          desc: 'Deep dive into your current revenue, channels, unit economics, customer data, and team capacity.',
        },
        {
          title: 'Growth Model',
          desc: 'Build a financial growth model with scenarios, assumptions, and milestone-based targets for 6 and 12 months.',
        },
        {
          title: 'Strategic Prioritization',
          desc: 'Identify the top 3 to 5 growth bets with highest ROI. Build 90-day sprint plans for each.',
        },
        {
          title: 'Track and Adapt',
          desc: 'Monthly growth reviews, dashboard monitoring, and plan adjustments based on what is and is not working.',
        },
      ]}
      faqs={[
        {
          q: 'What size business do you work with on growth planning?',
          a: 'We work with businesses doing Rs 50L to Rs 50Cr annually. The structure changes but the core process is the same: understand the current state, define the target, and build a realistic path between them.',
        },
        {
          q: 'How long does growth planning take?',
          a: 'An initial growth plan typically takes 3 to 5 weeks to develop. We start with a discovery session and deliver the full strategy document and 90-day sprint plan at the end.',
        },
        {
          q: 'Do you help with execution or just the planning?',
          a: 'Both. As an integrated digital agency, we can execute on the marketing, product, and technology components of your growth plan. You get strategy and execution from one team.',
        },
        {
          q: 'What data do you need from us to start?',
          a: 'Monthly revenue for the last 12 months, channel-wise marketing spend and leads, customer acquisition costs if tracked, and churn rates. We work with what you have and help you track what you are missing.',
        },
        {
          q: 'How do you measure whether the growth plan is working?',
          a: 'We set up a KPI dashboard at the start with your north star metric, weekly leading indicators, and monthly lagging indicators. You always know whether you are on track.',
        },
      ]}
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
  )
}
