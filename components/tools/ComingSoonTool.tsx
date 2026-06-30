'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Props {
  label: string
  icon: string
  color: string
  desc: string
  tags: string[]
}

export default function ComingSoonTool({ label, icon, color, desc, tags }: Props) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setDone(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#f0f8ff 0%,#e8f4fc 60%,#f0f8ff 100%)', padding: '120px 24px 60px', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '10%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle,${color}12 0%,transparent 65%)`, filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '5%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle,${color}08 0%,transparent 65%)`, filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,35,126,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(26,35,126,0.025) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${color}10`, border: `1.5px solid ${color}30`, borderRadius: 100, padding: '6px 18px', marginBottom: 28 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', animation: 'cssBlink 1.6s ease-in-out infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: 0.4 }}>Coming Soon</span>
        </div>

        {/* Icon */}
        <div style={{ width: 80, height: 80, borderRadius: 22, background: `${color}12`, border: `1.5px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, margin: '0 auto 24px', boxShadow: `0 8px 32px ${color}18` }}>
          {icon}
        </div>

        <h1 style={{ fontSize: 'clamp(28px,6vw,48px)', fontWeight: 900, color: '#0f172a', marginBottom: 12, letterSpacing: -1 }}>
          {label}
        </h1>
        <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.75, marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>
          {desc}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 36 }}>
          {tags.map(tag => (
            <span key={tag} style={{ padding: '6px 14px', background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 100, fontSize: 12, color: '#334155', fontWeight: 600 }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Notify form */}
        <div style={{ background: '#ffffff', border: '1px solid rgba(26,35,126,0.10)', borderRadius: 20, padding: '28px 28px', boxShadow: '0 8px 40px rgba(26,35,126,0.07)', marginBottom: 28 }}>
          {done ? (
            <div style={{ padding: '8px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>You&apos;re on the list!</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>We&apos;ll notify you as soon as {label} is live.</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Get early access</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Be the first to know when {label} launches</div>
              <form onSubmit={handleNotify} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{ flex: 1, padding: '11px 14px', border: '1.5px solid rgba(26,35,126,0.14)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#f8faff', color: '#0f172a' }}
                />
                <button type="submit" disabled={loading}
                  style={{ padding: '11px 20px', background: `linear-gradient(135deg,${color},${color}cc)`, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, opacity: loading ? 0.7 : 1 }}>
                  {loading ? '...' : 'Notify Me'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Back links */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/tools" style={{ fontSize: 13, color: '#1a237e', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            ← View Live Tools
          </Link>
          <Link href="/tools/lead-generation" style={{ fontSize: 13, color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>
            Try Lead Generation →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes cssBlink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}
