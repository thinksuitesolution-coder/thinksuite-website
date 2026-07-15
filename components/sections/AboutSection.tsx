import Link from 'next/link'

const pillars = [
  'AI-First Approach',
  'Agile, Sprint-Based Delivery',
  'Measurable ROI on Every Project',
  'Full Transparency & Reporting',
  'In-House Expert Team',
  'Scalable, Future-Proof Solutions',
  'Fixed-Price Engagements',
  '30-Day Post-Launch Warranty',
]

export default function AboutSection() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-img-wrap reveal">
            <div className="about-img-main">
              <i className="fa-solid fa-lightbulb about-placeholder-icon" />
              <span className="about-placeholder-text">ThinkSuite</span>
            </div>
            <div className="about-badge">
              <span className="about-badge-num counter" data-target="5" data-suffix="+">5+</span>
              <span className="about-badge-label">Years of Experience</span>
            </div>
            <div style={{ position: 'absolute', bottom: -16, right: 32, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 20px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(5,150,105,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-shield-check" style={{ color: '#059669', fontSize: 16 }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>100% In-House</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>No outsourcing, ever</div>
              </div>
            </div>
          </div>

          <div className="about-content reveal">
            <span className="label">About ThinkSuite</span>
            <h2 className="mt-16">
              We Turn Ideas Into <span className="text-accent">Digital Reality</span>
            </h2>
            <p className="mt-16">
              ThinkSuite is a full-stack digital agency where innovation meets flawless execution.
              We combine cutting-edge AI technology, world-class design, and growth-driven marketing
              to help startups and enterprises worldwide achieve their most ambitious goals, faster and smarter.
            </p>
            <p>
              Our multidisciplinary in-house team of developers, designers, marketers, AI engineers,
              and business strategists work as a true extension of your team. Whether you need a
              high-converting website, a viral social media strategy, a custom SaaS platform, or an
              AI-powered automation system. We deliver end-to-end, with full transparency.
            </p>
            <div className="about-pillars mt-24">
              {pillars.map((p) => (
                <div key={p} className="pillar">
                  <i className="fa-solid fa-check" />
                  {p}
                </div>
              ))}
            </div>
            <Link href="/about" className="btn btn-primary mt-32">
              Our Full Story <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
