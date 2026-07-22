import type { Project } from '../../data'
import { hasWebsite } from '../utils'

export default function WebsitePreview({ project }: { project: Project }) {
  if (!project.screenshot || !hasWebsite(project)) return null
  return (
    <div className="prj-panel-section reveal">
      <div className="prj-panel-section-label">Website Preview</div>
      <div className="prj-website-preview">
        <img src={project.screenshot} alt={`${project.title} website preview`} />
      </div>
    </div>
  )
}
