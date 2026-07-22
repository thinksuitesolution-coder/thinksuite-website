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
import './gallery-grid.css'

export default function GalleryGridTheme({ project }: { project: Project }) {
  const isSocial = project.cat.includes('Social Media')
  const mosaicItems: { image: string; caption: string }[] = [
    ...(project.screenshot ? [{ image: project.screenshot, caption: `${project.title} overview` }] : []),
    ...(project.socialPosts || []).map(p => ({ image: p.image, caption: p.caption })),
  ].slice(0, 6)

  return (
    <>
      <section className="gg-hero" style={{ background: project.coverGradient }}>
        <div className="container gg-hero-inner reveal">
          <span className="gg-hero-index">Selected Work</span>
          <h1 className="gg-hero-title">{project.title}</h1>
          <p className="gg-hero-lede">{project.tagline}</p>
          <div className="gg-hero-meta">
            <span><i className={`fa-solid ${project.industryIcon}`} /> {project.industry}</span>
            <span>{project.cat.join(' / ')}</span>
          </div>
          <div className="gg-cta">
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
        <div className="gg-layout reveal">
          {mosaicItems.length > 0 && (
            <div className="gg-grid">
              {mosaicItems.map((item, i) => (
                <div key={i} className="gg-cell">
                  <img src={item.image} alt={item.caption} />
                  <span className="gg-cell-caption">{item.caption}</span>
                </div>
              ))}
            </div>
          )}
          <aside className="gg-panel">
            <div className="gg-panel-label">At a Glance</div>
            <div className="gg-panel-row"><span>Industry</span><strong>{project.industry}</strong></div>
            <div className="gg-panel-row"><span>Services</span><strong>{project.services.length} delivered</strong></div>
            {project.tech && project.tech.length > 0 && (
              <div className="gg-panel-row"><span>Stack</span><strong>{project.tech.join(', ')}</strong></div>
            )}
            <div className="gg-panel-divider" />
            <LiveLinks project={project} />
          </aside>
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
          </div>
        </div>
      </div>
    </>
  )
}
