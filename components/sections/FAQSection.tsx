import SectionHeading from '@/components/ui/SectionHeading'
import Link from 'next/link'

const faqs = [
  {
    q: 'What services does ThinkSuite offer?',
    a: 'ThinkSuite is a full-stack digital agency offering six core service pillars: Software Development (web apps, mobile apps, custom software, SaaS), Digital Marketing (SEO, Google & Meta Ads, social media, content marketing), Branding & Design (brand identity, UI/UX, graphic design, product design), AI & Automation (chatbots, workflow automation, LLM integrations, AI tools), Media & Advertising (indoor/outdoor ads, influencer marketing, PR campaigns), and Consulting & Growth (startup consulting, business strategy, growth planning, market research).',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Project timelines depend on scope and complexity. A landing page or brand identity takes 1,2 weeks. A full website typically takes 3,6 weeks. An MVP or mobile app takes 6,12 weeks. A complex SaaS platform or enterprise system takes 3,6 months. We provide a detailed timeline with milestones during your free discovery call after understanding your specific requirements.',
  },
  {
    q: 'Does ThinkSuite work with startups and small businesses?',
    a: 'Absolutely. We work with everyone from pre-revenue founders building their first MVP to enterprise teams running multi-million-rupee campaigns. For early-stage startups, we offer flexible pricing, phased project scopes, and lean engagement models designed to maximise impact within a limited budget. Many of our most exciting projects started as startup MVPs that we scaled over time.',
  },
  {
    q: 'What is ThinkSuite\'s pricing model?',
    a: 'We offer project-based fixed pricing for one-time deliverables (websites, apps, brand identities), and monthly retainer packages for ongoing services like SEO, social media management, and AI maintenance. All engagements come with a detailed proposal, fixed scope, and no hidden charges. Book a free consultation to get a custom quote tailored to your goals and budget.',
  },
  {
    q: 'Which industries does ThinkSuite specialize in?',
    a: 'We have proven track records across 15+ industries including e-commerce & retail, healthcare & wellness, fintech & BFSI, edtech & education, food & hospitality, real estate & proptech, logistics & supply chain, fashion & lifestyle, and tech startups & SaaS. Our cross-industry experience means we bring tested patterns and best practices from adjacent sectors into every new engagement.',
  },
  {
    q: 'How does ThinkSuite approach SEO and digital marketing?',
    a: 'Our digital marketing strategy is data-first and full-funnel. For SEO, we conduct comprehensive technical audits, keyword research, on-page optimization, content strategy, and white-hat link building. For paid media, we run conversion-optimized campaigns on Google, Meta, and LinkedIn with weekly optimization cycles. Every campaign includes monthly performance reports with transparent KPI tracking. We never use black-hat tactics that risk penalties.',
  },
  {
    q: 'Does ThinkSuite build AI-powered applications?',
    a: 'Yes, AI development is one of our core and fastest-growing service lines. We build custom AI chatbots, RAG (retrieval-augmented generation) systems, LLM-powered tools, document processing automation, recommendation engines, and AI marketing systems. We work with frontier AI providers including OpenAI, Anthropic, and Hugging Face. If you have a business problem that can benefit from AI, we can build the solution.',
  },
  {
    q: 'What happens after a project is delivered?',
    a: 'All delivered projects include a 30-day post-launch warranty period during which we fix any bugs or issues at no additional cost. Beyond that, we offer flexible monthly maintenance retainers, performance monitoring, and ongoing improvement plans. We also offer quarterly strategy reviews for marketing and consulting clients. Our goal is a long-term partnership, not a one-time transaction.',
  },
]

export default function FAQSection() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section className="section section-tinted" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container">
        <SectionHeading
          label="FAQ"
          title={<>Frequently Asked <span className="text-accent">Questions</span></>}
          subtitle="Everything you need to know before partnering with ThinkSuite. Can't find your answer? We're happy to chat."
          center
        />
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: '28px 32px',
                marginBottom: 14,
                boxShadow: 'var(--shadow)',
              }}
            >
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  marginBottom: 12,
                  color: 'var(--white)',
                  lineHeight: 1.45,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <span style={{ color: 'var(--cyan)', fontSize: 13, fontFamily: 'var(--font-m)', marginTop: 2, flexShrink: 0 }}>Q.</span>
                {faq.q}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, margin: 0, paddingLeft: 28 }}>{faq.a}</p>
            </div>
          ))}

          <div className="reveal" style={{ marginTop: 32, textAlign: 'center', padding: '32px', background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 20, boxShadow: 'var(--shadow)' }}>
            <h4 style={{ marginBottom: 8 }}>Still have questions?</h4>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20 }}>
              Our team responds to every inquiry within 24 hours. Book a free discovery call and we&apos;ll answer everything in person.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary">
                Book Free Consultation <i className="fa-solid fa-arrow-right" />
              </Link>
              <Link href="/faq" className="btn btn-outline">
                View Full FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
