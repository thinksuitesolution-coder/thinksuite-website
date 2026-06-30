'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import SafeImg from './SafeImg'

export interface FeaturedSlide {
  slug: string
  title: string
  summary: string
  image: string
  fallback: string
  badgeLabel: string
  company: string
  timeAgo: string
}

export default function FeaturedCarousel({ slides }: { slides: FeaturedSlide[] }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => setActive(i => (i + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [slides.length])

  if (slides.length === 0) return null

  return (
    <div className="pulse-featured">
      {slides.map((s, i) => (
        <div key={s.slug} className={`pulse-featured-slide${i === active ? ' active' : ''}`}>
          <div className="pulse-featured-body">
            <span className="pulse-featured-badge">FEATURED</span>
            <Link href={`/ai-news/${s.slug}`} className="pulse-featured-title">{s.title}</Link>
            <p className="pulse-featured-desc">{s.summary}</p>
            <div className="pulse-featured-meta">
              <span>{s.company}</span>
              <span>·</span>
              <span>{s.timeAgo}</span>
            </div>
          </div>
          <div className="pulse-featured-img">
            <SafeImg src={s.image} fallback={s.fallback} alt={s.title} loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        </div>
      ))}
      {slides.length > 1 && (
        <div className="pulse-dots">
          {slides.map((s, i) => (
            <button
              key={s.slug}
              className={`pulse-dot${i === active ? ' active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
