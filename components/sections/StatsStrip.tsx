const stats = [
  { target: 5, suffix: '+', label: 'Years of Experience' },
  { target: 20, suffix: '+', label: 'Services Offered' },
  { target: 15, suffix: '+', label: 'Industries Served' },
  { target: 6, suffix: '', label: 'Expert Departments' },
  { target: 100, suffix: '%', label: 'In-House Delivery' },
  { target: 30, suffix: '-Day', label: 'Post-Launch Support' },
]

export default function StatsStrip() {
  return (
    <section className="stats-strip">
      <div className="container">
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(6,1fr)' }}>
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-num counter" data-target={s.target} data-suffix={s.suffix}>0</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
