import Link from 'next/link'

interface CTASectionProps {
  eyebrow?: string
  title?: string
  titleHighlight?: string
  subtitle?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export default function CTASection({
  eyebrow = 'Ready to Scale?',
  title = "Let's Build Something",
  titleHighlight = 'Extraordinary',
  subtitle = 'Join 50+ businesses that trust ThinkSuite to deliver exceptional digital solutions. Your next big breakthrough starts with a conversation.',
  primaryLabel = 'Start Your Project',
  primaryHref = '/contact',
  secondaryLabel = 'View All Services',
  secondaryHref = '/services',
}: CTASectionProps) {
  return (
    <section className="cta-section">
      <div className="container">
        <span className="label reveal">{eyebrow}</span>
        <h2 className="mt-16 reveal">
          {title} <span className="grad-text">{titleHighlight}</span>
        </h2>
        <p className="reveal">{subtitle}</p>
        <div className="cta-btns reveal">
          <Link href={primaryHref} className="btn btn-primary btn-lg">
            {primaryLabel} <i className="fa-solid fa-arrow-right" />
          </Link>
          <Link href={secondaryHref} className="btn btn-outline btn-lg">
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
