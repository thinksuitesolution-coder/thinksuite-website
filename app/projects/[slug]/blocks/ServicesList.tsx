import type { Project } from '../../data'

export default function ServicesList({ project }: { project: Project }) {
  return (
    <div className="prj-panel-section reveal">
      <div className="prj-panel-section-label">Services Delivered</div>
      <ul className="prj-panel-services reveal">
        {project.services.map(s => (
          <li key={s}>
            <i className="fa-solid fa-check" />
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
