import type { Project } from '../../data'
import { parseMetric } from '../utils'

export default function MetricsGrid({ project, bare = false }: { project: Project; bare?: boolean }) {
  if (!project.metrics || project.metrics.length === 0) return null

  const grid = (
    <div className="prj-panel-metrics reveal">
      {project.metrics.map(m => {
        const parsed = parseMetric(m.val)
        return (
          <div key={m.key} className="prj-panel-metric-card">
            {parsed ? (
              <span
                className="prj-panel-metric-val counter"
                data-target={parsed.target}
                data-suffix={parsed.suffix}
                data-decimals={parsed.decimals}
              >
                {m.val}
              </span>
            ) : (
              <span className="prj-panel-metric-val">{m.val}</span>
            )}
            <span className="prj-panel-metric-key">{m.key}</span>
          </div>
        )
      })}
    </div>
  )

  if (bare) return grid

  return (
    <div className="prj-panel-section reveal">
      <div className="prj-panel-section-label">Key Results</div>
      {grid}
    </div>
  )
}
