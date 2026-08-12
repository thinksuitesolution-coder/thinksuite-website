'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// The /ai-news query string, read in the browser rather than on the server.
//
// Two things this deliberately avoids:
//
// - `useSearchParams`. Reading it makes the route dynamic, and every visitor
//   costs a Vercel function invocation to render HTML that is identical for
//   everyone. Wrapping it in Suspense to keep the route static is worse: Next
//   prerenders the boundary's fallback, so the listing would reach crawlers
//   empty.
// - `<Link>` for the filters. A client navigation to the same route with a new
//   query still round-trips for an RSC payload. Nothing about these filters
//   needs the server — the page already holds every article it can show.
//
// So the page prerenders once with the default view (latest, page 1, no
// filter), which is what the HTML and the crawler get, and filtering happens
// entirely in the browser with the URL kept in sync via history.pushState.

interface PulseQueryValue {
  params: URLSearchParams
  navigate: (href: string) => void
}

const EMPTY_PARAMS = new URLSearchParams()

const PulseQueryContext = createContext<PulseQueryValue>({
  params: EMPTY_PARAMS,
  navigate: () => {},
})

function searchOf(href: string): string {
  const i = href.indexOf('?')
  return i === -1 ? '' : href.slice(i)
}

export function PulseQueryProvider({ children }: { children: React.ReactNode }) {
  // Starts empty so the server render and the first client render agree; the
  // effect below fills it in on mount, which is also what applies the query
  // for someone landing directly on a filtered URL.
  const [search, setSearch] = useState('')

  useEffect(() => {
    const read = () => setSearch(window.location.search)
    read()
    window.addEventListener('popstate', read)
    return () => window.removeEventListener('popstate', read)
  }, [])

  const navigate = useCallback((href: string) => {
    window.history.pushState({}, '', href)
    setSearch(searchOf(href))
    window.scrollTo({ top: 0 })
  }, [])

  const value = useMemo(
    () => ({ params: new URLSearchParams(search), navigate }),
    [search, navigate]
  )

  return <PulseQueryContext.Provider value={value}>{children}</PulseQueryContext.Provider>
}

export function usePulseQuery(): PulseQueryValue {
  return useContext(PulseQueryContext)
}

// A real anchor — crawlable, middle-clickable, openable in a new tab — that
// filters in place on an ordinary left click instead of navigating.
export function PulseLink({
  href,
  className,
  style,
  children,
  onNavigate,
}: {
  href: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  onNavigate?: () => void
}) {
  const { navigate } = usePulseQuery()

  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        navigate(href)
        onNavigate?.()
      }}
    >
      {children}
    </a>
  )
}
