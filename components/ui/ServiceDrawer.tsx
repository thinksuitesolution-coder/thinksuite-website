'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export type SubCat = { icon: string; title: string; href: string; desc: string; features: string[] }
export type ServiceDrawerData = {
  num: string; title: string; desc: string; tagline: string; overview: string
  numColor: string; lineColor: string; cardBg: string; linkColor: string
  subCategories: SubCat[]
}

export const serviceDrawerData: ServiceDrawerData[] = [
  {
    num: '01', title: 'Software Development', cardBg: '#f5f3ff',
    numColor: '#7c3aed', lineColor: '#7c3aed', linkColor: '#7c3aed',
    desc: 'Custom websites, SaaS platforms, mobile apps and enterprise solutions built for performance and scale.',
    tagline: 'Code that scales with your ambitions.',
    overview: 'We engineer high-performance digital products, from MVPs to enterprise platforms, using modern tech stacks and clean architecture. Every line of code is crafted for speed, security, and long-term maintainability.',
    subCategories: [
      { icon: 'fa-globe', title: 'Web Development', href: '/web-development', desc: 'Full-stack web applications built for performance, SEO, and seamless user experience.', features: ['React / Next.js frontends', 'Node.js & Python backends', 'RESTful & GraphQL APIs', 'Database design & optimisation', 'CI/CD pipelines & DevOps'] },
      { icon: 'fa-mobile-screen', title: 'Mobile App Development', href: '/mobile-app-development', desc: 'Cross-platform and native apps for iOS and Android that users love.', features: ['React Native & Flutter apps', 'iOS (Swift) & Android (Kotlin)', 'App Store & Play Store submissions', 'Push notifications & offline mode', 'In-app payments & analytics'] },
      { icon: 'fa-gear', title: 'Custom Software', href: '/custom-software', desc: 'Bespoke enterprise software tailored precisely to your workflows and operations.', features: ['ERP & CRM systems', 'Inventory & billing platforms', 'Third-party API integrations', 'Legacy system modernisation', 'Admin dashboards & reporting'] },
      { icon: 'fa-cloud', title: 'SaaS Products', href: '/saas-products', desc: 'End-to-end SaaS platforms engineered from MVP to enterprise-grade product.', features: ['Multi-tenant architecture', 'Subscription & billing engine', 'Analytics & usage dashboards', 'Role-based access control', 'Scalable cloud infrastructure'] },
    ],
  },
  {
    num: '02', title: 'Digital Marketing', cardBg: '#fffbeb',
    numColor: '#d97706', lineColor: '#d97706', linkColor: '#d97706',
    desc: 'Data-driven strategies that increase visibility, generate leads and drive measurable business growth.',
    tagline: 'Visibility, leads, and revenue. On autopilot.',
    overview: 'Data-driven marketing strategies that attract the right audience, convert visitors into customers, and maximise your return on every rupee spent. We combine creativity with analytics to deliver measurable results.',
    subCategories: [
      { icon: 'fa-magnifying-glass', title: 'SEO Optimisation', href: '/seo-optimization', desc: 'Rank higher on Google and drive consistent organic traffic to your website.', features: ['Technical SEO audits & fixes', 'On-page & off-page optimisation', 'Keyword research & content strategy', 'Backlink building', 'Local SEO & Google Business'] },
      { icon: 'fa-bullhorn', title: 'Google & Meta Ads', href: '/google-meta-ads', desc: 'High-ROI paid advertising campaigns on Google, Facebook, and Instagram.', features: ['Google Search & Display Ads', 'Meta (Facebook / Instagram) Ads', 'Retargeting & lookalike audiences', 'A/B testing & CRO', 'Monthly performance reports'] },
      { icon: 'fa-share-nodes', title: 'Social Media Marketing', href: '/social-media-marketing', desc: 'Build a loyal community and grow your brand across social platforms.', features: ['Content calendar & strategy', 'Reels, posts & story creation', 'Community management', 'Influencer collaborations', 'Hashtag & trend research'] },
      { icon: 'fa-pen-to-square', title: 'Content Marketing', href: '/content-marketing', desc: 'Compelling content that educates, engages, and converts your target audience.', features: ['Blog & article writing', 'Video scripts & production support', 'Email newsletters', 'Lead magnets & ebooks', 'Content distribution strategy'] },
    ],
  },
  {
    num: '03', title: 'Branding & Design', cardBg: '#fdf2f8',
    numColor: '#db2777', lineColor: '#db2777', linkColor: '#db2777',
    desc: 'Build memorable brands with strategic identity, stunning visuals and seamless user experiences.',
    tagline: "Great brands aren't built by accident.",
    overview: 'We create brand identities that resonate deeply with your audience, from the first logo sketch to the final design system. Stunning visuals, strategic thinking, and careful execution in every project.',
    subCategories: [
      { icon: 'fa-star', title: 'Brand Identity', href: '/brand-identity', desc: 'A cohesive visual identity that makes your brand instantly recognisable.', features: ['Logo design & variations', 'Colour palette & typography', 'Brand guidelines document', 'Business cards & stationery', 'Brand voice & messaging'] },
      { icon: 'fa-pen-nib', title: 'UI/UX Design', href: '/ui-ux-design', desc: 'Intuitive, beautiful interfaces that delight users and drive conversions.', features: ['User research & personas', 'Wireframes & prototypes', 'Figma / Adobe XD design', 'Usability testing', 'Design system creation'] },
      { icon: 'fa-image', title: 'Graphic Design', href: '/graphic-design', desc: 'Eye-catching visuals for every touchpoint, digital and print.', features: ['Social media creatives', 'Marketing collaterals', 'Brochures & flyers', 'Banners & display ads', 'Packaging design'] },
      { icon: 'fa-cube', title: 'Product Design', href: '/product-design', desc: 'End-to-end product design from concept to launch-ready experience.', features: ['Product strategy & vision', 'Information architecture', 'Interactive prototyping', 'User journey mapping', 'Design handoff to dev'] },
    ],
  },
  {
    num: '04', title: 'AI & Automation', cardBg: '#eff6ff',
    numColor: '#2563eb', lineColor: '#2563eb', linkColor: '#2563eb',
    desc: 'Intelligent automation, AI chatbots, integrations and workflows that save time and scale operations.',
    tagline: 'Let machines do the heavy lifting.',
    overview: "We build intelligent automation systems that eliminate repetitive tasks, supercharge your team's productivity, and unlock new revenue streams. From custom AI tools to fully automated workflows, we make AI practical for real businesses.",
    subCategories: [
      { icon: 'fa-robot', title: 'AI Tools Development', href: '/ai-tools-development', desc: 'Custom AI-powered applications built on the latest LLMs and ML models.', features: ['LLM integrations (GPT, Claude, Gemini)', 'Custom model fine-tuning', 'AI content & copy generators', 'Predictive analytics tools', 'Computer vision solutions'] },
      { icon: 'fa-comment-dots', title: 'Chatbot Solutions', href: '/chatbot-solutions', desc: 'Smart chatbots that handle customer support, lead gen, and sales 24/7.', features: ['Website & WhatsApp chatbots', 'Lead qualification bots', 'FAQ & support automation', 'CRM integrations', 'Multi-language support'] },
      { icon: 'fa-diagram-project', title: 'Workflow Automation', href: '/workflow-automation', desc: 'Eliminate manual work by automating business processes end-to-end.', features: ['Zapier / Make / n8n automations', 'CRM & ERP integrations', 'Email & notification workflows', 'Data sync & reporting pipelines', 'Custom API connectors'] },
      { icon: 'fa-chart-line', title: 'AI Marketing Systems', href: '/ai-marketing-systems', desc: 'AI-driven marketing stacks that personalise, optimise, and scale automatically.', features: ['Personalised email sequences', 'AI ad creative testing', 'Lead scoring models', 'Customer segmentation', 'Automated campaign management'] },
    ],
  },
  {
    num: '05', title: 'Media & Advertising', cardBg: '#f0fdf4',
    numColor: '#059669', lineColor: '#059669', linkColor: '#059669',
    desc: 'Creative campaigns and performance marketing that maximize reach, engagement and ROI.',
    tagline: 'Be seen everywhere that matters.',
    overview: 'Strategic media planning and creative advertising that puts your brand in front of the right people at the right time, whether on a billboard, a phone screen, or a podcast. We maximise reach and impact across every channel.',
    subCategories: [
      { icon: 'fa-building', title: 'Indoor Advertising', href: '/indoor-advertising', desc: 'High-impact brand placements in malls, airports, offices, and premium indoor spaces.', features: ['Mall & retail activations', 'Airport & transit displays', 'Corporate lobby branding', 'Event & exhibition displays', 'Digital screen placements'] },
      { icon: 'fa-signs-post', title: 'Outdoor Advertising', href: '/outdoor-advertising', desc: 'Dominate the outdoor landscape with strategic OOH advertising placements.', features: ['Hoardings & billboards', 'Bus shelters & transit ads', 'Wall murals & wraps', 'Highway & transit branding', 'Location-based targeting'] },
      { icon: 'fa-user-group', title: 'Influencer Marketing', href: '/influencer-marketing', desc: 'Authentic creator partnerships that build trust and drive real conversions.', features: ['Influencer identification & vetting', 'Campaign brief & creative direction', 'Instagram / YouTube / LinkedIn', 'Performance tracking', 'Long-term brand ambassador programmes'] },
      { icon: 'fa-newspaper', title: 'PR Campaigns', href: '/pr-campaigns', desc: 'Strategic PR that builds credibility, earns media coverage, and shapes your narrative.', features: ['Press release writing & distribution', 'Media outreach & journalist relations', 'Crisis communication', 'Thought leadership placements', 'Event PR & launch coverage'] },
    ],
  },
  {
    num: '06', title: 'Consulting & Growth', cardBg: '#fffbeb',
    numColor: '#d97706', lineColor: '#d97706', linkColor: '#d97706',
    desc: 'Strategic consulting, business planning and growth roadmaps to scale smarter and faster.',
    tagline: 'Strategy that turns vision into traction.',
    overview: 'We partner with founders, CEOs, and marketing teams to cut through complexity, identify growth opportunities, and build actionable roadmaps. Our consultants bring cross-industry expertise and a bias for results over reports.',
    subCategories: [
      { icon: 'fa-rocket', title: 'Startup Consulting', href: '/startup-consulting', desc: 'Hands-on guidance for early-stage startups from idea validation to first 100 customers.', features: ['Business model validation', 'Go-to-market strategy', 'Pitch deck creation', 'Investor readiness', 'Product-market fit coaching'] },
      { icon: 'fa-chess', title: 'Business Strategy', href: '/business-strategy', desc: 'Clear competitive strategy that aligns your team and drives sustainable growth.', features: ['Competitive landscape analysis', 'SWOT & gap analysis', 'Revenue model optimisation', 'OKRs & KPI frameworks', 'Strategic partnership mapping'] },
      { icon: 'fa-arrow-trend-up', title: 'Growth Planning', href: '/growth-planning', desc: 'Data-backed growth plans with clear milestones and accountability frameworks.', features: ['Growth audit & opportunity mapping', 'Channel prioritisation', 'Customer acquisition strategy', 'Retention & LTV optimisation', 'Monthly growth reviews'] },
      { icon: 'fa-magnifying-glass-chart', title: 'Market Research', href: '/market-research', desc: 'Deep market insights that de-risk decisions and uncover untapped opportunities.', features: ['Primary & secondary research', 'Customer surveys & interviews', 'Competitor benchmarking', 'Trend analysis', 'Market sizing & TAM reports'] },
    ],
  },
]

