'use client'

type NavProduct = {
  id: string
  emoji: string
  logo?: string
  name: string
  color: string
  accentBg: string
}

export default function EcosystemNav({ products }: { products: NavProduct[] }) {
  return (
    <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
      {products.map((p) => (
        <a
          key={p.id}
          href={`#${p.id}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '20px 28px', flexShrink: 0,
            borderRight: '1px solid var(--border)',
            fontSize: 14, fontWeight: 600, color: 'var(--text2)',
            textDecoration: 'none', transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color = p.color
            el.style.background = p.accentBg
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color = 'var(--text2)'
            el.style.background = 'transparent'
          }}
        >
          {p.logo
            ? <img src={p.logo} alt={p.name} style={{ width: 22, height: 22, objectFit: 'contain' }} />
            : <span style={{ fontSize: 18 }}>{p.emoji}</span>
          }
          {p.name}
        </a>
      ))}
    </div>
  )
}