import type { Project } from '../../data'

export default function TechStack({ project }: { project: Project }) {
  if (!project.tech || project.tech.length === 0) return null
  return (
    <div className="prj-panel-section reveal">
      <div className="prj-panel-section-label">Tech Stack</div>
      <div className="prj-panel-tech reveal">
        {project.tech.map(t => (
          <span key={t} className="prj-tech-tag">{t}</span>
        ))}
      </div>
    </div>
  )
}
