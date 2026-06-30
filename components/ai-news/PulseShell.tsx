'use client'
import { useState } from 'react'
import Link from 'next/link'

export interface PulseNavLink {
  label: string
  href: string
  icon: string
  active: boolean
}

export interface PulseTopic {
  label: string
  href: string
  color: string
}

export default function PulseShell({
  navLinks,
  topics,
  children,
}: {
  navLinks: PulseNavLink[]
  topics: PulseTopic[]
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="pulse-app">
      <aside className={`pulse-sidebar${sidebarOpen ? ' open' : ''}`}>
        <Link href="/ai-news" className="pulse-logo" onClick={() => setSidebarOpen(false)}>
          <span className="pulse-logo-icon"><i className="fa-solid fa-wave-square" style={{ color: '#fff', fontSize: 12 }} /></span>
          AI Pulse
        </Link>

        {navLinks.map(l => (
          <Link
            key={l.label}
            href={l.href}
            className={`pulse-nav-item${l.active ? ' active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <i className={`fa-solid ${l.icon}`} />
            {l.label}
          </Link>
        ))}

        <div className="pulse-sidebar-label">Topics</div>
        {topics.map(t => (
          <Link key={t.label} href={t.href} className="pulse-topic-item" onClick={() => setSidebarOpen(false)}>
            <span className="pulse-topic-dot" style={{ background: t.color }} />
            {t.label}
          </Link>
        ))}
      </aside>

      <div className="pulse-main">
        <div className="pulse-topbar">
          <button className="pulse-mobile-toggle" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">
            <i className="fa-solid fa-bars" />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
