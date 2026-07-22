import Link from 'next/link'
import type { Project } from '../../data'
import AboutContribution from '../blocks/AboutContribution'
import ServicesList from '../blocks/ServicesList'
import TechStack from '../blocks/TechStack'
import ColorPalette from '../blocks/ColorPalette'
import MetricsGrid from '../blocks/MetricsGrid'
import AnimationsList from '../blocks/AnimationsList'
import SocialShowcase from '../blocks/SocialShowcase'
import LiveLinks from '../blocks/LiveLinks'
import { hasWebsite } from '../utils'
import './oversized-type.css'

export default function OversizedTypeTheme({ project }: { project: Project }) {
  const isSocial = project.cat.includes('Social Media')
  const heroImage = (hasWebsite(project) && project.screenshot) || project.logo || null
  const giantWord = project.industry.split(/\s+/)[0]
  const highlightMetric = project.metrics?.[0]

  return (
    <>
      <section className="ot-hero" style={{ background: project.coverGradient }}>
        <div className="container">
          <div className="ot-hero-top reveal">
            <span className="ot-kicker">
              <i className={`fa-solid ${project.industryIcon}`} /> {project.industry}
            </span>
            <div className="ot-badges">
              {project.comingSoon && <span className="prj-badge prj-badge-soon">Coming Soon</span>}
              {project.cat.map(c => <span key={c} className="prj-badge">{c}</span>)}
            </div>
          </div>
          <div className="ot-hero-grid">
            <div className="ot-hero-left reveal reveal-d1">
              {project.logo && (
                <img src={project.logo} alt={`${project.title} logo`} className="ot-logo" />
              )}
              <h1 className="ot-title">{project.title}</h1>
              <p className="ot-tagline">{project.tagline}</p>
              <div className="ot-cta">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Visit Live Website <i className="fa-solid fa-arrow-up-right-from-square" />
                  </a>
                )}
                <Link href="/projects" className="btn btn-outline">All Projects</Link>
              </div>
              {highlightMetric && (
                <div className="ot-quote reveal reveal-d2">
                  <div className="ot-quote-avatar"><i className={`fa-solid ${project.coverIcon}`} /></div>
                  <div className="ot-quote-body">
                    <strong>{highlightMetric.val} {highlightMetric.key}</strong>
                    <span>Real results from real content.</span>
                  </div>
                </div>
              )}
            </div>
            <div className="ot-hero-right reveal reveal-d1">
              <div className="ot-hero-image">
                {heroImage ? (
                  <img src={heroImage} alt={`${project.title} showcase`} style={{ objectFit: project.screenshotFit || 'cover' }} />
                ) : (
                  <i className={`fa-solid ${project.coverIcon}`} />
                )}
              </div>
              <div className="ot-giant-word" aria-hidden="true">{giantWord}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="prj-detail-layout">
          <div className="prj-detail-main">
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
