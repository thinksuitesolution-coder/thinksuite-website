'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

const TOOL_FEATURES: Record<string, string[]> = {
  'lead-generation': ['Find 100+ verified B2B leads instantly', 'AI cold email via Gmail', 'Export to CSV & Google Drive'],
  'content': ['Blog posts, ads & email campaigns', 'SEO-optimized content in seconds', 'Generate in 10+ Indian languages'],
  'voice': ['28+ languages & regional accents', 'Voice cloning from 30-sec sample', 'Studio-quality MP3 download'],
  'imagestudio': ['DALL-E 3 & GPT Image 1 access', 'Bulk poster generation', '4x AI upscaling & background removal'],
  'video': ['Text to video with Veo 2', 'AI avatar & lip sync', 'Up to 4K resolution output'],
}

const DEFAULT_FEATURES = ['Access all AI tools in one account', 'Manage all subscriptions easily', 'Cancel or upgrade anytime']

interface Props {
  isOpen: boolean
  onClose: () => void
  toolName: string
  slug?: string
  selectedPlan?: string | null
  defaultTab?: 'login' | 'signup'
  redirectTo?: string
}

export default function ToolAuthModal({ isOpen, onClose, toolName, slug, selectedPlan, defaultTab = 'signup', redirectTo }: Props) {
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signInWithGoogle, user } = useAuth()
  const router = useRouter()

  useEffect(() => { setTab(defaultTab) }, [defaultTab])

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; setError('') }
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Auto-close if user is already logged in
  useEffect(() => {
    if (user && isOpen) {
      onClose()
      if (redirectTo) router.push(redirectTo)
    }
  }, [user, isOpen])

  if (!isOpen) return null

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      onClose()
      if (redirectTo) router.push(redirectTo)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed. Please try again.'
      if (!msg.includes('popup-closed')) setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tool-modal-overlay">
      <div className="tool-modal-backdrop" onClick={onClose} />
      <div className="tool-modal-card">
        <button className="tool-modal-close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>

        <div className="tool-modal-header">
          <div className="tool-modal-icon">
            <i className="fa-solid fa-bolt" />
          </div>
          <h3 style={{ marginBottom: 6 }}>
            {tab === 'login' ? 'Welcome Back' : 'Get Started Free'}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text2)', margin: 0 }}>{toolName}</p>
          {selectedPlan && (
            <span className="tool-modal-plan-tag">{selectedPlan} Plan</span>
          )}
        </div>

        <div className="tool-modal-tabs">
          <button className={`tool-modal-tab${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); setError('') }}>
            Login
          </button>
          <button className={`tool-modal-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => { setTab('signup'); setError('') }}>
            Sign Up
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          {/* Google Sign-In */}
          <button onClick={handleGoogle} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '13px 20px', background: loading ? '#f1f5f9' : '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: '#0f172a', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>
            {loading ? (
              <i className="fa-solid fa-circle-notch fa-spin" style={{ color: '#1a237e' }} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            {loading ? 'Signing in…' : tab === 'login' ? 'Continue with Google' : 'Sign up with Google'}
          </button>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: 6 }} />
              {error}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 12, color: '#94a3b8' }}>Free forever • No credit card needed</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(slug ? (TOOL_FEATURES[slug] ?? DEFAULT_FEATURES) : DEFAULT_FEATURES).map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155' }}>
                <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 14 }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>

        <p className="tool-modal-footer" style={{ marginTop: 16 }}>
          By continuing, you agree to our{' '}
          <a href="/terms-and-conditions" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Terms</a>
          {' & '}
          <a href="/privacy-policy" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
