import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogArticle } from '@/lib/news/types';

export const metadata: Metadata = {
  title: 'AI News and Insights | ThinkSuite Blog',
  description: 'Real-time AI news, research, and analysis. Stay updated with the latest from OpenAI, Anthropic, Google DeepMind, Meta AI, and the global AI industry.',
  alternates: { canonical: 'https://thinksuite.in/blog' },
};

export const revalidate = 300; // ISR: revalidate every 5 minutes

async function getArticles(page = 1, category?: string): Promise<{ articles: BlogArticle[]; total: number }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const params = new URLSearchParams({ page: String(page), limit: '12' });
    if (category) params.set('category', category);

    const res = await fetch(`${baseUrl}/api/blog?${params}`, { next: { revalidate: 300 } });
    if (!res.ok) return { articles: [], total: 0 };
    return res.json();
  } catch {
    return { articles: [], total: 0 };
  }
}

const CATEGORIES = ['All', 'AI Models', 'Research', 'Funding', 'Open Source', 'Tools', 'Policy', 'Industry News'];

const EVENT_BADGES: Record<string, { label: string; color: string }> = {
  model_release:  { label: 'Model Release', color: '#2563eb' },
  research_paper: { label: 'Research',       color: '#7c3aed' },
  funding:        { label: 'Funding',        color: '#d97706' },
  acquisition:    { label: 'Acquisition',    color: '#dc2626' },
  open_source:    { label: 'Open Source',    color: '#059669' },
  api_release:    { label: 'API Release',    color: '#0891b2' },
  product_launch: { label: 'Launch',         color: '#2563eb' },
  github_release: { label: 'GitHub',         color: '#1f2937' },
  breaking_news:  { label: 'Breaking',       color: '#dc2626' },
  keynote:        { label: 'Keynote',        color: '#7c3aed' },
  general:        { label: 'News',           color: '#64748b' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#dc2626' : score >= 65 ? '#d97706' : '#2563eb';
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
      {score}/100
    </span>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  const category = searchParams.category !== 'All' ? searchParams.category : undefined;
  const page = parseInt(searchParams.page || '1');
  const { articles, total } = await getArticles(page, category);

  return (
    <main>
      {/* Hero */}
      <section className="blog-hero">
        <div className="container">
          <div className="blog-hero-badge">
            <span className="live-dot" />
            Live AI Intelligence
          </div>
          <h1 className="blog-hero-title">
            Global AI News,<br />
            <span className="gradient-text">Understood & Analyzed</span>
          </h1>
          <p className="blog-hero-desc">
            Real-time coverage of every major AI announcement, research paper, model release, and industry move, automatically detected, fact-checked, and written by AI.
          </p>
          <div className="blog-hero-stats">
            <div className="blog-stat"><strong>{total}</strong><span>Articles Published</span></div>
            <div className="blog-stat"><strong>50+</strong><span>Sources Monitored</span></div>
            <div className="blog-stat"><strong>10min</strong><span>Update Interval</span></div>
            <div className="blog-stat"><strong>GPT-4o</strong><span>AI Writer</span></div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="blog-filters-wrap">
        <div className="container">
          <div className="blog-filters">
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                href={`/blog${cat !== 'All' ? `?category=${encodeURIComponent(cat)}` : ''}`}
                className={`blog-filter-btn ${(!searchParams.category && cat === 'All') || searchParams.category === cat ? 'active' : ''}`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section">
        <div className="container">
          {articles.length === 0 ? (
            <div className="blog-empty">
              <div className="blog-empty-icon">🤖</div>
              <h3>AI is fetching the latest news...</h3>
              <p>The pipeline runs every 10 minutes. Check back soon or trigger a manual fetch.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {articles.map((article, i) => {
                const badge = EVENT_BADGES[article.eventType] || EVENT_BADGES.general;
                return (
                  <Link key={article.id} href={`/blog/${article.slug}`} className={`blog-card ${i === 0 ? 'blog-card-featured' : ''}`}>
                    <div className="blog-card-image">
                      <img
                        src={article.heroImageUrl || `https://source.unsplash.com/800x400/?AI,technology,${article.company}`}
                        alt={article.title}
                        loading={i < 3 ? 'eager' : 'lazy'}
                      />
                      <div className="blog-card-badges">
                        <span className="blog-badge" style={{ background: badge.color }}>{badge.label}</span>
                        <ScoreBadge score={article.importanceScore} />
                      </div>
                    </div>
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span className="blog-company">{article.company}</span>
                        <span className="blog-dot">·</span>
                        <span className="blog-time">{timeAgo(article.publishedAt)}</span>
                        <span className="blog-dot">·</span>
                        <span className="blog-source">{article.sourceName}</span>
                      </div>
                      <h2 className="blog-card-title">{article.title}</h2>
                      <p className="blog-card-summary">{article.summary}</p>
                      <div className="blog-card-tags">
                        {(article.tags || []).slice(0, 3).map(tag => (
                          <span key={tag} className="blog-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {total > 12 && (
            <div className="blog-pagination">
              {page > 1 && (
                <Link href={`/blog?page=${page - 1}${category ? `&category=${category}` : ''}`} className="blog-page-btn">
                  ← Previous
                </Link>
              )}
              <span className="blog-page-info">Page {page} of {Math.ceil(total / 12)}</span>
              {page * 12 < total && (
                <Link href={`/blog?page=${page + 1}${category ? `&category=${category}` : ''}`} className="blog-page-btn">
                  Next →
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
