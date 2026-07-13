import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Careers at ThinkSuite | Join Our Team in Gurgaon, India',
  description: 'Explore opportunities at ThinkSuite. We work at the intersection of AI, software, and marketing from Gurgaon. Send your resume and we will reach out.',
  keywords: [
    'ThinkSuite careers', 'jobs in Gurgaon', 'digital marketing jobs India', 'AI jobs India',
    'software developer jobs Gurgaon', 'work at ThinkSuite', 'UI UX design jobs India', 'AI engineer jobs Gurgaon',
  ],
}

const careersFaqs = [
  {
    q: 'Is ThinkSuite hiring right now?',
    a: 'We are not actively hiring for a specific role at this moment, but we review every resume we receive and reach out as soon as a relevant opening comes up. Send us your resume at info@thinksuite.in to stay on our radar.',
  },
  {
    q: 'What is the hiring process like?',
    a: 'It is a simple four-step process: you apply, we hold a 20-minute screening call, you complete a short practical task or technical conversation, and if it is a fit, we extend an offer within 5 business days. There are no lengthy multi-round interview loops.',
  },
  {
    q: 'Does ThinkSuite offer remote work?',
    a: 'Yes. You can work from our Gurgaon office, remotely, or a mix of both. We care about the quality and consistency of your output, not where you sit while producing it.',
  },
  {
    q: 'What kind of roles does ThinkSuite typically hire for?',
    a: 'Our team spans frontend and backend development, UI/UX design, AI engineering, and growth marketing. Since we are a full-stack agency and product company, roles open up across all of these areas as the team grows.',
  },
  {
    q: 'How do I apply if I do not see an open role?',
    a: 'Email your resume and a short note on why you would be a fit to info@thinksuite.in. We keep every application on file and reach out directly when a matching role opens.',
  },
]

const perks = [
  { icon: 'fa-laptop-house', title: 'Remote & Hybrid', desc: 'Work from our Gurgaon office or remotely. We care about output, not location.' },
  { icon: 'fa-clock', title: 'Flexible Hours', desc: 'Core hours exist, but we don\'t micromanage your schedule. Deliver and we\'re happy.' },
  { icon: 'fa-graduation-cap', title: 'Learning Budget', desc: 'Courses, tools, certifications. We invest in your growth because it benefits everyone.' },
  { icon: 'fa-hand-holding-dollar', title: 'Performance Bonus', desc: 'Deliver results and get rewarded. No politics, no waiting for an annual cycle.' },
  { icon: 'fa-comments', title: 'Direct Founder Access', desc: 'Work with leadership directly. No layers of management blocking good ideas.' },
  { icon: 'fa-rocket', title: 'Fast Career Growth', desc: 'Stand out and move up fast. We promote based on impact, nothing else.' },
]

const steps = [
  { num: '01', title: 'Apply', desc: 'Send your resume to info@thinksuite.in with a short note on why you\'re a fit.' },
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
            <a href="mailto:info@thinksuite.in" className="btn btn-outline">
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
            <a href="mailto:info@thinksuite.in" className="btn btn-primary">
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

      {/* FAQ */}
      <section className="section">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: careersFaqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }} className="reveal">
            <span className="label">Common Questions</span>
            <h2 style={{ marginTop: 12 }}>
              Frequently Asked <span className="grad-text">Questions</span>
            </h2>
          </div>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {careersFaqs.map((faq, i) => (
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
            <a href="mailto:info@thinksuite.in" className="btn btn-primary btn-lg">
              Email info@thinksuite.in <i className="fa-solid fa-paper-plane" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
