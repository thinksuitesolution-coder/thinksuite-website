'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PulseLink, usePulseQuery } from './pulse-query'

export interface PulseNavLink {
  label: string
  href: string
  icon: string
  /**
   * Leave unset on the query-driven /ai-news shell, where the highlight follows
   * the URL query and so can only be resolved in the browser. The category
   * pages have a real route per link and pass it explicitly.
   */
  active?: boolean
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

// Anchors inside the /ai-news shell filter in place; anything pointing at
// another route (the category pages, the newsletter jump link) navigates
// normally. Declared at module scope so toggling the mobile sidebar re-renders
// these rather than remounting them.
function Anchor({
  href,
  className,
  queryDriven,
  onClose,
  children,
}: {
  href: string
  className: string
  queryDriven: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (queryDriven && href.startsWith('/ai-news')) {
    return <PulseLink href={href} className={className} onNavigate={onClose}>{children}</PulseLink>
  }
  return <Link href={href} className={className} onClick={onClose}>{children}</Link>
}

export default function PulseShell({
  navLinks,
  topics,
  filters,
  queryDriven = false,
  children,
}: {
  navLinks: PulseNavLink[]
  topics: PulseTopic[]
  filters?: FilterItem[]
  /** Filter clicks rewrite the query string in place instead of navigating. */
  queryDriven?: boolean
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { params } = usePulseQuery()

  const company = params.get('company')
  const industry = params.get('industry')
  const eventType = params.get('eventType')
  const tab = params.get('tab')
  const category = params.get('category')
  const q = params.get('q')
  const hasActiveFilter = !!(company || industry || eventType || category || q)

  // Only consulted when a nav link doesn't carry its own `active`.
  function navActive(label: string): boolean {
    switch (label) {
      case 'Home':     return !tab && !hasActiveFilter
      case 'Latest':   return (!tab || tab === 'latest') && !category
      case 'Trending': return tab === 'popular'
      case 'Research': return category === 'Research'
      case 'Tools':    return category === 'Tools'
      case 'Funding':  return category === 'Funding'
      default:         return false
    }
  }

  function filterHref(param: string, value: string) {
    const p = new URLSearchParams(params.toString())
    if (p.get(param) === value) {
      p.delete(param)
    } else {
      p.set(param, value)
    }
    p.delete('page')
    const qs = p.toString()
    return `/ai-news${qs ? `?${qs}` : ''}`
  }

  const close = () => setSidebarOpen(false)

  const llmFilters = filters?.filter(f => f.param === 'company') ?? []
  const industryFilters = filters?.filter(f => f.param === 'industry') ?? []
  const typeFilters = filters?.filter(f => f.param === 'eventType') ?? []

  return (
    <div className="pulse-app">
      <aside className={`pulse-sidebar${sidebarOpen ? ' open' : ''}`}>
        <Anchor href="/ai-news" className="pulse-logo" queryDriven={queryDriven} onClose={close}>
          <span className="pulse-logo-icon"><i className="fa-solid fa-wave-square" style={{ color: '#fff', fontSize: 12 }} /></span>
          AI Pulse
        </Anchor>

        {navLinks.map(l => (
          <Anchor
            key={l.label}
            href={l.href}
            className={`pulse-nav-item${(l.active ?? navActive(l.label)) ? ' active' : ''}`}
            queryDriven={queryDriven}
            onClose={close}
          >
            <i className={`fa-solid ${l.icon}`} />
            {l.label}
          </Anchor>
        ))}

        {llmFilters.length > 0 && (
          <>
            <div className="pulse-sidebar-label">By LLM / Company</div>
            {llmFilters.map(f => (
              <Anchor
                key={f.value}
                href={filterHref('company', f.value)}
                className={`pulse-nav-item${company === f.value ? ' active' : ''}`}
                queryDriven={queryDriven}
                onClose={close}
              >
                <i className="fa-solid fa-building" />
                {f.label}
              </Anchor>
            ))}
          </>
        )}

        {industryFilters.length > 0 && (
          <>
            <div className="pulse-sidebar-label">By Industry</div>
            {industryFilters.map(f => (
              <Anchor
                key={f.value}
                href={filterHref('industry', f.value)}
                className={`pulse-nav-item${industry === f.value ? ' active' : ''}`}
                queryDriven={queryDriven}
                onClose={close}
              >
                <i className="fa-solid fa-industry" />
                {f.label}
              </Anchor>
            ))}
          </>
        )}

        {typeFilters.length > 0 && (
          <>
            <div className="pulse-sidebar-label">By Type</div>
            {typeFilters.map(f => (
              <Anchor
                key={f.value}
                href={filterHref('eventType', f.value)}
                className={`pulse-nav-item${eventType === f.value ? ' active' : ''}`}
                queryDriven={queryDriven}
                onClose={close}
              >
                <i className="fa-solid fa-tag" />
                {f.label}
              </Anchor>
            ))}
          </>
        )}

        <div className="pulse-sidebar-label">Topics</div>
        {topics.map(t => (
          <Anchor key={t.label} href={t.href} className="pulse-topic-item" queryDriven={queryDriven} onClose={close}>
            <span className="pulse-topic-dot" style={{ background: t.color }} />
            {t.label}
          </Anchor>
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
