import ServicePageTerminal from '@/components/pages/ServicePageTerminal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Chatbot Development India | ThinkSuite',
  description: 'Custom AI chatbot solutions for WhatsApp, websites, and CRM platforms. Customer support bots, lead generation bots, and appointment booking bots built for Indian businesses.',
}

export default function ChatbotSolutionsPage() {
  return (
    <ServicePageTerminal
      breadcrumb="AI and Automation"
      breadcrumbHref="/ai-automation"
      label="Conversational AI"
      title="AI Chatbot"
      titleHighlight="Solutions"
      tagline="Most businesses lose inquiries every night. When your team is offline, customers are asking questions and no one replies. An AI chatbot handles real queries, books appointments, and qualifies leads around the clock."
      animationType="chat"
      stats={[
        { number: 'Tier-1', label: 'Queries Handled' },
        { number: '24/7', label: 'Always Online' },
        { number: 'Real-time', label: 'Response Speed' },
        { number: '6+', label: 'Platforms Supported' },
      ]}
      highlights={[
        {
          icon: 'fa-headset',
          title: 'Customer Support Bot',
          desc: 'Handle tier-1 support tickets automatically. FAQs, order status, refund requests, and policy queries resolved without any human involvement.',
        },
        {
          icon: 'fa-comment-dots',
          title: 'WhatsApp Business Bot',
          desc: 'Deploy AI on WhatsApp Business API. Your customers are already there. Make it the fastest way to reach your business.',
        },
        {
          icon: 'fa-user-check',
          title: 'Lead Qualification Bot',
          desc: 'Capture, qualify, and score leads through conversation. Ask the right questions and book sales meetings automatically while you sleep.',
        },
        {
          icon: 'fa-calendar-check',
          title: 'Appointment Booking Bot',
          desc: 'Let customers schedule themselves. The bot checks your calendar, books available slots, sends confirmations, and follows up with reminders.',
        },
        {
          icon: 'fa-cart-shopping',
          title: 'E-Commerce Shopping Assistant',
          desc: 'Help customers find products, check availability, track orders, and process returns. Reduce support volume while improving satisfaction.',
        },
        {
          icon: 'fa-building-user',
          title: 'Internal HR Helpdesk Bot',
          desc: 'Answer leave policy questions, payslip queries, and onboarding FAQs for your employees. Frees your HR team from repetitive requests.',
        },
      ]}
      industries={[
        {
          icon: 'fa-building',
          name: 'Real Estate',
          useCase: 'Capture property inquiries from listing portals at 2 AM. Qualify buyer budgets, schedule site visits, and send brochures automatically. Never miss a hot lead again.',
          tags: ['Lead Capture', 'Site Visits', 'Brochures'],
        },
        {
          icon: 'fa-hospital',
          name: 'Healthcare and Clinics',
          useCase: 'Book appointments, share clinic timing, answer medication FAQs, and send post-consultation follow-ups. All without staff being on call.',
          tags: ['Appointments', 'Patient FAQ', 'Follow-ups'],
        },
        {
          icon: 'fa-graduation-cap',
          name: 'Education',
          useCase: 'Answer admission queries, share fee structures, and guide applicants through enrollment. Handle peak season inquiry volume without hiring extra staff.',
          tags: ['Admissions', 'Fee Queries', 'Counseling'],
        },
        {
          icon: 'fa-bag-shopping',
          name: 'E-Commerce and Retail',
          useCase: 'Order tracking, return initiation, product recommendations, and COD confirmation. Keep customers informed without increasing support headcount.',
          tags: ['Order Tracking', 'Returns', 'Recommendations'],
        },
        {
          icon: 'fa-landmark',
          name: 'Finance and BFSI',
          useCase: 'Loan eligibility checks, EMI calculators, policy FAQs, and KYC guidance. Compliant, scripted responses available around the clock.',
          tags: ['Loan Queries', 'Policy FAQ', 'KYC'],
        },
        {
          icon: 'fa-hotel',
          name: 'Hospitality',
          useCase: 'Room availability, restaurant reservations, local recommendations, and checkout requests. Five-star responsiveness, fully automated.',
          tags: ['Reservations', 'Room Info', 'Concierge'],
        },
      ]}
      process={[
        {
          title: 'Audit',
          desc: 'Map your most common customer queries, support tickets, and inquiry types to define exactly what the bot needs to handle first.',
        },
        {
          title: 'Design',
          desc: 'Build conversation flows, fallback paths, tone guidelines, and multi-language scripts aligned to your brand voice.',
        },
        {
          title: 'Build and Train',
          desc: 'Develop the bot on your target platforms and train it on your actual product, service, and policy data.',
        },
        {
          title: 'Launch and Improve',
          desc: 'Go live, monitor conversation quality weekly, and continuously improve accuracy based on real interactions.',
        },
      ]}
      faqs={[
        {
          q: 'How long does it take to build a chatbot?',
          a: 'A basic FAQ bot on your website can go live in 5 to 7 days. A full multi-platform bot with lead qualification, CRM integration, and custom flows typically takes 3 to 6 weeks depending on scope.',
        },
        {
          q: 'Can the bot handle Hindi and regional languages?',
          a: 'Yes. We build bots that handle Hindi, English, and regional languages like Tamil, Telugu, Marathi, and Bengali. Language can be set based on user preference or auto-detected from the message.',
        },
        {
          q: 'Which platforms do you deploy chatbots on?',
          a: 'We deploy on websites (chat widget), WhatsApp Business API, Telegram, Facebook Messenger, Instagram DMs, and integrate with HubSpot, Salesforce, Zoho, or your custom CRM.',
        },
        {
          q: 'What happens when a customer asks something the bot cannot answer?',
          a: 'Every bot includes a graceful handoff mechanism. When a query is outside scope, the bot collects contact details and escalates to your human team with full conversation context included.',
        },
        {
          q: 'Is my business and customer data safe?',
          a: 'All conversations are encrypted in transit and at rest. We do not use your customer data to train any shared AI models. We follow GDPR-aligned practices and can sign data processing agreements on request.',
        },
      ]}
      sidebarLinks={[
        { label: 'Workflow Automation', href: '/workflow-automation' },
        { label: 'AI Tools Development', href: '/ai-tools-development' },
        { label: 'AI Marketing Systems', href: '/ai-marketing-systems' },
        { label: 'AI and Automation', href: '/ai-automation' },
      ]}
      ctaTitle="Deploy Your"
      ctaTitleHighlight="AI Chatbot"
      ctaDesc="Your team should not spend hours answering the same 20 questions every day. Let a trained AI chatbot handle them so your people can focus on work that actually needs human judgment."
    />
  )
}
