import ServicePageDashboard from '@/components/pages/ServicePageDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digital Marketing Agency | SEO, Ads, GEO | ThinkSuite',
  description: 'Full-stack digital marketing for businesses worldwide: SEO, Google Ads, Meta Ads, social media, content, and Generative Engine Optimization for AI search.',
  keywords: [
    'digital marketing agency Gurgaon',
    'digital marketing agency India',
    'SEO agency India',
    'Google Ads management India',
    'Meta Ads agency India',
    'GEO optimization for businesses',
    'social media marketing agency India',
    'content marketing agency India',
    'performance marketing agency India',
    'full-stack digital marketing company',
    'digital marketing agency',
    'SEO agency worldwide',
    'performance marketing agency',
  ],
}

const faqData = [
  {
    q: 'What is Generative Engine Optimization (GEO)?',
    a: "GEO is the practice of structuring your brand's digital content and schema data so that AI search engines like ChatGPT, Gemini, and Perplexity select your business as a cited answer for relevant queries. It captures a growing category of search traffic that traditional SEO alone cannot reach.",
  },
  {
    q: 'How long before we see measurable SEO results?',
    a: 'Initial ranking improvements typically appear within 6 to 10 weeks for lower-competition terms. Full domain authority gains and AI citation visibility build over 4 to 6 months as semantic content and backlink profiles mature.',
  },
  {
    q: 'Do you manage Google Ads and Meta Ads together?',
    a: 'Yes. Our performance team manages both platforms under a unified attribution model, ensuring ad spend, landing page messaging, and organic content reinforce each other for a lower customer acquisition cost.',
  },
  {
    q: 'How do you measure digital marketing ROI?',
    a: 'We track revenue-tied KPIs from day one: cost per qualified lead, pipeline contribution, organic session-to-conversion rates, and AI citation share. Every report links marketing activity directly to business outcomes, not vanity metrics.',
  },
  {
    q: "Can GEO work for my industry even if it's competitive?",
    a: 'Especially in competitive verticals. The more saturated a space is with generic SEO content, the greater the GEO advantage, since AI models tend to prefer authoritative, structured, entity-rich sources over keyword-stuffed pages.',
  },
]

export default function DigitalMarketingPage() {
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqData.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }),
      }}
    />
    <ServicePageDashboard
      breadcrumb="Services"
      breadcrumbHref="/services"
      label="Digital Marketing and GEO"
      title="Claim The Definitive Answer"
      titleHighlight="Across Modern Search."
      tagline="People are searching on Google and asking questions on ChatGPT and Gemini. We make sure your brand shows up on all of them, through SEO, paid ads, and GEO strategies that bring you real customers."
      stats={[
        { number: 'SEO + GEO', label: 'Combined Strategy' },
        { number: 'Lower CAC', label: 'Ad Spend Efficiency' },
        { number: 'In-House', label: 'Team, Serving Clients Worldwide' },
        { number: '2', label: 'Discovery Engines Covered' },
      ]}
      chartTitle="Organic Traffic and GEO Citation Growth"
      chartBadge="Growth Trajectory"
      intro="More and more people are using AI tools like ChatGPT and Gemini to find products and services. Businesses that are not showing up in these AI answers are missing a growing chunk of potential customers. We combine SEO, GEO, and paid campaigns so your brand gets found across all of them."
      introPoints={[
        'Structured semantic schema models so AI engines cite your brand as the top answer',
        'Precision Google and Meta ad campaigns focused on lowest customer acquisition cost',
        'SEO content frameworks that build topical authority and compound organic traffic',
        'Full-funnel analytics tying every marketing activity directly to revenue outcomes',
      ]}
      capabilities={[
        {
          icon: 'fa-magnifying-glass-chart',
          metric: 'AI-Cited',
          title: 'Generative Engine Optimization',
          desc: 'Setting up your content and structured data so AI search engines like ChatGPT and Gemini naturally recommend your brand when users ask about your industry.',
        },
        {
          icon: 'fa-rectangle-ad',
          metric: 'Lowest CAC',
          title: 'ROI-Driven Ad Campaigns',
          desc: 'Google and Meta ad campaigns focused on bringing in real customers at the lowest possible cost, not just clicks or impressions that do not convert.',
        },
        {
          icon: 'fa-hashtag',
          metric: 'Omnichannel',
          title: 'Social Media Marketing',
          desc: 'Building your presence on Instagram, LinkedIn, and YouTube to reach potential customers at every stage, from first discovery to final purchase decision.',
        },
        {
          icon: 'fa-file-pen',
          metric: 'Intent-Driven',
          title: 'Content Marketing',
          desc: 'SEO content and blog strategy that builds your authority on topics your customers search for, driving steady organic traffic month after month.',
        },
        {
          icon: 'fa-envelope-open-text',
          metric: 'Behavior-Triggered',
          title: 'Email Marketing',
          desc: 'Email sequences triggered by user behavior and sent at the right moment to nurture leads and bring them closer to making a purchase.',
        },
        {
          icon: 'fa-chart-bar',
          metric: 'Live Data',
          title: 'Analytics and Reporting',
          desc: 'Clear performance dashboards showing what is actually working, tied to real revenue outcomes so you always know where your marketing spend is going.',
        },
      ]}
      process={[
        {
          title: 'Audit',
          desc: 'Full technical SEO and GEO readiness audit, we assess your current semantic structure, content gaps, schema coverage, and AI citation potential.',
        },
        {
          title: 'Strategy',
          desc: 'We architect a semantic content roadmap and paid media plan targeting the highest-intent keywords across Google, Bing, and AI search platforms.',
        },
        {
          title: 'Execute',
          desc: 'SEO, GEO, and performance ad campaigns are launched in parallel, with weekly reporting tied directly to qualified lead and revenue metrics.',
        },
        {
          title: 'Optimize',
          desc: 'Real-time analytics drive continuous bid, content, and schema refinements, compounding performance gains every 30-day cycle.',
        },
      ]}
      faqs={faqData}
      sidebarLinks={[
        { label: 'SEO Optimization', href: '/seo-optimization' },
        { label: 'Social Media Marketing', href: '/social-media-marketing' },
        { label: 'Google and Meta Ads', href: '/google-meta-ads' },
        { label: 'Content Marketing', href: '/content-marketing' },
        { label: 'AI Marketing Systems', href: '/ai-marketing-systems' },
        { label: 'Business Strategy', href: '/business-strategy' },
      ]}
      ctaTitle="Dominate Search With"
      ctaTitleHighlight="GEO Precision"
      ctaDesc="Position your brand as a trusted answer across ChatGPT, Gemini, and Perplexity, alongside strong Google rankings. Our semantic infrastructure connects AI citations to qualified revenue."
    />
    </>
  )
}
