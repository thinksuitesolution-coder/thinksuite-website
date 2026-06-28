const cards = [
  {
    cls: 'ts-s-card-1',
    num: '01',
    icon: 'fa-solid fa-rocket',
    title: 'Rapid Deployment.',
    desc: 'While traditional agencies take months to write code, our AI-assisted workflows let us launch production-ready SaaS, websites, and automation tracks in weeks, not months.',
    deco: '10X',
    metric: '3x Faster Time-to-Market',
  },
  {
    cls: 'ts-s-card-2',
    num: '02',
    icon: 'fa-solid fa-brain',
    title: 'Built for the Generative Era.',
    desc: 'Every piece of software or marketing asset we create is optimized for AI tools. We make sure your brand is native to the ecosystem of ChatGPT, Gemini, and future LLMs.',
    deco: 'AI',
    metric: '100% Future-Proof Frameworks',
  },
  {
    cls: 'ts-s-card-3',
    num: '03',
    icon: 'fa-solid fa-chart-line',
    title: 'Pure Performance Marketing.',
    desc: 'No vanity metrics. No fake likes or empty traffic reports. Every ad dollar is tracked directly against your revenue, customer acquisition cost (CAC), and ultimate business growth.',
    deco: 'ROI',
    metric: 'Average 4.2x ROI on Ad Spend',
  },
  {
    cls: 'ts-s-card-4',
    num: '04',
    icon: 'fa-solid fa-users',
    title: 'No Scattered Vendors.',
    desc: 'Stop talking to 4 different agencies for web, design, marketing, and AI. ThinkSuite gives you one tightly integrated engineering team where nothing gets lost in translation.',
    deco: 'ONE',
    metric: 'Unified Business Control',
  },
]

export default function StickyStackingSection() {
  return (
    <section style={{ background: 'var(--bg)' }}>
      <div className="ts-sticky-wrap">
        <div className="ts-left-content">
          <span className="ts-left-eyebrow">Why ThinkSuite</span>
          <h2 className="ts-left-heading">Why brands scale with ThinkSuite.</h2>
          <p className="ts-left-body">
            We don&apos;t just deliver services; we build unfair technical advantages.
            Here is how we move the needle for your business.
          </p>
        </div>
        <div className="ts-right-content">
          {cards.map(c => (
            <div key={c.num} className={`ts-s-card ${c.cls}`}>
              <span className="ts-s-card-number">
                <i className={`${c.icon} ts-s-card-icon`} aria-hidden="true" />
                {c.num}
              </span>
              <div>
                <div className="ts-s-card-title">{c.title}</div>
                <p className="ts-s-card-desc">{c.desc}</p>
              </div>
              <span className="ts-s-card-metric">{c.metric}</span>
              <span className="ts-s-card-deco" aria-hidden="true">{c.deco}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
