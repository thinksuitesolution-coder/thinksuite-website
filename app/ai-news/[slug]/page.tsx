import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogArticle } from '@/lib/news/types';
import { StartupOpportunity } from '@/lib/news/pipeline/opportunities';
import { CompetitorAnalysis } from '@/lib/news/pipeline/competitor-intel';
import { PersonalizedVersion } from '@/lib/news/pipeline/personalized-versions';
import ArticleTabs from '@/components/blog/ArticleTabs';
import { articlesCol } from '@/lib/firebase-admin';

export const revalidate = 3600;

interface EnrichedArticle extends BlogArticle {
  opportunities?: { opportunities: StartupOpportunity[]; topOpportunity: StartupOpportunity; investmentAngles: string[]; threatenedStartups: string[]; emergingJobRoles: string[]; summary: string } | null;
  competitorIntel?: CompetitorAnalysis | null;
  personalizedVersions?: PersonalizedVersion[];
  seo?: { readingTimeMinutes?: number; wordCount?: number; conversationalQueries?: string[] };
}

async function getArticle(slug: string): Promise<EnrichedArticle | null> {
  try {
    const snap = await articlesCol().where('slug', '==', slug).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as EnrichedArticle;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) {
    return {
      title: 'Article Not Found | ThinkSuite AI News',
      description: 'This AI news story could not be found. Browse the latest AI news, research, and product launches on ThinkSuite AI Pulse.',
    };
  }
  const title = article.metaTitle || `${article.title} | ThinkSuite AI News`;
  const description = article.metaDescription || article.summary || `Latest AI news from ${article.company || 'the AI industry'}, tracked and analyzed by ThinkSuite AI Pulse.`;
  return {
    title,
    description,
    alternates: { canonical: `https://thinksuite.in/ai-news/${article.slug}` },
    openGraph: {
      title,
      description,
      images: article.heroImageUrl ? [{ url: article.heroImageUrl, width: 1200, height: 630 }] : undefined,
      type: 'article',
      publishedTime: article.publishedAt,
      url: `https://thinksuite.in/ai-news/${article.slug}`,
    },
    twitter: { card: 'summary_large_image', title, description, images: article.heroImageUrl ? [article.heroImageUrl] : undefined },
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function ArticleContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="article-h2">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="article-h3">{line.slice(4)}</h3>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="article-ul">
          {items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: fmtInline(item) }} />)}
        </ul>
      );
      continue;
    } else if (line.trim()) {
      elements.push(<p key={i} className="article-p" dangerouslySetInnerHTML={{ __html: fmtInline(line) }} />);
    }
    i++;
  }
  return <>{elements}</>;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fmtInline(t: string) {
  return escapeHtml(t)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const readingTime = article.seo?.readingTimeMinutes || Math.max(1, Math.round((article.content?.split(/\s+/).length || 0) / 200));

  const schemaJson = {
    '@context': 'https://schema.org', '@type': 'NewsArticle',
    headline: article.title, description: article.summary,
    image: article.heroImageUrl ? [article.heroImageUrl] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: { '@type': 'Organization', name: 'ThinkSuite AI', url: 'https://thinksuite.in/ai-news' },
    publisher: {
      '@type': 'Organization',
      name: 'ThinkSuite',
      logo: { '@type': 'ImageObject', url: 'https://thinksuite.in/assets/img/favicon.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://thinksuite.in/ai-news/${article.slug}` },
    url: `https://thinksuite.in/ai-news/${article.slug}`,
    articleSection: article.category || undefined,
    keywords: article.tags?.length ? article.tags.join(', ') : undefined,
  };
  const faqSchema = article.faqs?.length ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: article.faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <main>
        {/* Breadcrumb */}
        <div className="article-breadcrumb">
          <div className="container">
            <Link href="/">Home</Link><span>›</span>
            <Link href="/ai-news">AI News</Link><span>›</span>
            <Link href={`/companies/${article.company?.toLowerCase().replace(/\s/g, '-')}`}>{article.company}</Link><span>›</span>
            <span>{article.title?.slice(0, 40)}...</span>
          </div>
        </div>

        <article className="article-wrap">
          <div className="container">
            <div className="article-layout">

              {/* Main */}
              <div className="article-main">
                <header className="article-header">
                  <div className="article-header-meta">
                    <Link href={`/companies/${article.company?.toLowerCase().replace(/\s/g, '-')}`} className="article-company-chip">{article.company}</Link>
                    <span className="article-category-chip">{article.category}</span>
                    <span className="article-score">Impact: {article.importanceScore}/100</span>
                  </div>
                  <h1 className="article-title">{article.title}</h1>
                  <p className="article-summary">{article.summary}</p>
                  <div className="article-byline">
                    <span>ThinkSuite AI</span><span>·</span>
                    <span>{timeAgo(article.publishedAt)}</span><span>·</span>
                    <span>{readingTime} min read</span><span>·</span>
                    <a href={article.originalUrl} target="_blank" rel="noopener noreferrer">Source: {article.sourceName} ↗</a>
                  </div>
                </header>

                <div className="article-hero-img">
                  <img src={article.heroImageUrl} alt={article.title} />
                  {article.heroImageCredit && !article.heroImageCredit.includes('Picsum') && (
                    <div className="article-img-credit">
                      {article.heroImageSourceUrl ? (
                        <a href={article.heroImageSourceUrl} target="_blank" rel="noopener noreferrer">
                          📷 {article.heroImageCredit}
                        </a>
                      ) : (
                        <span>📷 {article.heroImageCredit}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Key Highlights */}
                {article.keyHighlights?.length > 0 && (
                  <div className="article-highlights">
                    <h3>Key Highlights</h3>
                    <ul>
                      {article.keyHighlights.map((h, i) => <li key={i}><span>✓</span>{h}</li>)}
                    </ul>
                  </div>
                )}

                {/* === TABS: Article / Opportunities / Competitor / Personalized === */}
                <ArticleTabs
                  article={article}
                  opportunities={article.opportunities}
                  competitorIntel={article.competitorIntel}
                  personalizedVersions={article.personalizedVersions}
                />

                {/* FAQs */}
                {article.faqs?.length > 0 && (
                  <div className="article-faqs">
                    <h3>Frequently Asked Questions</h3>
                    {article.faqs.map((faq, i) => (
                      <details key={i} className="article-faq-item">
                        <summary>{faq.question}</summary>
                        <p>{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                )}

                {/* Conversational Queries for AI Search */}
                {article.seo?.conversationalQueries?.length ? (
                  <div style={{ display: 'none' }} aria-hidden="true">
                    {article.seo.conversationalQueries.map((q, i) => <span key={i}>{q}</span>)}
                  </div>
                ) : null}

                <div className="article-tags">
                  {article.tags?.map(tag => (
                    <Link key={tag} href={`/ai-news?tag=${encodeURIComponent(tag)}`} className="blog-tag">#{tag}</Link>
                  ))}
                </div>

                <div className="article-sources">
                  <h4>Sources</h4>
                  {article.sources?.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">{s.name} ↗</a>
                  ))}
                </div>

                {/* CTA */}
                <div className="article-bottom-cta">
                  <div>
                    <h3>Want AI intelligence for your business?</h3>
                    <p>ThinkSuite builds AI-powered systems, automation, and custom tools for forward-thinking companies.</p>
                  </div>
                  <Link href="/contact" className="btn-primary">Talk to Us →</Link>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="article-sidebar">
                <div className="sidebar-card">
                  <h4>Article Details</h4>
                  <div className="sidebar-meta-list">
                    {[
                      { label: 'Source', value: article.sourceName },
                      { label: 'Company', value: article.company },
                      { label: 'Category', value: article.category },
                      { label: 'Impact', value: `${article.importanceScore}/100` },
                      { label: 'Read time', value: `${readingTime} min` },
                      { label: 'Published', value: timeAgo(article.publishedAt) },
                    ].map(item => (
                      <div key={item.label}><span>{item.label}</span><span className={item.label === 'Impact' ? 'score-pill' : ''} style={item.label === 'Impact' ? { color: '#fff' } : undefined}>{item.value}</span></div>
                    ))}
                  </div>
                </div>

                {/* Opportunities teaser */}
                {article.opportunities?.topOpportunity && (
                  <div className="sidebar-card sidebar-opportunity">
                    <h4>💡 Top Opportunity</h4>
                    <p className="opp-name">{article.opportunities.topOpportunity.name}</p>
                    <p className="opp-desc">{article.opportunities.topOpportunity.description}</p>
                    <div className="opp-chips">
                      <span>{article.opportunities.topOpportunity.targetMarket}</span>
                      <span className={`opp-comp-${article.opportunities.topOpportunity.competitionLevel}`}>
                        {article.opportunities.topOpportunity.competitionLevel} competition
                      </span>
                    </div>
                  </div>
                )}

                {/* Competitor impact teaser */}
                {article.competitorIntel?.affectedCompetitors?.length ? (
                  <div className="sidebar-card">
                    <h4>🧩 Competitor Impact</h4>
                    {article.competitorIntel.affectedCompetitors.slice(0, 3).map(c => (
                      <div key={c.company} className="sidebar-competitor-row">
                        <span>{c.company}</span>
                        <span className={`impact-badge impact-${c.impact}`}>{c.impact}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="sidebar-card sidebar-cta">
                  <h4>Stay Ahead of AI</h4>
                  <p>Get real-time AI intelligence for your team.</p>
                  <Link href="/contact" className="btn-primary" style={{ textAlign: 'center', display: 'block' }}>Talk to Us</Link>
                </div>

                <div className="sidebar-card">
                  <h4>🤖 Ask AI About This</h4>
                  <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>Have questions about this news?</p>
                  <Link href="/intelligence/chat" className="btn-secondary" style={{ display: 'block', textAlign: 'center' }}>Open AI Chat →</Link>
                </div>
              </aside>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
