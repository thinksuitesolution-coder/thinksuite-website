import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogArticle } from '@/lib/news/types';

export const metadata: Metadata = {
  title: 'AI Research Intelligence | ThinkSuite',
  description: 'Track the latest AI research papers, breakthroughs, and academic developments from Arxiv, MIT, Stanford, CMU, and top AI labs.',
};
export const revalidate = 3600;

async function getResearchArticles(): Promise<BlogArticle[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/blog?limit=50`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const { articles } = await res.json();
    return articles.filter((a: BlogArticle) =>
      a.eventType === 'research_paper' || a.category === 'Research' ||
      a.sourceName?.includes('ArXiv') || a.sourceName?.includes('Research')
    );
  } catch { return []; }
}

const RESEARCH_ORGS = [
  { name: 'OpenAI Research', focus: 'Safety, reasoning, multimodal', papers: '200+' },
  { name: 'Google DeepMind', focus: 'AlphaFold, RL, scientific AI', papers: '500+' },
  { name: 'Meta AI Research', focus: 'Open models, vision, NLP', papers: '300+' },
  { name: 'Anthropic', focus: 'Constitutional AI, interpretability', papers: '100+' },
  { name: 'MIT CSAIL', focus: 'Theory, robotics, vision', papers: '400+' },
  { name: 'Stanford AI Lab', focus: 'Foundation models, agents', papers: '350+' },
  { name: 'CMU ML', focus: 'NLP, multimodal learning', papers: '250+' },
  { name: 'Berkeley AI', focus: 'RL, robotics, safety', papers: '300+' },
];

const LANDMARK_PAPERS = [
  { title: 'Attention Is All You Need', year: 2017, authors: 'Vaswani et al. (Google)', impact: 'Invented the Transformer, the foundation of all modern LLMs', citations: '100K+', link: 'https://arxiv.org/abs/1706.03762' },
  { title: 'GPT-3: Language Models are Few-Shot Learners', year: 2020, authors: 'Brown et al. (OpenAI)', impact: 'Demonstrated emergent capabilities at 175B parameters', citations: '35K+', link: 'https://arxiv.org/abs/2005.14165' },
  { title: 'Constitutional AI: Harmlessness from AI Feedback', year: 2022, authors: 'Bai et al. (Anthropic)', impact: 'Introduced RLHF alternative for safer AI alignment', citations: '2K+', link: 'https://arxiv.org/abs/2212.08073' },
  { title: 'Sparks of Artificial General Intelligence', year: 2023, authors: 'Bubeck et al. (Microsoft)', impact: 'First paper to claim GPT-4 shows AGI-like capabilities', citations: '5K+', link: 'https://arxiv.org/abs/2303.12528' },
  { title: 'Toolformer: Language Models Can Teach Themselves', year: 2023, authors: 'Schick et al. (Meta)', impact: 'Showed LLMs can learn to use external tools autonomously', citations: '1.5K+', link: 'https://arxiv.org/abs/2302.04761' },
  { title: 'Mixtral of Experts', year: 2023, authors: 'Jiang et al. (Mistral AI)', impact: 'Sparse MoE architecture rivaling dense 70B models', citations: '800+', link: 'https://arxiv.org/abs/2401.04088' },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 36e5);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function ResearchPage() {
  const articles = await getResearchArticles();

  return (
    <main>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
        <div className="container">
          <div className="chip" style={{ marginBottom: 16 }}>🧪 Research Intelligence</div>
          <h1 className="page-title" style={{ color: '#fff' }}>AI Research Tracker</h1>
          <p className="page-desc" style={{ color: 'rgba(255,255,255,0.75)' }}>Every important AI paper explained in plain language, with business implications, who should care, and what changes next.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="research-layout">
            <div className="research-main">

              {/* Live Research Articles */}
              {articles.length > 0 && (
                <div style={{ marginBottom: 48 }}>
                  <div className="intel-section-header" style={{ marginBottom: 16 }}>
                    <h2>🔴 Latest Research Detected ({articles.length})</h2>
                  </div>
                  {articles.map((a) => (
                    <Link key={a.id} href={`/blog/${a.slug}`} className="research-article-card">
                      <div className="research-badge">📄 Research</div>
                      <h3>{a.title}</h3>
                      <p>{a.summary?.slice(0, 150)}...</p>
                      <div className="research-meta">
                        <span>{a.sourceName}</span>
                        <span>·</span>
                        <span>{timeAgo(a.publishedAt)}</span>
                        <span>·</span>
                        <span>Impact: {a.importanceScore}/100</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Landmark Papers */}
              <div>
                <h2 className="intel-section-header" style={{ marginBottom: 20 }}><span>📚 Landmark AI Papers</span></h2>
                {LANDMARK_PAPERS.map((paper, i) => (
                  <a key={i} href={paper.link} target="_blank" rel="noopener noreferrer" className="landmark-paper-card">
                    <div className="landmark-year">{paper.year}</div>
                    <div className="landmark-body">
                      <h3>{paper.title}</h3>
                      <div className="landmark-authors">{paper.authors}</div>
                      <p className="landmark-impact">{paper.impact}</p>
                      <span className="landmark-citations">📊 {paper.citations} citations</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="research-sidebar">
              <div className="intel-widget">
                <h3>Top Research Organizations</h3>
                {RESEARCH_ORGS.map(org => (
                  <div key={org.name} className="research-org-row">
                    <div>
                      <div className="research-org-name">{org.name}</div>
                      <div className="research-org-focus">{org.focus}</div>
                    </div>
                    <span className="research-org-papers">{org.papers}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
