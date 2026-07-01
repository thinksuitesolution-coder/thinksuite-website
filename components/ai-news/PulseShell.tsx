'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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

export interface FilterItem {
  label: string
  value: string
  param: 'company' | 'industry' | 'eventType'
}

export default function PulseShell({
  navLinks,
  topics,
  filters,
  children,
}: {
  navLinks: PulseNavLink[]
  topics: PulseTopic[]
  filters?: FilterItem[]
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const searchParams = useSearchParams()

  const company = searchParams.get('company')
  const industry = searchParams.get('industry')
  const eventType = searchParams.get('eventType')

  function filterHref(param: string, value: string) {
    const p = new URLSearchParams(searchParams.toString())
    if (p.get(param) === value) {
      p.delete(param)
    } else {
      p.set(param, value)
    }
    const qs = p.toString()
    return `/ai-news${qs ? `?${qs}` : ''}`
  }

  const llmFilters = filters?.filter(f => f.param === 'company') ?? []
  const industryFilters = filters?.filter(f => f.param === 'industry') ?? []
  const typeFilters = filters?.filter(f => f.param === 'eventType') ?? []

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

        {llmFilters.length > 0 && (
          <>
            <div className="pulse-sidebar-label">By LLM / Company</div>
            {llmFilters.map(f => (
              <Link
                key={f.value}
                href={filterHref('company', f.value)}
                className={`pulse-nav-item${company === f.value ? ' active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fa-solid fa-building" />
                {f.label}
              </Link>
            ))}
          </>
        )}

        {industryFilters.length > 0 && (
          <>
            <div className="pulse-sidebar-label">By Industry</div>
            {industryFilters.map(f => (
              <Link
                key={f.value}
                href={filterHref('industry', f.value)}
                className={`pulse-nav-item${industry === f.value ? ' active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fa-solid fa-industry" />
                {f.label}
              </Link>
            ))}
          </>
        )}

        {typeFilters.length > 0 && (
          <>
            <div className="pulse-sidebar-label">By Type</div>
            {typeFilters.map(f => (
              <Link
                key={f.value}
                href={filterHref('eventType', f.value)}
                className={`pulse-nav-item${eventType === f.value ? ' active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fa-solid fa-tag" />
                {f.label}
              </Link>
            ))}
          </>
        )}

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
