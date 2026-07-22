import type { Project } from '../../data'
import { getDomain, hasWebsite } from '../utils'
import TechStack from '../blocks/TechStack'
import ColorPalette from '../blocks/ColorPalette'
import MetricsGrid from '../blocks/MetricsGrid'
import AnimationsList from '../blocks/AnimationsList'
import SocialShowcase from '../blocks/SocialShowcase'
import LiveLinks from '../blocks/LiveLinks'
import './mac-window.css'

export default function MacWindowTheme({ project }: { project: Project }) {
  const isSocial = project.cat.includes('Social Media')
  const domain = getDomain(project.liveUrl)
  const showcaseImage = (hasWebsite(project) && project.screenshot) || project.logo || null

  return (
    <>
      <section className="mw-hero" style={{ background: project.coverGradient }}>
        <div className="container">
          <div className="mw-window reveal">
            <div className="mw-window-bar">
              <span className="mw-dot mw-dot-red" />
              <span className="mw-dot mw-dot-yellow" />
              <span className="mw-dot mw-dot-green" />
              <div className="mw-window-url">
                <i className="fa-solid fa-lock" />
                {domain || `${project.id.replace(/-/g, '')}.com`}
              </div>
            </div>
            <div className="mw-window-body">
              {showcaseImage ? (
                <img src={showcaseImage} alt={`${project.title} showcase`} />
              ) : (
                <div className="mw-window-fallback" style={{ background: project.coverGradient }}>
                  <i className={`fa-solid ${project.coverIcon}`} />
                </div>
              )}
              <div className="mw-window-nav">
                <span>Overview</span>
                <span>Services</span>
                <span>Contact</span>
              </div>
              <div className="mw-window-overlay">
                <h1>{project.title}</h1>
                <p>{project.tagline}</p>
              </div>
            </div>
          </div>

          <div className="mw-meta-row reveal">
            <div className="mw-meta-col mw-meta-services">
              <span className="mw-meta-label">Services</span>
              <div className="mw-meta-pills">
                {project.services.map(s => <span key={s} className="mw-pill">{s}</span>)}
              </div>
            </div>
            <div className="mw-meta-col mw-meta-summary">
              <span className="mw-meta-label">Summary</span>
              <p>{project.desc}</p>
            </div>
            <div className="mw-meta-col mw-meta-industry">
              <span className="mw-meta-label">Industry</span>
              <span className="mw-meta-value">{project.industry}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="prj-detail-layout">
          <div className="prj-detail-main">
            {project.contribution && (
              <div className="prj-panel-section reveal">
                <div className="prj-panel-section-label">What ThinkSuite Did</div>
                <div className="prj-contribution">
                  <p>{project.contribution}</p>
                </div>
              </div>
            )}
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
