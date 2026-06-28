import SectionHeading from '@/components/ui/SectionHeading'

const industries = [
  {
    icon: 'fa-store',
    color: '#2563eb',
    bg: 'rgba(37,99,235,0.06)',
    title: 'E-Commerce & Retail',
    desc: 'Shopify & WooCommerce stores, custom storefronts, D2C brand launches, and performance marketing for online retailers.',
  },
  {
    icon: 'fa-hospital',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
    title: 'Healthcare & Wellness',
    desc: 'Patient portals, appointment booking systems, telemedicine apps, and compliant healthcare marketing campaigns.',
  },
  {
    icon: 'fa-building-columns',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.06)',
    title: 'Fintech & BFSI',
    desc: 'Secure fintech platforms, payment gateway integrations, compliance-first UI, and financial services digital marketing.',
  },
  {
    icon: 'fa-graduation-cap',
    color: '#d97706',
    bg: 'rgba(217,119,6,0.06)',
    title: 'EdTech & Education',
    desc: 'LMS platforms, e-learning portals, quiz engines, student apps, and enrollment marketing for schools and institutes.',
  },
  {
    icon: 'fa-utensils',
    color: '#dc2626',
    bg: 'rgba(220,38,38,0.06)',
    title: 'Food & Hospitality',
    desc: 'Restaurant apps, food delivery platforms, table booking systems, QR menus, and influencer-driven social campaigns.',
  },
  {
    icon: 'fa-building',
    color: '#0891b2',
    bg: 'rgba(8,145,178,0.06)',
    title: 'Real Estate & PropTech',
    desc: 'Property listing portals, virtual tours, CRM systems, and high-ROI lead generation campaigns for realtors.',
  },
  {
    icon: 'fa-truck',
    color: '#65a30d',
    bg: 'rgba(101,163,13,0.06)',
    title: 'Logistics & Supply Chain',
    desc: 'Shipment tracking dashboards, route optimization tools, warehouse management systems, and automation solutions.',
  },
  {
    icon: 'fa-shirt',
    color: '#9333ea',
    bg: 'rgba(147,51,234,0.06)',
    title: 'Fashion & Lifestyle',
    desc: 'Lookbook websites, influencer campaigns, D2C brand building, visual identity systems, and social commerce.',
  },
  {
    icon: 'fa-microchip',
    color: '#334155',
    bg: 'rgba(51,65,85,0.06)',
    title: 'Tech Startups & SaaS',
    desc: 'MVP development, SaaS platforms, AI feature integrations, investor pitch decks, and growth hacking campaigns.',
  },
]

export default function IndustriesSection() {
  return (
    <section className="section" id="industries">
      <div className="container">
        <SectionHeading
          label="Industries We Serve"
          title={<>Expertise Across <span className="text-accent">Every Sector</span></>}
          subtitle="From early-stage startups to established enterprises, we work across 15+ industries and bring relevant experience and fresh thinking to every engagement."
          center
        />
        <div className="grid-3">
          {industries.map((ind, i) => (
            <div
              key={ind.title}
              className={`reveal reveal-d${(i % 3) + 1}`}
              style={{
                background: ind.bg,
                border: `1px solid ${ind.color}20`,
                borderRadius: 16,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <i className={`fa-solid ${ind.icon}`} style={{ fontSize: 28, color: ind.color }} />
              <h5 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--white)' }}>{ind.title}</h5>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, margin: 0 }}>{ind.desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>
            Don&apos;t see your industry?{' '}
            <a href="/contact" style={{ color: 'var(--cyan)', fontWeight: 600, textDecoration: 'underline' }}>
              Talk to us. We adapt to any vertical.
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
