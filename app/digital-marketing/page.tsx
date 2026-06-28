import ServicePageDashboard from '@/components/pages/ServicePageDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digital Marketing Agency India | SEO, Ads, GEO | ThinkSuite',
  description: 'Full-stack digital marketing for Indian businesses: SEO, Google Ads, Meta Ads, social media, content marketing, and Generative Engine Optimization.',
  keywords: ['digital marketing agency India', 'SEO agency India', 'Google Ads India', 'Meta Ads India', 'GEO optimization India', 'social media marketing India', 'content marketing agency', 'digital marketing Gurgaon', 'performance marketing India'],
}

export default function DigitalMarketingPage() {
  return (
    <ServicePageDashboard
      breadcrumb="Services"
      breadcrumbHref="/services"
      label="Digital Marketing and GEO"
      title="Claim The Definitive Answer"
      titleHighlight="Across Modern Search."
      tagline="People are searching on Google and asking questions on ChatGPT and Gemini. We make sure your brand shows up on all of them, through SEO, paid ads, and GEO strategies that bring you real customers."
      stats={[
        { number: '3x', label: 'Organic Traffic Growth' },
        { number: '40%', label: 'Lower Acquisition Cost' },
        { number: '120%', label: 'Average Campaign ROI' },
        { number: '50+', label: 'Brands Scaled' },
      ]}
      chartTitle="Organic Traffic and GEO Citation Growth"
      chartBadge="3x Average Growth"
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
          metric: '5x Cited',
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
          metric: '3x CTR',
          title: 'Content Marketing',
          desc: 'SEO content and blog strategy that builds your authority on topics your customers search for, driving steady organic traffic month after month.',
        },
        {
          icon: 'fa-envelope-open-text',
          metric: '42% Open',
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
      faqs={[
        {
          q: 'What is Generative Engine Optimization (GEO)?',
          a: "GEO is the practice of structuring your brand's digital content and schema data so that AI search engines like ChatGPT, Gemini, and Perplexity select your business as the primary cited answer for relevant queries, capturing traffic that traditional SEO cannot.",
        },
        {
          q: 'How long before we see measurable SEO results?',
          a: 'Initial ranking improvements typically appear within 6,10 weeks for lower-competition terms. Full domain authority gains and AI citation visibility compound over 4,6 months as semantic content and backlink profiles mature.',
        },
        {
          q: 'Do you manage Google Ads and Meta Ads together?',
          a: 'Yes. Our performance team manages both platforms under a unified attribution model, ensuring ad spend, landing page messaging, and organic content reinforce each other for the lowest possible customer acquisition cost.',
        },
        {
          q: 'How do you measure marketing ROI?',
          a: 'We track revenue-tied KPIs from day one: cost per qualified lead, pipeline contribution, organic session-to-conversion rates, and AI citation share. Every report links marketing activity directly to business outcomes, no vanity metrics.',
        },
        {
          q: "Can GEO work for my industry even if it's competitive?",
          a: 'Especially in competitive verticals. The more saturated a space is with generic SEO content, the greater the GEO advantage, AI models prefer authoritative, structured, entity-rich sources over keyword-stuffed pages.',
        },
      ]}
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
      ctaDesc="Position your brand as the definitive answer across ChatGPT, Gemini, and Perplexity. Our semantic infrastructure converts AI citations into qualified revenue."
    />
  )
}
