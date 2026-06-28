import SectionHeading from '@/components/ui/SectionHeading'

const results = [
  {
    tag: 'E-Commerce',
    icon: 'fa-bag-shopping',
    title: 'Sales and Revenue Growth',
    desc: 'We rebuild storefronts, run targeted ad campaigns across Meta and Google, and set up email automation to grow your sales consistently month over month.',
    color: '#2563eb',
  },
  {
    tag: 'SaaS / B2B',
    icon: 'fa-magnifying-glass-chart',
    title: 'Search Visibility and Organic Leads',
    desc: 'Full-stack SEO, technical audits, and content marketing designed to move your target keywords up the rankings and grow qualified organic lead volume over time.',
    color: '#7c3aed',
  },
  {
    tag: 'Healthcare',
    icon: 'fa-robot',
    title: 'AI-Powered Query Handling',
    desc: 'Custom AI chatbots trained on your FAQs and clinical protocols help handle routine patient queries, freeing your team for complex and personal care.',
    color: '#059669',
  },
  {
    tag: 'FinTech',
    icon: 'fa-arrows-up-to-line',
    title: 'UX-Driven Conversion Improvement',
    desc: 'We redesign onboarding flows and key user journeys with A/B testing built in, so every iteration is data-driven and moves your sign-up rate in the right direction.',
    color: '#d97706',
  },
  {
    tag: 'Real Estate',
    icon: 'fa-location-dot',
    title: 'Qualified Buyer Lead Pipelines',
    desc: 'Targeted Meta and Google ad campaigns with CRM integration, built to attract serious buyers and keep your sales pipeline consistently filled with warm prospects.',
    color: '#0891b2',
  },
  {
    tag: 'EdTech',
    icon: 'fa-graduation-cap',
    title: 'Enrollment Growth and Awareness',
    desc: 'We rebuild learning platforms, launch keyword-driven content, and run social campaigns to steadily grow course enrollments and brand recognition over time.',
    color: '#dc2626',
  },
]

export default function ResultsSection() {
  return (
    <section className="section section-tinted" id="results">
      <div className="container">
        <SectionHeading
          label="What We Work Toward"
          title={<>Outcomes We Focus On <span className="text-accent">Across Industries</span></>}
          subtitle="We approach every project with clear goals. Here are the types of outcomes we work toward for businesses across different sectors."
          center
        />
        <div className="grid-3">
          {results.map((r, i) => (
            <div key={r.title} className={`service-card reveal reveal-d${(i % 3) + 1}`} style={{ padding: '32px 28px' }}>
              <span
                className="chip"
                style={{
                  fontSize: 11,
                  background: `${r.color}11`,
                  color: r.color,
                  borderColor: `${r.color}33`,
                  marginBottom: 20,
                  display: 'inline-block',
                }}
              >
                {r.tag}
              </span>
              <div className="service-icon" style={{ background: `${r.color}11`, color: r.color, marginBottom: 18 }}>
                <i className={`fa-solid ${r.icon}`} />
              </div>
              <h4 style={{ marginBottom: 12, fontSize: 17, lineHeight: 1.3 }}>{r.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8, margin: 0 }}>{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 16 }}>
            Every project comes with its own goals and starting point. Book a call and we will map out exactly what is achievable for your business.
          </p>
          <a href="/contact" className="btn btn-primary btn-lg">
            Get Your Custom Growth Plan <i className="fa-solid fa-arrow-right" />
          </a>
        </div>
      </div>
    </section>
  )
}
