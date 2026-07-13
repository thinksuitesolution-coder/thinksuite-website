import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Team | ThinkSuite Digital Agency in Gurgaon, India',
  description: 'Meet the ThinkSuite team: developers, designers, marketers, and AI engineers building and growing digital businesses from our in-house Gurgaon office.',
  keywords: [
    'ThinkSuite team', 'ThinkSuite founder', 'Aakash Upadhyay ThinkSuite', 'digital agency team Gurgaon',
    'in-house developers and designers India', 'AI engineers Gurgaon', 'meet the ThinkSuite team',
  ],
}

const teamFaqs = [
  {
    q: 'Who will actually work on my project?',
    a: 'A dedicated group of full-time ThinkSuite developers, designers, marketers, and AI engineers, not freelancers or subcontractors passed around between agencies. You get direct access to the same team throughout the engagement.',
  },
  {
    q: 'How big is the ThinkSuite team?',
    a: 'ThinkSuite is a growing in-house team covering frontend and backend development, UI/UX design, AI engineering, and growth marketing. We staff each project with the specific specialists it needs rather than a one-size-fits-all pod.',
  },
  {
    q: 'Do you outsource any part of the work?',
    a: 'No. Every deliverable, from code to creative to campaigns, is produced by our in-house team in Gurgaon. That keeps quality consistent and means there is always someone accountable for your project.',
  },
  {
    q: 'Is ThinkSuite hiring?',
    a: 'We are always open to hearing from talented people even when we are not actively hiring for a specific role. Visit our careers page to see current openings or send your resume for future consideration.',
  },
]

export default function TeamPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>Team</span>
          </div>
          <span className="label">The People</span>
          <h1 className="mt-16">Meet Our <span className="grad-text">Team</span></h1>
          <p className="mt-16" style={{ maxWidth: 560, color: 'var(--text2)', fontSize: 18 }}>
            Passionate experts dedicated to turning your vision into extraordinary digital experiences.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-3">
            <div className="team-card reveal">
              <div className="team-img" style={{ background: 'linear-gradient(135deg, #004767, #00d4ff)', fontSize: 72, color: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', display: 'flex', fontFamily: 'var(--font-h)', fontWeight: 900 }}>
                AU
              </div>
              <div className="team-info">
                <div className="team-name">Aakash Upadhyay</div>
                <div className="team-role">Founder & CEO</div>
                <p className="team-bio">
                  Visionary entrepreneur and full-stack technologist with expertise in AI, software architecture,
                  and digital strategy. Leading ThinkSuite&apos;s mission to deliver next-generation digital solutions.
                </p>
                <div className="tag-list mb-16">
                  {['AI & ML', 'Full-Stack Dev', 'Product Strategy', 'Growth Hacking'].map((s) => (
                    <span key={s} className="chip" style={{ fontSize: 11 }}>{s}</span>
                  ))}
                </div>
                <div className="team-socials">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="team-social" aria-label="LinkedIn">
                    <i className="fa-brands fa-linkedin-in" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="team-social" aria-label="Twitter">
                    <i className="fa-brands fa-x-twitter" />
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="team-social" aria-label="GitHub">
                    <i className="fa-brands fa-github" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bio section */}
          <div className="team-bio-wrap reveal mt-48">
            <div className="team-bio-grid">
              <div>
                <span className="label">Founder Story</span>
                <h2 className="mt-16">Aakash <span className="text-cyan">Upadhyay</span></h2>
                <p className="mt-16 mb-16" style={{ color: 'var(--text2)', lineHeight: 1.85 }}>
                  Aakash Upadhyay is the visionary founder and CEO of ThinkSuite, bringing together expertise
                  in artificial intelligence, software engineering, and digital marketing strategy to create
                  a truly full-stack digital agency.
                </p>
                <p style={{ color: 'var(--text2)', lineHeight: 1.85 }}>
                  With years of experience building products for startups and enterprises alike, Aakash founded
                  ThinkSuite with a clear mission: to give every business access to enterprise-grade digital
                  capabilities that actually drive growth.
                </p>
              </div>
              <div>
                <h4 className="mb-16">Core Expertise</h4>
                {['AI & Machine Learning', 'Full-Stack Development', 'Digital Marketing Strategy', 'Product Design', 'Business Consulting', 'Growth Hacking'].map((skill) => (
                  <div key={skill} className="highlight-item">
                    <div className="hi-icon sc-cyan"><i className="fa-solid fa-check" style={{ fontSize: 12 }} /></div>
                    <div className="hi-text"><strong>{skill}</strong></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: teamFaqs.map((f) => ({
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
            {teamFaqs.map((faq, i) => (
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

      <section className="cta-section">
        <div className="container">
          <span className="label reveal">Work With Us</span>
          <h2 className="mt-16 reveal">Join the <span className="grad-text">ThinkSuite Team</span></h2>
          <p className="reveal">We&apos;re always looking for talented individuals who are passionate about technology and digital innovation.</p>
          <div className="cta-btns reveal">
            <Link href="/contact" className="btn btn-primary btn-lg">Get In Touch <i className="fa-solid fa-arrow-right" /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
