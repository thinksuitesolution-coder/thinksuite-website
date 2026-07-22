import type { Project } from '../../data'

export default function LiveLinks({ project }: { project: Project }) {
  const hasLiveUrl = project.liveUrl && project.liveUrl !== '#'
  const hasSocialHandles = project.socialHandles && project.socialHandles.length > 0
  if (!hasLiveUrl && !hasSocialHandles) return null

  return (
    <div className="prj-panel-section reveal">
      <div className="prj-panel-section-label">Live Links</div>
      <div className="prj-panel-links">
        {hasLiveUrl && (
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
  )
}
