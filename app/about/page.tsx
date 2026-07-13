import type { Metadata } from 'next'
import Link from 'next/link'
import CTASection from '@/components/sections/CTASection'
import './about.css'

export const metadata: Metadata = {
  title: 'About ThinkSuite | Digital Agency Based in Gurgaon, India',
  description: 'ThinkSuite is a full-service digital agency founded in Gurgaon in 2020, helping businesses grow through web development, marketing, AI automation, and design.',
  keywords: ['about ThinkSuite', 'digital agency Gurgaon', 'full service digital agency India', 'web development agency Gurgaon', 'marketing agency India', 'AI agency Gurgaon', 'ThinkSuite founder story', 'in-house digital agency team India'],
}

// ── HERO ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const stats = [
    { num: '2020', suffix: '',  label: 'Year Founded',       isCounter: false },
    { num: '120',  suffix: '+', label: 'Projects Delivered', isCounter: true  },
    { num: '50',   suffix: '+', label: 'Clients Served',     isCounter: true  },
    { num: '24',   suffix: '',  label: 'Services Offered',   isCounter: true  },
    { num: '4',    suffix: '',  label: 'Products Built',     isCounter: true  },
  ]

  return (
    <section className="ab-hero">
      <div className="ab-hero-inner container">
        <span className="ab-hero-eyebrow reveal">
          <i className="fa-solid fa-bolt" /> AI-First Digital Agency, Gurgaon
        </span>
        <h1 className="ab-hero-h1 reveal">
          We Think.<br />
          We Build.<br />
          <span className="grad-text">We Grow You.</span>
        </h1>
        <p className="ab-hero-sub reveal">
          Founded in 2020, ThinkSuite is a full-service digital partner, websites, marketing,
          AI automation, and digital products, all delivered by one in-house team.
        </p>
        <div className="ab-hero-btns reveal">
          <Link href="/contact" className="btn btn-primary btn-lg">
            <i className="fa-solid fa-calendar-check" /> Get Free Strategy Call
          </Link>
          <Link href="/services" className="btn btn-outline btn-lg">
            Explore Our Services <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
        <div className="ab-stat-strip reveal">
          {stats.map((s) => (
            <div key={s.label} className="ab-stat-item">
              {s.isCounter ? (
                <span
                  className="ab-stat-num counter"
                  data-target={s.num}
                  data-suffix={s.suffix}
                >
                  {s.num}{s.suffix}
                </span>
              ) : (
                <span className="ab-stat-num">{s.num}</span>
              )}
              <span className="ab-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── OUR STORY ────────────────────────────────────────────────────────────────

function StorySection() {
  const milestones = [
    {
      year: '2020',
      title: 'The Beginning',
      desc: 'Started as a 3-person web studio in Gurgaon, building websites for local businesses with a focus on quality over quantity.',
    },
    {
      year: '2021',
      title: 'Marketing & Branding Expanded',
      desc: 'Grew into digital marketing, SEO, and brand identity. First 10 clients onboarded and first key revenue milestone reached.',
    },
    {
      year: '2022',
      title: 'AI Automation Services Launched',
      desc: 'Built our AI practice, chatbots, workflow automation, and custom AI tool integrations for enterprise clients.',
    },
    {
      year: '2023',
      title: 'First In-House Products',
      desc: 'ThinkVirtual (freelancer-client-influencer network) and Thinksuite (personal AI workspace) launched as standalone SaaS products.',
    },
    {
      year: '2024',
      title: 'Ecosystem Complete',
      desc: 'WavCart (AI e-commerce) and the ThinkSuite AI Intelligence Hub went live, 4 products, 6 service verticals, 50+ clients.',
    },
    {
      year: '2025',
      title: 'Scaling Forward',
      desc: '120+ projects delivered, expanding globally, investing in deeper AI capabilities and new product verticals.',
    },
  ]

  const delayClasses = ['reveal-d1', 'reveal-d2', 'reveal-d3', 'reveal-d4', 'reveal-d4', 'reveal-d4']

  return (
    <section className="ab-story">
      <div className="container">
        <div className="ab-story-grid">
          {/* Left: Origin Story */}
          <div>
            <span className="ab-story-eyebrow reveal">
              <i className="fa-solid fa-book-open" /> Our Story
            </span>
            <h2 className="ab-story-h2 reveal">
              From 3 People to a{' '}
              <span className="grad-text">Full Ecosystem</span>
            </h2>
            <p className="ab-story-p reveal">
              We started ThinkSuite in 2020 with a simple observation: growing businesses were
              managing 5 different agencies simultaneously, a web studio, a marketing team,
              a design firm, an AI consultant, and a strategist. Nobody talked to each other.
              The result? Fragmented strategy, duplicated budgets, and zero accountability.
            </p>
            <p className="ab-story-p reveal">
              Our answer was to build one team that handles everything in-house. Developers,
              designers, marketers, AI engineers, and strategists, all fully aligned to one
              goal. Your growth.
            </p>
            <blockquote className="ab-story-quote reveal">
              &ldquo;We don&apos;t just deliver services, we become the digital backbone of your
              business, so you can focus entirely on what you do best.&rdquo;
            </blockquote>
          </div>

          {/* Right: Timeline */}
          <div className="ab-timeline">
            {milestones.map((m, i) => (
              <div key={m.year} className={`ab-tl-item reveal ${delayClasses[i]}`}>
                <div className="ab-tl-dot" />
                <div className="ab-tl-year">{m.year}</div>
                <div className="ab-tl-title">{m.title}</div>
                <div className="ab-tl-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── MISSION + VALUES (dark section) ──────────────────────────────────────────

function ValuesSection() {
  const values = [
    {
      icon: 'fa-bullseye',
      iconBg: 'rgba(79,70,229,0.15)',
      iconColor: '#818cf8',
      title: 'Our Mission',
      body: 'Make digital growth accessible to every business, from early-stage startups to established enterprises, with strategy, technology, and creativity working as one system.',
      points: ['One team for everything digital', 'Measurable outcomes, not vanity metrics', 'AI embedded in every solution'],
    },
    {
      icon: 'fa-eye',
      iconBg: 'rgba(0,188,212,0.15)',
      iconColor: '#00bcd4',
      title: 'Our Vision',
      body: "Build India's first truly full-stack AI-powered digital ecosystem, where businesses don't just get services, they get a permanent partner invested in their growth.",
      points: ['4 in-house products and growing', 'AI-first from day one', 'Global reach, Indian roots'],
    },
    {
      icon: 'fa-code-branch',
      iconBg: 'rgba(217,119,6,0.15)',
      iconColor: '#fbbf24',
      title: 'Our Approach',
      body: 'No black boxes. No vague timelines. We work in sprints, communicate transparently, and give you real-time visibility into every project, because trust is built through honesty.',
      points: ['Agile sprint methodology', 'Real-time project dashboards', 'Full transparency, no surprises'],
    },
  ]

  return (
    <section className="ab-values">
      <div className="container ab-values-inner">
        <div className="reveal">
          <span className="ab-values-eyebrow">
            <i className="fa-solid fa-compass" /> What Drives Us
          </span>
          <h2 className="ab-values-h2">
            Mission, Vision &amp;{' '}
            <span style={{ color: '#00bcd4' }}>Core Values</span>
          </h2>
          <p className="ab-values-sub">
            The principles behind every project, every decision, every client relationship.
          </p>
        </div>
        <div className="ab-values-grid">
          {values.map((v, i) => (
            <div key={v.title} className={`ab-val-card reveal reveal-d${i + 1}`}>
              <div className="ab-val-icon" style={{ background: v.iconBg }}>
                <i className={`fa-solid ${v.icon}`} style={{ color: v.iconColor }} />
              </div>
              <h3 className="ab-val-title">{v.title}</h3>
              <p className="ab-val-body">{v.body}</p>
              <div className="ab-val-points">
                {v.points.map((pt) => (
                  <div key={pt} className="ab-val-point">
                    <i className="fa-solid fa-check ab-val-check" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── BIG NUMBERS ───────────────────────────────────────────────────────────────

function BigNumbersSection() {
  const numbers = [
    { val: '120', suffix: '+', label: 'Projects Delivered' },
    { val: '50',  suffix: '+', label: 'Clients Served'     },
    { val: '24',  suffix: '',  label: 'Services Offered'   },
    { val: '4',   suffix: '',  label: 'Products Built'     },
    { val: '15',  suffix: '+', label: 'Industries Served'  },
  ]

  return (
    <section className="ab-numbers">
      <div className="container">
        <div className="ab-numbers-head reveal">
          <span className="ab-story-eyebrow" style={{ borderColor: 'rgba(79,70,229,0.25)', color: '#4f46e5', background: 'rgba(79,70,229,0.07)' }}>
            <i className="fa-solid fa-chart-bar" /> Results In Numbers
          </span>
          <h2 className="ab-numbers-h2">
            The Proof Is in the <span className="grad-text">Numbers</span>
          </h2>
          <p className="ab-numbers-sub">
            Every project, every client, every sprint, backed by real, measurable results.
          </p>
        </div>
        <div className="ab-numbers-grid reveal">
          {numbers.map((n) => (
            <div key={n.label} className="ab-num-item">
              <span
                className="ab-num-val counter"
                data-target={n.val}
                data-suffix={n.suffix}
              >
                {n.val}{n.suffix}
              </span>
              <span className="ab-num-label">{n.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── WHAT WE DO ────────────────────────────────────────────────────────────────

function ServicePillarsSection() {
  const services = [
    {
      icon: 'fa-code',
      iconBg: 'rgba(79,70,229,0.09)',
      iconColor: '#4f46e5',
      title: 'Web & Software Development',
      desc: 'Custom websites, SaaS platforms, mobile apps, and enterprise software built for performance and scale.',
      href: '/web-development',
    },
    {
      icon: 'fa-chart-line',
      iconBg: 'rgba(8,145,178,0.09)',
      iconColor: '#0891b2',
      title: 'Digital Marketing',
      desc: 'SEO, paid ads, social media, content marketing, and influencer campaigns, all under one roof.',
      href: '/digital-marketing',
    },
    {
      icon: 'fa-brain',
      iconBg: 'rgba(124,58,237,0.09)',
      iconColor: '#7c3aed',
      title: 'AI Automation',
      desc: 'AI chatbots, workflow automation, custom AI tools, and smart systems that eliminate manual work.',
      href: '/ai-automation',
    },
    {
      icon: 'fa-palette',
      iconBg: 'rgba(217,119,6,0.09)',
      iconColor: '#d97706',
      title: 'Branding & Design',
      desc: 'Brand identity, UI/UX design, graphic design, and product design that makes you instantly recognisable.',
      href: '/branding-design',
    },
    {
      icon: 'fa-lightbulb',
      iconBg: 'rgba(5,150,105,0.09)',
      iconColor: '#059669',
      title: 'Business Strategy',
      desc: 'Market research, startup consulting, growth planning, and go-to-market strategy for ambitious businesses.',
      href: '/business-strategy',
    },
    {
      icon: 'fa-bullhorn',
      iconBg: 'rgba(220,38,38,0.09)',
      iconColor: '#dc2626',
      title: 'Media & Advertising',
      desc: 'Outdoor, indoor, PR campaigns, and media buying for brands that want to dominate their market.',
      href: '/media-advertising',
    },
  ]

  const delayMap = ['reveal-d1', 'reveal-d2', 'reveal-d3', 'reveal-d1', 'reveal-d2', 'reveal-d3']

  return (
    <section className="ab-services">
      <div className="container">
        <div className="ab-services-head reveal">
          <span className="sp-badge"><span className="sp-badge-dot">✦</span> WHAT WE DO</span>
          <h2 className="ab-services-h2">
            Six Verticals. <span className="grad-text">One Partner.</span>
          </h2>
          <p className="ab-services-sub">
            From ideation to execution, every digital need covered by specialists working as one team.
          </p>
        </div>
        <div className="ab-svc-grid">
          {services.map((svc, i) => (
            <Link
              key={svc.title}
              href={svc.href}
              className={`ab-svc-card reveal ${delayMap[i]}`}
            >
              <div className="ab-svc-icon-wrap" style={{ background: svc.iconBg }}>
                <i className={`fa-solid ${svc.icon}`} style={{ color: svc.iconColor }} />
              </div>
              <div className="ab-svc-title">{svc.title}</div>
              <p className="ab-svc-desc">{svc.desc}</p>
              <span className="ab-svc-cta">
                Explore <i className="fa-solid fa-arrow-right" style={{ fontSize: 11 }} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── OUR ECOSYSTEM ─────────────────────────────────────────────────────────────

function EcosystemTeaserSection() {
  const products = [
    {
      icon: '🧠',
      logo: '/assets/img/logos/thinksuite.png',
      tag: 'Agency',
      tagBg: 'rgba(79,70,229,0.10)',
      tagColor: '#4f46e5',
      barColor: '#4f46e5',
      cardBg: '#fafafe',
      name: 'ThinkSuite',
      desc: 'The core agency brand, full-service digital solutions across 6 verticals for businesses of all sizes.',
      href: '/services',
      linkLabel: 'Our Services',
      linkColor: '#4f46e5',
    },
    {
      icon: '🤝',
      logo: '/assets/img/logos/thinkvirtual.png',
      tag: 'NETWORK',
      tagBg: 'rgba(8,145,178,0.10)',
      tagColor: '#0891b2',
      barColor: '#0891b2',
      cardBg: '#f7fcff',
      name: 'ThinkVirtual',
      desc: 'Freelancers, clients, and influencers connect to post projects, take work, and collaborate, like LinkedIn for India\'s digital talent.',
      href: '/ecosystem',
      linkLabel: 'Explore Product',
      linkColor: '#0891b2',
    },
    {
      icon: '✨',
      logo: '/assets/img/logos/thinksuite.png',
      tag: 'AI Workspace',
      tagBg: 'rgba(124,58,237,0.10)',
      tagColor: '#7c3aed',
      barColor: '#7c3aed',
      cardBg: '#fdf9ff',
      name: 'Thinksuite',
      desc: 'Personal AI workspace, write content, research markets, automate tasks, with AI trained on your business.',
      href: '/ecosystem',
      linkLabel: 'Explore Product',
      linkColor: '#7c3aed',
    },
    {
      icon: '🛒',
      logo: '/assets/img/logos/wavcart.png',
      tag: 'E-Commerce',
      tagBg: 'rgba(217,119,6,0.10)',
      tagColor: '#d97706',
      barColor: '#d97706',
      cardBg: '#fffbf0',
      name: 'WavCart',
      desc: 'AI-powered e-commerce, smart listings, auto-marketing, conversion optimisation, and inventory intelligence.',
      href: '/ecosystem',
      linkLabel: 'Explore Product',
      linkColor: '#d97706',
    },
  ]

  const delayClasses = ['reveal-d1', 'reveal-d2', 'reveal-d3', 'reveal-d4']

  return (
    <section className="ab-ecosystem">
      <div className="container">
        <div className="ab-ecosystem-head reveal">
          <span className="sp-badge"><span className="sp-badge-dot">◆</span> THE ECOSYSTEM</span>
          <h2 className="ab-ecosystem-h2">
            Beyond Agency ,{' '}
            <span className="grad-text">A Full Ecosystem</span>
          </h2>
          <p className="ab-ecosystem-sub">
            We&apos;ve built 4 in-house products so businesses have tools they own, not just services they rent.
          </p>
        </div>
        <div className="ab-eco-grid">
          {products.map((p, i) => (
            <Link
              key={p.name}
              href={p.href}
              className={`ab-eco-card reveal ${delayClasses[i]}`}
              style={{ background: p.cardBg, '--eco-bar': p.barColor } as React.CSSProperties}
            >
              {p.logo
                ? <img src={p.logo} alt={p.name} className="ab-eco-icon" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                : <span className="ab-eco-icon">{p.icon}</span>
              }
              <span className="ab-eco-tag" style={{ background: p.tagBg, color: p.tagColor }}>
                {p.tag}
              </span>
              <span className="ab-eco-name">{p.name}</span>
              <p className="ab-eco-desc">{p.desc}</p>
              <span className="ab-eco-link" style={{ color: p.linkColor }}>
                {p.linkLabel} <i className="fa-solid fa-arrow-right" style={{ fontSize: 11 }} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── WHY THINKSUITE (existing bento) ──────────────────────────────────────────

function TransparencyMockup() {
  const items = [
    { label: 'Requirement Analysis', done: true,  active: false },
    { label: 'Design Approval',      done: true,  active: false },
    { label: 'Development',          done: false, active: true  },
    { label: 'Testing',              done: false, active: false },
    { label: 'Delivered',            done: true,  active: false },
  ]
  return (
    <svg viewBox="0 0 200 196" fill="none" xmlns="http://www.w3.org/2000/svg" className="sp-mockup">
      <rect x="8" y="8" width="184" height="180" rx="13" fill="white" filter="url(#tr1)"/>
      <text x="26" y="36" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="700" fill="#0f172a">Project Updates</text>
      {items.map((item, i) => (
        <g key={item.label}>
          {item.done ? (
            <>
              <circle cx="28" cy={60 + i * 27} r="9.5" fill="rgba(34,197,94,0.14)"/>
              <text x="28" y={64 + i * 27} textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="9.5" fill="#16a34a">✓</text>
            </>
          ) : item.active ? (
            <circle cx="28" cy={60 + i * 27} r="9.5" fill="none" stroke="#2563eb" strokeWidth="2"/>
          ) : (
            <circle cx="28" cy={60 + i * 27} r="9.5" fill="none" stroke="#e2e8f0" strokeWidth="1.5"/>
          )}
          <text x="46" y={64 + i * 27} fontFamily="system-ui,sans-serif" fontSize="10" fill={item.done ? '#64748b' : item.active ? '#0f172a' : '#94a3b8'}>
            {item.label}
          </text>
        </g>
      ))}
      <defs><filter id="tr1"><feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#000" floodOpacity="0.06"/></filter></defs>
    </svg>
  )
}

interface CardData {
  num: string
  title: string
  desc: string
  numColor: string
  lineColor: string
  cardBg: string
  img?: string
  Mockup?: () => React.ReactElement
}

const whyCards: CardData[] = [
  {
    num: '01', title: 'AI-First Approach',
    desc: 'AI is embedded in our solutions to automate workflows, predict outcomes and drive smarter, faster decisions.',
    numColor: '#7c3aed', lineColor: '#7c3aed', cardBg: '#ede9ff',
    img: '/assets/img/About/AI-First%20Approach.png',
  },
  {
    num: '02', title: 'Full In-House Team',
    desc: 'Developers, designers, marketers and strategists, all working under one roof, fully aligned with your goals.',
    numColor: '#2563eb', lineColor: '#2563eb', cardBg: '#ffffff',
    img: '/assets/img/About/Full%20In-House%20Team.png',
  },
  {
    num: '03', title: 'Guaranteed Measurable Results',
    desc: 'We focus on outcomes. Every project comes with clear KPIs, real-time dashboards and transparent reporting.',
    numColor: '#059669', lineColor: '#059669', cardBg: '#ffffff',
    img: '/assets/img/About/Guaranteed%20Measurable%20Results.png',
  },
  {
    num: '04', title: 'Complete Transparency',
    desc: "No hidden fees, no vague timelines. You're always in the loop with real-time updates and clear communication.",
    numColor: '#0891b2', lineColor: '#0891b2', cardBg: '#ffffff',
    Mockup: TransparencyMockup,
  },
  {
    num: '05', title: 'Agile & Fast Delivery',
    desc: 'We work in sprints, not months. Iterate fast, adapt quickly and deliver high-quality solutions ahead of the curve.',
    numColor: '#d97706', lineColor: '#d97706', cardBg: '#ffffff',
    img: '/assets/img/About/Agile%20%26%20Fast%20Delivery.png',
  },
  {
    num: '06', title: 'True Partnership Model',
    desc: "We don't just work for you, we grow with you. As your long-term partner, your success is our priority.",
    numColor: '#4f46e5', lineColor: '#4f46e5', cardBg: '#ffffff',
    img: '/assets/img/About/True%20Partnership%20Model.png',
  },
]

function BentoCard({ card, style }: { card: CardData; style?: React.CSSProperties }) {
  return (
    <div className="sp-card" style={{ background: card.cardBg, minHeight: 0, ...style }}>
      <span className="sp-card-ghost">{card.num}</span>
      <div className="sp-card-left">
        <span className="sp-card-num" style={{ color: card.numColor }}>{card.num}</span>
        <h3 className="sp-card-title">{card.title}</h3>
        <div className="sp-card-line" style={{ background: card.lineColor }} />
        <p className="sp-card-desc">{card.desc}</p>
      </div>
      <div className="sp-card-right" style={{ padding: '10px 10px 0 0' }}>
        {card.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.img} alt={card.title} style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} />
        ) : card.Mockup ? (
          <card.Mockup />
        ) : null}
      </div>
    </div>
  )
}

function BentoCard01() {
  const card = whyCards[0]
  return (
    <div
      className="sp-card"
      style={{ background: card.cardBg, alignSelf: 'start', gridTemplateColumns: '1fr 1.4fr', minHeight: 0 }}
    >
      <span className="sp-card-ghost">{card.num}</span>
      <div className="sp-card-left">
        <span className="sp-card-num" style={{ color: card.numColor }}>{card.num}</span>
        <h3 className="sp-card-title">{card.title}</h3>
        <div className="sp-card-line" style={{ background: card.lineColor }} />
        <p className="sp-card-desc">{card.desc}</p>
      </div>
      <div className="sp-card-right" style={{ alignItems: 'center', padding: '14px 12px 14px 0' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.img} alt={card.title} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
      </div>
    </div>
  )
}

function WhyThinkSuiteSection() {
  const [, c02, c03, c04, c05, c06] = whyCards
  return (
    <section
      className="sp-section"
      style={{
        background: '#f7f6ff',
        backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.13) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div className="container">
        <div className="sp-hero">
          <span className="sp-badge"><span className="sp-badge-dot">✦</span> WHY THINKSUITE</span>
          <h2 className="sp-hero-title">
            Why Businesses Choose{' '}
            <span>ThinkSuite</span>
          </h2>
          <p className="sp-hero-sub">
            What makes us different is how we think, build and deliver.
            Here&apos;s what sets us apart.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 22 }}>
          <BentoCard01 />
          <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gap: 22 }}>
            <BentoCard card={c02} />
            <BentoCard card={c03} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, marginBottom: 48 }}>
          <BentoCard card={c04} style={{ minHeight: 320 }} />
          <BentoCard card={c05} style={{ minHeight: 320 }} />
          <BentoCard card={c06} style={{ minHeight: 320 }} />
        </div>
      </div>
    </section>
  )
}

// ── TEAM TEASER ───────────────────────────────────────────────────────────────

function TeamTeaserSection() {
  const roles = [
    { icon: 'fa-code',       iconBg: 'rgba(79,70,229,0.09)',  iconColor: '#4f46e5', name: 'Frontend Developers', sub: 'React & Next.js'   },
    { icon: 'fa-server',     iconBg: 'rgba(8,145,178,0.09)',  iconColor: '#0891b2', name: 'Backend Engineers',   sub: 'Node & Python'     },
    { icon: 'fa-palette',    iconBg: 'rgba(217,119,6,0.09)',  iconColor: '#d97706', name: 'UI/UX Designers',     sub: 'Figma & Framer'    },
    { icon: 'fa-brain',      iconBg: 'rgba(124,58,237,0.09)', iconColor: '#7c3aed', name: 'AI Engineers',        sub: 'LLMs & Automation' },
    { icon: 'fa-chart-line', iconBg: 'rgba(5,150,105,0.09)',  iconColor: '#059669', name: 'Growth Marketers',    sub: 'SEO & Paid Ads'    },
    { icon: 'fa-lightbulb',  iconBg: 'rgba(220,38,38,0.09)',  iconColor: '#dc2626', name: 'Strategists',         sub: 'GTM & Consulting'  },
  ]

  const delayMap = ['reveal-d1', 'reveal-d2', 'reveal-d3', 'reveal-d1', 'reveal-d2', 'reveal-d3']

  return (
    <section className="ab-team">
      <div className="container">
        <div className="ab-team-grid">
          <div>
            <span className="ab-team-eyebrow reveal">
              <i className="fa-solid fa-users" /> Our Team
            </span>
            <h2 className="ab-team-h2 reveal">
              A Team Built for <span className="grad-text">Real Results</span>
            </h2>
            <p className="ab-team-sub reveal">
              20+ specialists working under one roof, no outsourcing, no freelancers,
              no communication gaps. Every person on your project is a full-time
              ThinkSuite team member invested in your outcome.
            </p>
            <div className="reveal">
              <Link href="/team" className="btn btn-primary">
                <i className="fa-solid fa-users" /> Meet the Team
              </Link>
            </div>
          </div>

          <div className="ab-roles-grid">
            {roles.map((r, i) => (
              <div key={r.name} className={`ab-role-chip reveal ${delayMap[i]}`}>
                <div className="ab-role-icon" style={{ background: r.iconBg }}>
                  <i className={`fa-solid ${r.icon}`} style={{ color: r.iconColor }} />
                </div>
                <div>
                  <div className="ab-role-name">{r.name}</div>
                  <div className="ab-role-sub">{r.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── INDUSTRIES WE SERVE ───────────────────────────────────────────────────────

const industries = [
  {
    icon: 'fa-cart-shopping', iconBg: '#eff6ff', iconColor: '#2563eb',
    title: 'E-Commerce & Retail',
    desc: 'Shopify & WooCommerce stores, custom storefronts, D2C brands, and performance marketing for online retailers.',
    projects: '25+',
    img: '/assets/img/About/E-Commerce%20%26%20Retail.png',
  },
  {
    icon: 'fa-kit-medical', iconBg: '#f0fdf4', iconColor: '#10b981',
    title: 'Healthcare & Wellness',
    desc: 'Patient portals, appointment systems, telemedicine apps, and compliant healthcare marketing.',
    projects: '12+',
    img: '/assets/img/About/Healthcare%20%26%20Wellness.png',
  },
  {
    icon: 'fa-landmark', iconBg: '#f5f3ff', iconColor: '#7c3aed', imgScale: true,
    title: 'FinTech & BFSI',
    desc: 'Secure fintech platforms, payment gateway integrations, compliance-first UI, and financial services marketing.',
    projects: '8+',
    img: '/assets/img/About/FinTech%20%26%20BFSI.png',
  },
  {
    icon: 'fa-graduation-cap', iconBg: '#fffbeb', iconColor: '#d97706', imgScale: true,
    title: 'EdTech & Education',
    desc: 'LMS platforms, e-learning portals, quiz engines, student apps, and enrollment marketing for institutes.',
    projects: '15+',
    img: '/assets/img/About/EdTech%20%26%20Education.png',
  },
  {
    icon: 'fa-utensils', iconBg: '#fff1f2', iconColor: '#e11d48',
    title: 'Food & Hospitality',
    desc: 'Restaurant apps, food delivery platforms, table booking systems, QR menus, and influencer-driven campaigns.',
    projects: '18+',
    img: '/assets/img/About/Food%20%26%20Hospitality.png',
  },
  {
    icon: 'fa-building', iconBg: '#ecfeff', iconColor: '#0891b2', imgScale: true,
    title: 'Real Estate & PropTech',
    desc: 'Property listing portals, virtual tours, CRM systems, and high-ROI lead generation campaigns for realtors.',
    projects: '20+',
    img: '/assets/img/About/Real%20Estate%20%26%20PropTech.png',
  },
  {
    icon: 'fa-truck', iconBg: '#f0fdf4', iconColor: '#16a34a',
    title: 'Logistics & Supply Chain',
    desc: 'Shipment tracking dashboards, route optimisation tools, warehouse management systems, and automation.',
    projects: '10+',
    img: '/assets/img/About/Logistics%20%26%20Supply%20Chain.png',
  },
  {
    icon: 'fa-shirt', iconBg: '#e2d5f2', iconColor: '#ea580c',
    title: 'Fashion & Lifestyle',
    desc: 'Lookbook websites, influencer campaigns, D2C brand building, visual identity systems, and social commerce.',
    projects: '14+',
    img: '/assets/img/About/Fashion%20%26%20Lifestyle.png',
  },
  {
    icon: 'fa-microchip', iconBg: '#f8fafc', iconColor: '#334155', imgScale: true,
    title: 'Tech Startups & SaaS',
    desc: 'MVP development, SaaS platforms, AI feature integration, investor pitch decks, and growth hacking campaigns.',
    projects: '30+',
    img: '/assets/img/About/Tech%20Startups%20%26%20SaaS.png',
  },
]

function IndustriesSection() {
  return (
    <section
      style={{
        background: '#f7f6ff',
        backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.10) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        padding: '88px 0 72px',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            border: '1px solid rgba(79,70,229,0.3)', borderRadius: 40,
            padding: '6px 18px', fontSize: 12, fontWeight: 700,
            color: '#4f46e5', letterSpacing: '0.08em', marginBottom: 20,
            background: 'rgba(79,70,229,0.06)',
          }}>
            <i className="fa-solid fa-grip" style={{ fontSize: 11 }} /> INDUSTRIES WE SERVE
          </span>
          <h2 style={{
            fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900,
            color: '#0f172a', lineHeight: 1.15, marginBottom: 20,
            fontFamily: 'var(--font-h)',
          }}>
            Expertise Across <span style={{ color: '#4f46e5' }}>Every Sector</span>
          </h2>
          <p style={{ fontSize: 17, color: '#64748b', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            From early-stage startups to established enterprises, we&apos;ve delivered
            digital success across 15+ industries with deep domain knowledge and proven results.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 28 }}>
          {industries.map((ind) => (
            <div key={ind.title} style={{
              background: ind.iconBg,
              borderRadius: 18,
              border: '1px solid #e8e6f0',
              boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              display: 'flex',
              minHeight: 230,
            }}>
              <div style={{ flex: 1, padding: '22px 16px 18px 22px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: ind.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <i className={`fa-solid ${ind.icon}`} style={{ fontSize: 19, color: ind.iconColor }} />
                </div>
                <h3 style={{ fontSize: 15.5, fontWeight: 800, color: '#0f172a', lineHeight: 1.3, fontFamily: 'var(--font-h)', margin: 0 }}>
                  {ind.title}
                </h3>
                <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.65, flex: 1, margin: 0 }}>
                  {ind.desc}
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 11.5, fontWeight: 600, color: '#475569',
                  background: '#f8f7ff', borderRadius: 8, padding: '5px 10px',
                  alignSelf: 'flex-start',
                }}>
                  <i className="fa-solid fa-chart-simple" style={{ color: '#f59e0b', fontSize: 11 }} />
                  {ind.projects} Projects Delivered
                </div>
              </div>
              <div style={{ width: '48%', flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', padding: '10px 10px 0 0' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ind.img}
                  alt={ind.title}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block', transform: ind.imgScale ? 'scale(1.15)' : 'none', transformOrigin: 'bottom center' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

const aboutFaqs = [
  {
    q: 'Who is behind ThinkSuite?',
    a: 'ThinkSuite was founded in 2020 by Aakash Upadhyay and is run today by an in-house team of developers, designers, marketers, AI engineers, and strategists based in Gurgaon. Every project is delivered by full-time ThinkSuite staff, not outsourced freelancers or subcontractors.',
  },
  {
    q: 'When was ThinkSuite founded and where is it based?',
    a: 'ThinkSuite was founded in Gurgaon, India in 2020 as a small web studio and has since grown into a full-stack digital agency and AI product company. Our team and operations remain based in Gurgaon, serving clients across India and beyond.',
  },
  {
    q: 'What makes ThinkSuite different from other digital agencies?',
    a: 'ThinkSuite brings web development, marketing, branding, and AI automation together under one in-house team instead of making you coordinate multiple vendors. That means one point of contact, one shared strategy, and no finger-pointing when something needs to move fast.',
  },
  {
    q: 'Does ThinkSuite only work with large companies?',
    a: 'No, we work with businesses at every stage, from early founders building their first MVP to established companies running large-scale campaigns. We tailor engagement models and pricing to fit the size and budget of the business we are working with.',
  },
  {
    q: 'Does ThinkSuite build its own products, or only client projects?',
    a: 'Both. Alongside client work, ThinkSuite has built its own in-house products including ThinkVirtual, WavCart, and our AI workspace tools. Building our own products keeps our team hands-on with the same technology we recommend to clients.',
  },
]

function AboutFaqSection() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: aboutFaqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 40 }} className="reveal">
          <span className="ab-story-eyebrow">
            <i className="fa-solid fa-circle-question" /> Common Questions
          </span>
          <h2 className="ab-story-h2" style={{ marginTop: 12 }}>
            Frequently Asked <span className="grad-text">Questions</span>
          </h2>
        </div>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {aboutFaqs.map((faq, i) => (
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
        </div>
      </div>
    </section>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <ValuesSection />
      <BigNumbersSection />
      <ServicePillarsSection />
      <EcosystemTeaserSection />
      <WhyThinkSuiteSection />
      <TeamTeaserSection />
      <IndustriesSection />
      <AboutFaqSection />
      <CTASection
        eyebrow="Ready to Work Together?"
        title="Let's Build Something"
        titleHighlight="Extraordinary"
        subtitle="Join 50+ businesses that trust ThinkSuite as their complete digital partner. Your next breakthrough starts with one conversation."
        primaryLabel="Get Free Strategy Call"
        primaryHref="/contact"
        secondaryLabel="Explore All Services"
        secondaryHref="/services"
      />
    </>
  )
}
