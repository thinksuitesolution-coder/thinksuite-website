import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects, getProjectBySlug, type Project, type ProjectTheme } from '../data'
import DefaultTheme from './themes/DefaultTheme'
import NoirEditorialTheme from './themes/NoirEditorialTheme'
import MacWindowTheme from './themes/MacWindowTheme'
import OversizedTypeTheme from './themes/OversizedTypeTheme'
import GalleryGridTheme from './themes/GalleryGridTheme'
import StatsEditorialTheme from './themes/StatsEditorialTheme'
import VideoCaseStudyTheme from './themes/VideoCaseStudyTheme'
import '../projects.css'
import './project-detail.css'

const THEME_MAP: Record<ProjectTheme, ComponentType<{ project: Project }>> = {
  'noir-editorial': NoirEditorialTheme,
  'mac-window': MacWindowTheme,
  'oversized-type': OversizedTypeTheme,
  'gallery-grid': GalleryGridTheme,
  'stats-editorial': StatsEditorialTheme,
  'video-case-study': VideoCaseStudyTheme,
}

export async function generateStaticParams() {
  return projects.map(p => ({ slug: p.id }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)
  if (!project) return { title: 'Project Not Found | ThinkSuite' }

  const title = `${project.title}: Client Project Case Study`
  const description = `${project.tagline} See how ThinkSuite delivered ${project.services.slice(0, 3).join(', ')} for ${project.title} in the ${project.industry} industry.`
  const ogImage = project.screenshot || project.logo || '/assets/img/logo.png'

  return {
    title,
    description,
    keywords: [project.title, project.industry, ...project.services, 'ThinkSuite projects', 'ThinkSuite portfolio'],
    alternates: { canonical: `https://thinksuite.in/projects/${project.id}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://thinksuite.in/projects/${project.id}`,
      images: [{ url: `https://thinksuite.in${ogImage}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://thinksuite.in${ogImage}`],
    },
  }
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  const related = projects.filter(p => p.id !== project.id).slice(0, 3)
  const ThemeComponent = project.theme ? THEME_MAP[project.theme] : DefaultTheme

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: project.services[0] || `${project.title} Digital Services`,
    serviceType: project.industry,
    description: project.desc,
    provider: {
      '@type': 'Organization',
      name: 'ThinkSuite',
      url: 'https://thinksuite.in',
      logo: 'https://thinksuite.in/assets/img/logo.png',
    },
    areaServed: 'IN',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thinksuite.in' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://thinksuite.in/projects' },
      { '@type': 'ListItem', position: 3, name: project.title, item: `https://thinksuite.in/projects/${project.id}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main>
        {/* Breadcrumb */}
        <div className="article-breadcrumb">
          <div className="container">
            <Link href="/">Home</Link><span>›</span>
            <Link href="/projects">Projects</Link><span>›</span>
            <span>{project.title}</span>
          </div>
        </div>

        <ThemeComponent project={project} />

        <div className="container">
          {/* Related Projects */}
          {related.length > 0 && (
            <section className="prj-related-section">
              <h2>Explore More <span className="grad-text">Projects</span></h2>
              <div className="prj-related-grid reveal">
                {related.map(p => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="prj-related-card">
                    <div className="prj-related-card-cover" style={{ background: p.coverGradient }}>
                      <div className="prj-card-cover-pattern" />
                      {p.logo ? (
                        <img src={p.logo} alt={`${p.title} logo`} className="prj-card-logo" />
                      ) : (
                        <i className={`fa-solid ${p.coverIcon}`} />
                      )}
                    </div>
                    <div className="prj-related-card-body">
                      <span className="prj-related-card-industry">{p.industry}</span>
                      <h3>{p.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Bottom CTA */}
        <section className="prj-detail-bottom-cta">
          <div className="container">
            <h2>Want Results Like <span className="grad-text">This?</span></h2>
            <p>Let&apos;s talk about what we can build and grow for your brand.</p>
            <Link href="/contact" className="btn btn-primary btn-lg">Get in Touch <i className="fa-solid fa-arrow-right" /></Link>
          </div>
        </section>
      </main>
    </>
  )
}
