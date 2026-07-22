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
import './noir-editorial.css'

export default function NoirEditorialTheme({ project }: { project: Project }) {
  const isSocial = project.cat.includes('Social Media')
  const primaryImage = (hasWebsite(project) && project.screenshot) || project.socialPosts?.[0]?.image || null
  const sideItems = (project.socialPosts || []).slice(0, 3)

  return (
    <>
      <section className="noir-hero" style={{ background: project.coverGradient }}>
        <div className="container noir-hero-inner">
          <div className="noir-hero-top reveal">
            <span className="noir-hero-kicker">
              <i className={`fa-solid ${project.industryIcon}`} /> {project.industry}
            </span>
            <div className="noir-hero-badges">
              {project.comingSoon && <span className="prj-badge prj-badge-soon">Coming Soon</span>}
              {project.cat.map(c => <span key={c} className="prj-badge">{c}</span>)}
            </div>
          </div>
          <h1 className="noir-hero-title reveal reveal-d1">{project.title}</h1>
          <p className="noir-hero-tagline reveal reveal-d2">{project.tagline}</p>
          <div className="noir-hero-cta reveal reveal-d3">
            {project.liveUrl && project.liveUrl !== '#' && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Visit Live Website <i className="fa-solid fa-arrow-up-right-from-square" />
              </a>
            )}
            <Link href="/contact" className="noir-cta-round" aria-label="Let's build something bold together">
              <i className="fa-solid fa-arrow-right" />
            </Link>
            <Link href="/projects" className="btn btn-outline">All Projects</Link>
          </div>
        </div>
        <div className="noir-marquee" aria-hidden="true">
          <div className="noir-marquee-track">
            {Array.from({ length: 4 }).map((_, i) => <span key={i}>{project.title}</span>)}
          </div>
        </div>
      </section>

      <div className="container">
        <div className="noir-gallery reveal">
          <div className="noir-gallery-main">
            {primaryImage ? (
              <img src={primaryImage} alt={`${project.title} showcase`} />
            ) : (
              <div className="noir-gallery-main-fallback" style={{ background: project.coverGradient }}>
                <i className={`fa-solid ${project.coverIcon}`} />
              </div>
            )}
          </div>
          {sideItems.length > 0 && (
            <div className="noir-gallery-side">
              {sideItems.map((item, i) => (
                <div key={i} className="noir-gallery-side-item">
                  <div className="noir-gallery-side-item-image">
                    <img className="prj-social-img-bg" src={item.image} alt="" aria-hidden="true" />
                    <img className="prj-social-img-fg" src={item.image} alt={item.caption} />
                  </div>
                  <span>{item.caption}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="prj-detail-layout">
          <div className="prj-detail-main">
            <AboutContribution project={project} />
            <ServicesList project={project} />
            <ColorPalette project={project} />
            <MetricsGrid project={project} />
            <TechStack project={project} />
            <AnimationsList project={project} />
            {isSocial && <SocialShowcase project={project} />}
            <LiveLinks project={project} />
          </div>
        </div>
      </div>
    </>
  )
}
