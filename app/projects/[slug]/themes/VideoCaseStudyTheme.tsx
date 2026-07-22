import type { Project } from '../../data'
import ReelCarousel from '../ReelCarousel'
import AboutContribution from '../blocks/AboutContribution'
import ColorPalette from '../blocks/ColorPalette'
import MetricsGrid from '../blocks/MetricsGrid'
import TechStack from '../blocks/TechStack'
import AnimationsList from '../blocks/AnimationsList'
import SocialShowcase from '../blocks/SocialShowcase'
import WebsitePreview from '../blocks/WebsitePreview'
import LiveLinks from '../blocks/LiveLinks'
import './video-case-study.css'

export default function VideoCaseStudyTheme({ project }: { project: Project }) {
  const reels = project.socialPosts?.filter(p => p.type === 'reel') || []
  const posts = project.socialPosts?.filter(p => p.type === 'post') || []
  const heroReel = reels[0]
  const heroPost = !heroReel ? posts[0] : null

  return (
    <>
      <section className="vc-hero" style={{ background: project.coverGradient }}>
        <div className="container">
          <div className="vc-layout reveal">
            <div className="vc-media">
              {heroReel ? (
                <ReelCarousel reels={[heroReel]} />
              ) : heroPost ? (
                <div className="vc-media-image">
                  <img src={heroPost.image} alt={heroPost.caption} />
                </div>
              ) : (
                <div className="vc-media-fallback" style={{ background: project.coverGradient }}>
                  <i className={`fa-solid ${project.coverIcon}`} />
                </div>
              )}
            </div>
            <aside className="vc-sidebar">
              <span className="vc-sidebar-kicker">Client</span>
              <h1 className="vc-sidebar-title">{project.title}</h1>
              <p className="vc-sidebar-tagline">{project.tagline}</p>

              <span className="vc-sidebar-label">Industry</span>
              <span className="vc-sidebar-value">{project.industry}</span>

              <span className="vc-sidebar-label">Services</span>
              <ul className="vc-sidebar-services">
                {project.services.map(s => <li key={s}>{s}</li>)}
              </ul>

              <div className="vc-sidebar-connect">
                <LiveLinks project={project} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="prj-detail-layout">
          <div className="prj-detail-main">
            <AboutContribution project={project} />
            <WebsitePreview project={project} />
            <ColorPalette project={project} />
            <MetricsGrid project={project} />
            <TechStack project={project} />
            <AnimationsList project={project} />
            <SocialShowcase project={project} />
          </div>
        </div>
      </div>
    </>
  )
}
