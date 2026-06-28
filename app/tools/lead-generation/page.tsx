'use client'
import { useState } from 'react'
import ToolDemoAnimation from '@/components/tools/ToolDemoAnimation'
import ToolAuthModal from '@/components/tools/ToolAuthModal'

const FEATURE_BADGES = [
  { icon: '👥', title: '100+', subtitle: 'Leads Per Search', desc: 'Get high-quality leads instantly' },
  { icon: '🏙️', title: 'All Cities', subtitle: 'Find Leads Anywhere In India', desc: '' },
  { icon: '🎯', title: 'Any Niche', subtitle: 'Business Category Search', desc: 'Find leads in any industry' },
  { icon: '✅', title: 'Verified Data', subtitle: 'Real Verified Leads', desc: '100% accurate & reliable' },
]

const PLATFORM_ICONS = {
  google: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.69 2 6 4.69 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6z" fill="#1a237e"/>
      <circle cx="12" cy="8" r="2.2" fill="rgba(220,38,38,0.85)" stroke="#fff" strokeWidth="0.8"/>
    </svg>
  ),
  website: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="#1a237e" strokeWidth="1.6"/>
      <ellipse cx="12" cy="12" rx="4" ry="9.5" stroke="#1a237e" strokeWidth="1.6"/>
      <path d="M2.5 8.5 Q12 7 21.5 8.5" stroke="#1a237e" strokeWidth="1.6" fill="none"/>
      <path d="M2.5 15.5 Q12 17 21.5 15.5" stroke="#1a237e" strokeWidth="1.6" fill="none"/>
    </svg>
  ),
  traders: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="11" width="20" height="10" rx="1" fill="#1a237e"/>
      <rect x="4" y="7" width="3" height="4" fill="#1a237e"/>
      <rect x="10" y="5" width="3" height="6" fill="#1a237e"/>
      <rect x="16" y="7" width="3" height="4" fill="#1a237e"/>
      <rect x="10" y="15" width="4" height="6" fill="rgba(139,92,246,0.7)"/>
      <path d="M2 11 L7 6 L7 11" fill="#1a237e"/>
      <path d="M7 11 L13 4.5 L13 11" fill="#1a237e"/>
      <path d="M13 11 L19 6 L19 11" fill="#1a237e"/>
    </svg>
  ),
  instagram: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="#1a237e" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="4.2" stroke="#1a237e" strokeWidth="1.8"/>
      <circle cx="17.2" cy="6.8" r="1.1" fill="#1a237e"/>
    </svg>
  ),
  linkedin: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#1a237e">
      <rect x="3" y="8.5" width="3.5" height="12" rx="0.5"/>
      <circle cx="4.75" cy="5.25" r="1.9"/>
      <path d="M10 8.5h3.3v1.7c.7-1.1 2-1.9 3.5-1.9 2.8 0 4.2 1.8 4.2 5.1v7.1h-3.5v-6.5c0-1.5-.5-2.5-1.8-2.5-1 0-1.6.7-1.9 1.4-.1.3-.1.6-.1 1v6.6H10V8.5z"/>
    </svg>
  ),
  govt: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <polygon points="12,2.5 1.5,9 22.5,9" fill="#1a237e"/>
      <rect x="1.5" y="9" width="21" height="1.5" fill="#1a237e"/>
      <rect x="3" y="10.5" width="2" height="8.5" fill="#1a237e"/>
      <rect x="7" y="10.5" width="2" height="8.5" fill="#1a237e"/>
      <rect x="11" y="10.5" width="2" height="8.5" fill="#1a237e"/>
      <rect x="15" y="10.5" width="2" height="8.5" fill="#1a237e"/>
      <rect x="19" y="10.5" width="2" height="8.5" fill="#1a237e"/>
      <rect x="1.5" y="19" width="21" height="1.5" fill="#1a237e"/>
      <rect x="0.5" y="20.5" width="23" height="1.5" fill="#1a237e"/>
    </svg>
  ),
}

