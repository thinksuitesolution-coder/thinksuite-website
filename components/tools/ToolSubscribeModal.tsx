'use client'
import { useState, useEffect } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  toolSlug: string
  toolName: string
  toolColor: string
  toolIcon: string
  userId: string
  onSubscribed: () => void
}

const MONTHLY_PRICES: Record<string, number> = {
  'content': 999,
  'voice': 999,
  'imagestudio': 999,
  'video': 1499,
}

const ADMIN_COUPON = 'admin@@2026'

declare global {
  interface Window { Razorpay: new (opts: Record<string, unknown>) => { open(): void } }
}

function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Razorpay) { resolve(); return }
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load payment SDK'))
    document.head.appendChild(s)
  })
}

export default function ToolSubscribeModal({
  isOpen, onClose, toolSlug, toolName, toolColor, toolIcon, userId, onSubscribed,
}: Props) {
  const [selected, setSelected] = useState<'monthly' | 'sixmonth' | 'annual'>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [coupon, setCoupon] = useState('')
  const [couponError, setCouponError] = useState('')

  const isLeadGen = toolSlug === 'lead-generation'

  const monthly = MONTHLY_PRICES[toolSlug] ?? 999
  const sixMonth = Math.round(monthly * 6 * 0.8)
  const annual = Math.round(monthly * 12 * 0.67)

  const plans = isLeadGen
    ? [
        {
          id: 'monthly' as const,
          label: '500 Leads / Month',
          price: 5000,
          per: '/month',
          desc: '500 verified leads every month. All sources included.',
        },
      ]
    : [
        {
          id: 'monthly' as const,
          label: 'Monthly',
          price: monthly,
          per: '/month',
          desc: 'Full access. Cancel anytime.',
        },
        {
          id: 'sixmonth' as const,
          label: '6 Months',
          price: sixMonth,
          per: 'one-time',
          desc: `Save 20% — only ₹${Math.round(sixMonth / 6).toLocaleString()}/mo`,
          badge: 'Popular',
        },
        {
          id: 'annual' as const,
          label: 'Annual',
          price: annual,
          per: 'one-time',
          desc: `Save 33% — only ₹${Math.round(annual / 12).toLocaleString()}/mo`,
        },
      ]

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const selectedPlan = plans.find(p => p.id === selected)!

  const handleCoupon = () => {
    setCouponError('')
    if (coupon.trim() === ADMIN_COUPON) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ts_admin_bypass', '1')
      }
      onSubscribed()
      onClose()
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')
    try {
      await loadRazorpay()
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!key) throw new Error('Payment not configured. Contact support.')

      if (selected === 'monthly') {
        const r = await fetch('/api/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create_subscription', toolSlug, userId }),
        })
        const d = await r.json()
        if (!d.subscriptionId) throw new Error(d.error || 'Failed to create subscription')

        new window.Razorpay({
          key,
          subscription_id: d.subscriptionId,
          name: 'ThinkSuite AI',
          description: `${toolName} – Monthly Plan`,
          theme: { color: toolColor },
          handler: async (resp: Record<string, string>) => {
            const v = await fetch('/api/razorpay', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'verify_subscription',
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_subscription_id: resp.razorpay_subscription_id,
                razorpay_signature: resp.razorpay_signature,
                toolSlug, userId,
              }),
            })
            const vd = await v.json()
            if (vd.success) { onSubscribed(); onClose() }
            else setError(vd.error || 'Verification failed. Contact support.')
            setLoading(false)
          },
          modal: { ondismiss: () => setLoading(false) },
        }).open()
        return
      }

      // 6-month or annual — one-time Razorpay order
      const planType = selected === 'sixmonth' ? 'sixmonth' : 'annual'
      const r = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_order', planType, toolSlug, userId }),
      })
      const d = await r.json()
      if (!d.orderId) throw new Error(d.error || 'Failed to create order')

      new window.Razorpay({
        key,
        order_id: d.orderId,
        amount: d.amount,
        currency: 'INR',
        name: 'ThinkSuite AI',
        description: selected === 'sixmonth' ? `${toolName} – 6-Month Plan` : `${toolName} – Annual Plan`,
        theme: { color: toolColor },
        handler: async (resp: Record<string, string>) => {
          const v = await fetch('/api/razorpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'verify_payment',
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_signature: resp.razorpay_signature,
              planType,
              toolSlug, userId,
            }),
          })
          const vd = await v.json()
          if (vd.success) { onSubscribed(); onClose() }
          else setError(vd.error || 'Verification failed. Contact support.')
          setLoading(false)
        },
        modal: { ondismiss: () => setLoading(false) },
      }).open()

    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: 24, padding: '36px 32px', maxWidth: 440, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#94a3b8', lineHeight: 1, padding: 4, fontFamily: 'inherit' }}>×</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: `${toolColor}12`, border: `1.5px solid ${toolColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px' }}>
            {toolIcon}
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>Subscribe to {toolName}</h3>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Choose a plan to get full access</p>
        </div>

        {/* Plans */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {plans.map(plan => (
            <button key={plan.id} onClick={() => setSelected(plan.id)}
              style={{
                position: 'relative',
                background: selected === plan.id ? `${toolColor}08` : '#f8faff',
                border: `${selected === plan.id ? '2px' : '1.5px'} solid ${selected === plan.id ? toolColor : 'rgba(26,35,126,0.12)'}`,
                borderRadius: 14,
                padding: '14px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                transition: 'all 0.15s',
              }}>
              {'badge' in plan && plan.badge && (
                <span style={{ position: 'absolute', top: -9, right: 12, background: toolColor, color: '#fff', fontSize: 9.5, fontWeight: 800, borderRadius: 100, padding: '2px 10px', letterSpacing: 0.3 }}>
                  {plan.badge}
                </span>
              )}
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{plan.label}</div>
                <div style={{ fontSize: 11.5, color: '#64748b' }}>{plan.desc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: toolColor }}>₹{plan.price.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{plan.per}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: '#dc2626', marginBottom: 14 }}>
            {error}
          </div>
        )}

        {/* CTA */}
        <button onClick={handlePayment} disabled={loading}
          style={{ width: '100%', padding: 14, background: `linear-gradient(135deg,${toolColor},${toolColor}cc)`, border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, marginBottom: 12 }}>
          {loading ? 'Processing…' : `Pay ₹${selectedPlan.price.toLocaleString()} – Activate ${selectedPlan.label} →`}
        </button>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          {['🔒 Secure Payment', '7'].map(t => (
            <span key={t} style={{ fontSize: 10.5, color: '#94a3b8' }}>{t}</span>
          ))}
        </div>

        {/* Coupon Code */}
        <div style={{ borderTop: '1px solid rgba(26,35,126,0.1)', paddingTop: 16 }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>Have a coupon code?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={coupon}
              onChange={e => { setCoupon(e.target.value); setCouponError('') }}
              onKeyDown={e => e.key === 'Enter' && handleCoupon()}
              placeholder="Enter coupon code"
              style={{ flex: 1, padding: '10px 12px', border: `1px solid ${couponError ? 'rgba(239,68,68,0.4)' : 'rgba(26,35,126,0.15)'}`, borderRadius: 10, fontSize: 13, color: '#0f172a', background: '#f8faff', outline: 'none', fontFamily: 'inherit' }}
            />
            <button
              onClick={handleCoupon}
              style={{ padding: '10px 16px', background: 'rgba(26,35,126,0.08)', border: '1px solid rgba(26,35,126,0.15)', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#1a237e', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
            >
              Apply
            </button>
          </div>
          {couponError && (
            <div style={{ fontSize: 11.5, color: '#dc2626', marginTop: 6 }}>{couponError}</div>
          )}
        </div>
      </div>
    </div>
  )
}
