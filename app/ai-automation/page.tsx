import ServicePageTerminal from '@/components/pages/ServicePageTerminal'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Automation and Workflow Agency | ThinkSuite',
  description: 'Custom AI tool integration and workflow automation for businesses worldwide. RAG systems, LLM chatbots, and automation that cuts manual work fast, every week.',
  keywords: [
    'AI automation agency Gurgaon',
    'AI automation India',
    'AI tool integration services',
    'workflow automation India',
    'RAG systems for business India',
    'LLM development India',
    'business process automation India',
    'custom AI automation for small business',
    'chatbot development India',
    'AI agency Gurgaon',
    'custom AI solutions India',
    'reduce manual work with AI',
    'AI automation agency',
    'AI agency worldwide',
    'custom AI solutions company',
    'AI workflow automation company',
    'business process automation with AI',
    'AI automation for small business',
    'AI automation consulting',
    'custom AI automation solutions',
  ],
}

const faqData = [
  {
    q: 'What business processes can be automated with AI?',
    a: 'Almost any repetitive, rule-based, or data-intensive task is a candidate. Customer support routing, invoice processing, lead scoring, document parsing, inventory alerts, onboarding workflows, and internal knowledge retrieval are the most common starting points.',
  },
  {
    q: 'How long does an automation deployment take?',
    a: 'Scope determines timeline. A focused single-process automation, like a customer support chatbot, can go live in 2 to 4 weeks. A full enterprise AI integration spanning multiple departments typically takes 6 to 12 weeks from audit to production.',
  },
  {
    q: 'Is AI automation secure for enterprise-sensitive data?',
    a: 'Yes. We implement role-based access controls, encrypted data pipelines, and on-premises or private-cloud LLM options for organisations with strict data residency requirements. Every system is built with security as a first-class requirement, not an afterthought.',
  },
  {
    q: 'What ROI can we realistically expect?',
    a: 'Most clients see a positive return within 3 to 6 months. Savings come from reduced headcount on repetitive tasks, faster processing cycles, and lower error rates. The exact number depends on your process volume and current manual overhead, and we walk through the math with you before you commit.',
  },
  {
    q: 'Do we need in-house technical staff to manage the systems?',
    a: 'No. We build and hand over systems with intuitive dashboards, admin controls, and full documentation. We also offer ongoing managed services for organisations that prefer a fully handled automation environment.',
  },
  {
    q: 'Do you offer AI automation for small businesses, or only large enterprises?',
    a: 'Both. Small businesses typically start with a single high-friction process, like customer support or lead intake, while enterprises usually run multi-department rollouts. Scope and pricing are matched to your size, not a fixed enterprise package.',
  },
  {
    q: 'Do you provide AI automation consulting, or only implementation?',
    a: 'We do both. If you are unsure where to start, our audit phase functions as a standalone consulting engagement that maps your highest-impact automation opportunities, and you can take that roadmap to build with us or hand it to your own team.',
  },
  {
    q: 'How does AI automation actually save businesses money?',
    a: 'Savings come from three places: fewer hours spent on repetitive manual tasks, lower error rates that would otherwise cost money to fix, and faster processing cycles that reduce operational overhead. Most clients see a positive return within 3 to 6 months once these compound.',
  },
  {
    q: 'How do I identify which processes to automate first with AI?',
    a: 'Start with tasks that are high-volume, rule-based, and currently eating the most staff hours, like support ticket triage, invoice processing, or lead routing. Our audit phase maps these systematically so you automate the highest-impact process first instead of guessing.',
  },
  {
    q: 'Is AI automation worth it for a small business?',
    a: 'Yes, if the process you are automating is genuinely repetitive and high-volume. A small business automating one bottleneck, like customer inquiries or order processing, often sees a return faster than an enterprise rolling out automation across many departments at once, simply because the scope is smaller and faster to deploy.',
  },
]

