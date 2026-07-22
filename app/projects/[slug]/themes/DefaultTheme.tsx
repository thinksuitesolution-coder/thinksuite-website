import Link from 'next/link'
import type { Project } from '../../data'
import { buildKeywords, getDomain } from '../utils'
import AboutContribution from '../blocks/AboutContribution'
import ServicesList from '../blocks/ServicesList'
import TechStack from '../blocks/TechStack'
import ColorPalette from '../blocks/ColorPalette'
import MetricsGrid from '../blocks/MetricsGrid'
import AnimationsList from '../blocks/AnimationsList'
import SocialShowcase from '../blocks/SocialShowcase'
import LiveLinks from '../blocks/LiveLinks'

export default function DefaultTheme({ project }: { project: Project }) {
  const isWebsite = project.cat.includes('Website')
  const isSocial = project.cat.includes('Social Media')
  const keywords = buildKeywords(project)
  const domain = getDomain(project.liveUrl)

  return (
    <>
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
                  {project.socialPosts?.[0] ? (
                    <img
                      src={project.socialPosts[0].image}
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

            <AboutContribution project={project} />
            <ServicesList project={project} />
            <TechStack project={project} />
            <ColorPalette project={project} />
            <MetricsGrid project={project} />
            <AnimationsList project={project} />
            {isSocial && <SocialShowcase project={project} />}
            <LiveLinks project={project} />
          </div>
        </div>
      </div>
    </>
  )
}
