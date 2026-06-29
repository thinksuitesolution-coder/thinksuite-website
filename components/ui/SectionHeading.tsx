interface SectionHeadingProps {
  label: string
  title: React.ReactNode
  subtitle?: string
  center?: boolean
}

export default function SectionHeading({ label, title, subtitle, center }: SectionHeadingProps) {
  return (
    <div className={`title-block${center ? ' center' : ''} reveal`}>
      <span className="label">{label}</span>
      <h2 className="mt-16">{title}</h2>
      {subtitle && <p className="mt-16">{subtitle}</p>}
    </div>
  )
}
