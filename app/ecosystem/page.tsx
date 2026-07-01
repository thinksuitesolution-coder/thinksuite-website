import type { Metadata } from 'next'
import Link from 'next/link'
import EcosystemNav from '@/components/ui/EcosystemNav'

export const metadata: Metadata = {
  title: 'ThinkSuite Ecosystem | ThinkVirtual, WavCart, Visibility & Thinksuite',
  description: 'Explore the ThinkSuite product ecosystem: ThinkVirtual for professional networking, WavCart for local vendor eStores, Visibility for GEO ranking, and Thinksuite for targeted leads.',
  alternates: { canonical: 'https://thinksuite.in/ecosystem' },
}

const products = [
  {
    id: 'thinksuite',
    emoji: '🏢',
    logo: '/assets/img/logos/thinksuite.png',
    name: 'ThinkSuite',
    tagline: 'Full-Service Digital Agency',
    color: '#1a237e',
    accentBg: 'rgba(26,35,126,0.06)',
    border: 'rgba(26,35,126,0.14)',
    status: 'live',
    statusLabel: 'Live',
    href: '/services',
    ctaLabel: 'Explore Services',
    desc: 'ThinkSuite is your all-in-one digital partner, a full-service agency that covers every angle of your business growth. From custom websites and mobile apps to AI automation and performance marketing, we are your single partner for everything digital.',
    capabilities: [
      { icon: 'fa-code', label: 'Software Development', desc: 'Custom websites, apps, SaaS, enterprise software' },
      { icon: 'fa-bullhorn', label: 'Digital Marketing', desc: 'SEO, Google Ads, Meta Ads, social media, content' },
      { icon: 'fa-pen-nib', label: 'Branding & Design', desc: 'Brand identity, UI/UX, graphic design, product design' },
      { icon: 'fa-brain', label: 'AI & Automation', desc: 'Custom AI tools, chatbots, workflow automation' },
      { icon: 'fa-tower-broadcast', label: 'Media & Advertising', desc: 'Outdoor, indoor, influencer, PR campaigns' },
      { icon: 'fa-chart-line', label: 'Consulting & Growth', desc: 'Strategy, startup advisory, market research' },
    ],
    stats: [
      { num: '150+', label: 'Projects Delivered' },
      { num: '15+', label: 'Industries Served' },
      { num: '98%', label: 'Client Satisfaction' },
      { num: '5+', label: 'Years Experience' },
    ],
  },
  {
    id: 'Thinksuite',
    emoji: '🤖',
    logo: '/assets/img/logos/thinksuite.png',
    name: 'Thinksuite',
    tagline: 'Targeted Leads by Occupation & Location',
    color: '#d97706',
    accentBg: 'rgba(217,119,6,0.06)',
    border: 'rgba(217,119,6,0.14)',
    status: 'coming_soon',
    statusLabel: 'Coming Soon',
    href: '/ecosystem/mythinkai',
    ctaLabel: 'Get Your Lead List',
    desc: 'Thinksuite provides hyper-targeted lead lists for businesses. Tell us the occupation, city, and industry of the customers you need, and we deliver a verified, ready-to-use contact list so you can start outreach immediately.',
    capabilities: [
      { icon: 'fa-briefcase', label: 'Occupation-Based Filters', desc: 'Target doctors, lawyers, retailers, and any profession you need' },
      { icon: 'fa-location-dot', label: 'City & Location Targeting', desc: 'Filter by city, district, state, or pincode' },
      { icon: 'fa-address-card', label: 'Verified Contact Data', desc: 'Name, phone, email, and business address, all verified' },
      { icon: 'fa-industry', label: 'Industry Segmentation', desc: 'Narrow down by industry, business size, and revenue' },
      { icon: 'fa-file-csv', label: 'Bulk CSV Export', desc: 'Download your lead list in CSV or Excel format instantly' },
      { icon: 'fa-rotate', label: 'Fresh Daily Data', desc: 'Database updated daily to ensure accuracy' },
    ],
    stats: [
      { num: '10K+', label: 'Leads Available' },
      { num: '50+', label: 'Filter Options' },
      { num: '95%', label: 'Data Accuracy' },
      { num: 'Daily', label: 'Updated' },
    ],
  },
  {
    id: 'thinkvirtual',
    emoji: '🌐',
    logo: '/assets/img/logos/thinkvirtual.png',
    name: 'ThinkVirtual',
    tagline: 'Freelancer & Client Network',
    color: '#0891b2',
    accentBg: 'rgba(8,145,178,0.06)',
    border: 'rgba(8,145,178,0.14)',
    status: 'coming_soon',
    statusLabel: 'Coming Soon',
    href: '/ecosystem/thinkvirtual',
    ctaLabel: 'Join Waitlist',
    desc: 'ThinkVirtual is a professional network where freelancers, clients, and influencers connect to collaborate. Post projects, browse talent, take assignments, and build lasting professional relationships, all in one platform built for India\'s creative and digital economy.',
    capabilities: [
      { icon: 'fa-briefcase', label: 'Post Projects', desc: 'Clients post work, freelancers apply and get hired fast' },
      { icon: 'fa-user-tie', label: 'Freelancer Profiles', desc: 'Showcase your skills, portfolio, and client reviews' },
      { icon: 'fa-star', label: 'Influencer Network', desc: 'Influencers connect with brands for campaigns and collabs' },
      { icon: 'fa-handshake', label: 'Direct Collaboration', desc: 'Clients and talent work together without middlemen' },
      { icon: 'fa-chart-line', label: 'Career Growth', desc: 'Build reputation, gather reviews, and grow your network' },
      { icon: 'fa-globe', label: 'Professional Network', desc: 'LinkedIn-style platform for India\'s gig economy' },
    ],
    stats: [
      { num: '500+', label: 'Freelancers' },
      { num: '200+', label: 'Projects Posted' },
      { num: '50+', label: 'Brands' },
      { num: '4.8★', label: 'Avg Rating' },
    ],
  },
  {
    id: 'visibility',
    emoji: '👁️',
    logo: undefined,
    name: 'Visibility',
    tagline: 'GEO & AI Search Ranking Platform',
    color: '#7c3aed',
    accentBg: 'rgba(124,58,237,0.06)',
    border: 'rgba(124,58,237,0.14)',
    status: 'coming_soon',
    statusLabel: 'Coming Soon',
    href: '/ecosystem/visibility',
    ctaLabel: 'Get a GEO Audit',
    desc: 'Visibility is ThinkSuite\'s GEO (Generative Engine Optimization) platform. When someone asks ChatGPT, Gemini, or Perplexity about businesses in your industry, does your name come up? Visibility makes sure it does, through AI citation strategy, E-E-A-T authority building, and structured data optimization.',
    capabilities: [
      { icon: 'fa-eye', label: 'AI Search Optimization', desc: 'Get cited by ChatGPT, Gemini, and Perplexity when users ask about your industry' },
      { icon: 'fa-shield-halved', label: 'E-E-A-T Authority', desc: 'Build credibility signals that AI models trust and cite' },
      { icon: 'fa-quote-left', label: 'Citation Optimization', desc: 'Structure content so AI engines naturally quote your brand' },
      { icon: 'fa-code', label: 'Structured Data for AI', desc: 'Schema markup optimized for AI crawlers and knowledge graphs' },
      { icon: 'fa-bullhorn', label: 'Brand Mention Strategy', desc: 'Proactive mention building across high-authority publications' },
      { icon: 'fa-chart-line', label: 'AI Answer Monitoring', desc: 'Track when and how AI engines mention your brand in real time' },
    ],
    stats: [
      { num: '3×', label: 'AI Visibility' },
      { num: '120%', label: 'Traffic Increase' },
      { num: '50+', label: 'Brands Ranked' },
      { num: 'GPT+', label: 'Gemini & Perplexity' },
    ],
  },
  {
    id: 'wavcart',
    emoji: '🛒',
    logo: '/assets/img/logos/wavcart.png',
    name: 'WavCart',
    tagline: 'AI-Powered E-Commerce Platform',
    color: '#059669',
    accentBg: 'rgba(5,150,105,0.06)',
    border: 'rgba(5,150,105,0.14)',
    status: 'coming_soon',
    statusLabel: 'Coming Soon',
    href: '/ecosystem/wavcart',
    ctaLabel: 'Join Waitlist',
    desc: 'WavCart is an AI-native e-commerce platform built for modern D2C brands and local vendors. It does not just help you sell, it intelligently manages your listings, automates your marketing, and continuously optimizes for conversions.',
    capabilities: [
      { icon: 'fa-list-check', label: 'Smart Product Listings', desc: 'AI-written titles, descriptions, and SEO tags' },
      { icon: 'fa-bullhorn', label: 'Auto Marketing', desc: 'Campaigns that run and optimize themselves' },
      { icon: 'fa-chart-bar', label: 'Conversion Optimization', desc: 'AI-driven layout and pricing recommendations' },
      { icon: 'fa-boxes-stacked', label: 'Inventory Intelligence', desc: 'Predict demand, prevent stockouts automatically' },
      { icon: 'fa-star', label: 'Review Management', desc: 'AI-powered review responses and reputation monitoring' },
      { icon: 'fa-envelope', label: 'Email & WhatsApp', desc: 'Automated customer journeys across all channels' },
    ],
    stats: [
      { num: '2.5×', label: 'Average Revenue Lift' },
      { num: '60%', label: 'Marketing Automated' },
      { num: '< 24h', label: 'Setup Time' },
      { num: 'D2C', label: 'Optimized For' },
    ],
  },
]

