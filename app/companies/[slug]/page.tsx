import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogArticle } from '@/lib/news/types';

export const revalidate = 1800;

const COMPANY_DATA: Record<string, {
  name: string;
  description: string;
  founded: string;
  hq: string;
  ceo: string;
  valuation: string;
  employees: string;
  models: string[];
  website: string;
  color: string;
  filterKeys: string[];
}> = {
  openai: {
    name: 'OpenAI', description: 'American AI research lab focused on artificial general intelligence. Creator of GPT series, DALL-E, Sora, and ChatGPT.', founded: '2015', hq: 'San Francisco, CA', ceo: 'Sam Altman', valuation: '$157B+', employees: '3,000+', models: ['GPT-4o', 'GPT-4', 'GPT-3.5', 'DALL-E 3', 'Sora', 'Whisper'], website: 'https://openai.com', color: '#10a37f', filterKeys: ['OpenAI', 'ChatGPT', 'GPT'],
  },
  anthropic: {
    name: 'Anthropic', description: 'AI safety company founded by ex-OpenAI researchers. Creator of the Claude AI assistant family.', founded: '2021', hq: 'San Francisco, CA', ceo: 'Dario Amodei', valuation: '$18.4B+', employees: '700+', models: ['Claude 3.5 Sonnet', 'Claude 3 Opus', 'Claude 3 Haiku', 'Claude 2'], website: 'https://anthropic.com', color: '#d97706', filterKeys: ['Anthropic', 'Claude'],
  },
  google: {
    name: 'Google DeepMind', description: 'World\'s leading AI research lab, combining Google Brain and DeepMind. Creator of Gemini, AlphaFold, and more.', founded: '1998 (AI: 2014)', hq: 'London / Mountain View', ceo: 'Sundar Pichai (Google) / Demis Hassabis (DeepMind)', valuation: 'Public (Alphabet)', employees: '180,000+', models: ['Gemini 1.5 Pro', 'Gemini Ultra', 'Gemma', 'PaLM 2'], website: 'https://deepmind.google', color: '#4285f4', filterKeys: ['Google', 'DeepMind', 'Gemini'],
  },
  meta: {
    name: 'Meta AI', description: 'Meta Platforms\' AI research division. Pioneers of open-source AI through the LLaMA model family.', founded: '2013', hq: 'Menlo Park, CA', ceo: 'Mark Zuckerberg', valuation: 'Public (Meta)', employees: '70,000+', models: ['Llama 3', 'Llama 2', 'Code Llama', 'SAM'], website: 'https://ai.meta.com', color: '#0866ff', filterKeys: ['Meta', 'Llama', 'Facebook'],
  },
  microsoft: {
    name: 'Microsoft AI', description: 'Major AI investor and integrator. Partners with OpenAI, creator of Copilot, and Azure AI platform.', founded: '1975', hq: 'Redmond, WA', ceo: 'Satya Nadella', valuation: '$3T+ (Public)', employees: '220,000+', models: ['Copilot', 'Phi-3', 'Azure OpenAI'], website: 'https://microsoft.com/ai', color: '#00a4ef', filterKeys: ['Microsoft', 'Copilot', 'Azure'],
  },
  nvidia: {
    name: 'NVIDIA', description: 'World\'s leading GPU maker powering AI infrastructure. Creator of CUDA, NeMo, and AI hardware ecosystem.', founded: '1993', hq: 'Santa Clara, CA', ceo: 'Jensen Huang', valuation: '$3T+ (Public)', employees: '29,000+', models: ['NeMo', 'Megatron', 'cuLLM', 'Blackwell GPU'], website: 'https://nvidia.com', color: '#76b900', filterKeys: ['NVIDIA', 'GPU'],
  },
  xai: {
    name: 'xAI', description: 'Elon Musk\'s AI company building Grok, integrated with X (Twitter) platform.', founded: '2023', hq: 'San Francisco, CA', ceo: 'Elon Musk', valuation: '$24B+', employees: '200+', models: ['Grok 1', 'Grok 2'], website: 'https://x.ai', color: '#1d1d1f', filterKeys: ['xAI', 'Grok', 'Elon Musk'],
  },
  mistral: {
    name: 'Mistral AI', description: 'French AI startup building open and efficient language models. Strong in European AI ecosystem.', founded: '2023', hq: 'Paris, France', ceo: 'Arthur Mensch', valuation: '$6B+', employees: '200+', models: ['Mistral 7B', 'Mixtral', 'Mistral Large', 'Codestral'], website: 'https://mistral.ai', color: '#ff7000', filterKeys: ['Mistral'],
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const company = COMPANY_DATA[params.slug];
  if (!company) {
    return {
      title: 'Company Not Found | ThinkSuite AI News',
      description: 'This AI company profile could not be found. Browse profiles of OpenAI, Anthropic, Google DeepMind, Meta AI, and more on ThinkSuite AI Pulse.',
    };
  }
  return {
    title: `${company.name} | AI Company Profile | ThinkSuite`,
    description: `${company.description} Latest news, models, funding, and analysis.`,
    keywords: [
      `${company.name} news`,
      `${company.name} AI`,
      `${company.name} models`,
      `${company.name} funding`,
      ...company.filterKeys.map(k => `${k} AI news`),
    ],
    alternates: { canonical: `https://thinksuite.in/companies/${params.slug}` },
  };
}

async function getCompanyArticles(filterKeys: string[]): Promise<BlogArticle[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/blog?limit=50`, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const { articles } = await res.json();
    return articles.filter((a: BlogArticle) =>
      filterKeys.some(key => a.company?.toLowerCase().includes(key.toLowerCase()) || a.title?.toLowerCase().includes(key.toLowerCase()))
    ).slice(0, 12);
  } catch {
    return [];
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 36e5);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function CompanyProfilePage({ params }: { params: { slug: string } }) {
  const company = COMPANY_DATA[params.slug];
  if (!company) notFound();

  const articles = await getCompanyArticles(company.filterKeys);

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    description: company.description,
    url: company.website,
    foundingDate: company.founded,
    address: company.hq,
    employee: { '@type': 'Person', name: company.ceo, jobTitle: 'CEO' },
    numberOfEmployees: { '@type': 'QuantitativeValue', value: company.employees },
    sameAs: [company.website],
  };
  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `https://thinksuite.in/companies/${params.slug}`,
    mainEntity: orgSchema,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
      {/* Company Header */}
      <section className="company-hero" style={{ '--company-color': company.color } as React.CSSProperties}>
        <div className="container">
          <Link href="/intelligence" className="back-link">← Intelligence Dashboard</Link>
          <div className="company-hero-content">
            <div className="company-logo-placeholder" style={{ background: company.color + '22', borderColor: company.color + '44' }}>
              <span style={{ color: company.color, fontSize: 32, fontWeight: 800 }}>{company.name[0]}</span>
            </div>
            <div>
              <h1 className="company-name" style={{ color: company.color }}>{company.name}</h1>
              <p className="company-desc">{company.description}</p>
              <div className="company-meta-chips">
                <span>📅 Founded {company.founded}</span>
                <span>📍 {company.hq}</span>
                <span>👤 {company.ceo}</span>
                <span>💰 {company.valuation}</span>
                <span>👥 {company.employees}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="company-layout">
          <div className="company-main">
            {/* Models */}
            <div className="company-section">
              <h2>AI Models & Products</h2>
              <div className="company-models-grid">
                {company.models.map(model => (
                  <div key={model} className="company-model-chip" style={{ borderColor: company.color + '44', color: company.color }}>
                    {model}
                  </div>
                ))}
              </div>
            </div>

            {/* Latest News */}
            <div className="company-section">
              <div className="intel-section-header">
                <h2>Latest News & Analysis ({articles.length})</h2>
              </div>
              {articles.length === 0 ? (
                <p style={{ color: 'var(--text2)', padding: '20px 0' }}>No recent articles about {company.name} yet. We track new stories as they come in, so check back soon.</p>
              ) : (
                <div className="company-articles">
                  {articles.map(a => (
                    <Link key={a.id} href={`/ai-news/${a.slug}`} className="company-article-row">
                      <div className="company-article-score" style={{ background: company.color }}>{a.importanceScore}</div>
                      <div className="company-article-body">
                        <h3>{a.title}</h3>
                        <p>{a.summary?.slice(0, 100)}...</p>
                        <div className="company-article-meta">
                          <span>{a.category}</span>
                          <span>·</span>
                          <span>{timeAgo(a.publishedAt)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="company-sidebar">
            <div className="intel-widget">
              <h3>Quick Facts</h3>
              <div className="sidebar-meta-list">
                {[
                  { label: 'Founded', value: company.founded },
                  { label: 'CEO', value: company.ceo },
                  { label: 'HQ', value: company.hq },
                  { label: 'Valuation', value: company.valuation },
                  { label: 'Employees', value: company.employees },
                ].map(item => (
                  <div key={item.label}><span>{item.label}</span><span>{item.value}</span></div>
                ))}
              </div>
              <a href={company.website} target="_blank" rel="noopener noreferrer"
                className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
                Official Website ↗
              </a>
            </div>

            <div className="intel-widget">
              <h3>Other Companies</h3>
              {Object.entries(COMPANY_DATA)
                .filter(([slug]) => slug !== params.slug)
                .slice(0, 5)
                .map(([slug, c]) => (
                  <Link key={slug} href={`/companies/${slug}`} className="intel-company-row" style={{ marginBottom: 8 }}>
                    <span>{c.name[0]}</span>
                    <span style={{ flex: 1 }}>{c.name}</span>
                    <span style={{ color: 'var(--text2)', fontSize: 12 }}>→</span>
                  </Link>
                ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
