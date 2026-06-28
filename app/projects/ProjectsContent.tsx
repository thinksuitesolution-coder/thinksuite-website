'use client'
import { useState, useEffect } from 'react'
import './projects.css'

const CATS = ['All', 'Website', 'Social Media', 'Branding']

interface SocialHandle {
  platform: string
  url: string
  icon: string
  color: string
}

interface Project {
  id: string
  cat: string[]
  title: string
  industry: string
  industryIcon: string
  tagline: string
  desc: string
  services: string[]
  tech?: string[]
  colors?: { hex: string; name: string }[]
  animations?: string[]
  metrics?: { val: string; key: string }[]
  liveUrl?: string
  socialHandles?: SocialHandle[]
  coverGradient: string
  coverIcon: string
}

const projects: Project[] = [
  {
    id: 'laghima-jewelry',
    cat: ['Website', 'Social Media', 'Branding'],
    title: 'Laghima Jewelry',
    industry: 'Jewelry & Accessories',
    industryIcon: 'fa-gem',
    tagline: 'Premium gold and silver rings and bracelets, from brand identity to full digital presence.',
    desc: 'Complete brand presence built for Laghima Jewelry, a luxury jewelry brand specializing in handcrafted gold and silver rings and bracelets. We developed the full brand identity including logo, typography, and color palette, then designed and built an elegant catalog website, and grew their Instagram presence with premium curated content.',
    services: [
      'Brand Identity & Logo Design',
      'Website Design & Development',
      'Social Media Management',
      'Content Creation & Photography Direction',
      'Instagram Growth Strategy',
    ],
    tech: ['Next.js', 'Tailwind CSS', 'Figma'],
    colors: [
      { hex: '#C9A84C', name: 'Gold' },
      { hex: '#1A1A1A', name: 'Onyx' },
      { hex: '#F5F0E8', name: 'Ivory' },
      { hex: '#8B6914', name: 'Burnished Gold' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    animations: [
      'Fade-in on scroll for all product sections',
      'Hover zoom on jewelry product cards',
      'Gold shimmer text effect on brand name',
      'Smooth page transition animations',
    ],
    metrics: [
      { val: '3x', key: 'Instagram Growth' },
      { val: '5K+', key: 'Followers' },
      { val: '40%', key: 'Engagement Rate' },
    ],
    liveUrl: '#',
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
    ],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #1a237e 100%)',
    coverIcon: 'fa-gem',
  },
  {
    id: 'aklr-foundation',
    cat: ['Website', 'Social Media'],
    title: 'AKLR Foundation',
    industry: 'NGO & Event Services',
    industryIcon: 'fa-leaf',
    tagline: 'Nature conservation NGO and premium furniture rental for corporate events and weddings.',
    desc: 'AKLR Foundation operates on two fronts: environmental conservation work focused on air, water, and earth wellness, and a premium furniture rental service for corporate events, SPX setups, and weddings. We built a dual-purpose website that clearly presents both verticals and manages their growing social media community.',
    services: [
      'Website Design & Development',
      'Social Media Management',
      'Content Strategy & Creation',
      'Brand Positioning',
      'Event Inquiry System Integration',
    ],
    tech: ['WordPress', 'PHP', 'Figma', 'HTML/CSS'],
    colors: [
      { hex: '#2D5016', name: 'Forest Green' },
      { hex: '#6B8F3A', name: 'Leaf Green' },
      { hex: '#F4F1E8', name: 'Natural Cream' },
      { hex: '#8B7355', name: 'Earth Brown' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    animations: [
      'Nature-inspired parallax scroll',
      'Leaf floating particle effect',
      'Section fade-in on scroll',
      'Hover lift on service cards',
    ],
    metrics: [
      { val: '2K+', key: 'Social Followers' },
      { val: '85%', key: 'Web Inquiries' },
      { val: '12+', key: 'Events Supported' },
    ],
    liveUrl: '#',
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
      { platform: 'Facebook', url: '#', icon: 'fa-facebook', color: '#1877f2' },
    ],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #071c28 50%, #005f6b 100%)',
    coverIcon: 'fa-leaf',
  },
  {
    id: 'bliss-foundation',
    cat: ['Website'],
    title: 'Bliss Foundation',
    industry: 'Healthcare & Wellness',
    industryIcon: 'fa-user-doctor',
    tagline: 'Clean, trust-building static website for a doctor-led healthcare initiative.',
    desc: 'Designed and developed a professional static website for Bliss Foundation, a doctor-led healthcare and wellness initiative. The site presents the doctor\'s credentials, specializations, consultation process, and contact details with a calm, trustworthy aesthetic that patients immediately connect with.',
    services: [
      'Website Design',
      'Static Website Development',
      'On-page SEO Setup',
      'Content Writing',
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Figma'],
    colors: [
      { hex: '#1565C0', name: 'Medical Blue' },
      { hex: '#FFFFFF', name: 'White' },
      { hex: '#E3F2FD', name: 'Sky Blue' },
      { hex: '#0D47A1', name: 'Deep Blue' },
      { hex: '#F5F5F5', name: 'Light Grey' },
    ],
    animations: [
      'Smooth scroll behavior',
      'Counter animations on stat numbers',
      'Fade-in on section scroll',
      'Subtle button hover effects',
    ],
    metrics: [
      { val: '<1s', key: 'Page Load Time' },
      { val: 'A+', key: 'Performance Score' },
      { val: '100%', key: 'Mobile Responsive' },
    ],
    liveUrl: '#',
    socialHandles: [],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0d2040 50%, #0d47a1 100%)',
    coverIcon: 'fa-user-doctor',
  },
  {
    id: 'thinkvirtual',
    cat: ['Social Media'],
    title: 'ThinkVirtual',
    industry: 'Technology & Digital',
    industryIcon: 'fa-vr-cardboard',
    tagline: 'Social media identity and community built from scratch for a digital-first brand.',
    desc: 'Built and managed the complete social media presence for ThinkVirtual, setting up the account identity, defining a consistent brand voice, creating a content calendar, and growing an engaged audience through creative, platform-optimized content.',
    services: [
      'Social Media Account Setup',
      'Brand Voice & Tone Definition',
      'Content Creation',
      'Content Calendar Management',
      'Community Management',
    ],
    colors: [
      { hex: '#7C3AED', name: 'Electric Violet' },
      { hex: '#1E1B4B', name: 'Deep Indigo' },
      { hex: '#A78BFA', name: 'Lavender' },
      { hex: '#4C1D95', name: 'Dark Violet' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    metrics: [
      { val: '3.5K+', key: 'Followers' },
      { val: '6.8%', key: 'Engagement Rate' },
      { val: '60+', key: 'Posts Created' },
    ],
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
    ],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0f0d2e 50%, #312e81 100%)',
    coverIcon: 'fa-vr-cardboard',
  },
  {
    id: 'wavcart',
    cat: ['Social Media'],
    title: 'WavCart',
    industry: 'E-Commerce',
    industryIcon: 'fa-cart-shopping',
    tagline: 'Social media growth and conversion-focused content for an emerging e-commerce brand.',
    desc: 'Managed end-to-end social media for WavCart, including platform setup, content strategy, creative production, and audience building. Helped position WavCart as a trusted shopping platform through engaging, conversion-driven posts and consistent brand storytelling.',
    services: [
      'Social Media Management',
      'Content Creation & Design',
      'Meta Ads Strategy',
      'Reels & Video Production',
      'Audience Growth',
    ],
    colors: [
      { hex: '#00BCD4', name: 'Cyan' },
      { hex: '#0A1628', name: 'Deep Navy' },
      { hex: '#E0F7FA', name: 'Light Cyan' },
      { hex: '#006064', name: 'Teal Dark' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    metrics: [
      { val: '8K+', key: 'Followers Gained' },
      { val: '4.2%', key: 'Engagement Rate' },
      { val: '2x', key: 'Reach Growth' },
    ],
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
    ],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #071e28 50%, #006e7f 100%)',
    coverIcon: 'fa-cart-shopping',
  },
  {
    id: 'rewa-education',
    cat: ['Social Media'],
    title: 'Rewa Education',
    industry: 'K–5 Education',
    industryIcon: 'fa-book-open',
    tagline: 'Warm social media for a kids learning centre covering Grades 1–5 academics and moral values.',
    desc: 'Created and managed the social media presence for Rewa Education, a learning centre providing academic classes for children from Grades 1 to 5, combined with a strong focus on moral values and character development. Content is warm, colorful, and parent-focused to build trust and grow community.',
    services: [
      'Social Media Handle Setup',
      'Content Creation for Parents and Kids',
      'Educational Content Strategy',
      'Parent Community Building',
    ],
    colors: [
      { hex: '#F59E0B', name: 'Sunshine Yellow' },
      { hex: '#FEF3C7', name: 'Light Yellow' },
      { hex: '#D97706', name: 'Amber' },
      { hex: '#1A1A1A', name: 'Dark' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    metrics: [
      { val: '1.2K+', key: 'Followers' },
      { val: '7%', key: 'Engagement Rate' },
      { val: '45+', key: 'Posts Published' },
    ],
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
    ],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #1565c0 100%)',
    coverIcon: 'fa-book-open',
  },
  {
    id: 'aklr-academy',
    cat: ['Social Media'],
    title: 'AKLR Academy',
    industry: 'AI Education & Online Courses',
    industryIcon: 'fa-robot',
    tagline: 'Social media for an AI-focused online education platform offering courses and live classes.',
    desc: 'Built and managed the social media identity for AKLR Academy, an online education platform specializing in AI learning through structured courses and live classes. Content focuses on making AI accessible to beginners, showcasing learning outcomes, and building a community of motivated learners.',
    services: [
      'Social Media Handle Setup',
      'AI Education Content Creation',
      'Course Promotion Strategy',
      'Community Building',
    ],
    colors: [
      { hex: '#4F46E5', name: 'Indigo' },
      { hex: '#0F0C29', name: 'Deep Dark' },
      { hex: '#818CF8', name: 'Soft Indigo' },
      { hex: '#312E81', name: 'Dark Indigo' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    metrics: [
      { val: '2K+', key: 'Followers' },
      { val: '5.5%', key: 'Engagement Rate' },
      { val: '80+', key: 'Educational Posts' },
    ],
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
    ],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0f0d2e 50%, #283593 100%)',
    coverIcon: 'fa-robot',
  },
  {
    id: 'aklr-tech',
    cat: ['Social Media'],
    title: 'AKLR Tech',
    industry: 'IT Services & Technology',
    industryIcon: 'fa-microchip',
    tagline: 'Professional social media for an IT services and technology news brand.',
    desc: 'Managed the social media presence for AKLR Tech, an IT services company that also covers technology news and industry updates. We developed a professional, authoritative content strategy covering tech news, service highlights, and insights to establish credibility and attract business clients.',
    services: [
      'Social Media Management',
      'Tech News Content Curation',
      'Service Highlight Campaigns',
      'Brand Positioning',
      'Audience Growth',
    ],
    colors: [
      { hex: '#00BCD4', name: 'Tech Cyan' },
      { hex: '#0D1117', name: 'Code Black' },
      { hex: '#00E5FF', name: 'Electric Blue' },
      { hex: '#006064', name: 'Dark Teal' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    metrics: [
      { val: '1.8K+', key: 'Followers' },
      { val: '4.8%', key: 'Engagement Rate' },
      { val: '100+', key: 'Posts Published' },
    ],
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
    ],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #071828 50%, #01579b 100%)',
    coverIcon: 'fa-microchip',
  },
  {
    id: 'vibestyl',
    cat: ['Website', 'Branding'],
    title: 'VibéStyl',
    industry: 'Fashion & Clothing',
    industryIcon: 'fa-shirt',
    tagline: 'Trendy clothing store with a full e-commerce website. Browse, pick, and order online.',
    desc: 'Designed and developed a full e-commerce website for VibéStyl, a fashion-forward clothing brand. The site features a product catalog with category filters, size and color selection, a smooth cart experience, and a clean checkout flow. The brand identity was built to match the vibe: bold, modern, and unapologetically stylish.',
    services: [
      'E-commerce Website Design & Development',
      'Brand Identity & Logo',
      'Product Catalog Setup',
      'Mobile-first UI Design',
      'Checkout & Order Flow',
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Figma'],
    colors: [
      { hex: '#0D0D0D', name: 'Jet Black' },
      { hex: '#C9184A', name: 'Fashion Red' },
      { hex: '#F8F8F8', name: 'Off White' },
      { hex: '#FFD6E0', name: 'Blush Pink' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    animations: [
      'Product image hover zoom',
      'Smooth cart slide-in drawer',
      'Color and size selector transitions',
      'Scroll-reveal on product grid',
    ],
    metrics: [
      { val: '100%', key: 'Mobile Responsive' },
      { val: '<1.2s', key: 'Page Load' },
      { val: '50+', key: 'Products Listed' },
    ],
    liveUrl: '#',
    socialHandles: [],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0c1030 50%, #1a237e 100%)',
    coverIcon: 'fa-shirt',
  },
  {
    id: 'shrisurbhikripa',
    cat: ['Website'],
    title: 'Shri Surbhi Kripa',
    industry: 'Organic & Natural Products',
    industryIcon: 'fa-seedling',
    tagline: 'Static product website for an organic goods brand. Browse the catalog and order via WhatsApp.',
    desc: 'Designed and built a clean static product showcase website for Shri Surbhi Kripa, a brand dealing in pure, natural organic products. Customers browse the full product catalog on the website and place orders directly through WhatsApp, making the buying process simple and personal. The design reflects the brand\'s natural, trustworthy character.',
    services: [
      'Static Website Design & Development',
      'Product Catalog Design',
      'WhatsApp Order Integration',
      'SEO Setup',
      'Content Writing',
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Figma'],
    colors: [
      { hex: '#1B5E20', name: 'Deep Green' },
      { hex: '#4CAF50', name: 'Leaf Green' },
      { hex: '#F1F8E9', name: 'Natural Cream' },
      { hex: '#8D6E63', name: 'Earthy Brown' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    animations: [
      'Fade-in on scroll for product cards',
      'Hover lift on product images',
      'WhatsApp button pulse effect',
      'Smooth scroll navigation',
    ],
    metrics: [
      { val: 'WhatsApp', key: 'Order Channel' },
      { val: '<1s', key: 'Page Load' },
      { val: '100%', key: 'Mobile Friendly' },
    ],
    liveUrl: '#',
    socialHandles: [],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #071c30 50%, #00607a 100%)',
    coverIcon: 'fa-seedling',
  },
  {
    id: 'a2z-graphics',
    cat: ['Website'],
    title: 'A2Z Graphics & Computer',
    industry: 'Printing & Design Services',
    industryIcon: 'fa-print',
    tagline: 'Static showcase website for a full-service printing and graphic design studio.',
    desc: 'Designed and developed a static product and service showcase website for A2Z Graphics and Computer, a studio offering comprehensive printing and graphic design services. The site presents their service offerings, past work samples, and contact details in a bold, professional layout that mirrors their creative expertise.',
    services: [
      'Website Design & Development',
      'Service Portfolio Showcase',
      'Work Gallery Integration',
      'Contact & Inquiry Setup',
      'SEO Setup',
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Figma'],
    colors: [
      { hex: '#E65100', name: 'Print Orange' },
      { hex: '#0D0D0D', name: 'Ink Black' },
      { hex: '#FFF3E0', name: 'Warm White' },
      { hex: '#BF360C', name: 'Deep Red' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    animations: [
      'Gallery image hover zoom',
      'Scroll-reveal on service cards',
      'Fade-in section transitions',
      'Smooth anchor link scroll',
    ],
    metrics: [
      { val: '100%', key: 'Static Performance' },
      { val: '<1s', key: 'Load Time' },
      { val: '20+', key: 'Services Showcased' },
    ],
    liveUrl: '#',
    socialHandles: [],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0e0d30 50%, #4527a0 100%)',
    coverIcon: 'fa-print',
  },
]

const catCounts = CATS.reduce((acc, cat) => {
  acc[cat] = cat === 'All' ? projects.length : projects.filter(p => p.cat.includes(cat)).length
  return acc
}, {} as Record<string, number>)

export default function ProjectsContent() {
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)

  const filtered = active === 'All' ? projects : projects.filter(p => p.cat.includes(active))

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selected])

  const closePanel = () => setSelected(null)

  return (
    <>
      {/* Hero */}
      <section className="prj-hero">
        <div className="container">
          <div className="prj-hero-label">Our Work</div>
          <h1>Real Projects. <span>Real Results.</span></h1>
          <p>From brand identities to social media growth, here is what we have built and grown for our clients.</p>
          <div className="prj-stats">
            <div className="prj-stat">
              <div className="prj-stat-num">60+</div>
              <div className="prj-stat-label">Projects Delivered</div>
            </div>
            <div className="prj-stat">
              <div className="prj-stat-num">40+</div>
              <div className="prj-stat-label">Happy Clients</div>
            </div>
            <div className="prj-stat">
              <div className="prj-stat-num">3</div>
              <div className="prj-stat-label">Service Verticals</div>
            </div>
            <div className="prj-stat">
              <div className="prj-stat-num">4</div>
              <div className="prj-stat-label">Years in Business</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <section className="prj-layout-section">
        <div className="container">
          <div className="prj-layout">

            {/* Left Sidebar */}
            <aside className="prj-sidebar">
              <div className="prj-sidebar-inner">
                <div className="prj-sidebar-title">Filter Work</div>

                <div className="prj-filter-group">
                  <div className="prj-filter-group-label">Category</div>
                  {CATS.map(cat => (
                    <button
                      key={cat}
                      className={`prj-filter-row${active === cat ? ' active' : ''}`}
                      onClick={() => setActive(cat)}
                    >
                      <span className="prj-filter-row-name">{cat === 'All' ? 'All Projects' : cat}</span>
                      <span className="prj-filter-row-count">{catCounts[cat]}</span>
                    </button>
                  ))}
                </div>

                <div className="prj-sidebar-divider" />

                <div className="prj-filter-group">
                  <div className="prj-filter-group-label">Services</div>
                  {['Web Design & Dev', 'Social Media', 'Brand Identity', 'Content Creation'].map(s => (
                    <div key={s} className="prj-filter-tag">
                      <span className="prj-filter-tag-dot" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="prj-content">
              {/* Mobile filter strip */}
              <div className="prj-mobile-filters">
                {CATS.map(cat => (
                  <button
                    key={cat}
                    className={`prj-filter-pill${active === cat ? ' active' : ''}`}
                    onClick={() => setActive(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <p className="prj-count">
                <span className="prj-count-num">{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
                {active !== 'All' ? ` in ${active}` : ' across all verticals'}
              </p>

              <div className="prj-grid">
                {filtered.map((p, i) => (
                  <div
                    key={p.id}
                    className="prj-card reveal"
                    style={{ animationDelay: `${(i % 2) * 0.08}s` }}
                    onClick={() => setSelected(p)}
                  >
                    {/* Cover */}
                    <div className="prj-card-cover" style={{ background: p.coverGradient }}>
                      <div className="prj-card-cover-pattern" />
                      <i className={`fa-solid ${p.coverIcon} prj-card-cover-icon`} />
                      <div className="prj-card-badges">
                        {p.cat.map(c => (
                          <span key={c} className="prj-badge">{c}</span>
                        ))}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="prj-card-body">
                      <div className="prj-card-industry">
                        <i className={`fa-solid ${p.industryIcon}`} />
                        {p.industry}
                      </div>
                      <h3 className="prj-card-title">{p.title}</h3>
                      <p className="prj-card-tagline">{p.tagline}</p>

                      <div className="prj-card-services">
                        {p.services.slice(0, 3).map(s => (
                          <span key={s} className="prj-service-tag">{s}</span>
                        ))}
                        {p.services.length > 3 && (
                          <span className="prj-service-tag prj-service-more">+{p.services.length - 3} more</span>
                        )}
                      </div>

                      {p.metrics && (
                        <div className="prj-card-metrics">
                          {p.metrics.map(m => (
                            <div key={m.key} className="prj-card-metric">
                              <span className="prj-metric-val">{m.val}</span>
                              <span className="prj-metric-key">{m.key}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <button className="prj-view-btn">
                        View Project Details <i className="fa-solid fa-arrow-right" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overlay */}
      <div
        className={`prj-overlay${selected ? ' open' : ''}`}
        onClick={closePanel}
      />

      {/* Side Panel */}
      <aside className={`prj-panel${selected ? ' open' : ''}`}>
        {selected && (
          <>
            {/* Panel Cover */}
            <div className="prj-panel-cover" style={{ background: selected.coverGradient }}>
              <div className="prj-card-cover-pattern" />
              <button className="prj-panel-close" onClick={closePanel} aria-label="Close panel">
                <i className="fa-solid fa-xmark" />
              </button>
              <i className={`fa-solid ${selected.coverIcon} prj-panel-cover-icon`} />
              <div className="prj-panel-cover-badges">
                {selected.cat.map(c => (
                  <span key={c} className="prj-badge">{c}</span>
                ))}
              </div>
            </div>

            {/* Panel Body */}
            <div className="prj-panel-body">
              <div className="prj-panel-industry">
                <i className={`fa-solid ${selected.industryIcon}`} />
                {selected.industry}
              </div>
              <h2 className="prj-panel-title">{selected.title}</h2>
              <p className="prj-panel-tagline">{selected.tagline}</p>

              <div className="prj-panel-section">
                <div className="prj-panel-section-label">About This Project</div>
                <p className="prj-panel-desc">{selected.desc}</p>
              </div>

              <div className="prj-panel-section">
                <div className="prj-panel-section-label">Services Delivered</div>
                <ul className="prj-panel-services">
                  {selected.services.map(s => (
                    <li key={s}>
                      <i className="fa-solid fa-check" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {selected.tech && selected.tech.length > 0 && (
                <div className="prj-panel-section">
                  <div className="prj-panel-section-label">Tech Stack</div>
                  <div className="prj-panel-tech">
                    {selected.tech.map(t => (
                      <span key={t} className="prj-tech-tag">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.colors && selected.colors.length > 0 && (
                <div className="prj-panel-section">
                  <div className="prj-panel-section-label">Color Palette</div>
                  <div className="prj-panel-colors">
                    {selected.colors.map(c => (
                      <div key={c.hex} className="prj-color-swatch">
                        <div className="prj-color-dot" style={{ background: c.hex }} />
                        <span className="prj-color-hex">{c.hex}</span>
                        <span className="prj-color-name">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.metrics && (
                <div className="prj-panel-section">
                  <div className="prj-panel-section-label">Key Results</div>
                  <div className="prj-panel-metrics">
                    {selected.metrics.map(m => (
                      <div key={m.key} className="prj-panel-metric-card">
                        <span className="prj-panel-metric-val">{m.val}</span>
                        <span className="prj-panel-metric-key">{m.key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.animations && selected.animations.length > 0 && (
                <div className="prj-panel-section">
                  <div className="prj-panel-section-label">Animations & Features</div>
                  <ul className="prj-panel-animations">
                    {selected.animations.map(a => (
                      <li key={a}>
                        <i className="fa-solid fa-bolt" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(selected.liveUrl || (selected.socialHandles && selected.socialHandles.length > 0)) && (
                <div className="prj-panel-section">
                  <div className="prj-panel-section-label">Live Links</div>
                  <div className="prj-panel-links">
                    {selected.liveUrl && (
                      <a
                        href={selected.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="prj-live-btn"
                      >
                        <i className="fa-solid fa-globe" />
                        Visit Website
                        <i className="fa-solid fa-arrow-up-right-from-square" />
                      </a>
                    )}
                    {selected.socialHandles?.map(h => (
                      <a
                        key={h.platform}
                        href={h.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="prj-social-btn"
                        style={{
                          color: h.color,
                          borderColor: h.color + '4D',
                          background: h.color + '14',
                        }}
                      >
                        <i className={`fa-brands ${h.icon}`} />
                        {h.platform}
                        <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 10 }} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  )
}