function StatusBadge({ status, label, color }: { status: string; label: string; color: string }) {
  const isLive = status === 'live'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
      color: isLive ? '#059669' : color,
      background: isLive ? 'rgba(5,150,105,0.1)' : `rgba(0,0,0,0.05)`,
      border: `1px solid ${isLive ? 'rgba(5,150,105,0.25)' : `${color}33`}`,
      borderRadius: 6, padding: '4px 12px',
    }}>
      {isLive && (
        <span style={{
          display: 'inline-block', width: 6, height: 6,
          borderRadius: '50%', background: '#059669',
          animation: 'pulse 2s infinite',
        }} />
      )}
      {label}
    </span>
  )
}

export default function EcosystemPage() {
  return (
    <main>

      {/* ── Hero ── */}
      <section
        style={{
          background: 'var(--bg)',
          backgroundImage: 'radial-gradient(circle, rgba(26,35,126,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          padding: '120px 0 80px',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <span className="label" style={{ marginBottom: 24, display: 'inline-block' }}>
            THE THINKSUITE ECOSYSTEM
          </span>
          <h1 style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 900, color: 'var(--white)', marginBottom: 24, lineHeight: 1.1 }}>
            One Brand.{' '}
            <span className="grad-text">Four Powerful Products.</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.8 }}>
            ThinkSuite is more than a digital agency. We are building a full ecosystem of
            products that help businesses build, automate, experience, and sell, all
            powered by cutting-edge AI.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Talk to Our Team <i className="fa-solid fa-arrow-right" />
            </Link>
            <Link href="/services" className="btn btn-outline btn-lg">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── Product Quick Nav ── */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '0' }}>
        <div className="container">
          <EcosystemNav products={products.map(p => ({ id: p.id, emoji: p.emoji, logo: p.logo, name: p.name, color: p.color, accentBg: p.accentBg }))} />
        </div>
      </section>

      {/* ── Product Sections ── */}
      {products.map((p, index) => (
        <section
          key={p.id}
          id={p.id}
          style={{
            padding: '96px 0',
            background: index % 2 === 0 ? 'var(--bg)' : 'var(--bg2)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 64,
                alignItems: 'start',
              }}
            >
              {/* Left, Info */}
              <div style={{ order: index % 2 === 0 ? 0 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 18,
                    background: 'var(--surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: `1px solid ${p.border}`,
                    overflow: 'hidden',
                  }}>
                    {p.logo
                      ? <img src={p.logo} alt={p.name} style={{ width: 46, height: 46, objectFit: 'contain' }} />
                      : <span style={{ fontSize: 32 }}>{p.emoji}</span>
                    }
                  </div>
                  <StatusBadge status={p.status} label={p.statusLabel} color={p.color} />
                </div>

                <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, color: 'var(--white)', marginBottom: 8 }}>
                  {p.name}
                </h2>
                <p style={{ fontSize: 15, fontWeight: 600, color: p.color, marginBottom: 20, letterSpacing: 0.3 }}>
                  {p.tagline}
                </p>
                <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.85, marginBottom: 32 }}>
                  {p.desc}
                </p>

                {/* Stats */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2,
                  borderRadius: 14, overflow: 'hidden',
                  border: `1px solid ${p.border}`,
                  marginBottom: 32,
                }}>
                  {p.stats.map((s) => (
                    <div key={s.label} style={{
                      background: p.accentBg, padding: '16px 12px', textAlign: 'center',
                      borderRight: `1px solid ${p.border}`,
                    }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: p.color, fontFamily: 'var(--font-h)', lineHeight: 1 }}>
                        {s.num}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 4, fontWeight: 600 }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <Link href={p.href} className="btn btn-primary">
                  {p.ctaLabel} <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>

              {/* Right, Capabilities */}
              <div style={{ order: index % 2 === 0 ? 1 : 0 }}>
                <div style={{
                  background: 'var(--surface)',
                  border: `1px solid ${p.border}`,
                  borderRadius: 20,
                  padding: '28px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: p.color, marginBottom: 20, textTransform: 'uppercase' }}>
                    What {p.name} Includes
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {p.capabilities.map((cap) => (
                      <div
                        key={cap.label}
                        style={{
                          padding: '14px 16px',
                          background: p.accentBg,
                          borderRadius: 12,
                          border: `1px solid ${p.border}`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <i className={`fa-solid ${cap.icon}`} style={{ fontSize: 13, color: p.color, width: 16 }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--white)' }}>{cap.label}</span>
                        </div>
                        <p style={{ fontSize: 11.5, color: 'var(--text2)', lineHeight: 1.55, margin: 0 }}>{cap.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Integration CTA ── */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, rgba(26,35,126,0.06), rgba(0,188,212,0.06))',
        borderTop: '1px solid var(--border)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="label" style={{ marginBottom: 20, display: 'inline-block' }}>
            BUILD YOUR STACK
          </span>
          <h2 style={{ marginBottom: 20 }}>
            Use One or Use All,<br />
            <span className="grad-text">We Integrate Everything</span>
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.8 }}>
            Mix and match ThinkSuite ecosystem products to build the perfect digital stack
            for your business. Our team handles the strategy, integration, and support.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Book a Free Strategy Call <i className="fa-solid fa-arrow-right" />
            </Link>
            <Link href="/intelligence" className="btn btn-outline btn-lg">
              Explore AI Intelligence Hub
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}