export function ServiceDrawer({ service, onClose }: { service: ServiceDrawerData | null; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = service ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [service])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <div
        className={`sdr-overlay${service ? ' sdr-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`sdr-panel${service ? ' sdr-panel--open' : ''}`} role="dialog" aria-modal="true">
        {service && (
          <>
            <div className="sdr-header" style={{ borderBottom: `2px solid ${service.lineColor}22` }}>
              <div className="sdr-header-left">
                <span className="sdr-num" style={{ color: service.numColor }}>{service.num}</span>
                <div>
                  <h2 className="sdr-title">{service.title}</h2>
                  <p className="sdr-tagline">{service.tagline}</p>
                </div>
              </div>
              <button className="sdr-close" onClick={onClose} aria-label="Close">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="sdr-body">
              <p className="sdr-overview">{service.overview}</p>
              <h3 className="sdr-section-title">
                <span style={{ background: service.lineColor, width: 4, height: 18, borderRadius: 2, display: 'inline-block', marginRight: 10, verticalAlign: 'middle' }} />
                What&apos;s Included
              </h3>
              <div className="sdr-grid">
                {service.subCategories.map((sub) => (
                  <div key={sub.href} className="sdr-card">
                    <div className="sdr-card-icon" style={{ background: `${service.numColor}15`, color: service.numColor }}>
                      <i className={`fa-solid ${sub.icon}`} />
                    </div>
                    <h4 className="sdr-card-title">{sub.title}</h4>
                    <p className="sdr-card-desc">{sub.desc}</p>
                    <ul className="sdr-features">
                      {sub.features.map((f) => (
                        <li key={f} style={{ color: service.numColor }}>
                          <i className="fa-solid fa-check" style={{ marginRight: 8, fontSize: 10 }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={sub.href} className="sdr-card-link" style={{ color: service.numColor }}>
                      Explore <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="sdr-footer">
              <p style={{ fontSize: 13, color: 'var(--text2)', margin: 0 }}>Ready to get started with <strong>{service.title}</strong>?</p>
              <Link href="/contact" className="btn btn-primary" onClick={onClose}>
                Start a Project <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
