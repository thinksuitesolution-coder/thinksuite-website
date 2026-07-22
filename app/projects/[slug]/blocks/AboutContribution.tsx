import type { Project } from '../../data'

export default function AboutContribution({ project }: { project: Project }) {
  return (
    <>
      <div className="prj-panel-section reveal">
        <div className="prj-panel-section-label">About This Project</div>
        <p className="prj-panel-desc">{project.desc}</p>
      </div>
      {project.contribution && (
        <div className="prj-panel-section reveal">
          <div className="prj-panel-section-label">What ThinkSuite Did</div>
          <div className="prj-contribution">
            <p>{project.contribution}</p>
          </div>
        </div>
      )}
    </>
  )
}
