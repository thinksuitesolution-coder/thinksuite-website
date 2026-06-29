import SectionHeading from '@/components/ui/SectionHeading'

const steps = [
  {
    num: '01',
    icon: 'fa-magnifying-glass',
    title: 'Discover & Plan',
    desc: 'We start with a deep-dive discovery session to understand your goals, audience, competitors, and market landscape. The output is a bulletproof strategy, clear project scope, and a realistic roadmap with defined milestones and KPIs.',
  },
  {
    num: '02',
    icon: 'fa-compass-drafting',
    title: 'Design & Prototype',
    desc: 'Our designers create wireframes, high-fidelity mockups, and interactive prototypes aligned with your brand vision and user expectations. You review and approve at every stage, with no surprises along the way.',
  },
  {
    num: '03',
    icon: 'fa-laptop-code',
    title: 'Build & Test',
    desc: 'Our engineering team builds your solution using modern, scalable technologies with comprehensive QA testing at every sprint. We run performance audits, security checks, and cross-device testing before any code ships to production.',
  },
  {
    num: '04',
    icon: 'fa-rocket',
    title: 'Launch & Optimize',
    desc: 'We deploy with confidence and do not disappear post-launch. Our team monitors performance, analyzes real user data, and continuously optimizes for speed, conversions, and growth to deliver compounding value over time.',
  },
]

export default function ProcessSection() {
  return (
    <section className="section section-process">
      <div className="container">
        <SectionHeading
          label="How We Work"
          title={<>Our Proven <span className="text-accent">4-Step Process</span></>}
          subtitle="A streamlined, transparent approach that ensures quality delivery, clear communication, and consistent results at every step of the project."
          center
        />
        <div className="grid-4 process-grid">
          {steps.map((step, i) => (
            <div key={step.num} className={`process-step reveal reveal-d${i + 1}`}>
              <span className="step-num">{step.num}</span>
              <div className="process-icon-wrap">
                <div className="process-icon">
                  <i className={`fa-solid ${step.icon}`} />
                </div>
              </div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
