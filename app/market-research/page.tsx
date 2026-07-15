import ServicePageDashboard from '@/components/pages/ServicePageDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Market Research Services | ThinkSuite',
  description: 'ThinkSuite runs primary and secondary market research for businesses worldwide: consumer surveys, competitor analysis, market sizing, and focus group studies.',
  keywords: [
    'market research India',
    'consumer research India',
    'competitor analysis India',
    'market sizing India',
    'focus group research India',
    'survey research for businesses India',
    'business research Gurgaon',
    'market research agency for startups',
    'TAM SAM SOM market sizing study',
    'primary and secondary market research India',
    'market research for investor pitch decks',
    'consumer survey research company India',
    'market research agency worldwide',
    'consumer research company',
    'competitor analysis agency',
  ],
}

const faqs = [
  {
    q: 'How long does market research take?',
    a: 'A consumer survey project typically takes 2 to 4 weeks from design to final report. Qualitative research using focus groups takes 3 to 5 weeks. Comprehensive research combining primary and secondary methods can take 5 to 8 weeks depending on scope.',
  },
  {
    q: 'How do you ensure the sample represents our target audience?',
    a: 'We define precise screening criteria before recruitment even begins. We use verified panel providers for surveys and targeted recruitment for qualitative research, and the exact sample composition is reported alongside every finding, not hidden in an appendix.',
  },
  {
    q: 'Can you research markets outside India?',
    a: 'Yes. We conduct primary and secondary research across Southeast Asia, the Middle East, Europe, and North America for clients based anywhere, including Indian businesses expanding abroad. Our methodology adapts to whatever local research infrastructure is available in that market.',
  },
  {
    q: 'What format do the research reports come in?',
    a: 'Reports are delivered as PowerPoint or PDF decks with an executive summary, detailed findings, data visualizations, and appendices with raw data. We also walk you through the findings live, so nothing gets lost in translation.',
  },
  {
    q: 'Can research findings be used in investor presentations?',
    a: 'Yes. Our research follows a documented methodology and is sourced and attributed properly, which is exactly what investors want to see. Many clients use our findings directly in pitch decks, information memorandums, and board presentations.',
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

export default function MarketResearchPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ServicePageDashboard
        breadcrumb="Consulting and Growth"
        breadcrumbHref="/consulting-growth"
        label="Market Intelligence"
        title="Market"
        titleHighlight="Research"
        tagline="Decisions made on assumptions cost more than research ever will. We gather real data from your actual target market, so every major business decision is backed by evidence instead of the founder's gut feeling at 2am."
        stats={[
          { number: 'Primary + Secondary', label: 'Research Methods, Combined' },
          { number: 'TAM SAM SOM', label: 'Market Sizing With Credible Sources' },
          { number: 'Confidence-Rated', label: 'Sample Sizes With Reported Margins' },
          { number: 'Decision-Focused', label: 'Reports Built for Action, Not Dumps' },
        ]}
        chartTitle="Market Opportunity Mapping"
        chartBadge="Data-Backed Decisions"
        intro="Good market research answers the questions that keep founders and business leaders up at night. Is there a real market for this? What do customers actually want, versus what we assume they want? How are competitors really performing behind the marketing gloss? We find the answers with real data, not speculation dressed up as strategy."
        introPoints={[
          'Primary research through surveys, interviews, and focus groups with your target audience',
          'Secondary research across industry reports, public data, and competitor intelligence',
          'Market sizing with TAM, SAM, and SOM calculations specific to your geography',
          'Clear reports with findings and recommended next steps, not raw data dumps',
        ]}
        capabilities={[
          {
            icon: 'fa-poll',
            metric: 'Quantitative',
            title: 'Consumer Surveys',
            desc: 'Online and offline surveys targeting your specific demographic profile, with sample sizes large enough to be statistically meaningful and confidence intervals reported.',
          },
          {
            icon: 'fa-users',
            metric: 'Qualitative',
            title: 'Focus Group Research',
            desc: 'Moderated group discussions that explore attitudes, perceptions, and motivations in depth, uncovering the kind of insight a survey alone cannot capture.',
          },
          {
            icon: 'fa-magnifying-glass-chart',
            metric: 'Competitive',
            title: 'Competitor Benchmarking',
            desc: 'A close analysis of what competitors are actually doing, what is working for them, and where they are weak. We help you find the gap you can profitably fill.',
          },
          {
            icon: 'fa-chart-pie',
            metric: 'TAM/SAM/SOM',
            title: 'Market Sizing',
            desc: 'Bottom-up and top-down market size calculations from credible sources, so you know the real opportunity before pitching investors or setting internal targets.',
          },
          {
            icon: 'fa-arrow-trend-up',
            metric: 'Forward-Looking',
            title: 'Trend and Opportunity Analysis',
            desc: 'We spot emerging trends in your category before your competitors do, and identify white spaces and adjacent opportunities worth pursuing.',
          },
          {
            icon: 'fa-file-lines',
            metric: 'Actionable',
            title: 'Research Reports',
            desc: 'Clear, decision-focused reports with executive summaries, key findings, data visualizations, and specific recommendations. No jargon, no filler.',
          },
        ]}
        industries={[
          {
            icon: 'fa-store',
            name: 'FMCG and Consumer Goods',
            useCase: 'Product-market fit research, price sensitivity studies, packaging preference testing, and retail distribution research across geographies.',
            tags: ['Product-Market Fit', 'Price Sensitivity', 'Distribution Research'],
          },
          {
            icon: 'fa-hospital',
            name: 'Healthcare and Pharma',
            useCase: 'Patient needs assessment, physician attitude studies, treatment pathway research, and awareness surveys for new therapies or devices.',
            tags: ['Patient Needs', 'Physician Research', 'Awareness Studies'],
          },
          {
            icon: 'fa-building',
            name: 'Real Estate',
            useCase: 'Location feasibility studies, buyer preference surveys, pricing analysis, and competitive project benchmarking for new developments.',
            tags: ['Feasibility Studies', 'Buyer Preferences', 'Competitive Pricing'],
          },
          {
            icon: 'fa-laptop',
            name: 'Technology and SaaS',
            useCase: 'Willingness-to-pay research, feature prioritization surveys, competitive positioning analysis, and enterprise buyer journey mapping.',
            tags: ['WTP Research', 'Feature Prioritization', 'Buyer Journey'],
          },
          {
            icon: 'fa-graduation-cap',
            name: 'Education',
            useCase: 'Course demand validation, parent and student attitude surveys, fee benchmarking, and competitor curriculum analysis.',
            tags: ['Demand Validation', 'Parent Surveys', 'Fee Benchmarking'],
          },
          {
            icon: 'fa-shirt',
            name: 'Fashion and Retail',
            useCase: 'Consumer preference research, category trend analysis, shopper behavior studies, and new market entry feasibility.',
            tags: ['Consumer Preferences', 'Category Trends', 'Market Entry'],
          },
        ]}
        process={[
          {
            title: 'Scope',
            desc: 'We define research objectives, the key questions to answer, target audience, methodology, and deliverables before any work begins.',
          },
          {
            title: 'Research Design',
            desc: 'We design questionnaires, interview guides, or focus group discussion guides, and establish sample criteria and recruitment approach.',
          },
          {
            title: 'Data Collection',
            desc: 'We execute the surveys, interviews, or secondary research, quality-checking data as it comes in to catch issues early rather than at the end.',
          },
          {
            title: 'Analysis and Report',
            desc: 'We analyze the data, extract the key insights, and produce a report with an executive summary and specific recommendations you can act on.',
          },
        ]}
        faqs={faqs}
        sidebarLinks={[
          { label: 'Startup Consulting', href: '/startup-consulting' },
          { label: 'Growth Planning', href: '/growth-planning' },
          { label: 'AI Marketing Systems', href: '/ai-marketing-systems' },
          { label: 'Business Strategy', href: '/business-strategy' },
        ]}
        ctaTitle="Make Your Next"
        ctaTitleHighlight="Decision with Data"
        ctaDesc="The cost of bad market assumptions far exceeds the cost of good research. Let us gather the real data you need to make decisions with confidence."
      />
    </>
  )
}
