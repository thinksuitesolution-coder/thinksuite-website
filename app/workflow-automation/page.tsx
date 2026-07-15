import ServicePageTerminal from '@/components/pages/ServicePageTerminal'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workflow Automation Services Agency | ThinkSuite',
  description: 'Business workflow automation for companies worldwide: CRM automation, invoice processing, marketing automation, and data sync across your existing tools.',
  keywords: [
    'workflow automation agency Gurgaon',
    'workflow automation India',
    'business process automation India',
    'CRM automation India',
    'Zapier Make n8n automation India',
    'marketing automation for small business India',
    'invoice automation India',
    'no-code automation agency India',
    'automate Excel workflows to software',
    'HR onboarding automation India',
    'workflow automation agency',
    'business process automation company',
    'CRM automation services worldwide',
    'no-code automation agency for global businesses',
    'workflow automation services',
    'business workflow automation company',
    'workflow automation consulting',
    'Zapier alternative custom automation',
    'workflow automation for small business',
    'automate repetitive business tasks',
  ],
}

const faqData = [
  {
    q: 'Which tools do you integrate with for workflow automation?',
    a: 'We work with 200+ tools including HubSpot, Zoho CRM, Salesforce, Google Workspace, QuickBooks, Tally, WhatsApp Business, Slack, Notion, Airtable, and most platforms that have an API or webhook support.',
  },
  {
    q: 'Do I need technical staff to maintain the automations?',
    a: 'No. We build automations your team can monitor and manage without developers. We provide full documentation and a training session after launch.',
  },
  {
    q: 'How do you handle errors or failures in automation?',
    a: 'Every automation includes error handling with instant alerts. If something fails, you get notified right away. We also build fallback paths for critical workflows so business does not stop.',
  },
  {
    q: 'What is the typical ROI on workflow automation?',
    a: 'Most clients recover their project cost within 2 to 3 months through time saved and error reduction. A common outcome is 15 to 40 hours saved per week per team, though it depends on how many manual processes you currently run.',
  },
  {
    q: 'Can you automate processes that currently live in Excel sheets?',
    a: 'Yes, absolutely. Moving spreadsheet-based workflows to automated systems is one of the most common projects we handle. We also replace manual reports with live dashboards.',
  },
  {
    q: 'Are you a Zapier alternative for custom automation needs?',
    a: 'We use Zapier, Make, and n8n where they fit, but we are not limited to their pre-built integrations. When a workflow needs custom logic, an obscure API, or conditional branching those platforms cannot handle, we write custom automation code instead, so you are never stuck waiting on a third-party app connector.',
  },
  {
    q: 'Do you build workflow automation for small businesses?',
    a: 'Yes. Small businesses are often where automation has the fastest payback, since a single person is usually doing manual data entry, invoicing, and follow-ups by hand. We scope small projects around one or two high-friction processes rather than requiring a full enterprise rollout.',
  },
  {
    q: 'What tasks should a business automate first?',
    a: 'Start with tasks that are repetitive, rule-based, and happen frequently, like lead assignment, invoice generation, or status update emails. These give the fastest, most measurable time savings and build confidence before automating more complex, judgment-heavy processes.',
  },
  {
    q: 'How much time can workflow automation actually save?',
    a: 'It depends on how much manual work you currently run, but teams typically recover 15 to 40 hours per week once their core processes are automated. The biggest time savings usually come from eliminating manual data entry and status update emails, not from any single flashy feature.',
  },
  {
    q: 'What is the difference between workflow automation and RPA?',
    a: 'Workflow automation connects your existing tools through APIs and webhooks so data flows between them automatically, for example when a new lead in your form triggers a CRM update and a Slack alert. RPA (robotic process automation) instead mimics human clicks on a screen, useful for legacy systems with no API. We default to API-based workflow automation wherever possible since it is faster and far more reliable long-term.',
  },
]

