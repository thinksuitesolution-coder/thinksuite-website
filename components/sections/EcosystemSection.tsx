import Link from 'next/link'

const products = [
  {
    id: 'visibilityai',
    emoji: '📡',
    logo: null,
    name: 'Visibility AI',
    tagline: 'GEO: Rank in AI Search Engines',
    desc: 'Get your business cited by ChatGPT, Perplexity, Google SGE, and every major AI engine. Generative Engine Optimization that puts your brand in the answer, not just the results.',
    features: ['GEO Strategy', 'AI Search Ranking', 'Brand Citation Audit', 'Content Optimization'],
    cta: 'Coming Soon',
    href: '/ecosystem',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.10), rgba(234,88,12,0.04))',
    border: 'rgba(249,115,22,0.18)',
    badge: 'GEO Product',
    badgeBg: 'rgba(249,115,22,0.10)',
    badgeColor: '#f97316',
  },
  {
    id: 'mythinkai',
    emoji: '🤖',
    logo: '/assets/img/logos/mythinkai.jpeg',
    name: 'MyThinkAI',
    tagline: 'Your Personal AI Workspace',
    desc: 'Write content, conduct research, and automate repetitive tasks with an AI assistant trained and tailored specifically for your business needs.',
    features: ['AI Content Writing', 'Business Research', 'Task Automation', 'Custom AI Training'],
    cta: 'Coming Soon',
    href: '/ecosystem',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(124,58,237,0.03))',
    border: 'rgba(124,58,237,0.15)',
    badge: 'AI Product',
    badgeBg: 'rgba(124,58,237,0.08)',
    badgeColor: '#7c3aed',
  },
  {
    id: 'thinkvirtual',
    emoji: '🌐',
    logo: '/assets/img/logos/thinkvirtual.png',
    name: 'ThinkVirtual',
    tagline: 'Freelancer & Client Network',
    desc: 'Connect freelancers, clients, and influencers, post projects, find talent, and collaborate. A LinkedIn-style professional network built for India\'s digital and creative economy.',
    features: ['Post Projects', 'Find Freelancers', 'Influencer Network', 'Build Your Profile'],
    cta: 'Coming Soon',
    href: '/ecosystem',
    color: '#0891b2',
    gradient: 'linear-gradient(135deg, rgba(8,145,178,0.08), rgba(8,145,178,0.03))',
    border: 'rgba(8,145,178,0.15)',
    badge: 'Talent Network',
    badgeBg: 'rgba(8,145,178,0.08)',
    badgeColor: '#0891b2',
  },
  {
    id: 'wavcart',
    emoji: '🛒',
    logo: '/assets/img/logos/wavcart.png',
    name: 'WavCart',
    tagline: 'AI-Powered E-Commerce Platform',
    desc: 'Launch and grow your online store with AI: smart product listings, automated marketing campaigns, conversion optimization, and inventory intelligence.',
    features: ['Smart Product Listings', 'Auto Marketing', 'Conversion Optimization', 'Inventory AI'],
    cta: 'Coming Soon',
    href: '/ecosystem',
    color: '#059669',
    gradient: 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(5,150,105,0.03))',
    border: 'rgba(5,150,105,0.15)',
    badge: 'Commerce Product',
    badgeBg: 'rgba(5,150,105,0.08)',
    badgeColor: '#059669',
  },
]

export default function EcosystemSection() {
  return (
    <section className="section section-tinted" id="ecosystem">
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="label" style={{ marginBottom: 20, display: 'inline-block' }}>
            THE THINKSUITE ECOSYSTEM
          </span>
          <h2 style={{ marginBottom: 20 }}>
            One Brand.{' '}
            <span className="grad-text">Four Powerful Products.</span>
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 580, margin: '0 auto', lineHeight: 1.8 }}>
            ThinkSuite is more than an agency. We are building the tools that power
            the next generation of businesses. From GEO and AI search ranking to virtual commerce.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid-2" style={{ gap: 24 }}>
          {products.map((p) => (
            <div
              key={p.id}
              className="reveal"
              style={{
                background: p.gradient,
                border: `1px solid ${p.border}`,
                borderRadius: 20,
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'var(--surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  flexShrink: 0, overflow: 'hidden',
                }}>
                  {p.logo
                    ? <img src={p.logo} alt={p.name} style={{ width: 38, height: 38, objectFit: 'contain' }} />
                    : <span style={{ fontSize: 26 }}>{p.emoji}</span>
                  }
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 1,
                  color: p.badgeColor,
                  background: p.badgeBg,
                  border: `1px solid ${p.border}`,
                  borderRadius: 5, padding: '3px 10px',
                }}>
                  {p.badge}
                </span>
              </div>

              {/* Name + tagline */}
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--white)', marginBottom: 6 }}>
                {p.name}
              </h3>
              <p style={{ fontSize: 12, fontWeight: 600, color: p.color, marginBottom: 14, letterSpacing: 0.3 }}>
                {p.tagline}
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: p.border, marginBottom: 16 }} />

              {/* Description */}
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 20, flex: 1 }}>
                {p.desc}
              </p>

              {/* Features */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {p.features.map(f => (
                  <span key={f} style={{
                    fontSize: 11, fontWeight: 600,
                    color: p.color,
                    background: 'var(--surface)',
                    border: `1px solid ${p.border}`,
                    borderRadius: 6, padding: '4px 10px',
                  }}>
                    {f}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={p.href}
                className={p.cta === 'Explore Services' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                style={p.cta !== 'Explore Services' ? { color: p.color, borderColor: p.border } : {}}
              >
                {p.cta} <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}