import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Careers at ThinkSuite | Join Our Team in Gurgaon',
  description: 'Explore opportunities at ThinkSuite. We work at the intersection of AI, software, and marketing. Send us your resume and we\'ll be in touch when roles open.',
  keywords: ['ThinkSuite careers', 'jobs in Gurgaon', 'digital marketing jobs India', 'AI jobs India', 'software developer jobs', 'work at ThinkSuite'],
}

const perks = [
  { icon: 'fa-laptop-house', title: 'Remote & Hybrid', desc: 'Work from our Gurgaon office or remotely. We care about output, not location.' },
  { icon: 'fa-clock', title: 'Flexible Hours', desc: 'Core hours exist, but we don\'t micromanage your schedule. Deliver and we\'re happy.' },
  { icon: 'fa-graduation-cap', title: 'Learning Budget', desc: 'Courses, tools, certifications. We invest in your growth because it benefits everyone.' },
  { icon: 'fa-hand-holding-dollar', title: 'Performance Bonus', desc: 'Deliver results and get rewarded. No politics, no waiting for an annual cycle.' },
  { icon: 'fa-comments', title: 'Direct Founder Access', desc: 'Work with leadership directly. No layers of management blocking good ideas.' },
  { icon: 'fa-rocket', title: 'Fast Career Growth', desc: 'Stand out and move up fast. We promote based on impact, nothing else.' },
]

const steps = [
  { num: '01', title: 'Apply', desc: 'Send your resume to careers@thinksuite.in with a short note on why you\'re a fit.' },
  { num: '02', title: 'Screening Call', desc: 'A 20-minute call to discuss your background and whether expectations align.' },
  { num: '03', title: 'Task / Interview', desc: 'A short practical task or 45-minute technical conversation. Real skill, not textbook answers.' },
  { num: '04', title: 'Offer', desc: 'If it\'s a fit, we move to an offer within 5 business days.' },
]

export default function CareersPage() {
  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>Careers</span>
          </div>
          <span className="label">Join Our Team</span>
          <h1 className="mt-16">Grow With<br /><span className="grad-text">ThinkSuite</span></h1>
          <p className="mt-16" style={{ maxWidth: 560, color: 'var(--text2)', fontSize: 18 }}>
            We work at the intersection of AI, software, and business strategy.
            If you solve real problems and want your work to matter, we&apos;d love to know you.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 32 }}>
            <a href="#open-positions" className="btn btn-primary">
              See Openings <i className="fa-solid fa-arrow-down" />
            </a>
            <a href="mailto:careers@thinksuite.in" className="btn btn-outline">
              Send Your Resume
            </a>
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <section className="section">
        <div className="container">
          <span className="label">Why Join Us</span>
          <h2 className="mt-16" style={{ maxWidth: 520 }}>A Place Where Your Work Actually Moves Things</h2>
          <p className="mt-16" style={{ color: 'var(--text2)', maxWidth: 540 }}>
            ThinkSuite operates at the edge of AI, software, and business strategy.
            The work here is fast, real, and consequential.
          </p>
          <div className="why-grid mt-48">
            {[
              { icon: 'fa-bolt', title: 'Ownership From Day One', desc: 'You\'re not a cog. Every person here owns a piece of the output. Ideas move from conversation to live product in weeks, not quarters.' },
              { icon: 'fa-robot', title: 'Work With Real AI', desc: 'We build AI systems for clients and use AI internally to move faster. You\'ll be working with cutting-edge tools, not just talking about them.' },
              { icon: 'fa-chart-line', title: 'Grow Without a Ceiling', desc: 'We\'re a growing company. Every senior person here started junior. Progression is based on contribution, not time served.' },
              { icon: 'fa-users', title: 'Clients Who Matter', desc: 'Our clients are founders building serious businesses. You\'ll learn what it actually takes to scale from zero to real revenue.' },
            ].map((c) => (
              <div key={c.title} className="why-card reveal">
                <div className="why-icon"><i className={`fa-solid ${c.icon}`} /></div>
                <div className="why-title">{c.title}</div>
                <div className="why-text">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="section section--dark">
        <div className="container">
          <span className="label">Perks &amp; Benefits</span>
          <h2 className="mt-16">What You Get Beyond the Salary</h2>
          <div className="perks-grid mt-48">
            {perks.map((p) => (
              <div key={p.title} className="perk-item reveal">
                <div className="perk-icon"><i className={`fa-solid ${p.icon}`} /></div>
                <div className="perk-text">
                  <h6>{p.title}</h6>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section className="section" id="open-positions">
        <div className="container">
          <span className="label">Open Positions</span>
          <h2 className="mt-16">Current Openings</h2>
          <p className="mt-12" style={{ color: 'var(--text2)' }}>
            We post new roles as the team grows. Check back soon.
          </p>

          {/* No Openings State */}
          <div className="no-openings-box mt-48 reveal">
            <div className="no-openings-icon">
              <i className="fa-solid fa-briefcase" />
            </div>
            <h4>No openings right now</h4>
            <p>
              We&apos;re not actively hiring at the moment, but we&apos;re always open to
              hearing from talented people. Send us your resume and we&apos;ll reach out
              when something relevant opens up.
            </p>
            <a href="mailto:careers@thinksuite.in" className="btn btn-primary">
              Send Your Resume <i className="fa-solid fa-paper-plane" />
            </a>
          </div>
        </div>
      </section>

      {/* HIRING PROCESS */}
      <section className="section section--dark">
        <div className="container">
          <span className="label">How We Hire</span>
          <h2 className="mt-16" style={{ textAlign: 'center' }}>A Process That Respects Your Time</h2>
          <p className="mt-12" style={{ color: 'var(--text2)', textAlign: 'center', maxWidth: 480, margin: '12px auto 0' }}>
            No 6-round interviews. No ghost forms. We keep it simple and move fast.
          </p>
          <div className="process-steps mt-48">
            {steps.map((s) => (
              <div key={s.num} className="process-step reveal">
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-text">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GENERAL CTA */}
      <section className="section">
        <div className="container">
          <div className="open-apply-box reveal">
            <span className="label" style={{ marginBottom: 20, display: 'inline-block' }}>Stay on Our Radar</span>
            <h2>Send Us Your Resume Anyway</h2>
            <p>
              We regularly open new roles as the team grows. If you&apos;re talented and driven,
              we&apos;d love to have you on our radar.
            </p>
            <a href="mailto:careers@thinksuite.in" className="btn btn-primary btn-lg">
              Email careers@thinksuite.in <i className="fa-solid fa-paper-plane" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
