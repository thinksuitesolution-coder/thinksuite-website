'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const cards = [
  {
    id: 'ai',
    eyebrow: 'Intelligence Layer',
    outlineText: 'AI',
    heading: 'AI & Automation',
    desc: 'Intelligent systems powered by LLMs, ML models and automation pipelines that transform how you operate.',
    activeLabel: 'Solutions',
    links: ['LLM Integration', 'Predictive Analytics', 'Workflow Automation', 'Computer Vision', 'Chatbots & Agents'],
  },
  {
    id: 'software',
    eyebrow: 'Build & Scale',
    outlineText: 'BUILD',
    heading: 'Software Development',
    desc: 'Full-stack web apps, mobile and SaaS platforms engineered for scale and long-term maintainability.',
    activeLabel: 'Technologies',
    links: ['Web Applications', 'Mobile Apps', 'SaaS Products', 'API Development', 'Cloud Architecture'],
  },
  {
    id: 'marketing',
    eyebrow: 'Growth Engine',
    outlineText: 'GROW',
    heading: 'Digital Marketing',
    desc: 'Data-driven campaigns that increase visibility, generate qualified leads and compound revenue over time.',
    activeLabel: 'Services',
    links: ['SEO & Content', 'Performance Ads', 'Social Media', 'Email Marketing', 'Analytics & CRO'],
  },
  {
    id: 'branding',
    eyebrow: 'Visual Identity',
    outlineText: 'BRAND',
    heading: 'Branding & Design',
    desc: 'Brand identities and UI design systems that make your business instantly recognizable and trusted.',
    activeLabel: 'Offerings',
    links: ['Brand Identity', 'UI/UX Design', 'Print & Collateral', 'Motion Design', 'Campaign Creative'],
  },
]

export default function ServiceShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cardEls = sectionRef.current?.querySelectorAll<HTMLDivElement>('.scw-card')
    if (!cardEls) return

    const cleanups: Array<() => void> = []

    cardEls.forEach(card => {
      const onTouch = () => card.classList.toggle('is-active')
      card.addEventListener('touchstart', onTouch, { passive: true })
      cleanups.push(() => card.removeEventListener('touchstart', onTouch))
    })

    return () => cleanups.forEach(fn => fn())
  }, [])

  return (
    <div ref={sectionRef} className="scw-section">
      {cards.map(c => (
        <div key={c.id} className="scw-card">
          <div className="scw-state--static">
            <p className="scw-eyebrow">{c.eyebrow}</p>
            <span className="scw-outline-text" aria-hidden="true">{c.outlineText}</span>
            <div className="scw-meta">
              <h3 className="scw-heading">{c.heading}</h3>
              <p className="scw-desc">{c.desc}</p>
            </div>
          </div>

          <div className="scw-state--active">
            <p className="scw-active-label">{c.activeLabel}</p>
            <ul className="scw-list">
              {c.links.map(link => (
                <li key={link}>
                  <Link href="/services">{link}</Link>
                </li>
              ))}
            </ul>
            <Link href="/services" className="scw-arrow-link" aria-label="View all services">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 22L22 6M22 6H10M22 6V18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
