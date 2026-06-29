import SectionHeading from '@/components/ui/SectionHeading'

const stacks = [
  {
    cat: 'Frontend',
    color: '#2563eb',
    icon: 'fa-display',
    techs: ['React.js', 'Next.js 14', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    cat: 'Backend',
    color: '#7c3aed',
    icon: 'fa-server',
    techs: ['Node.js', 'Python / FastAPI', 'Django', 'PHP / Laravel', 'Go', 'REST & GraphQL APIs'],
  },
  {
    cat: 'Mobile',
    color: '#059669',
    icon: 'fa-mobile-screen',
    techs: ['React Native', 'Flutter', 'iOS (Swift)', 'Android (Kotlin)', 'Expo', 'Firebase'],
  },
  {
    cat: 'AI & Machine Learning',
    color: '#d97706',
    icon: 'fa-brain',
    techs: ['OpenAI / GPT-4o', 'Anthropic Claude', 'LangChain', 'Hugging Face', 'RAG Systems', 'Pinecone / Weaviate'],
  },
  {
    cat: 'Cloud & DevOps',
    color: '#0891b2',
    icon: 'fa-cloud',
    techs: ['AWS', 'Google Cloud', 'Vercel / Netlify', 'Docker / Kubernetes', 'CI/CD Pipelines', 'Terraform'],
  },
  {
    cat: 'Marketing Tech',
    color: '#dc2626',
    icon: 'fa-chart-bar',
    techs: ['Google Ads', 'Meta Ads Manager', 'Semrush / Ahrefs', 'HubSpot CRM', 'Klaviyo', 'GA4 / GTM'],
  },
]

export default function TechStackSection() {
  return (
    <section className="section" id="tech-stack">
      <div className="container">
        <SectionHeading
          label="Our Tech Stack"
          title={<>Built with <span className="text-accent">Industry-Leading Tools</span></>}
          subtitle="We work with the best modern technologies to build fast, scalable, and future-proof solutions, from frontend to AI infrastructure."
          center
        />
        <div className="grid-3">
          {stacks.map((s, i) => (
            <div
              key={s.cat}
              className={`service-card reveal reveal-d${(i % 3) + 1}`}
              style={{ padding: '32px 28px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: 18 }} />
                </div>
                <h5 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: s.color, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'var(--font-m)' }}>
                  {s.cat}
                </h5>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {s.techs.map((t) => (
                  <span key={t} className="chip" style={{ fontSize: 12 }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
