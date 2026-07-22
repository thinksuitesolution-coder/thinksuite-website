import type { Project } from '../../data'

export default function AnimationsList({ project }: { project: Project }) {
  if (!project.animations || project.animations.length === 0) return null
  return (
    <div className="prj-panel-section reveal">
      <div className="prj-panel-section-label">Animations & Features</div>
      <ul className="prj-panel-animations reveal">
        {project.animations.map(a => (
          <li key={a}>
            <i className="fa-solid fa-wand-magic-sparkles" />
            {a}
          </li>
        ))}
      </ul>
    </div>
  )
}
