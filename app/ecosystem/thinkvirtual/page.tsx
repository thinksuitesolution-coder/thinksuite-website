import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ThinkVirtual: Freelancer, Client & Influencer Network',
  description: 'ThinkVirtual is ThinkSuite\'s professional network where freelancers, clients, and influencers post projects, hire talent, and collaborate, starting with India\'s gig economy.',
  keywords: [
    'ThinkVirtual freelancer network',
    'freelancer client platform India',
    'post freelance projects online',
    'hire freelancers India',
    'influencer brand collaboration platform',
    'gig economy platform India',
    'freelance marketplace India',
    'professional networking platform India',
    'find freelance work online',
    'influencer marketing network',
    'freelancer client platform',
    'hire freelancers online worldwide',
    'freelance marketplace',
  ],
  alternates: { canonical: 'https://thinksuite.in/ecosystem/thinkvirtual' },
}

const COLOR = '#0891b2'
const ACCENT_BG = 'rgba(8,145,178,0.08)'
const BORDER = 'rgba(8,145,178,0.15)'

const features = [
  { icon: 'fa-briefcase', title: 'Post Projects', desc: 'Clients post work, freelancers apply and get hired fast, with no middlemen' },
  { icon: 'fa-user-tie', title: 'Freelancer Profiles', desc: 'Showcase your skills, portfolio, rates, and verified client reviews' },
  { icon: 'fa-star', title: 'Influencer Network', desc: 'Influencers connect with brands for paid campaigns and collaborations' },
  { icon: 'fa-handshake', title: 'Direct Collaboration', desc: 'Clients and talent work together in one shared workspace' },
  { icon: 'fa-chart-line', title: 'Career Growth', desc: 'Build your reputation, gather reviews, and grow your professional network' },
  { icon: 'fa-globe', title: 'Professional Network', desc: 'LinkedIn-style platform built for India\'s growing gig economy' },
]

const stats = [
  { num: 'Freelancers', label: 'Post & Apply' },
  { num: 'Clients', label: 'Hire Talent' },
  { num: 'Influencers', label: 'Connect With Brands' },
  { num: 'Coming Soon', label: 'Status' },
]

const steps = [
  { n: '01', title: 'Create Your Profile', desc: 'Sign up as a freelancer, client, or influencer and build your professional presence.' },
  { n: '02', title: 'Post or Browse Work', desc: 'Clients post projects with budgets. Freelancers browse and apply in minutes.' },
  { n: '03', title: 'Collaborate & Grow', desc: 'Work together, get paid, collect reviews, and build your reputation.' },
]

const faqs = [
  {
    q: 'What is ThinkVirtual used for?',
    a: 'ThinkVirtual is used to connect freelancers, clients, and influencers on one platform. Clients post projects and hire talent directly, freelancers build a profile and apply for work, and influencers connect with brands for paid campaigns, all without a middleman taking a cut.',
  },
  {
    q: 'Who can join ThinkVirtual?',
    a: 'ThinkVirtual is open to three kinds of users: clients who need work done, freelancers offering a skill or service, and influencers looking to collaborate with brands. India\'s creative and digital economy is the primary community it is built for.',
  },
  {
    q: 'How is ThinkVirtual different from a general freelance marketplace?',
    a: 'ThinkVirtual combines freelance hiring and influencer collaboration in a single professional network, rather than treating them as separate markets. Profiles carry portfolios and client reviews, so reputation is visible and follows a freelancer or influencer across every project.',
  },
  {
    q: 'Is ThinkVirtual only for full-time freelancers?',
    a: 'No. ThinkVirtual works for full-time freelancers, part-time creators, and influencers who take on brand collaborations alongside other work. Anyone building a professional reputation in India\'s gig or creative economy can create a profile.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function ThinkVirtualPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section style={{
        background: 'linear-gradient(135deg, #07091a 0%, #0c1a2e 50%, #061620 100%)',
        padding: '130px 0 80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(8,145,178,0.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24, background: 'rgba(8,145,178,0.15)',
            border: '1.5px solid rgba(8,145,178,0.35)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 28px',
          }}>
            <i className="fa-solid fa-diagram-project" style={{ color: COLOR, fontSize: 32 }} />
          </div>
          <span className="label" style={{ marginBottom: 16, display: 'inline-block', color: COLOR }}>THINKSUITE ECOSYSTEM</span>
          <h1 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, color: '#fff', marginBottom: 14, lineHeight: 1.1 }}>ThinkVirtual</h1>
          <p style={{ fontSize: 20, fontWeight: 600, color: COLOR, marginBottom: 20 }}>Network Connecting &amp; Project Platform</p>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.85 }}>
            ThinkVirtual is a professional network where freelancers, clients, and influencers connect, post projects, and collaborate directly, no middlemen. Built for India&apos;s creative and digital economy.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Join Waitlist <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="/ecosystem" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>All Products</Link>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderLeft: '1px solid var(--border)' }}>
            {stats.map((s) => (
              <div key={s.label} style={{ padding: '28px 20px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: COLOR, fontFamily: 'var(--font-h)', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6, fontWeight: 600, letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="label" style={{ marginBottom: 12, display: 'inline-block' }}>PLATFORM FEATURES</span>
            <h2>Everything You Need to <span className="grad-text">Connect &amp; Collaborate</span></h2>
            <p style={{ color: 'var(--text2)', maxWidth: 500, margin: '16px auto 0', fontSize: 16, lineHeight: 1.7 }}>
              Find work, hire talent, and grow your professional network, all in one place.
            </p>
          </div>
          <div className="grid-3" style={{ gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} style={{ background: 'var(--surface)', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: ACCENT_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <i className={`fa-solid ${f.icon}`} style={{ color: COLOR, fontSize: 18 }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="label" style={{ marginBottom: 12, display: 'inline-block' }}>HOW IT WORKS</span>
            <h2>Get Started in <span className="grad-text">3 Simple Steps</span></h2>
          </div>
          <div className="grid-3" style={{ gap: 28 }}>
            {steps.map((s) => (
              <div key={s.n} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '32px 28px' }}>
                <div style={{ fontSize: 48, fontWeight: 900, fontFamily: 'var(--font-h)', lineHeight: 1, marginBottom: 16, color: COLOR, opacity: 0.3 }}>{s.n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--white)', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: ACCENT_BG, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ marginBottom: 16 }}>Ready to Join <span className="grad-text">ThinkVirtual?</span></h2>
          <p style={{ color: 'var(--text2)', fontSize: 17, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Be among the first to access India&apos;s professional network for freelancers, clients, and creative talent.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Join Waitlist <i className="fa-solid fa-arrow-right" /></Link>
            <Link href="/ecosystem" className="btn btn-outline btn-lg">Explore All Products</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="label" style={{ marginBottom: 12, display: 'inline-block' }}>FAQ</span>
            <h2>Frequently Asked <span className="grad-text">Questions</span></h2>
          </div>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '24px 28px', marginBottom: 14 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: 'var(--white)', lineHeight: 1.45, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: COLOR, fontSize: 13, fontFamily: 'var(--font-m)', marginTop: 2, flexShrink: 0 }}>Q.</span>
                  {faq.q}
                </h3>
                <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.7, margin: 0, paddingLeft: 26 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