const PLATFORMS = [
  { icon: PLATFORM_ICONS.google, iconBg: 'linear-gradient(135deg,#fef2f2,#fee2e2)', name: 'Google Map Leads', desc: 'Extract leads from any location and niche on Google Maps.', badge: 'Popular', badgeColor: '#7c3aed', badgeBg: 'rgba(124,58,237,0.1)', featured: false },
  { icon: PLATFORM_ICONS.website, iconBg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', name: 'Website Leads', desc: 'Get leads from any website, directory or business listing.', badge: 'Popular', badgeColor: '#7c3aed', badgeBg: 'rgba(124,58,237,0.1)', featured: true },
  { icon: PLATFORM_ICONS.traders, iconBg: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', name: 'Traders / Suppliers', desc: 'Find verified traders and suppliers across industries.', badge: 'Beta', badgeColor: '#d97706', badgeBg: 'rgba(245,158,11,0.1)', featured: false },
  { icon: PLATFORM_ICONS.instagram, iconBg: 'linear-gradient(135deg,#fff7ed,#fde68a)', name: 'Instagram Leads', desc: 'Extract leads from business profiles and public accounts.', badge: 'Beta', badgeColor: '#d97706', badgeBg: 'rgba(245,158,11,0.1)', featured: false },
  { icon: PLATFORM_ICONS.linkedin, iconBg: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', name: 'LinkedIn Leads', desc: 'Get leads from LinkedIn profiles and company pages.', badge: null, badgeColor: null, badgeBg: null, featured: false },
  { icon: PLATFORM_ICONS.govt, iconBg: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', name: 'Government Tenders', desc: 'Find valid tender opportunities and government leads.', badge: 'Beta', badgeColor: '#d97706', badgeBg: 'rgba(245,158,11,0.1)', featured: false },
]

const WHO_CAN_USE = [
  {
    role: 'Digital Marketing\nAgency',
    desc: 'Build targeted local business lists for client prospecting, automate cold outreach, and generate 100+ new leads every week.',
    bullets: ['Target Local Businesses', 'Automate Outreach', 'Generate 100+ Leads Weekly'],
  },
  {
    role: 'Freelancer /\nSolo Consultant',
    desc: 'Find potential clients in your niche and reach out directly with ready-made cold emails — no salesperson needed.',
    bullets: ['Find Niche Clients', 'Ready-to-Send Emails', 'No Sales Experience Needed'],
  },
  {
    role: 'SaaS /\nSoftware Sales',
    desc: 'Find targeted businesses by city and industry, collect their website and phone details, and book demos.',
    bullets: ['Target by Industry & City', 'Get Verified Contact Details', 'Book More Demos'],
  },
  {
    role: 'Insurance /\nFinance Sales',
    desc: 'Build a list of local businesses — CA firms, clinics, retail shops — and pitch them your services.',
    bullets: ['Build Local Business Lists', 'Find Relevant Businesses', 'Pitch & Close More Deals'],
  },
]

const FAQS = [
  { q: 'How does the lead discovery work?', a: 'We use Vibe Prospecting AI to search verified business databases and find companies matching your niche, location, and size filters — delivering 100+ leads per search.' },
  { q: 'Are the leads real or fake?', a: '100% real — sourced directly from verified business databases. Only businesses with confirmed phone numbers, websites, and ratings appear in your results.' },
  { q: 'How many leads do I get per search?', a: 'Each search returns up to 100+ leads. You can expand your list by searching across different cities or niches. Paid plans unlock unlimited searches.' },
  { q: 'Can I send cold emails from my own Gmail account?', a: 'Yes! We integrate with Gmail via MCP so cold emails are sent from your own address — improving deliverability and keeping replies in your inbox.' },
  { q: 'What data is included in the CSV export?', a: 'Business name, phone number, website, address, rating, total reviews, category, LinkedIn URL, and Maps link — all in one clean, CRM-ready file.' },
  { q: 'Can I add a custom city or niche?', a: 'Yes! You can type any city and any business category — there are no restrictions on location or niche. The AI will find matching leads from across the country.' },
]

export default function LeadGenerationPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#f0f8ff', color: '#1a237e', fontFamily: "'Segoe UI',system-ui,-apple-system,sans-serif" }}>

        {/* HERO */}
        <section style={{ padding: '140px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#f0f8ff 0%,#e8f4fc 55%,#f0f8ff 100%)' }} />
            <div style={{ position: 'absolute', top: '-10%', left: '15%', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,35,126,0.08) 0%,transparent 65%)', animation: 'lgOrb1 14s ease-in-out infinite', filter: 'blur(55px)' }} />
            <div style={{ position: 'absolute', bottom: '-20%', right: '5%', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 65%)', animation: 'lgOrb2 18s ease-in-out infinite', filter: 'blur(70px)' }} />
            <div style={{ position: 'absolute', top: '40%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,188,212,0.05) 0%,transparent 65%)', animation: 'lgOrb3 23s ease-in-out infinite', filter: 'blur(65px)' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,35,126,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(26,35,126,0.025) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
          </div>

          <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,35,126,0.07)', border: '1px solid rgba(26,35,126,0.18)', borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
              <span style={{ fontSize: 12 }}>✦</span>
              <span style={{ fontSize: 13, color: '#1a237e', fontWeight: 600 }}>#1 AI-Powered B2B Lead Generation Tool</span>
            </div>

            <h1 style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px', color: '#0f172a' }}>
              <span style={{ background: 'linear-gradient(90deg,#1a237e,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Find 100+ Verified B2B Leads
              </span>
              <br />
              <span style={{ color: '#0f172a' }}>From Any City, </span>
              <span style={{ background: 'linear-gradient(90deg,#7c3aed,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Any Industry Instantly
              </span>
            </h1>

            <p style={{ fontSize: 'clamp(16px,2.5vw,20px)', color: '#64748b', lineHeight: 1.6, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
              Target any city, any niche. Get verified phone numbers, websites &amp; ratings. ThinkSuite AI writes a ready-to-send cold email via Gmail. Export 100+ leads to CSV or Google Drive in one click.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
              <button onClick={() => setAuthOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(90deg,#1a237e,#3b82f6)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 12, boxShadow: '0 8px 32px rgba(26,35,126,0.25)', cursor: 'pointer', fontFamily: 'inherit' }}>
                <span>🎯</span> Find 100+ Leads Free
              </button>
              <a href="#how-it-works" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid rgba(26,35,126,0.15)', color: '#1a237e', textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '14px 32px', borderRadius: 12 }}>
                How It Works
              </a>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { icon: '🗺️', label: 'Real Verified Data' },
                { icon: '✅', label: 'Verified Business Info' },
                { icon: '⬇️', label: 'Export CSV in 1 Click' },
              ].map((b) => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ffffff', border: '1px solid rgba(26,35,126,0.12)', borderRadius: 100, padding: '7px 16px', fontSize: 13, color: '#64748b' }}>
                  <span>{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURE BADGES */}
        <section style={{ padding: '0 24px 72px' }}>
          <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
            {FEATURE_BADGES.map((b) => (
              <div key={b.title} style={{ background: '#ffffff', border: '1px solid rgba(26,35,126,0.09)', borderRadius: 18, padding: '22px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, boxShadow: '0 2px 12px rgba(26,35,126,0.05)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {b.icon}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{b.title}</div>
                  <div style={{ fontSize: 13, color: '#334155', marginTop: 2 }}>{b.subtitle}</div>
                  {b.desc && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{b.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={{ padding: '80px 24px', background: 'rgba(26,35,126,0.02)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <h2 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
                How It Works
              </h2>
              <p style={{ color: '#64748b', fontSize: 17 }}>
                Get 100+ verified B2B leads from any city and any industry in just{' '}
                <span style={{ color: '#1a237e', fontWeight: 600 }}>3 simple steps</span>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', flexWrap: 'wrap' }}>
              {/* Card 1 */}
              <div style={{ flex: '1 1 280px', display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1, background: '#ffffff', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 20, padding: '28px 22px', display: 'flex', flexDirection: 'column', minHeight: 480, position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(26,35,126,0.06)' }}>
                  <div style={{ position: 'absolute', top: '-30%', left: '-20%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 18, flexShrink: 0, zIndex: 1 }}>1</div>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16, zIndex: 1 }}>⊞</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 6, zIndex: 1 }}>Choose Category</h3>
                  <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.5, zIndex: 1 }}>Select the niche or category you want leads from</p>
                  <div style={{ zIndex: 1 }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Select Category</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8faff', border: '1px solid rgba(26,35,126,0.12)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#334155', marginBottom: 10 }}>
                      <span>AI Automation</span>
                      <span style={{ color: '#94a3b8', fontSize: 10 }}>▼</span>
                    </div>
                    <div style={{ background: '#f8faff', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 10, overflow: 'hidden' }}>
                      {[
                        { label: 'AI Automation', active: true },
                        { label: 'Digital Marketing', active: false },
                        { label: 'Software Development', active: false },
                        { label: 'HR & Recruitment', active: false },
                        { label: 'IT Services', active: false },
                        { label: 'Consulting Services', active: false },
                      ].map((item) => (
                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: item.active ? 'rgba(124,58,237,0.07)' : 'transparent', borderLeft: item.active ? '3px solid #7c3aed' : '3px solid transparent', fontSize: 12, color: item.active ? '#7c3aed' : '#64748b', fontWeight: item.active ? 700 : 400 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.active ? '#7c3aed' : '#cbd5e1', flexShrink: 0 }} />
                          {item.label}
                        </div>
                      ))}
                      <div style={{ padding: '8px 12px', fontSize: 12, color: '#3b82f6', borderTop: '1px solid rgba(26,35,126,0.06)' }}>And many more...</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow 1→2 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px', flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#fff', boxShadow: '0 4px 16px rgba(59,130,246,0.2)' }}>→</div>
              </div>

              {/* Card 2 */}
              <div style={{ flex: '1 1 280px', display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1, background: '#ffffff', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 20, padding: '28px 22px', display: 'flex', flexDirection: 'column', minHeight: 480, position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(26,35,126,0.06)' }}>
                  <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 18, flexShrink: 0, zIndex: 1 }}>2</div>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16, zIndex: 1 }}>📍</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 6, zIndex: 1 }}>Choose Location</h3>
                  <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.5, zIndex: 1 }}>Select the city or location you want leads from</p>
                  <div style={{ zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8faff', border: '1px solid rgba(26,35,126,0.12)', borderRadius: 8, padding: '9px 12px', marginBottom: 16 }}>
                      <span style={{ fontSize: 14, color: '#94a3b8' }}>🔍</span>
                      <span style={{ fontSize: 13, color: '#94a3b8' }}>Search city...</span>
                    </div>
                    <div style={{ borderRadius: 14, background: 'linear-gradient(160deg,#eff6ff 0%,#dbeafe 100%)', border: '1px solid rgba(59,130,246,0.2)', padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 180, position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.05) 1px,transparent 1px)', backgroundSize: '28px 28px', borderRadius: 14 }} />
                      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 20px rgba(59,130,246,0.3)' }}>📍</div>
                        <div style={{ background: '#3b82f6', borderRadius: 8, padding: '4px 14px', fontSize: 13, color: '#fff', fontWeight: 700, boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}>Mumbai</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow 2→3 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px', flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#fff', boxShadow: '0 4px 16px rgba(59,130,246,0.2)' }}>→</div>
              </div>

              {/* Card 3 */}
              <div style={{ flex: '1 1 280px', display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1, background: '#ffffff', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 20, padding: '28px 22px', display: 'flex', flexDirection: 'column', minHeight: 480, position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(26,35,126,0.06)' }}>
                  <div style={{ position: 'absolute', bottom: '-20%', right: '-20%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 18, flexShrink: 0, zIndex: 1 }}>3</div>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16, zIndex: 1 }}>✨</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 6, zIndex: 1 }}>Get Leads Instantly</h3>
                  <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.5, zIndex: 1 }}>We find verified leads and show results instantly</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14, zIndex: 1 }}>
                    {['Searching verified databases...','Scanning business listings','Verifying contact details','Fetching websites & ratings','Preparing results'].map((step) => (
                      <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 9, color: '#22c55e' }}>✓</span>
                        </div>
                        {step}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#f8faff', border: '1px solid rgba(26,35,126,0.09)', borderRadius: 12, overflow: 'hidden', zIndex: 1 }}>
                    <div style={{ padding: '7px 12px', background: '#f0f4ff', borderBottom: '1px solid rgba(26,35,126,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
                        <span style={{ fontSize: 10, color: '#334155', fontWeight: 600 }}>100+ Leads Found</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <div style={{ padding: '2px 7px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 4, fontSize: 9, color: '#3b82f6', fontWeight: 600 }}>↑ Export CSV</div>
                        <div style={{ padding: '2px 7px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 4, fontSize: 9, color: '#7c3aed', fontWeight: 600 }}>◯ New Search</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr 0.6fr 0.3fr', padding: '5px 10px', borderBottom: '1px solid rgba(26,35,126,0.05)' }}>
                      {['Business Name','Category','Location','Phone','Web'].map(h => (
                        <div key={h} style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const }}>{h}</div>
                      ))}
                    </div>
                    {[
                      { name: 'ThinkSuite', cat: 'AI Automation', loc: 'Mumbai' },
                      { name: 'AutomateIt Solutions', cat: 'AI Automation', loc: 'Mumbai' },
                      { name: 'IntelliFlow Systems', cat: 'AI Automation', loc: 'Mumbai' },
                      { name: 'BotFusion Tech', cat: 'AI Automation', loc: 'Mumbai' },
                      { name: 'NeuralCraft AI', cat: 'AI Automation', loc: 'Mumbai' },
                      { name: 'Cognify Labs', cat: 'AI Automation', loc: 'Mumbai' },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr 0.6fr 0.3fr', padding: '6px 10px', borderBottom: '1px solid rgba(26,35,126,0.04)', background: i===0?'rgba(59,130,246,0.04)':'transparent' }}>
                        <div style={{ fontSize: 10, color: '#0f172a', fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap' as const, textOverflow: 'ellipsis' }}>{row.name}</div>
                        <div style={{ fontSize: 8, color: '#3b82f6', background: 'rgba(59,130,246,0.08)', borderRadius: 3, padding: '1px 4px', height: 'fit-content', width: 'fit-content' }}>{row.cat}</div>
                        <div style={{ fontSize: 9, color: '#64748b' }}>{row.loc}</div>
                        <div style={{ fontSize: 9, color: '#22c55e' }}>98*****</div>
                        <div style={{ fontSize: 11, color: '#3b82f6' }}>🌐</div>
                      </div>
                    ))}
                    <div style={{ padding: '6px 10px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {['✓ Verified Data','🗺️ Real Verified Results','↑ Ready to Export'].map(b => (
                        <div key={b} style={{ fontSize: 8, color: '#94a3b8', background: 'rgba(26,35,126,0.04)', borderRadius: 3, padding: '2px 6px' }}>{b}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, background: '#ffffff', border: '1px solid rgba(26,35,126,0.09)', borderRadius: 16, padding: '18px 28px', maxWidth: 640, margin: '40px auto 0', boxShadow: '0 2px 12px rgba(26,35,126,0.05)' }}>
              <span style={{ fontSize: 28 }}>🚀</span>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                That&apos;s it! You get <span style={{ color: '#1a237e', fontWeight: 700 }}>verified leads</span> with phone numbers, websites, ratings and more &mdash; ready to export.
              </p>
            </div>
          </div>
        </section>

        {/* PLATFORM SOURCES */}
        <section style={{ padding: '80px 24px', background: '#ffffff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <h2 style={{ fontSize: 'clamp(28px,4.5vw,50px)', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
                Where Can You{' '}
                <span style={{ background: 'linear-gradient(90deg,#7c3aed,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Generate Leads
                </span>{' '}
                From?
              </h2>
              <p style={{ color: '#64748b', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
                Extract high-quality leads from multiple trusted platforms and sources to grow your business.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 18, marginBottom: 40 }}>
              {PLATFORMS.map((p) => (
                <div key={p.name} style={{ background: p.featured ? 'rgba(59,130,246,0.04)' : '#ffffff', border: p.featured ? '1.5px solid rgba(59,130,246,0.3)' : '1px solid rgba(26,35,126,0.09)', borderRadius: 20, padding: '26px 22px', boxShadow: p.featured ? '0 4px 20px rgba(59,130,246,0.08)' : '0 2px 8px rgba(26,35,126,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: p.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, border: '1px solid rgba(26,35,126,0.08)' }}>
                      {p.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{p.name}</div>
                      {p.badge && p.badgeColor && p.badgeBg && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: p.badgeColor, background: p.badgeBg, borderRadius: 4, padding: '2px 8px', letterSpacing: 0.5 }}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
              {[
                { icon: '🛡️', iconBg: 'rgba(124,58,237,0.08)', title: '100% Verified Data', sub: 'Accurate & reliable leads' },
                { icon: '⚡', iconBg: 'rgba(245,158,11,0.08)', title: 'Instant Results', sub: 'Get leads in seconds' },
                { icon: '⬇️', iconBg: 'rgba(34,197,94,0.08)', title: 'Export in CSV', sub: 'Download & use anywhere' },
                { icon: '🔒', iconBg: 'rgba(59,130,246,0.08)', title: 'Safe & Secure', sub: 'No spam, no junk leads' },
              ].map((b) => (
                <div key={b.title} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#f8faff', border: '1px solid rgba(26,35,126,0.08)', borderRadius: 14, padding: '18px 20px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: b.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {b.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI WRITES. YOU CONNECT. */}
        <section style={{ padding: '80px 24px', background: 'rgba(26,35,126,0.02)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 56, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 340px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>✦</span> AI-Powered Outreach
              </div>
              <h2 style={{ fontSize: 'clamp(30px,4.5vw,52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
                <span style={{ color: '#0f172a' }}>AI Writes.</span>
                <br />
                <span style={{ background: 'linear-gradient(90deg,#1a237e,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>You Connect.</span>
              </h2>
              <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.7, marginBottom: 32 }}>
                Get personalized outreach messages crafted by AI in{' '}
                <span style={{ color: '#1a237e', fontStyle: 'italic' }}>seconds</span>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
                {[
                  { num: '1', title: 'Add Your Service', desc: 'Enter the service or solution you want to offer.' },
                  { num: '2', title: 'AI Crafts the Message', desc: 'Our AI understands the business and creates a highly personalized outreach message.' },
                  { num: '3', title: 'You Reach Out', desc: 'Copy the message and start conversations that convert.' },
                ].map((item) => (
                  <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(26,35,126,0.08)', border: '1px solid rgba(26,35,126,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#1a237e', flexShrink: 0 }}>
                      {item.num}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 14, color: '#94a3b8' }}>
                <span style={{ color: '#7c3aed', fontWeight: 700 }}>Personalized. Professional. Powerful.</span>
                <br />
                Save time and close more deals.
              </div>
            </div>

            <div style={{ flex: '1 1 380px' }}>
              <div style={{ background: '#ffffff', border: '1px solid rgba(26,35,126,0.09)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(26,35,126,0.08)' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(26,35,126,0.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>1</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>AI Outreach Message</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>What services / products do you offer? *</div>
                  <div style={{ background: '#f8faff', border: '1px solid rgba(26,35,126,0.1)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#334155', marginBottom: 8 }}>AI Automation</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 14 }}>AI will generate a personalized outreach message</div>
                  <div style={{ width: '100%', padding: '11px', background: 'linear-gradient(90deg,#1a237e,#7c3aed)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 13, textAlign: 'center' as const }}>
                    ✉️ Generate Message
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>2</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>AI Outreach Message</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(26,35,126,0.08)', border: '1px solid rgba(26,35,126,0.2)', borderRadius: 8, fontSize: 12, color: '#1a237e', fontWeight: 600, textAlign: 'center' as const }}>🇮🇳 English (India)</div>
                    <div style={{ flex: 1, padding: '8px 12px', background: '#f8faff', border: '1px solid rgba(26,35,126,0.09)', borderRadius: 8, fontSize: 12, color: '#64748b', textAlign: 'center' as const }}>Casual</div>
                  </div>
                  <div style={{ background: '#f8faff', border: '1px solid rgba(26,35,126,0.08)', borderRadius: 10, padding: '14px', fontSize: 12, color: '#334155', lineHeight: 1.8, marginBottom: 12 }}>
                    Hi [Business Name] Team! 👋
                    <br /><br />
                    I came across your work in AI Automation and really liked what you&apos;re building.
                    <br /><br />
                    Would love to explore how we can add value to your operations. Open to a quick 15-minute call this week?
                    <br /><br />
                    Looking forward to connecting!
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1, padding: '9px', background: '#f8faff', borderRadius: 8, fontSize: 12, color: '#64748b', textAlign: 'center' as const, border: '1px solid rgba(26,35,126,0.09)' }}>← Change</div>
                    <div style={{ flex: 2, padding: '9px', background: 'linear-gradient(90deg,#1a237e,#7c3aed)', borderRadius: 8, fontSize: 12, color: '#fff', textAlign: 'center' as const, fontWeight: 700 }}>📋 Copy Message</div>
                  </div>
                  <div style={{ textAlign: 'center' as const, fontSize: 11, color: '#94a3b8' }}>✏️ Customize &amp; Regenerate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHO CAN USE */}
        <section style={{ padding: '80px 24px', background: '#ffffff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,35,126,0.06)', border: '1px solid rgba(26,35,126,0.12)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
                <span style={{ fontSize: 12 }}>👥</span>
                <span style={{ fontSize: 12, color: '#1a237e', fontWeight: 600 }}>Built for Every Growth Mindset</span>
              </div>
              <h2 style={{ fontSize: 'clamp(28px,4.5vw,48px)', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
                Who Can Use{' '}
                <span style={{ background: 'linear-gradient(90deg,#7c3aed,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  This Tool?
                </span>
              </h2>
              <p style={{ color: '#64748b', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
                Whether you&apos;re an agency, freelancer, salesperson, or founder &mdash; this tool helps you{' '}
                <span style={{ color: '#1a237e' }}>find</span>,{' '}
                <span style={{ color: '#7c3aed' }}>connect</span>, and{' '}
                <span style={{ color: '#22c55e' }}>grow</span> with the right leads.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 28 }}>
              {WHO_CAN_USE.map((u) => (
                <div key={u.role} style={{ background: '#f8faff', border: '1px solid rgba(26,35,126,0.09)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 2px 12px rgba(26,35,126,0.05)' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 10, whiteSpace: 'pre-line' as const }}>{u.role}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, marginBottom: 16 }}>{u.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {u.bullets.map((b) => (
                      <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#334155' }}>
                        <span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span>
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', background: 'rgba(26,35,126,0.04)', border: '1px solid rgba(26,35,126,0.09)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <span style={{ fontSize: 24 }}>⚡</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Different Goals. Same Powerful Tool.</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>One platform. Multiple use cases. Unlimited opportunities.</div>
              </div>
            </div>
          </div>
        </section>

        {/* GUARANTEE + DEMO (dark navy section for contrast) */}
        <section style={{ padding: '56px 24px', background: 'linear-gradient(180deg,#1a237e 0%,#0d1757 100%)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 56, background: 'rgba(255,255,255,0.06)', borderRadius: 32, padding: '44px 64px', border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', position: 'relative', flexWrap: 'wrap' }}>
              <div style={{ position: 'absolute', top: '-25%', left: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,188,212,0.2) 0%,transparent 65%)', filter: 'blur(90px)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-30%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
              <div style={{ width: '52%', minWidth: 280, flexShrink: 0, position: 'relative', zIndex: 1 }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 22, overflow: 'hidden' }}>
                  <div style={{ padding: '11px 16px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <div style={{ padding: '3px 18px', background: 'rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 10.5, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>🎯 AI Lead Generation</div>
                    </div>
                    <div style={{ padding: '3px 10px', background: 'rgba(0,188,212,0.25)', border: '1px solid rgba(0,188,212,0.4)', borderRadius: 100, fontSize: 9, color: '#00bcd4', fontWeight: 800 }}>PRO</div>
                  </div>
                  <ToolDemoAnimation slug="lead-generation" color="#3b82f6" />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 260, position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#00bcd4', letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 18 }}>ThinkSuite AI.</div>
                <h2 style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>High-quality results,<br />or your money back.</h2>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.9, marginBottom: 36, maxWidth: 420 }}>
                  On ThinkSuite AI, you can grow your business risk-free. Every AI tool is backed by our 7-day money-back guarantee so you can create, generate, and scale with total confidence.
                </p>
                <button onClick={() => setAuthOpen(true)}
                  style={{ display: 'inline-block', padding: '16px 48px', background: '#ffffff', border: 'none', borderRadius: 100, color: '#1a237e', fontSize: 15, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.2, boxShadow: '0 8px 40px rgba(255,255,255,0.2)' }}>
                  Try now →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '80px 24px', background: '#ffffff' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#0f172a', marginBottom: 40, textAlign: 'center' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FAQS.map((faq, i) => (
                <div key={faq.q} style={{ background: '#f8faff', border: `1px solid ${openFaq===i ? 'rgba(59,130,246,0.25)' : 'rgba(26,35,126,0.09)'}`, borderRadius: 14, overflow: 'hidden' }}>
                  <button onClick={() => setOpenFaq(openFaq===i ? null : i)}
                    style={{ width: '100%', padding: '18px 22px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontFamily: 'inherit', textAlign: 'left' as const }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>{faq.q}</span>
                    <span style={{ fontSize: 18, color: '#1a237e', flexShrink: 0, transform: openFaq===i ? 'rotate(45deg)' : 'none', display: 'block' }}>+</span>
                  </button>
                  {openFaq===i && (
                    <div style={{ padding: '0 22px 18px', fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <style>{`
          @keyframes lgOrb1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(70px,-65px) scale(1.15)}66%{transform:translate(-55px,80px) scale(0.88)}}
          @keyframes lgOrb2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-95px,-80px) scale(1.22)}70%{transform:translate(65px,45px) scale(0.82)}}
          @keyframes lgOrb3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(110px,-95px) scale(1.10)}}
        `}</style>
      </div>

      <ToolAuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} toolName="AI Lead Generation" />
    </>
  )
}
