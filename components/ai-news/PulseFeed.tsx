'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import SafeImg from './SafeImg'
import FeaturedCarousel, { FeaturedSlide } from './FeaturedCarousel'
import { PulseLink, usePulseQuery } from './pulse-query'
import { eventMeta } from '@/lib/news/event-meta'
import type { ArticleCard } from '@/lib/news/db'

// `timeAgo` is computed on the server and carried along rather than derived
// here: the page is prerendered, so a clock read during render would disagree
// with the prerendered HTML and trip a hydration mismatch. The page revalidates
// every few minutes, which is well inside this label's resolution.
export type FeedItem = ArticleCard & { timeAgo: string }

const PAGE_SIZE = 20

function fallbackImage(id: string, w: number, h: number) {
  return `https://picsum.photos/seed/${id}/${w}/${h}`
}

export default function PulseFeed({
  items,
  featured,
}: {
  items: FeedItem[]
  featured: FeaturedSlide[]
}) {
  const { params } = usePulseQuery()

  const tabParam = params.get('tab')
  const tab = tabParam === 'popular' || tabParam === 'important' ? tabParam : 'latest'
  const category = params.get('category') || ''
  const rawQuery = params.get('q') || ''
  const q = rawQuery.trim().toLowerCase()
  const companyFilter = params.get('company') || ''
  const industryFilter = params.get('industry') || ''
  const eventTypeFilter = params.get('eventType') || ''
  const requestedPage = Math.max(1, parseInt(params.get('page') || '1', 10) || 1)

  const feedList = useMemo(() => {
    let filtered = items
    if (category) filtered = filtered.filter(a => a.category === category)
    if (companyFilter) filtered = filtered.filter(a =>
      a.company?.toLowerCase() === companyFilter.toLowerCase()
    )
    if (industryFilter) filtered = filtered.filter(a =>
      (a.industry ?? '').toLowerCase() === industryFilter.toLowerCase()
    )
    if (eventTypeFilter) filtered = filtered.filter(a => a.eventType === eventTypeFilter)
    if (q) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary?.toLowerCase().includes(q) ||
        a.company?.toLowerCase().includes(q) ||
        (a.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }

    if (tab === 'latest') {
      return [...filtered].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    }
    const byScore = [...filtered].sort((a, b) => b.importanceScore - a.importanceScore)
    return tab === 'important' ? byScore.filter(a => a.importanceScore >= 75) : byScore
  }, [items, tab, category, q, companyFilter, industryFilter, eventTypeFilter])

  const totalPages = Math.max(1, Math.ceil(feedList.length / PAGE_SIZE))
  const currentPage = Math.min(requestedPage, totalPages)
  const pagedList = feedList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const buildPageHref = (pageNum: number) => {
    const p = new URLSearchParams(params.toString())
    if (pageNum > 1) p.set('page', String(pageNum))
    else p.delete('page')
    const qs = p.toString()
    return `/ai-news${qs ? `?${qs}` : ''}`
  }

  const buildTabHref = (value: string) => {
    const p = new URLSearchParams(params.toString())
    p.set('tab', value)
    p.delete('page')
    return `/ai-news?${p.toString()}`
  }

  const hasActiveFilter = !!(companyFilter || industryFilter || eventTypeFilter || category || q)
  const activeLabel =
    companyFilter ||
    industryFilter ||
    (eventTypeFilter ? eventMeta(eventTypeFilter).label : '') ||
    category ||
    ''

  return (
    <div className="pulse-feed">
      {featured.length > 0 && !hasActiveFilter && <FeaturedCarousel slides={featured} />}

      {/* Active filter bar */}
      {hasActiveFilter && (
        <div className="pulse-active-filter">
          <span>Filtering:</span>
          {companyFilter && <span className="pulse-filter-tag">{companyFilter}</span>}
          {industryFilter && <span className="pulse-filter-tag">{industryFilter}</span>}
          {eventTypeFilter && <span className="pulse-filter-tag">{eventMeta(eventTypeFilter).label}</span>}
          {category && <span className="pulse-filter-tag">{category}</span>}
          {q && <span className="pulse-filter-tag">&quot;{q}&quot;</span>}
          <PulseLink href="/ai-news" className="pulse-clear-filter">x Clear all</PulseLink>
        </div>
      )}

      <div className="pulse-feed-head">
        <div className="pulse-feed-title">
          <i className="fa-solid fa-bolt" />
          {activeLabel ? `${activeLabel} News` : 'Latest AI News'}
        </div>
        <div className="pulse-tabs">
          <PulseLink href={buildTabHref('latest')}    className={`pulse-tab${tab === 'latest'    ? ' active' : ''}`}>Latest</PulseLink>
          <PulseLink href={buildTabHref('popular')}   className={`pulse-tab${tab === 'popular'   ? ' active' : ''}`}>Popular</PulseLink>
          <PulseLink href={buildTabHref('important')} className={`pulse-tab${tab === 'important' ? ' active' : ''}`}>Important</PulseLink>
        </div>
      </div>

      {feedList.length === 0 ? (
        <div className="pulse-empty">
          <i className="fa-solid fa-satellite-dish" />
          {hasActiveFilter
            ? "We don't have any stories matching this filter just yet. New articles come in every couple of hours, so check back soon."
            : "We're gathering the latest AI news right now. Check back in a few minutes."}
        </div>
      ) : (
        pagedList.map(a => {
          const meta = eventMeta(a.eventType)
          return (
            <Link key={a.id} href={`/ai-news/${a.slug}`} className="pulse-row">
              <div className="pulse-row-thumb">
                <SafeImg
                  src={a.heroImageUrl || fallbackImage(a.id, 900, 600)}
                  fallback={fallbackImage(a.id, 600, 340)}
                  alt={a.title}
                  loading="lazy"
                />
              </div>
              <div className="pulse-row-body">
                <div className="pulse-row-top">
                  <span className="pulse-row-title">{a.title}</span>
                  <span className="pulse-row-badge" style={{ background: `${meta.color}26`, color: meta.color }}>{meta.label}</span>
                </div>
                <p className="pulse-row-desc">{a.summary}</p>
                <div className="pulse-row-foot">
                  {a.company && a.company !== 'AI Industry' && (
                    <span className="pulse-company-tag">{a.company}</span>
                  )}
                  <span>{a.sourceName}</span>
                  <span>·</span>
                  <span>{a.timeAgo}</span>
                  <div className="pulse-row-actions">
                    <i className="fa-regular fa-bookmark" />
                    <i className="fa-solid fa-arrow-up-from-bracket" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })
      )}

      {feedList.length > 0 && totalPages > 1 && (
        <div className="pulse-pagination" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
          {currentPage > 1 && (
            <PulseLink href={buildPageHref(currentPage - 1)} className="pulse-tab">← Prev</PulseLink>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
            .map((p, i, arr) => (
              <span key={p} style={{ display: 'flex', gap: 8 }}>
                {i > 0 && arr[i - 1] !== p - 1 && <span style={{ padding: '0 4px', color: 'var(--pulse-text2)' }}>…</span>}
                <PulseLink href={buildPageHref(p)} className={`pulse-tab${p === currentPage ? ' active' : ''}`}>{String(p)}</PulseLink>
              </span>
            ))}
          {currentPage < totalPages && (
            <PulseLink href={buildPageHref(currentPage + 1)} className="pulse-tab">Next →</PulseLink>
          )}
        </div>
      )}
    </div>
  )
}
