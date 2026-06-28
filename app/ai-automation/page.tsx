import ServicePageTerminal from '@/components/pages/ServicePageTerminal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Tool Integration and Automation Services | ThinkSuite',
  description: 'Custom AI tool integration and workflow automation for businesses in India. RAG systems, LLM-powered chatbots, and intelligent automation that reduces manual work.',
}

export default function AiAutomationPage() {
  return (
    <ServicePageTerminal
      breadcrumb="Services"
      breadcrumbHref="/services"
      label="AI and Automation"
      title="Automate Legacy Friction."
      titleHighlight="Put Operations On Autopilot."
      tagline="Manual overhead slows market expansion. We identify core operational friction points and replace them with custom AI integrations and autonomous systems that compound results month after month."
      animationType="network"
      stats={[
        { number: '60%', label: 'Reduction in Manual Overhead' },
        { number: '3x', label: 'Faster Processing Speed' },
        { number: '24/7', label: 'Autonomous Operations' },
        { number: '90%', label: 'Task Accuracy Rate' },
      ]}
      highlights={[
        { icon: 'fa-book-open', title: 'Intelligent RAG Systems', desc: 'Secure internal knowledge repositories that query company data instantly, resulting in zero-latency information access for your team.' },
        { icon: 'fa-gears', title: 'Autonomous Backend Microservices', desc: 'Automated processing pipelines designed to sync background data arrays, delivering a 60% reduction in manual overhead.' },
        { icon: 'fa-robot', title: 'Custom LLM Toolsets', desc: 'Self-learning enterprise AI tools that manage user acquisition funnels with high-fidelity context retention across sessions.' },
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
      faqs={[
        {
          q: 'What business processes can be automated with AI?',
          a: 'Almost any repetitive, rule-based, or data-intensive task is a candidate, customer support routing, invoice processing, lead scoring, document parsing, inventory alerts, onboarding workflows, and internal knowledge retrieval are the most common starting points.',
        },
        {
          q: 'How long does an automation deployment take?',
          a: 'Scope determines timeline. A focused single-process automation (e.g., a customer support chatbot) can go live in 2,4 weeks. A full enterprise AI integration spanning multiple departments typically takes 6,12 weeks from audit to production.',
        },
        {
          q: 'Is AI automation secure for enterprise-sensitive data?',
          a: 'Yes. We implement role-based access controls, encrypted data pipelines, and on-premises or private-cloud LLM options for organisations with strict data residency requirements. Every system is built with SOC 2-aligned security practices.',
        },
        {
          q: 'What ROI can we realistically expect?',
          a: 'Most clients see a positive ROI within 3,6 months. Savings come from reduced headcount on repetitive tasks, faster processing cycles, and lower error rates. Average documented savings across our deployments sit at 30,60% of the automated process cost.',
        },
        {
          q: 'Do we need in-house technical staff to manage the systems?',
          a: 'No. We build and hand over systems with intuitive dashboards, admin controls, and full documentation. We also offer ongoing managed services for organisations that prefer a fully handled automation environment.',
        },
      ]}
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
      ctaDesc="Let AI eliminate the friction points holding your business back. Our automation engineering cells deploy high-velocity systems that compound results month over month."
    />
  )
}