export default function AiAutomationPage() {
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          buildServiceSchema({
            name: 'AI Automation',
            description: 'Custom AI tool integration and workflow automation for businesses worldwide, including RAG systems, LLM chatbots, and automation that cuts manual work every week.',
            url: 'https://thinksuite.in/ai-automation',
            serviceType: 'AI Automation',
            keywords: ['AI automation agency', 'AI workflow automation company', 'business process automation with AI'],
          })
        ),
      }}
    />
    <ServicePageTerminal
      breadcrumb="Services"
      breadcrumbHref="/services"
      label="AI and Automation"
      title="Automate Legacy Friction."
      titleHighlight="Put Operations On Autopilot."
      tagline="Too much manual work slows your team down. We find the bottlenecks in your operations and replace them with custom AI tools and automated systems that keep delivering better results over time."
      animationType="network"
      stats={[
        { number: 'Up to 60%', label: 'Less Manual Overhead' },
        { number: 'Faster', label: 'Processing Speed' },
        { number: '24/7', label: 'Autonomous Operations' },
        { number: 'In-House', label: 'AI Team' },
      ]}
      highlights={[
        { icon: 'fa-book-open', title: 'Intelligent RAG Systems', desc: 'A private knowledge base built from your company data. Your team gets accurate answers instantly without digging through folders or waiting on colleagues.' },
        { icon: 'fa-gears', title: 'Autonomous Backend Microservices', desc: 'Automated data pipelines that handle repetitive background tasks and sync your systems, cutting manual work by up to 60%.' },
        { icon: 'fa-robot', title: 'Custom LLM Toolsets', desc: 'Custom AI tools trained on your business data that assist with customer communication, lead nurturing, and sales workflows while keeping full conversation history.' },
        { icon: 'fa-comments', title: 'Chatbot Solutions', desc: 'Intelligent conversational AI for customer support, lead generation, and internal knowledge management at enterprise scale.' },
        { icon: 'fa-brain', title: 'Machine Learning Models', desc: 'Custom ML models for prediction, classification, recommendation, and real-time anomaly detection across business systems.' },
        { icon: 'fa-database', title: 'Data Pipeline Automation', desc: 'Automated data ingestion, transformation, and reporting for real-time business intelligence and predictive decision support.' },
      ]}
      industries={[
        {
          icon: 'fa-bag-shopping',
          name: 'E-Commerce and D2C',
          useCase: 'AI-powered product recommendations, automated inventory alerts, customer support chatbots, and order tracking bots that handle 80% of queries without human intervention.',
          tags: ['Product Recommendations', 'Support Bot', 'Order Automation'],
        },
        {
          icon: 'fa-hospital',
          name: 'Healthcare',
          useCase: 'Appointment booking bots, patient intake automation, insurance claim processing, and AI triage assistants that reduce front-desk workload by 50%.',
          tags: ['Appointment Bot', 'Claim Processing', 'Patient Intake'],
        },
        {
          icon: 'fa-building',
          name: 'Real Estate',
          useCase: 'Lead qualification chatbots, automated property matching, CRM data sync, and AI follow-up sequences that keep leads warm without manual effort.',
          tags: ['Lead Qualification', 'Property Matching', 'CRM Automation'],
        },
        {
          icon: 'fa-laptop',
          name: 'SaaS and Technology',
          useCase: 'Internal knowledge base RAG systems, AI-powered onboarding flows, automated bug triage, and LLM-based customer success assistants.',
          tags: ['RAG Knowledge Base', 'Onboarding AI', 'Customer Success'],
        },
        {
          icon: 'fa-graduation-cap',
          name: 'Education',
          useCase: 'AI tutors and doubt-solving chatbots, automated admission workflows, student engagement scoring, and personalized learning path generation.',
          tags: ['AI Tutor', 'Admission Automation', 'Learning Paths'],
        },
        {
          icon: 'fa-truck',
          name: 'Logistics and Supply Chain',
          useCase: 'Route optimization models, automated dispatch workflows, real-time freight tracking bots, and predictive maintenance alerts for fleet operations.',
          tags: ['Route Optimization', 'Dispatch Automation', 'Fleet Alerts'],
        },
      ]}
      process={[
        {
          title: 'Audit',
          desc: 'We map every manual workflow and friction point across your operations to identify the highest-impact automation opportunities.',
        },
        {
          title: 'Design',
          desc: 'Our engineers architect a bespoke automation ecosystem, from LLM pipelines to microservice triggers, tailored to your exact business logic.',
        },
        {
          title: 'Deploy',
          desc: 'We build, integrate, and deploy AI systems with zero operational downtime, including rigorous testing against your live data environment.',
        },
        {
          title: 'Optimize',
          desc: 'Post-launch we monitor system performance metrics, retrain models as needed, and continuously expand automation coverage for compounding ROI.',
        },
      ]}
      faqs={faqData}
      sidebarLinks={[
        { label: 'AI Tools Development', href: '/ai-tools-development' },
        { label: 'Chatbot Solutions', href: '/chatbot-solutions' },
        { label: 'Workflow Automation', href: '/workflow-automation' },
        { label: 'AI Marketing Systems', href: '/ai-marketing-systems' },
        { label: 'Software Development', href: '/software-development' },
        { label: 'Digital Marketing', href: '/digital-marketing' },
      ]}
      ctaTitle="Automate and"
      ctaTitleHighlight="Accelerate at Scale"
      ctaDesc="Let AI take over the repetitive work that is slowing your team down. We build automation systems that keep running and improving long after launch."
    />
    </>
  )
}
