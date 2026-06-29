import Link from 'next/link'

interface ServiceCardProps {
  icon: string
  color: string
  colorClass: string
  title: string
  desc: string
  href: string
  delay?: string
}

export default function ServiceCard({ icon, color, colorClass, title, desc, href, delay }: ServiceCardProps) {
  return (
    <div className={`service-card reveal${delay ? ` ${delay}` : ''}`} data-color={color}>
      <div className={`service-icon ${colorClass}`}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <h4>{title}</h4>
      <p>{desc}</p>
      <Link href={href} className="service-link">
        Learn More <i className="fa-solid fa-arrow-right" />
      </Link>
    </div>
  )
}
