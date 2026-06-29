import ServicePageDashboard from '@/components/pages/ServicePageDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Market Research Services India | ThinkSuite',
  description: 'Primary and secondary market research for Indian businesses. Consumer surveys, competitor analysis, market sizing, focus groups, and trend research for strategic decisions.',
  keywords: ['market research India', 'consumer research India', 'competitor analysis India', 'market sizing India', 'focus group research', 'survey research India', 'business research Gurgaon', 'market intelligence India'],
}

export default function MarketResearchPage() {
  return (
    <ServicePageDashboard
      breadcrumb="Consulting and Growth"
      breadcrumbHref="/consulting-growth"
      label="Market Intelligence"
      title="Market"
      titleHighlight="Research"
      tagline="Decisions made on assumptions cost more than research. We gather real data from your actual target market so every major business decision is backed by evidence, not guesswork."
      stats={[
        { number: '60+', label: 'Research Projects Completed' },
        { number: '15+', label: 'Industry Sectors' },
        { number: '10k+', label: 'Survey Respondents Reached' },
        { number: '2-4wk', label: 'Average Delivery Time' },
      ]}
      chartTitle="Market Opportunity Mapping"
      chartBadge="Data-Backed Decisions"
      intro="Good market research answers the questions that keep founders and business leaders awake at night. Is there a real market for this? What do customers actually want? How are competitors really performing? We find the answers with real data, not speculation."
      introPoints={[
        'Primary research through surveys, interviews, and focus groups with your target audience',
        'Secondary research across industry reports, public data, and competitor intelligence',
        'Market sizing with TAM, SAM, and SOM calculations specific to your geography',
        'Actionable reports with clear findings and recommended next steps, not data dumps',
      ]}
      capabilities={[
        {
          icon: 'fa-poll',
          metric: '10k+',
          title: 'Consumer Surveys',
          desc: 'Online and offline surveys targeting your specific demographic profile. Sample sizes large enough to be statistically significant with confidence intervals reported.',
        },
        {
          icon: 'fa-users',
          metric: 'Qualitative',
          title: 'Focus Group Research',
          desc: 'Moderated group discussions to explore attitudes, perceptions, and motivations in depth. Uncover insights that surveys cannot capture.',
        },
        {
          icon: 'fa-magnifying-glass-chart',
          metric: 'Competitive',
          title: 'Competitor Benchmarking',
          desc: 'Deep analysis of what competitors are doing, what is working for them, and where they are weak. Identify gaps you can profitably fill.',
        },
        {
          icon: 'fa-chart-pie',
          metric: 'TAM/SAM/SOM',
          title: 'Market Sizing',
          desc: 'Bottom-up and top-down market size calculations with credible sources. Know the real opportunity before pitching investors or setting targets.',
        },
        {
          icon: 'fa-arrow-trend-up',
          metric: 'Forward',
          title: 'Trend and Opportunity Analysis',
          desc: 'Identify emerging trends in your category before competitors do. Spot white spaces and adjacent opportunities for growth.',
        },
        {
          icon: 'fa-file-lines',
          metric: 'Actionable',
          title: 'Research Reports',
          desc: 'Clear, decision-focused reports with executive summaries, key findings, data visualizations, and specific recommendations. No jargon.',
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
          desc: 'Define research objectives, key questions to answer, target audience, methodology, and deliverables before any work begins.',
        },
        {
          title: 'Research Design',
          desc: 'Design questionnaires, interview guides, or focus group discussion guides. Establish sample criteria and recruitment approach.',
        },
        {
          title: 'Data Collection',
          desc: 'Execute surveys, interviews, or secondary research. Quality-check data during collection to catch issues early.',
        },
        {
          title: 'Analysis and Report',
          desc: 'Analyze data, extract key insights, and produce an actionable report with executive summary and specific recommendations.',
        },
      ]}
      faqs={[
        {
          q: 'How long does market research take?',
          a: 'A consumer survey project typically takes 2 to 4 weeks from design to report. Qualitative research with focus groups takes 3 to 5 weeks. Comprehensive research combining primary and secondary methods can take 5 to 8 weeks.',
        },
        {
          q: 'How do you ensure the sample represents our target audience?',
          a: 'We define precise screening criteria before recruitment. We use verified panel providers for surveys and targeted recruitment for qualitative research. Sample composition is reported alongside every finding.',
        },
        {
          q: 'Can you research markets outside India?',
          a: 'Yes. We conduct research in Southeast Asia, the Middle East, and other markets where Indian businesses are expanding. Methodology adapts to local research infrastructure.',
        },
        {
          q: 'What format do the research reports come in?',
          a: 'Reports are delivered as interactive PowerPoint or PDF decks with executive summary, detailed findings, data visualizations, and appendices with raw data. We also present findings in a live walkthrough session.',
        },
        {
          q: 'Can research findings be used as primary data in investor presentations?',
          a: 'Yes. Our research follows standard methodology and is sourced and attributed properly. Many clients use our findings in pitch decks, IM documents, and investor presentations.',
        },
      ]}
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
  )
}
