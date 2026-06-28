'use client'
import { useState, useEffect } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  toolName: string
  selectedPlan?: string | null
}

export default function ToolAuthModal({ isOpen, onClose, toolName, selectedPlan }: Props) {
  const [tab, setTab] = useState<'login' | 'signup'>('signup')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; setDone(false) }
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setDone(true)
  }

  return (
    <div className="tool-modal-overlay">
      <div className="tool-modal-backdrop" onClick={onClose} />
      <div className="tool-modal-card">
        <button className="tool-modal-close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>

        {done ? (
          <div className="tool-modal-success">
            <div className="tool-modal-success-icon">
              <i className="fa-solid fa-check" />
            </div>
            <h3 style={{ marginBottom: 8 }}>
              {tab === 'login' ? 'Welcome Back!' : 'Account Created!'}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text2)', marginBottom: 0 }}>
              Redirecting to {toolName} dashboard…
            </p>
            <div className="tool-modal-progress">
              <div className="tool-modal-progress-bar" />
            </div>
          </div>
        ) : (
          <>
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
              <button
                className={`tool-modal-tab${tab === 'login' ? ' active' : ''}`}
                onClick={() => setTab('login')}
              >
                Login
              </button>
              <button
                className={`tool-modal-tab${tab === 'signup' ? ' active' : ''}`}
                onClick={() => setTab('signup')}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {tab === 'signup' && (
                <input
                  className="tool-modal-inp"
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              )}
              <input
                className="tool-modal-inp"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                className="tool-modal-inp"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {tab === 'signup' && (
                <input
                  className="tool-modal-inp"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                />
              )}
              {tab === 'login' && (
                <div className="tool-modal-forgot">Forgot password?</div>
              )}
              <button type="submit" className="tool-modal-submit" disabled={loading}>
                {loading
                  ? <><i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: 8 }} />Please wait…</>
                  : tab === 'login' ? 'Login to Dashboard' : 'Create Free Account'
                }
              </button>
            </form>

            <p className="tool-modal-footer">
              {tab === 'login' ? (
                <>New here?{' '}
                  <span className="tool-modal-toggle" onClick={() => setTab('signup')}>Create an account</span>
                </>
              ) : (
                <>Already have an account?{' '}
                  <span className="tool-modal-toggle" onClick={() => setTab('login')}>Login</span>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