export default function WorkflowAutomationPage() {
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
            name: 'Workflow Automation',
            description: 'Business workflow automation for companies worldwide, including CRM automation, invoice processing, marketing automation, and data sync across your existing tools.',
            url: 'https://thinksuite.in/workflow-automation',
            serviceType: 'Workflow Automation',
            keywords: ['workflow automation services', 'business workflow automation company', 'workflow automation consulting'],
          })
        ),
      }}
    />
    <ServicePageTerminal
      breadcrumb="AI and Automation"
      breadcrumbHref="/ai-automation"
      label="Business Automation"
      title="Workflow"
      titleHighlight="Automation"
      tagline="Every business has repetitive work eating into productive hours. Data entry, follow-up emails, invoice generation, lead distribution. We map your existing processes and automate them end to end."
      animationType="flow"
      capabilitiesHeading={<>What a <span className="grad-text">Business Workflow Automation Company</span> Builds</>}
      processHeading={<>Our <span className="grad-text">Workflow Automation Consulting</span> Process</>}
      stats={[
        { number: 'Hours', label: 'Saved Every Week' },
        { number: '200+', label: 'Tools We Integrate' },
        { number: 'Built-In', label: 'Error Alerts' },
        { number: 'In-House', label: 'Automation Team' },
      ]}
      highlights={[
        {
          icon: 'fa-funnel-dollar',
          title: 'CRM and Sales Automation',
          desc: 'Auto-assign leads, trigger follow-up sequences, update deal stages, and send status notifications, the kind of workflow automation for small business sales teams rely on daily. Your CRM stays accurate without anyone manually updating it.',
        },
        {
          icon: 'fa-file-invoice-dollar',
          title: 'Invoice and Billing Automation',
          desc: 'Generate, send, and track invoices automatically. Payment reminders, overdue alerts, and reconciliation reports without touching spreadsheets.',
        },
        {
          icon: 'fa-envelope-open-text',
          title: 'Marketing Automation',
          desc: 'Email sequences, WhatsApp follow-ups, and drip campaigns triggered by user behavior. Every lead gets nurtured at the right moment without manual effort.',
        },
        {
          icon: 'fa-users-gear',
          title: 'HR and Onboarding Automation',
          desc: 'Welcome emails, document collection, access provisioning, and training reminders. New hires onboard smoothly from day one without HR doing it manually.',
        },
        {
          icon: 'fa-plug',
          title: 'Data Sync Across Tools',
          desc: 'Connect your CRM, accounting software, project management tool, and dashboards using Zapier alternative custom automation where pre-built connectors fall short, so data flows between them without anyone copy-pasting.',
        },
        {
          icon: 'fa-chart-bar',
          title: 'Report and Alert Automation',
          desc: 'Daily sales reports, weekly traffic summaries, inventory alerts. Get the right numbers at the right time without building them manually every time.',
        },
      ]}
      industries={[
        {
          icon: 'fa-briefcase',
          name: 'Agencies and Consultancies',
          useCase: 'Automate client onboarding, project kick-off emails, weekly status reports, and invoice generation. Spend time doing client work, not managing admin.',
          tags: ['Client Onboarding', 'Reports', 'Invoicing'],
        },
        {
          icon: 'fa-bag-shopping',
          name: 'E-Commerce and Retail',
          useCase: 'Order confirmation, shipping updates, return processing, and review requests. Reduce support load and improve customer experience at the same time.',
          tags: ['Order Flow', 'Shipping', 'Reviews'],
        },
        {
          icon: 'fa-building',
          name: 'Real Estate',
          useCase: 'Lead from MagicBricks to CRM in seconds. Auto-assign to agents, trigger WhatsApp follow-up, schedule site visits, and send property brochures.',
          tags: ['Lead Assignment', 'Follow-ups', 'Site Visits'],
        },
        {
          icon: 'fa-hospital',
          name: 'Healthcare and Clinics',
          useCase: 'Appointment confirmations, patient reminders, post-visit follow-ups, billing, and prescription sharing. Cut front desk workload significantly.',
          tags: ['Reminders', 'Billing', 'Patient Records'],
        },
        {
          icon: 'fa-calculator',
          name: 'Finance and Accounting',
          useCase: 'Invoice processing, GST report generation, client document collection, and compliance deadline reminders. Accuracy without manual effort.',
          tags: ['GST Reports', 'Invoices', 'Compliance'],
        },
        {
          icon: 'fa-industry',
          name: 'Manufacturing and Distribution',
          useCase: 'PO creation, inventory reorder triggers, quality check logs, and supplier communication. Keep production flowing without manual coordination.',
          tags: ['Inventory', 'POs', 'Quality Logs'],
        },
      ]}
      process={[
        {
          title: 'Process Audit',
          desc: 'Document your current workflows, identify bottlenecks, manual handoffs, and error-prone steps before recommending any automation.',
        },
        {
          title: 'Automation Blueprint',
          desc: 'Build a detailed map showing exactly what gets triggered, by what event, with what conditions and output.',
        },
        {
          title: 'Build and Integrate',
          desc: 'Connect your tools using APIs, webhooks, or platforms like Make, Zapier, or n8n. Custom scripts where needed.',
        },
        {
          title: 'Test and Hand Over',
          desc: 'Run the automation with real data, validate edge cases, and hand over with full documentation and a live monitoring setup.',
        },
      ]}
      faqs={faqData}
      sidebarLinks={[
        { label: 'Chatbot Solutions', href: '/chatbot-solutions' },
        { label: 'AI Tools Development', href: '/ai-tools-development' },
        { label: 'AI Marketing Systems', href: '/ai-marketing-systems' },
        { label: 'AI and Automation', href: '/ai-automation' },
      ]}
      ctaTitle="Automate Your"
      ctaTitleHighlight="Business Operations"
      ctaDesc="Hours spent on manual tasks add up to weeks lost every quarter. Let us map your processes and automate what does not need human hands."
    />
    </>
  )
}
