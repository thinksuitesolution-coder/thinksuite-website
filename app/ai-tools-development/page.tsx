import ServicePageTerminal from '@/components/pages/ServicePageTerminal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom AI Tools Development India | ThinkSuite',
  description: 'Custom AI tool development including NLP, computer vision, recommendation engines, and predictive analytics. AI solutions built for your specific data and business logic.',
}

export default function AIToolsDevelopmentPage() {
  return (
    <ServicePageTerminal
      breadcrumb="AI and Automation"
      breadcrumbHref="/ai-automation"
      label="Custom AI Solutions"
      title="AI Tools"
      titleHighlight="Development"
      tagline="Off-the-shelf AI tools are designed for everyone, which means they fit no one perfectly. We build AI tools shaped around your specific data, industry rules, and business logic."
      animationType="network"
      stats={[
        { number: 'Custom', label: 'Every Tool Built' },
        { number: 'Python', label: 'Core Stack' },
        { number: 'API-Ready', label: 'Production Grade' },
        { number: '24/7', label: 'Monitoring Included' },
      ]}
      highlights={[
        {
          icon: 'fa-language',
          title: 'NLP and Text AI Tools',
          desc: 'Text classification, sentiment analysis, entity extraction, document summarization. Trained on your industry terminology and specific data.',
        },
        {
          icon: 'fa-eye',
          title: 'Computer Vision Systems',
          desc: 'Defect detection, product recognition, document scanning, face verification, and visual quality control. Real-time processing at production scale.',
        },
        {
          icon: 'fa-thumbs-up',
          title: 'Recommendation Engines',
          desc: 'Product recommendations, content suggestions, and people matching. Personalization algorithms trained on your actual user behavior data.',
        },
        {
          icon: 'fa-chart-line',
          title: 'Predictive Analytics Models',
          desc: 'Churn prediction, demand forecasting, lead scoring, and fraud detection. Make high-stakes decisions based on data patterns, not instinct.',
        },
        {
          icon: 'fa-file-magnifying-glass',
          title: 'Document Intelligence',
          desc: 'AI that reads contracts, invoices, forms, and extracts structured data. Eliminate manual data entry from document-heavy workflows.',
        },
        {
          icon: 'fa-code',
          title: 'Custom AI APIs',
          desc: 'Package your AI model as a production-ready API. Integrate with your app, website, or internal tools via clean, documented endpoints.',
        },
      ]}
      industries={[
        {
          icon: 'fa-stethoscope',
          name: 'Healthcare and Diagnostics',
          useCase: 'AI-assisted diagnosis support, medical image analysis, patient risk scoring, and clinical notes summarization. Tools that save doctors time and improve accuracy.',
          tags: ['Diagnostics', 'Risk Scoring', 'Medical NLP'],
        },
        {
          icon: 'fa-landmark',
          name: 'Finance and Banking',
          useCase: 'Credit scoring models, fraud detection systems, AML transaction monitoring, and document KYC processing. Compliance-ready and explainable.',
          tags: ['Credit Scoring', 'Fraud Detection', 'KYC'],
        },
        {
          icon: 'fa-store',
          name: 'Retail and E-Commerce',
          useCase: 'Product recommendation engines, visual search, demand forecasting, and customer churn prediction. Turn browsing data into measurable revenue.',
          tags: ['Recommendations', 'Visual Search', 'Demand Forecast'],
        },
        {
          icon: 'fa-laptop',
          name: 'EdTech and Online Learning',
          useCase: 'Adaptive content delivery, plagiarism detection, student performance prediction, and automated grading for subjective answers.',
          tags: ['Adaptive Learning', 'Grading', 'Performance Prediction'],
        },
        {
          icon: 'fa-industry',
          name: 'Manufacturing and Quality',
          useCase: 'Computer vision defect detection on production lines, predictive maintenance from sensor data, and automated quality reports.',
          tags: ['Defect Detection', 'Predictive Maintenance', 'QC'],
        },
        {
          icon: 'fa-users',
          name: 'HR Technology',
          useCase: 'Resume screening and ranking, candidate matching, attrition prediction, and employee sentiment analysis from engagement surveys.',
          tags: ['Resume Screening', 'Candidate Matching', 'Attrition'],
        },
      ]}
      process={[
        {
          title: 'Problem Definition',
          desc: 'Understand your specific problem, available data, success metrics, and integration requirements before any model design begins.',
        },
        {
          title: 'Data Strategy',
          desc: 'Assess, clean, and structure your training data. If you lack data, we help build a collection strategy or use transfer learning.',
        },
        {
          title: 'Model Development',
          desc: 'Train, evaluate, and iterate on your custom AI model. Every model is tested against real-world edge cases before deployment.',
        },
        {
          title: 'Deploy and Integrate',
          desc: 'Package the model as an API or embedded tool. Integrate with your existing systems with full documentation and monitoring.',
        },
      ]}
      faqs={[
        {
          q: 'What kind of data do I need to build a custom AI tool?',
          a: 'It depends on the use case. For most classification or prediction tasks, 500 to 5,000 labeled examples are a good starting point. We evaluate your data in our discovery call and tell you honestly what is possible with what you have.',
        },
        {
          q: 'How accurate will the AI model be?',
          a: 'Accuracy depends on data quality and the complexity of the problem. We define target accuracy thresholds in the project spec and do not release a model to production unless it meets them.',
        },
        {
          q: 'Can you integrate the AI tool with our existing software?',
          a: 'Yes. We package every model as a clean API that can be called from your existing app, CRM, ERP, or internal tools. If you have developers, they can integrate it in a day.',
        },
        {
          q: 'Will the model improve over time?',
          a: 'It can, yes. We can set up continuous learning pipelines where the model improves as it processes new data. This is optional but recommended for high-volume use cases.',
        },
        {
          q: 'What tech stack do you use?',
          a: 'We primarily use Python with scikit-learn, TensorFlow, PyTorch, and HuggingFace depending on the task. Models are deployed via FastAPI or as serverless functions on AWS or GCP.',
        },
      ]}
      sidebarLinks={[
        { label: 'Chatbot Solutions', href: '/chatbot-solutions' },
        { label: 'Workflow Automation', href: '/workflow-automation' },
        { label: 'AI Marketing Systems', href: '/ai-marketing-systems' },
        { label: 'Custom Software', href: '/custom-software' },
      ]}
      ctaTitle="Build Your"
      ctaTitleHighlight="Custom AI Tool"
      ctaDesc="Stop forcing generic AI into your specific problem. Let us build an AI tool that works on your data, understands your domain, and integrates with your existing setup."
    />
  )
}
