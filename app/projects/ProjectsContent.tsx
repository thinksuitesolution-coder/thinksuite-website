'use client'
import { useState } from 'react'
import Link from 'next/link'
import './projects.css'
import { CATS, projects } from './data'

const catCounts = CATS.reduce((acc, cat) => {
  acc[cat] = cat === 'All' ? projects.length : projects.filter(p => p.cat.includes(cat)).length
  return acc
}, {} as Record<string, number>)

export default function ProjectsContent() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? projects : projects.filter(p => p.cat.includes(active))

  return (
    <>
      {/* Hero */}
      <section className="prj-hero">
        <div className="container">
          <div className="prj-hero-label">Our Work</div>
          <h1>Real Projects. <span>Real Results.</span></h1>
          <p>From brand identities to social media growth, here is what we have built and grown for our clients.</p>
          <div className="prj-stats">
            <div className="prj-stat">
              <div className="prj-stat-num">60+</div>
              <div className="prj-stat-label">Projects Delivered</div>
            </div>
            <div className="prj-stat">
              <div className="prj-stat-num">40+</div>
              <div className="prj-stat-label">Happy Clients</div>
            </div>
            <div className="prj-stat">
              <div className="prj-stat-num">3</div>
              <div className="prj-stat-label">Service Verticals</div>
            </div>
            <div className="prj-stat">
              <div className="prj-stat-num">4</div>
              <div className="prj-stat-label">Years in Business</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <section className="prj-layout-section">
        <div className="container">
          <div className="prj-layout">

            {/* Left Sidebar */}
            <aside className="prj-sidebar">
              <div className="prj-sidebar-inner">
                <div className="prj-sidebar-title">Filter Work</div>

                <div className="prj-filter-group">
                  <div className="prj-filter-group-label">Category</div>
                  {CATS.map(cat => (
                    <button
                      key={cat}
                      className={`prj-filter-row${active === cat ? ' active' : ''}`}
                      onClick={() => setActive(cat)}
                    >
                      <span className="prj-filter-row-name">{cat === 'All' ? 'All Projects' : cat}</span>
                      <span className="prj-filter-row-count">{catCounts[cat]}</span>
                    </button>
                  ))}
                </div>

                <div className="prj-sidebar-divider" />

                <div className="prj-filter-group">
                  <div className="prj-filter-group-label">Services</div>
                  {['Web Design & Dev', 'Social Media', 'Brand Identity', 'Content Creation'].map(s => (
                    <div key={s} className="prj-filter-tag">
                      <span className="prj-filter-tag-dot" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="prj-content">
              {/* Mobile filter strip */}
              <div className="prj-mobile-filters">
                {CATS.map(cat => (
                  <button
                    key={cat}
                    className={`prj-filter-pill${active === cat ? ' active' : ''}`}
                    onClick={() => setActive(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <p className="prj-count">
                <span className="prj-count-num">{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
                {active !== 'All' ? ` in ${active}` : ' across all verticals'}
              </p>

              <div className="prj-grid">
                {filtered.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="prj-card reveal"
                    style={{ animationDelay: `${(i % 2) * 0.08}s` }}
                  >
                    {/* Cover */}
                    <div className="prj-card-cover" style={p.screenshot ? undefined : { background: p.coverGradient }}>
                      {p.screenshot ? (
                        <>
                          <img src={p.screenshot} alt={`${p.title} website preview`} className="prj-card-cover-shot" />
                          <div className="prj-card-cover-scrim" />
                          {p.logo && (
                            <img src={p.logo} alt={`${p.title} logo`} className="prj-card-logo prj-card-logo-sm" />
                          )}
                        </>
                      ) : (
                        <>
                          <div className="prj-card-cover-pattern" />
                          {p.logo ? (
                            <img src={p.logo} alt={`${p.title} logo`} className="prj-card-logo" />
                          ) : (
                            <i className={`fa-solid ${p.coverIcon} prj-card-cover-icon`} />
                          )}
                        </>
                      )}
                      <div className="prj-card-badges">
                        {p.comingSoon && <span className="prj-badge prj-badge-soon">Coming Soon</span>}
                        {p.cat.map(c => (
                          <span key={c} className="prj-badge">{c}</span>
                        ))}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="prj-card-body">
                      <div className="prj-card-industry">
                        <i className={`fa-solid ${p.industryIcon}`} />
                        {p.industry}
                      </div>
                      <h3 className="prj-card-title">{p.title}</h3>
                      <p className="prj-card-tagline">{p.tagline}</p>

                      <div className="prj-card-services">
                        {p.services.slice(0, 3).map(s => (
                          <span key={s} className="prj-service-tag">{s}</span>
                        ))}
                        {p.services.length > 3 && (
                          <span className="prj-service-tag prj-service-more">+{p.services.length - 3} more</span>
                        )}
                      </div>

                      {p.metrics && (
                        <div className="prj-card-metrics">
                          {p.metrics.map(m => (
                            <div key={m.key} className="prj-card-metric">
                              <span className="prj-metric-val">{m.val}</span>
                              <span className="prj-metric-key">{m.key}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="prj-view-btn">
                        View Project Details <i className="fa-solid fa-arrow-right" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
