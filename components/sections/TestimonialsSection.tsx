import SectionHeading from '@/components/ui/SectionHeading'

type Part = { t: string; h?: boolean }

const REVIEWS: {
  bg: string; notebook: boolean; pin: string;
  parts: Part[]; name: string; role: string;
  co: string; co2?: string; icon: string; ic: string; ib: string; rot: string;
}[] = [
  {
    bg: '#FEFDFB', notebook: true, pin: '#DC2626',
    parts: [
      { t: 'ThinkSuite completely transformed our digital presence and helped us generate ' },
      { t: '3X more qualified leads', h: true },
      { t: ' within just 3 months.' },
    ],
    name: 'Rohit Sharma', role: 'Founder, PropEdge Realty',
    co: 'PropEdge', co2: 'REALTY', icon: 'fa-house', ic: '#2563EB', ib: '#EFF6FF', rot: '-0.5deg',
  },
  {
    bg: '#EDE9F8', notebook: false, pin: '#2563EB',
    parts: [
      { t: 'From branding to performance marketing, ThinkSuite delivered ' },
      { t: 'exceptional results.', h: true },
      { t: ' Our ROI has never been better!' },
    ],
    name: 'Anjali Mehta', role: 'CEO, StyleCart',
    co: 'StyleCart', icon: 'fa-bag-shopping', ic: '#2563EB', ib: '#EFF6FF', rot: '0.5deg',
  },
  {
    bg: '#FEFCE8', notebook: false, pin: '#D97706',
    parts: [{ t: 'Excellent communication, on-time delivery, and a proactive team. ThinkSuite is now an integral part of our growth journey.' }],
    name: 'Karan Verma', role: 'Growth Head, LearnVault Academy',
    co: 'LearnVault', co2: 'ACADEMY', icon: 'fa-shield-halved', ic: '#2563EB', ib: '#EFF6FF', rot: '-0.3deg',
  },
  {
    bg: '#E0EEFB', notebook: false, pin: '#16A34A',
    parts: [
      { t: 'Their SEO and content strategy helped us rank on top for key keywords and increased organic traffic by ' },
      { t: '180% in 6 months!', h: true },
    ],
    name: 'Vivek Nair', role: 'Marketing Manager, GreenHabit Living',
    co: 'GreenHabit', co2: 'LIVING', icon: 'fa-leaf', ic: '#16A34A', ib: '#F0FDF4', rot: '0.7deg',
  },
  {
    bg: '#FFFDE7', notebook: false, pin: '#1F2937',
    parts: [{ t: "The team at ThinkSuite doesn't just deliver services, they become your growth partners. Our sales pipeline grew by 2.4X in just 4 months!" }],
    name: 'Arjun Malhotra', role: 'Co-founder, Buildora',
    co: 'Buildora', icon: 'fa-gear', ic: '#EA580C', ib: '#FFF7ED', rot: '-0.4deg',
  },
  {
    bg: '#FCE7F3', notebook: false, pin: '#DC2626',
    parts: [{ t: 'Professional, reliable, and result-oriented. They truly understand what businesses need to scale. Highly recommended!' }],
    name: 'Neha Bansal', role: 'Business Owner, Glamiva Beauty',
    co: 'Glamiva', co2: 'BEAUTY', icon: 'fa-star', ic: '#DB2777', ib: '#FDF2F8', rot: '0.6deg',
  },
  {
    bg: '#FEFDFB', notebook: true, pin: '#D97706',
    parts: [{ t: 'Our app downloads and user engagement increased significantly after their app marketing campaign.' }],
    name: 'Siddharth Iyer', role: 'Product Lead, FitZone App',
    co: 'FitZone', co2: 'APP', icon: 'fa-person-running', ic: '#2563EB', ib: '#EFF6FF', rot: '-0.8deg',
  },
  {
    bg: '#FEFDFB', notebook: true, pin: '#7C3AED',
    parts: [{ t: 'ThinkSuite automated our marketing and lead nurturing. Our conversions improved by 70% while reducing ad spend!' }],
    name: 'Pooja Singh', role: 'CMO, EduBridge Learning',
    co: 'EduBridge', co2: 'LEARNING', icon: 'fa-graduation-cap', ic: '#16A34A', ib: '#F0FDF4', rot: '0.3deg',
  },
  {
    bg: '#DCFCE7', notebook: false, pin: '#DC2626',
    parts: [{ t: 'Their performance marketing strategies delivered quality leads consistently and helped us achieve 3X better ROI.' }],
    name: 'Manish Gupta', role: 'Director, SaaSDrive',
    co: 'SaaSDrive', icon: 'fa-cloud', ic: '#16A34A', ib: '#F0FDF4', rot: '-0.5deg',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          label="♥ CLIENT LOVE"
          title={<>Wall of <span className="text-accent">Client Love</span></>}
          subtitle="Real feedback from real clients who achieved real results with ThinkSuite."
          center
        />

        {/* Wooden frame outer */}
        <div style={{
          background: 'linear-gradient(135deg, #6B3A1F 0%, #8B4513 40%, #7A3B10 60%, #5C2D0A 100%)',
          borderRadius: 18,
          padding: 14,
          boxShadow: '0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          {/* Cork board inner */}
          <div style={{
            borderRadius: 8,
            padding: '44px 32px 36px',
            backgroundColor: '#C8956C',
            backgroundImage: `
              radial-gradient(ellipse 80px 60px at 8% 15%, rgba(255,255,255,0.12) 0%, transparent 100%),
              radial-gradient(ellipse 120px 80px at 92% 85%, rgba(0,0,0,0.1) 0%, transparent 100%),
              radial-gradient(ellipse 60px 40px at 45% 35%, rgba(200,130,60,0.4) 0%, transparent 100%),
              radial-gradient(ellipse 40px 30px at 70% 60%, rgba(180,110,50,0.3) 0%, transparent 100%),
              radial-gradient(ellipse 80px 50px at 20% 75%, rgba(210,150,80,0.2) 0%, transparent 100%)
            `,
          }}>
            <div className="cork-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 28,
            }}>
              {REVIEWS.map((r, i) => (
                <div
                  key={i}
                  style={{
                    position: 'relative',
                    backgroundColor: r.bg,
                    borderRadius: 3,
                    padding: r.notebook ? '22px 20px 20px 48px' : '22px 20px 20px',
                    boxShadow: '2px 5px 18px rgba(0,0,0,0.28), 0 1px 3px rgba(0,0,0,0.18)',
                    transform: `rotate(${r.rot})`,
                    backgroundImage: r.notebook
                      ? `repeating-linear-gradient(transparent, transparent 26px, rgba(147,197,253,0.45) 26px, rgba(147,197,253,0.45) 27px), linear-gradient(90deg, transparent 40px, rgba(239,68,68,0.35) 40px, rgba(239,68,68,0.35) 41px, transparent 41px)`
                      : undefined,
                  }}
                >
                  {/* Thumbtack */}
                  <div style={{
                    position: 'absolute',
                    top: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.5), ${r.pin})`,
                      boxShadow: `0 3px 8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.4)`,
                    }} />
                    <div style={{
                      width: 4,
                      height: 9,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.5))',
                      borderRadius: '0 0 3px 3px',
                    }} />
                  </div>

                  {/* Notebook ring holes */}
                  {r.notebook && ([20, 42, 64] as number[]).map((topPct, j) => (
                    <div key={j} style={{
                      position: 'absolute',
                      left: 14,
                      top: `${topPct}%`,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#C8956C',
                      border: '2px solid #A87040',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
                    }} />
                  ))}

                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 2, marginBottom: 10, marginTop: 6 }}>
                    {[...Array(5)].map((_, si) => (
                      <i key={si} className="fa-solid fa-star" style={{ color: '#F59E0B', fontSize: 12 }} />
                    ))}
                  </div>

                  {/* Review text */}
                  <p style={{ fontSize: 13, color: '#1F2937', lineHeight: 1.72, margin: '0 0 14px', fontWeight: 400 }}>
                    {r.parts.map((p, pi) =>
                      p.h
                        ? <span key={pi} style={{ color: '#2563EB', fontWeight: 700 }}>{p.t}</span>
                        : <span key={pi}>{p.t}</span>
                    )}
                  </p>

                  {/* Divider */}
                  <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', marginBottom: 12 }} />

                  {/* Author + Company */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{r.name}</div>
                      <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 1 }}>{r.role}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 7,
                        backgroundColor: r.ib,
                        border: `1px solid ${r.ic}33`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <i className={`fa-solid ${r.icon}`} style={{ color: r.ic, fontSize: 13 }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{r.co}</div>
                        {r.co2 && <div style={{ fontSize: 9, color: '#9CA3AF', letterSpacing: 0.6, fontWeight: 600 }}>{r.co2}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .cork-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .cork-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
