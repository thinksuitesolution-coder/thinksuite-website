import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects, getProjectBySlug } from '../data'
import '../projects.css'
import './project-detail.css'

export async function generateStaticParams() {
  return projects.map(p => ({ slug: p.id }))
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
          <div className="container prj-detail-hero-inner">
            {project.logo ? (
              <img src={project.logo} alt={`${project.title} logo`} className="prj-detail-logo" />
            ) : (
              <div className="prj-detail-logo-fallback">
                <i className={`fa-solid ${project.coverIcon}`} />
              </div>
            )}
            <div className="prj-detail-badges">
              {project.cat.map(c => (
                <span key={c} className="prj-badge">{c}</span>
              ))}
            </div>
            <h1 className="prj-detail-title">{project.title}</h1>
            <div className="prj-detail-industry">
              <i className={`fa-solid ${project.industryIcon}`} />
              {project.industry}
            </div>
            <p className="prj-detail-tagline">{project.tagline}</p>
            <div className="prj-detail-cta-row">
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

              {/* Screenshot showcase */}
              {project.screenshot ? (
                <img src={project.screenshot} alt={`${project.title} website screenshot`} className="prj-detail-screenshot" />
              ) : (
                <div className="prj-detail-screenshot-fallback" style={{ background: project.coverGradient }}>
                  <div className="prj-card-cover-pattern" />
                  <i className={`fa-solid ${project.coverIcon}`} />
                  <span>Screenshot coming soon</span>
                </div>
              )}

              {/* About */}
              <div className="prj-panel-section">
                <div className="prj-panel-section-label">About This Project</div>
                <p className="prj-panel-desc">{project.desc}</p>
              </div>

              {/* Our Contribution */}
              {project.contribution && (
                <div className="prj-panel-section">
                  <div className="prj-panel-section-label">What ThinkSuite Did</div>
                  <div className="prj-contribution">
                    <p>{project.contribution}</p>
                  </div>
                </div>
              )}

              {/* Services */}
              <div className="prj-panel-section">
                <div className="prj-panel-section-label">Services Delivered</div>
                <ul className="prj-panel-services">
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
                <div className="prj-panel-section">
                  <div className="prj-panel-section-label">Tech Stack</div>
                  <div className="prj-panel-tech">
                    {project.tech.map(t => (
                      <span key={t} className="prj-tech-tag">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {project.colors && project.colors.length > 0 && (
                <div className="prj-panel-section">
                  <div className="prj-panel-section-label">Color Palette</div>
                  <div className="prj-panel-colors">
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
                <div className="prj-panel-section">
                  <div className="prj-panel-section-label">Key Results</div>
                  <div className="prj-panel-metrics">
                    {project.metrics.map(m => (
                      <div key={m.key} className="prj-panel-metric-card">
                        <span className="prj-panel-metric-val">{m.val}</span>
                        <span className="prj-panel-metric-key">{m.key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Animations */}
              {project.animations && project.animations.length > 0 && (
                <div className="prj-panel-section">
                  <div className="prj-panel-section-label">Animations & Features</div>
                  <ul className="prj-panel-animations">
                    {project.animations.map(a => (
                      <li key={a}>
                        <i className="fa-solid fa-bolt" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Best on Social */}
              {project.socialPosts && project.socialPosts.length > 0 && (
                <div className="prj-panel-section">
                  <div className="prj-panel-section-label">Best on Social</div>
                  <p className="prj-social-note">Hand-picked by our team, not a live feed.</p>
                  <div className="prj-social-grid">
                    {project.socialPosts.map((post, i) => (
                      <div key={i} className={`prj-social-card prj-social-card-${post.type}`}>
                        <div className="prj-social-card-image">
                          {post.video ? (
                            <video controls poster={post.image} preload="none">
                              <source src={post.video} />
                            </video>
                          ) : (
                            <img src={post.image} alt={post.caption} />
                          )}
                          <span className={`prj-social-badge prj-social-badge-${post.type}`}>
                            <i className={`fa-solid ${post.type === 'reel' ? 'fa-film' : 'fa-image'}`} />
                            {post.type === 'reel' ? 'Reel' : 'Post'}
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
                </div>
              )}

              {/* Live Links */}
              {((project.liveUrl && project.liveUrl !== '#') || (project.socialHandles && project.socialHandles.length > 0)) && (
                <div className="prj-panel-section">
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
              <div className="prj-related-grid">
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
