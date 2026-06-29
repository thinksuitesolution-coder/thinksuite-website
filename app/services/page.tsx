import type { Metadata } from 'next'
import ServicesGrid from './ServicesGrid'

export const metadata: Metadata = {
  title: 'Digital Services by ThinkSuite | Web, Marketing, AI, Design',
  description: 'Explore ThinkSuite\'s digital services: software development, digital marketing, UI/UX design, AI automation, media advertising, and business consulting.',
}

export default function ServicesPage() {
  return (
    <section className="sp-section">
      <div className="container">

        {/* Hero */}
        <div className="sp-hero">
          <span className="sp-badge"><span className="sp-badge-dot">✦</span> OUR SERVICES</span>
          <h1 className="sp-hero-title">One Partner.{' '}<span>Six Growth Engines.</span></h1>
          <p className="sp-hero-sub">
            Technology, creativity and strategy, combined to deliver end-to-end
            solutions that help businesses build, grow and scale.
          </p>
        </div>

        {/* Grid + Drawer (client) */}
        <ServicesGrid />

      </div>
    </section>
  )
}
