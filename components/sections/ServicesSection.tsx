import SectionHeading from '@/components/ui/SectionHeading'
import ServiceCard from '@/components/ui/ServiceCard'

const services = [
  {
    icon: 'fa-code',
    color: 'blue',
    colorClass: 'sc-blue',
    title: 'Software Development',
    desc: 'Custom web apps, mobile platforms, SaaS products, and enterprise software engineered for scale, performance, and long-term maintainability. From MVP to production.',
    href: '/software-development',
    delay: 'reveal-d1',
  },
  {
    icon: 'fa-bullhorn',
    color: 'gold',
    colorClass: 'sc-gold',
    title: 'Digital Marketing',
    desc: 'Full-funnel digital marketing across SEO, Google Ads, Meta Ads, social media, and content strategy. Every campaign is backed by data and optimized for real revenue growth.',
    href: '/digital-marketing',
    delay: 'reveal-d2',
  },
  {
    icon: 'fa-pen-nib',
    color: 'purple',
    colorClass: 'sc-purple',
    title: 'Branding & Design',
    desc: 'Memorable brand identities, stunning UI/UX design, visual systems, and creative direction that captivate your audience and build lasting brand equity.',
    href: '/branding-design',
    delay: 'reveal-d3',
  },
  {
    icon: 'fa-brain',
    color: 'blue',
    colorClass: 'sc-blue',
    title: 'AI & Automation',
    desc: 'Custom AI tools, intelligent chatbots, LLM integrations, and workflow automation that slash operational costs, eliminate repetitive tasks, and give your business an edge.',
    href: '/ai-automation',
    delay: 'reveal-d1',
  },
  {
    icon: 'fa-tower-broadcast',
    color: 'green',
    colorClass: 'sc-green',
    title: 'Media & Advertising',
    desc: 'Strategic indoor/outdoor advertising, influencer marketing campaigns, and PR initiatives that build lasting brand presence and drive measurable offline and online impact.',
    href: '/media-advertising',
    delay: 'reveal-d2',
  },
  {
    icon: 'fa-chart-line',
    color: 'orange',
    colorClass: 'sc-orange',
    title: 'Consulting & Growth',
    desc: 'Strategic business consulting, startup advisory, growth planning, and market research to help you make better decisions, identify opportunities, and scale sustainably.',
    href: '/consulting-growth',
    delay: 'reveal-d3',
  },
]

export default function ServicesSection() {
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHeading
          label="What We Do"
          title={<>Full-Stack Digital <span className="text-accent">Solutions</span></>}
          subtitle="From concept to scale, we cover every angle of your digital growth with expert in-house teams and proven processes. One partner, zero gaps."
          center
        />
        <div className="grid-3">
          {services.map((s) => (
            <ServiceCard key={s.href} {...s} />
          ))}
        </div>

        <div style={{ marginTop: 48, padding: '32px 40px', background: 'var(--bg2)', borderRadius: 20, border: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ marginBottom: 6 }}>Not sure which service you need?</h4>
            <p style={{ fontSize: 14, color: 'var(--text2)', margin: 0 }}>Book a free 30-min discovery call. Our strategists will map out the right solution for your goals and budget.</p>
          </div>
          <a href="/contact" className="btn btn-primary">
            Book Free Strategy Call <i className="fa-solid fa-arrow-right" />
          </a>
        </div>
      </div>
    </section>
  )
}
