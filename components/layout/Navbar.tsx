'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const products = [
  {
    label: 'ThinkVirtual',
    href: '/ecosystem/thinkvirtual',
    desc: 'Network connecting & project platform',
    icon: 'fa-diagram-project',
    color: '#0891b2',
    iconBg: 'rgba(8,145,178,0.12)',
  },
  {
    label: 'WavCart',
    href: '/ecosystem/wavcart',
    desc: 'eStore & automation for local vendors',
    icon: 'fa-cart-shopping',
    color: '#059669',
    iconBg: 'rgba(5,150,105,0.12)',
  },
  {
    label: 'Visibility',
    href: '/ecosystem/visibility',
    desc: 'Rank through GEO & AI search',
    icon: 'fa-eye',
    color: '#7c3aed',
    iconBg: 'rgba(124,58,237,0.12)',
  },
  {
    label: 'MyThinkAI',
    href: '/ecosystem/mythinkai',
    desc: 'Targeted leads by occupation & location',
    icon: 'fa-crosshairs',
    color: '#d97706',
    iconBg: 'rgba(217,119,6,0.12)',
  },
]

const services = [
  {
    cat: 'Software Development',
    href: '/software-development',
    links: [
      { label: 'Web Development', href: '/web-development' },
      { label: 'Mobile App Development', href: '/mobile-app-development' },
      { label: 'Custom Software', href: '/custom-software' },
      { label: 'SaaS Products', href: '/saas-products' },
    ],
  },
  {
    cat: 'Digital Marketing',
    href: '/digital-marketing',
    links: [
      { label: 'SEO & GEO Optimization', href: '/seo-optimization' },
      { label: 'Social Media Marketing', href: '/social-media-marketing' },
      { label: 'Google & Meta Ads', href: '/google-meta-ads' },
      { label: 'Content Marketing', href: '/content-marketing' },
    ],
  },
  {
    cat: 'Branding & Design',
    href: '/branding-design',
    links: [
      { label: 'UI/UX Design', href: '/ui-ux-design' },
      { label: 'Brand Identity', href: '/brand-identity' },
      { label: 'Graphic Design', href: '/graphic-design' },
      { label: 'Product Design', href: '/product-design' },
    ],
  },
  {
    cat: 'AI & Automation',
    href: '/ai-automation',
    links: [
      { label: 'AI Tools Development', href: '/ai-tools-development' },
      { label: 'Chatbot Solutions', href: '/chatbot-solutions' },
      { label: 'Workflow Automation', href: '/workflow-automation' },
      { label: 'AI Marketing Systems', href: '/ai-marketing-systems' },
    ],
  },
  {
    cat: 'Media & Advertising',
    href: '/media-advertising',
    links: [
      { label: 'Indoor Advertising', href: '/indoor-advertising' },
      { label: 'Outdoor Advertising', href: '/outdoor-advertising' },
      { label: 'Influencer Marketing', href: '/influencer-marketing' },
      { label: 'PR Campaigns', href: '/pr-campaigns' },
    ],
  },
  {
    cat: 'Consulting & Growth',
    href: '/consulting-growth',
    links: [
      { label: 'Startup Consulting', href: '/startup-consulting' },
      { label: 'Business Strategy', href: '/business-strategy' },
      { label: 'Growth Planning', href: '/growth-planning' },
      { label: 'Market Research', href: '/market-research' },
    ],
  },
]

const mobileLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services', hasChildren: 'services' },
  { label: 'Products', href: '/ecosystem', hasChildren: 'products' },
  { label: 'Projects', href: '/projects' },
  { label: 'AI News', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link href="/" className="logo" onClick={() => setMenuOpen(false)}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.55rem', letterSpacing: '-0.025em', lineHeight: 1 }}>
              <span style={{ color: '#0f172a' }}>Think</span>
              <span style={{ background: 'linear-gradient(135deg, #1a237e 0%, #00bcd4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Suite</span>
            </span>
          </Link>

          <ul className="nav-links">
            <li className="nav-item"><Link href="/" className="nav-link">Home</Link></li>
            <li className="nav-item"><Link href="/about" className="nav-link">About</Link></li>
            <li className="nav-item">
              <Link href="/services" className="nav-link">
                Services <i className="fa-solid fa-chevron-down" style={{ fontSize: 10, marginLeft: 4 }} />
              </Link>
              <div className="mega-dropdown">
                <div style={{ padding: '8px 20px 4px', borderBottom: '1px solid rgba(37,99,235,0.1)', marginBottom: 8 }}>
                  <Link href="/services" className="mega-link" style={{ fontWeight: 700, color: 'var(--cyan)', fontSize: 13 }}>
                    <i className="fa-solid fa-th-large" style={{ marginRight: 7, fontSize: 11 }} />
                    All Services
                  </Link>
                </div>
                <div className="mega-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                  {services.map((col) => (
                    <div key={col.cat}>
                      <Link href={col.href} className="mega-col-title" style={{ display: 'block', textDecoration: 'none' }}>{col.cat}</Link>
                      {col.links.map((l) => (
                        <Link key={l.href} href={l.href} className="mega-link">{l.label}</Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </li>
            <li className="nav-item"><Link href="/blog" className="nav-link">AI News</Link></li>
            <li className="nav-item"><Link href="/projects" className="nav-link">Projects</Link></li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: 'default' }}>
                Products <i className="fa-solid fa-chevron-down" style={{ fontSize: 10, marginLeft: 4 }} />
              </span>
              <div className="mega-dropdown" style={{ width: 460, left: -120 }}>
                <div style={{ paddingBottom: 10, borderBottom: '1px solid rgba(37,99,235,0.1)', marginBottom: 10 }}>
                  <Link href="/ecosystem" className="mega-link" style={{ fontWeight: 700, color: 'var(--cyan)', fontSize: 13 }}>
                    <i className="fa-solid fa-th-large" style={{ marginRight: 7, fontSize: 11 }} />
                    All Products
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {products.map((p) => (
                    <Link key={p.href} href={p.href} className="prod-nav-card">
                      <span className="prod-nav-icon" style={{ background: p.iconBg, color: p.color }}>
                        <i className={`fa-solid ${p.icon}`} />
                      </span>
                      <span>
                        <span className="prod-nav-name">{p.label}</span>
                        <span className="prod-nav-desc">{p.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/contact" className="btn btn-primary btn-sm nav-cta">
              LET&apos;S TALK &rarr;
            </Link>
            <button
              className="hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <i className="fa-solid fa-xmark" />
        </button>
        <Link href="/" style={{ display: 'block', marginBottom: 32 }} onClick={() => setMenuOpen(false)}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.65rem', letterSpacing: '-0.025em', lineHeight: 1 }}>
            <span style={{ color: '#0f172a' }}>Think</span>
            <span style={{ background: 'linear-gradient(135deg, #1a237e 0%, #00bcd4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Suite</span>
          </span>
        </Link>
        {mobileLinks.map((item) =>
          item.hasChildren === 'services' ? (
            <div key={item.label}>
              <div
                className={`mobile-nav-link mobile-toggle${servicesOpen ? ' open' : ''}`}
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services
                <i className="fa-solid fa-plus" />
              </div>
              <div className={`mobile-sub${servicesOpen ? ' open' : ''}`}>
                <div>
                  <Link href="/services" className="mobile-sub-link" style={{ fontWeight: 700, color: 'var(--cyan)' }} onClick={() => setMenuOpen(false)}>
                    All Services →
                  </Link>
                </div>
                {services.map((col) => (
                  <div key={col.cat}>
                    <Link href={col.href} className="mobile-sub-cat" style={{ display: 'block', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>{col.cat}</Link>
                    {col.links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="mobile-sub-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : item.hasChildren === 'products' ? (
            <div key={item.label}>
              <div
                className={`mobile-nav-link mobile-toggle${productsOpen ? ' open' : ''}`}
                onClick={() => setProductsOpen(!productsOpen)}
              >
                Products
                <i className="fa-solid fa-plus" />
              </div>
              <div className={`mobile-sub${productsOpen ? ' open' : ''}`}>
                <div>
                  <Link href="/ecosystem" className="mobile-sub-link" style={{ fontWeight: 700, color: 'var(--cyan)' }} onClick={() => setMenuOpen(false)}>
                    All Products →
                  </Link>
                </div>
                {products.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="mobile-sub-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {p.icon} {p.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          )
        )}
        <div style={{ marginTop: 32 }}>
          <Link href="/contact" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
            Get Started <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    </>
  )
}
