import SectionHeading from '@/components/ui/SectionHeading'

const reasons = [
  {
    icon: 'fa-brain',
    colorClass: 'sc-blue',
    title: 'AI-First Approach',
    desc: 'Every solution we build is infused with artificial intelligence: predictive analytics, automated workflows, and smart personalization. We leverage the latest AI models (GPT-4o, Claude, Gemini) to give your business a genuine competitive advantage.',
  },
  {
    icon: 'fa-users',
    colorClass: 'sc-purple',
    title: 'Full In-House Team',
    desc: 'One team, every skill. Our in-house roster includes full-stack engineers, UI/UX designers, SEO specialists, paid media experts, brand strategists, AI engineers, and business consultants. All aligned on your project, no outsourcing.',
  },
  {
    icon: 'fa-chart-bar',
    colorClass: 'sc-gold',
    title: 'Guaranteed Measurable Results',
    desc: "We focus on outcomes, not just deliverables. Every engagement includes defined KPIs, real-time project dashboards, monthly performance reports, and a clear roadmap toward the goals you are investing for.",
  },
  {
    icon: 'fa-shield-halved',
    colorClass: 'sc-green',
    title: 'Complete Transparency',
    desc: 'No hidden fees, no vague timelines, no ghosting after delivery. You get a dedicated project manager, weekly sprint reviews, a shared project board, and full visibility into every rupee spent and every hour logged.',
  },
  {
    icon: 'fa-rocket',
    colorClass: 'sc-orange',
    title: 'Agile & Fast Delivery',
    desc: 'We ship in sprints, not years. Our agile methodology means you see tangible progress every week. We prototype fast, iterate based on data and feedback, and deploy continuously so you capture market opportunities first.',
  },
  {
    icon: 'fa-handshake',
    colorClass: 'sc-cyan',
    title: 'True Partnership Model',
    desc: "We embed into your team as a long-term digital partner, not just another vendor. Our goal is to build a relationship where you see us as a core part of your growth, not just a one-time hire.",
  },
]

export default function WhyChooseUsSection() {
  return (
    <section className="section section-tinted" id="why-us">
      <div className="container">
        <SectionHeading
          label="Why ThinkSuite"
          title={<>What Makes Us <span className="text-accent">Different</span></>}
          subtitle="Hundreds of digital agencies exist. Here is exactly why growing businesses choose ThinkSuite as their long-term digital partner and keep coming back."
          center
        />
        <div className="grid-3">
          {reasons.map((r, i) => (
            <div key={r.title} className={`process-step reveal reveal-d${(i % 3) + 1}`}>
              <div className="process-icon-wrap">
                <div className={`process-icon ${r.colorClass}`}>
                  <i className={`fa-solid ${r.icon}`} />
                </div>
              </div>
              <h4 className="mt-20 mb-12">{r.title}</h4>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {[
            { icon: 'fa-clock', label: '24-Hour Response', sub: 'On every inquiry' },
            { icon: 'fa-lock', label: 'NDA Protected', sub: 'Your ideas stay yours' },
            { icon: 'fa-rotate-left', label: '30-Day Warranty', sub: 'Post-launch support' },
            { icon: 'fa-indian-rupee-sign', label: 'Fixed Pricing', sub: 'No surprise invoices' },
          ].map((item) => (
            <div key={item.label} style={{ background: 'var(--surface)', padding: '28px 24px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
              <i className={`fa-solid ${item.icon}`} style={{ fontSize: 24, color: 'var(--cyan)', marginBottom: 12, display: 'block' }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
