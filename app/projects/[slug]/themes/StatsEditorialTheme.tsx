import Link from 'next/link'
import type { Project } from '../../data'
import AboutContribution from '../blocks/AboutContribution'
import ServicesList from '../blocks/ServicesList'
import ColorPalette from '../blocks/ColorPalette'
import MetricsGrid from '../blocks/MetricsGrid'
import AnimationsList from '../blocks/AnimationsList'
import SocialShowcase from '../blocks/SocialShowcase'
import WebsitePreview from '../blocks/WebsitePreview'
import LiveLinks from '../blocks/LiveLinks'
import './stats-editorial.css'

export default function StatsEditorialTheme({ project }: { project: Project }) {
  const isSocial = project.cat.includes('Social Media')
  const hasMetrics = project.metrics && project.metrics.length > 0

  return (
    <>
      <section className="se-hero" style={{ background: project.coverGradient }}>
        <div className="container">
          <div className="se-hero-top reveal">
            <span className="se-kicker">
              <i className={`fa-solid ${project.industryIcon}`} /> {project.industry}
            </span>
            <div className="se-badges">
              {project.comingSoon && <span className="prj-badge prj-badge-soon">Coming Soon</span>}
              {project.cat.map(c => <span key={c} className="prj-badge">{c}</span>)}
            </div>
          </div>
          <h1 className="se-title reveal reveal-d1">{project.title}</h1>
          <p className="se-tagline reveal reveal-d2">{project.tagline}</p>
          <div className="se-cta reveal reveal-d2">
            {project.liveUrl && project.liveUrl !== '#' && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Visit Live Website <i className="fa-solid fa-arrow-up-right-from-square" />
              </a>
            )}
            <Link href="/projects" className="btn btn-outline">All Projects</Link>
          </div>

          {hasMetrics ? (
            <div className="se-stats reveal reveal-d3">
              <MetricsGrid project={project} bare />
            </div>
          ) : (
            <div className="se-stats-fallback reveal reveal-d3">
              <div className="se-stats-fallback-card">
                <span className="se-stats-fallback-val">{project.services.length}</span>
                <span className="se-stats-fallback-key">Services Delivered</span>
              </div>
              <div className="se-stats-fallback-card">
                <span className="se-stats-fallback-val">{project.cat.length}</span>
                <span className="se-stats-fallback-key">Work Streams</span>
              </div>
              <div className="se-stats-fallback-card">
                <span className="se-stats-fallback-val">{project.socialPosts?.length || 0}</span>
                <span className="se-stats-fallback-key">Pieces of Content</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container">
        <div className="prj-detail-layout">
          <div className="prj-detail-main">
            <AboutContribution project={project} />
            <ServicesList project={project} />
            <WebsitePreview project={project} />
            <ColorPalette project={project} />
            <AnimationsList project={project} />
            {isSocial && <SocialShowcase project={project} />}
            <LiveLinks project={project} />
          </div>
        </div>
      </div>
    </>
  )
}
