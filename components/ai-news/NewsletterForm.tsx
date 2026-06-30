'use client'
import { useState } from 'react'

export default function NewsletterForm({ id }: { id?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/intelligence/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, edition: 'daily' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setMessage(data.message || 'Subscribed!')
      setStatus('done')
      setEmail('')
    } catch (err) {
      setMessage((err as Error).message)
      setStatus('error')
    }
  }

  return (
    <form id={id} onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="pulse-newsletter-input"
      />
      <button type="submit" className="pulse-newsletter-btn" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {message && (
        <div className={`pulse-newsletter-msg${status === 'error' ? ' error' : ''}`}>{message}</div>
      )}
    </form>
  )
}
