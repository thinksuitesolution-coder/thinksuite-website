import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects, getProjectBySlug, type Project } from '../data'
import ReelCarousel from './ReelCarousel'
import '../projects.css'
import './project-detail.css'

export async function generateStaticParams() {
  return projects.map(p => ({ slug: p.id }))
}

function parseMetric(val: string): { target: number; suffix: string; decimals: number } | null {
  const m = val.match(/^(\d+(?:\.\d+)?)(.*)$/)
  if (!m) return null
  const suffix = m[2]
  const decimals = m[1].includes('.') ? m[1].split('.')[1].length : 0
  const target = parseFloat(m[1])
  if (!suffix && target >= 1000) return null // bare years ("2015") don't read as a stat count-up
  return { target, suffix, decimals }
}

function getDomain(url?: string): string | null {
  if (!url || url === '#') return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function buildKeywords(project: Project): string[] {
  const raw = [project.industry, ...project.services, ...(project.tech || [])]
  const seen = new Set<string>()
  const out: string[] = []
  for (const k of raw) {
    const key = k.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(k)
  }
  return out
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)
  if (!project) return { title: 'Project Not Found | ThinkSuite' }

  const title = `${project.title}: Client Project Case Study`
  const description = `${project.tagline} See how ThinkSuite delivered ${project.services.slice(0, 3).join(', ')} for ${project.title} in the ${project.industry} industry.`
  const ogImage = project.screenshot || project.logo || '/assets/img/logo.png'

  return {
    title,
    description,
    keywords: [project.title, project.industry, ...project.services, 'ThinkSuite projects', 'ThinkSuite portfolio'],
    alternates: { canonical: `https://thinksuite.in/projects/${project.id}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://thinksuite.in/projects/${project.id}`,
      images: [{ url: `https://thinksuite.in${ogImage}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://thinksuite.in${ogImage}`],
    },
  }
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  const related = projects.filter(p => p.id !== project.id).slice(0, 3)
  const socialImagePosts = project.socialPosts?.filter(p => p.type === 'post') || []
  const socialReels = project.socialPosts?.filter(p => p.type === 'reel') || []
  const isWebsite = project.cat.includes('Website')
  const isSocial = project.cat.includes('Social Media')
  const keywords = buildKeywords(project)
  const domain = getDomain(project.liveUrl)

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: project.services[0] || `${project.title} Digital Services`,
    serviceType: project.industry,
    description: project.desc,
    provider: {
      '@type': 'Organization',
      name: 'ThinkSuite',
      url: 'https://thinksuite.in',
      logo: 'https://thinksuite.in/assets/img/logo.png',
    },
    areaServed: 'IN',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thinksuite.in' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://thinksuite.in/projects' },
      { '@type': 'ListItem', position: 3, name: project.title, item: `https://thinksuite.in/projects/${project.id}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main>
        {/* Breadcrumb */}
        <div className="article-breadcrumb">
          <div className="container">
            <Link href="/">Home</Link><span>›</span>
            <Link href="/projects">Projects</Link><span>›</span>
            <span>{project.title}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="prj-detail-hero" style={{ background: project.coverGradient }}>
          <div className="prj-card-cover-pattern" />
          <div className="prj-icon-field" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <i key={i} className={`fa-solid ${project.coverIcon} prj-float-icon`} />
            ))}
          </div>
          <div className="container prj-detail-hero-inner">
            {project.logo ? (
              <img src={project.logo} alt={`${project.title} logo`} className="prj-detail-logo reveal" />
            ) : (
              <div className="prj-detail-logo-fallback reveal">
                <i className={`fa-solid ${project.coverIcon}`} />
              </div>
            )}
            <div className="prj-detail-badges reveal reveal-d1">
              {project.comingSoon && <span className="prj-badge prj-badge-soon">Coming Soon</span>}
              {project.cat.map(c => (
                <span key={c} className="prj-badge">{c}</span>
              ))}
            </div>
            <h1 className="prj-detail-title reveal reveal-d1">{project.title}</h1>
            <div className="prj-detail-industry reveal reveal-d2">
              <i className={`fa-solid ${project.industryIcon}`} />
              {project.industry}
            </div>
            <p className="prj-detail-tagline reveal reveal-d2">{project.tagline}</p>
            {keywords.length > 0 && (
              <div className="prj-keyword-cloud reveal reveal-d3">
                {keywords.map((k, i) => (
                  <span
                    key={k}
                    className="prj-keyword-chip"
                    style={{ transitionDelay: `${i * 0.06}s`, animationDelay: `${i * 0.35}s` }}
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}
            <div className="prj-detail-cta-row reveal reveal-d3">
              {project.liveUrl && project.liveUrl !== '#' && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Visit Live Website <i className="fa-solid fa-arrow-up-right-from-square" />
                </a>
              )}
              <Link href="/projects" className="btn btn-outline">All Projects</Link>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="prj-detail-layout">
            <div className="prj-detail-main">

              {/* Showcase: browser mockup for website work, phone mockup for social-only work */}
              {isWebsite ? (
                project.screenshot ? (
                  <div className="prj-browser-frame reveal">
                    <div className="prj-browser-bar">
                      <span className="prj-browser-dot prj-browser-dot-red" />
                      <span className="prj-browser-dot prj-browser-dot-yellow" />
                      <span className="prj-browser-dot prj-browser-dot-green" />
                      <div className="prj-browser-url">
                        <i className="fa-solid fa-lock" />
                        {domain || `${project.id.replace(/-/g, '')}.com`}
                      </div>
                    </div>
                    <div className="prj-browser-viewport">
                      <img src={project.screenshot} alt={`${project.title} website screenshot`} className="prj-detail-screenshot" />
                    </div>
                  </div>
                ) : (
                  <div className="prj-detail-screenshot-fallback reveal" style={{ background: project.coverGradient }}>
                    <div className="prj-card-cover-pattern" />
                    <i className={`fa-solid ${project.coverIcon} prj-fallback-pulse-icon`} />
                    <span>Website preview coming soon</span>
                  </div>
                )
              ) : isSocial ? (
                <div className="prj-phone-frame reveal">
                  <div className="prj-phone-notch" />
                  <div className="prj-phone-screen">
                    {socialImagePosts[0] || socialReels[0] ? (
                      <img
                        src={(socialImagePosts[0] || socialReels[0]).image}
                        alt={`${project.title} social content`}
                      />
                    ) : (
                      <div className="prj-phone-empty" style={{ background: project.coverGradient }}>
                        <i className={`fa-solid ${project.coverIcon}`} />
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* About */}
              <div className="prj-panel-section reveal">
                <div className="prj-panel-section-label">About This Project</div>
                <p className="prj-panel-desc">{project.desc}</p>
              </div>

              {/* Our Contribution */}
              {project.contribution && (
                <div className="prj-panel-section reveal">
                  <div className="prj-panel-section-label">What ThinkSuite Did</div>
                  <div className="prj-contribution">
                    <p>{project.contribution}</p>
                  </div>
                </div>
              )}

              {/* Services */}
              <div className="prj-panel-section reveal">
                <div className="prj-panel-section-label">Services Delivered</div>
                <ul className="prj-panel-services reveal">
                  {project.services.map(s => (
                    <li key={s}>
                      <i className="fa-solid fa-check" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech stack */}
              {project.tech && project.tech.length > 0 && (
                <div className="prj-panel-section reveal">
                  <div className="prj-panel-section-label">Tech Stack</div>
                  <div className="prj-panel-tech reveal">
                    {project.tech.map(t => (
                      <span key={t} className="prj-tech-tag">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {project.colors && project.colors.length > 0 && (
                <div className="prj-panel-section reveal">
                  <div className="prj-panel-section-label">Color Palette</div>
                  <div className="prj-panel-colors reveal">
                    {project.colors.map(c => (
                      <div key={c.hex} className="prj-color-swatch">
                        <div className="prj-color-dot" style={{ background: c.hex }} />
                        <span className="prj-color-hex">{c.hex}</span>
                        <span className="prj-color-name">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics */}
              {project.metrics && (
                <div className="prj-panel-section reveal">
                  <div className="prj-panel-section-label">Key Results</div>
                  <div className="prj-panel-metrics reveal">
                    {project.metrics.map(m => {
                      const parsed = parseMetric(m.val)
                      return (
                        <div key={m.key} className="prj-panel-metric-card">
                          {parsed ? (
                            <span
                              className="prj-panel-metric-val counter"
                              data-target={parsed.target}
                              data-suffix={parsed.suffix}
                              data-decimals={parsed.decimals}
                            >
                              {m.val}
                            </span>
                          ) : (
                            <span className="prj-panel-metric-val">{m.val}</span>
                          )}
                          <span className="prj-panel-metric-key">{m.key}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Animations */}
              {project.animations && project.animations.length > 0 && (
                <div className="prj-panel-section reveal">
                  <div className="prj-panel-section-label">Animations & Features</div>
                  <ul className="prj-panel-animations reveal">
                    {project.animations.map(a => (
                      <li key={a}>
                        <i className="fa-solid fa-bolt" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Best on Social — only for projects where social media is part of the work */}
              {isSocial && (
              <div className="prj-panel-section reveal">
                <div className="prj-panel-section-label">Best on Social</div>
                <p className="prj-social-note">Hand-picked by our team, not a live feed.</p>
                {project.socialPosts && project.socialPosts.length > 0 ? (
                  <>
                    {socialImagePosts.length > 0 && (
                      <>
                        <div className="prj-social-subhead"><i className="fa-solid fa-images" /> Posts</div>
                        <div className="prj-social-row reveal">
                          {socialImagePosts.map((post, i) => (
                            <div key={i} className="prj-social-card prj-social-card-post">
                              <div className="prj-social-card-image">
                                <img className="prj-social-img-bg" src={post.image} alt="" aria-hidden="true" />
                                <img className="prj-social-img-fg" src={post.image} alt={post.caption} />
                                <span className="prj-social-badge prj-social-badge-post">
                                  <i className="fa-solid fa-image" />
                                  Post
                                </span>
                                {post.postUrl && (
                                  <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="prj-social-outbound-link" aria-label="View original post">
                                    <i className="fa-solid fa-arrow-up-right-from-square" />
                                  </a>
                                )}
                              </div>
                              <p className="prj-social-caption">{post.caption}</p>
                              {(post.likes || post.views) && (
                                <div className="prj-social-stats">
                                  {post.likes && <span><i className="fa-solid fa-heart" /> {post.likes}</span>}
                                  {post.views && <span><i className="fa-solid fa-eye" /> {post.views}</span>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {socialReels.length > 0 && (
                      <>
                        <div className="prj-social-subhead"><i className="fa-solid fa-clapperboard" /> Reels</div>
                        <ReelCarousel reels={socialReels} />
                      </>
                    )}
                  </>
                ) : (
                  <div className="prj-social-placeholder">
                    <i className="fa-solid fa-photo-film" />
                    <span>Social highlights coming soon</span>
                  </div>
                )}
              </div>
              )}

              {/* Live Links */}
              {((project.liveUrl && project.liveUrl !== '#') || (project.socialHandles && project.socialHandles.length > 0)) && (
                <div className="prj-panel-section reveal">
                  <div className="prj-panel-section-label">Live Links</div>
                  <div className="prj-panel-links">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="prj-live-btn">
                        <i className="fa-solid fa-globe" />
                        Visit Website
                        <i className="fa-solid fa-arrow-up-right-from-square" />
                      </a>
                    )}
                    {project.socialHandles?.map(h => (
                      <a
                        key={h.platform}
                        href={h.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="prj-social-btn"
                        style={{ color: h.color, borderColor: h.color + '4D', background: h.color + '14' }}
                      >
                        <i className={`fa-brands ${h.icon}`} />
                        {h.platform}
                        <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 10 }} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Projects */}
          {related.length > 0 && (
            <section className="prj-related-section">
              <h2>Explore More <span className="grad-text">Projects</span></h2>
              <div className="prj-related-grid reveal">
                {related.map(p => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="prj-related-card">
                    <div className="prj-related-card-cover" style={{ background: p.coverGradient }}>
                      <div className="prj-card-cover-pattern" />
                      {p.logo ? (
                        <img src={p.logo} alt={`${p.title} logo`} className="prj-card-logo" />
                      ) : (
                        <i className={`fa-solid ${p.coverIcon}`} />
                      )}
                    </div>
                    <div className="prj-related-card-body">
                      <span className="prj-related-card-industry">{p.industry}</span>
                      <h3>{p.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Bottom CTA */}
        <section className="prj-detail-bottom-cta">
          <div className="container">
            <h2>Want Results Like <span className="grad-text">This?</span></h2>
            <p>Let&apos;s talk about what we can build and grow for your brand.</p>
            <Link href="/contact" className="btn btn-primary btn-lg">Get in Touch <i className="fa-solid fa-arrow-right" /></Link>
          </div>
        </section>
      </main>
    </>
  )
}
