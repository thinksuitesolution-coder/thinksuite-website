import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Enterprise AI Intelligence | ThinkSuite',
  description: 'Private AI monitoring, competitor intelligence, and custom reports for enterprise teams. Real-time alerts, white-label reports, and API access.',
};

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: '#64748b',
    features: [
      'Public AI news feed',
      'Basic trend reports',
      'AI Chat (10 queries/day)',
      'Blog access',
      'Community newsletter',
    ],
    cta: 'Get Started Free',
    href: '/blog',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    color: '#2563eb',
    features: [
      'Everything in Free',
      'Daily AI Intelligence Reports',
      'Role-based newsletter editions',
      'Unlimited AI Chat',
      'Startup opportunity alerts',
      'Email notifications',
      'API access (1K calls/month)',
    ],
    cta: 'Start Pro Trial',
    href: '/intelligence/enterprise#contact',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    color: '#7c3aed',
    features: [
      'Everything in Pro',
      'Custom competitor monitoring',
      'Private Slack/Discord alerts',
      'White-label reports (your brand)',
      'Custom keyword monitoring',
      'Dedicated AI analyst reports',
      'Unlimited API access',
      'SSO + team management',
      'SLA + priority support',
    ],
    cta: 'Contact Sales',
    href: 'mailto:info@thinksuite.in?subject=ThinkSuite Enterprise',
    highlight: false,
  },
];

const ENTERPRISE_FEATURES = [
  {
    icon: '🎯',
    title: 'Custom Competitor Monitoring',
    desc: 'Track any company you define, set keywords, companies, and topics to monitor. Get alerts the moment something happens.',
  },
  {
    icon: '📊',
    title: 'Private Intelligence Reports',
    desc: 'AI-generated weekly and monthly reports branded with your company name, ready for board meetings and investor updates.',
  },
  {
    icon: '⚡',
    title: 'Real-Time Alerts',
    desc: 'Instant Slack, Discord, or email alerts when high-importance AI news breaks. Never miss a competitive development.',
  },
  {
    icon: '🔌',
    title: 'REST API Access',
    desc: 'Full API access to our AI news database, trend predictions, and scoring engine. Integrate into your own workflows.',
  },
  {
    icon: '👥',
    title: 'Team Dashboard',
    desc: 'Share insights across your team with role-based access, engineers see technical news, executives see strategic summaries.',
  },
  {
    icon: '🌍',
    title: 'Multi-Language Reports',
    desc: 'Get intelligence reports in Hindi, Spanish, French, Arabic, German, Japanese, and more, for global teams.',
  },
];

const USECASES = [
  {
    role: 'CTO / Engineering',
    icon: '⚙️',
    use: 'Track model releases, open source tools, and technical benchmarks. Know what to build, evaluate, or integrate next.',
  },
  {
    role: 'Founder / CEO',
    icon: '🚀',
    use: 'Monitor competitor moves, funding rounds, and strategic partnerships. Identify white-space opportunities early.',
  },
  {
    role: 'Investor / VC',
    icon: '💰',
    use: 'Track deal flow signals, emerging startups, and sector momentum. Generate weekly AI investment memos automatically.',
  },
  {
    role: 'Product Manager',
    icon: '📱',
    use: 'Stay ahead of what AI-native competitors are shipping. Get feature ideas with business impact scores.',
  },
];

export default function EnterprisePage() {
  return (
    <main>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0533, #2d1b69)' }}>
        <div className="container">
          <div className="chip" style={{ marginBottom: 16 }}>🏢 Enterprise Intelligence</div>
          <h1 className="page-title" style={{ color: '#fff' }}>AI Intelligence for Teams</h1>
          <p className="page-desc" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Private monitoring, custom reports, competitor intelligence, and API access, built for companies that need to stay ahead of AI.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Link href="#pricing" className="btn-primary">View Pricing</Link>
            <a href="mailto:info@thinksuite.in?subject=ThinkSuite Enterprise Demo" className="btn-secondary" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Request Demo</a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-label">Enterprise Features</div>
          <h2 className="section-title">Everything your team needs to track AI</h2>
          <div className="enterprise-features-grid">
            {ENTERPRISE_FEATURES.map(f => (
              <div key={f.title} className="enterprise-feature-card">
                <div className="enterprise-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-label">Built For</div>
          <h2 className="section-title">The right intelligence for your role</h2>
          <div className="enterprise-usecase-grid">
            {USECASES.map(u => (
              <div key={u.role} className="enterprise-usecase-card">
                <div className="enterprise-usecase-icon">{u.icon}</div>
                <h3>{u.role}</h3>
                <p>{u.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section">
        <div className="container">
          <div className="section-label">Pricing</div>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 48 }}>Simple, transparent pricing</h2>
          <div className="pricing-grid">
            {PLANS.map(plan => (
              <div key={plan.name} className={`pricing-card ${plan.highlight ? 'pricing-card-highlight' : ''}`} style={{ '--plan-color': plan.color } as React.CSSProperties}>
                {plan.badge && <div className="pricing-badge" style={{ background: plan.color }}>{plan.badge}</div>}
                <div className="pricing-name" style={{ color: plan.color }}>{plan.name}</div>
                <div className="pricing-price">
                  <span className="pricing-amount">{plan.price}</span>
                  <span className="pricing-period">{plan.period}</span>
                </div>
                <ul className="pricing-features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <span style={{ color: plan.color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href={plan.href} className="pricing-cta" style={{ background: plan.highlight ? plan.color : 'transparent', color: plan.highlight ? '#fff' : plan.color, borderColor: plan.color }}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="section" style={{ background: 'linear-gradient(135deg, #2d1b69, #1a0533)', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: '#fff', marginBottom: 16 }}>Ready to get started?</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 500, margin: '0 auto 32px' }}>
            Start free today, no credit card required. Enterprise teams get a personalized demo and custom setup.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/blog" className="btn-primary">Start Free →</Link>
            <a href="mailto:info@thinksuite.in?subject=ThinkSuite Enterprise" className="btn-secondary" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              Contact Enterprise Sales
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

