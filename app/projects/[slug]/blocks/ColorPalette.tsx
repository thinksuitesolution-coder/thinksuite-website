import type { Project } from '../../data'

export default function ColorPalette({ project }: { project: Project }) {
  if (!project.colors || project.colors.length === 0) return null
  return (
    <div className="prj-panel-section reveal">
      <div className="prj-panel-section-label">Color Palette</div>
      <div className="prj-panel-colors reveal">
        {project.colors.map(c => (
          <div key={c.hex} className="prj-color-swatch">
            <div className="prj-color-dot" style={{ background: c.hex }} />
            <span className="prj-color-hex">{c.hex}</span>
            <span className="prj-color-name">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
