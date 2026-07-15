import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogArticle } from '@/lib/news/types';
import { articlesCol } from '@/lib/firebase-admin';
import { getArchivedArticleBySlug } from '@/lib/news/archive-db';
import { LANGUAGE_CONFIG, SupportedLanguage, TranslatedArticle } from '@/lib/news/pipeline/multilang';

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thinksuite.in';

async function getArticleWithTranslation(slug: string, lang: string): Promise<{ article: BlogArticle; translation: TranslatedArticle } | null> {
  let article: BlogArticle | null = null;
  try {
    const snap = await articlesCol().where('slug', '==', slug).limit(1).get();
    if (!snap.empty) article = snap.docs[0].data() as BlogArticle;
  } catch { /* fall through to archive */ }

  if (!article) {
    try { article = await getArchivedArticleBySlug(slug) as BlogArticle | null; } catch { article = null; }
  }
  if (!article) return null;

  const translation = article.translations?.find((t) => t.lang === lang);
  if (!translation) return null;

  return { article, translation };
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

function TranslatedContent({ content }: { content: string }) {
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

export async function generateMetadata({ params }: { params: { slug: string; lang: string } }): Promise<Metadata> {
  const result = await getArticleWithTranslation(params.slug, params.lang);
  if (!result) return { title: 'Article Not Found | ThinkSuite AI News' };
  const { article, translation } = result;

  const languages: Record<string, string> = { 'x-default': `${SITE_URL}/ai-news/${article.slug}`, en: `${SITE_URL}/ai-news/${article.slug}` };
  for (const t of article.translations || []) {
    languages[t.lang] = `${SITE_URL}/ai-news/${article.slug}/${t.lang}`;
  }

  return {
    title: translation.metaTitle || `${translation.title} | ThinkSuite AI News`,
    description: translation.metaDescription || translation.summary,
    alternates: {
      canonical: `${SITE_URL}/ai-news/${article.slug}/${params.lang}`,
      languages,
    },
    openGraph: {
      title: translation.title,
      description: translation.summary,
      images: article.heroImageUrl ? [{ url: article.heroImageUrl, width: 1200, height: 630 }] : undefined,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      url: `${SITE_URL}/ai-news/${article.slug}/${params.lang}`,
      locale: params.lang,
    },
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

export default async function TranslatedArticlePage({ params }: { params: { slug: string; lang: string } }) {
  const result = await getArticleWithTranslation(params.slug, params.lang);
  if (!result) notFound();
  const { article, translation } = result;
  const langConfig = LANGUAGE_CONFIG[params.lang as SupportedLanguage];

  const schemaJson = {
    '@context': 'https://schema.org', '@type': 'NewsArticle',
    headline: translation.title, description: translation.summary,
    image: article.heroImageUrl ? [article.heroImageUrl] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    inLanguage: params.lang,
    author: { '@type': 'Organization', name: 'ThinkSuite AI', url: `${SITE_URL}/ai-news` },
    publisher: {
      '@type': 'Organization', name: 'ThinkSuite',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/img/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/ai-news/${article.slug}/${params.lang}` },
    url: `${SITE_URL}/ai-news/${article.slug}/${params.lang}`,
    articleSection: article.category || undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }} />
      <main dir={langConfig?.dir || 'ltr'}>
        <div className="article-breadcrumb">
          <div className="container">
            <Link href="/">Home</Link><span>›</span>
            <Link href="/ai-news">AI News</Link><span>›</span>
            <Link href={`/ai-news/${article.slug}`}>{article.title.slice(0, 40)}...</Link>
          </div>
        </div>

        <article className="article-wrap">
          <div className="container">
            <div className="article-layout">
              <div className="article-main">
                <header className="article-header">
                  <div className="article-header-meta">
                    <span className="article-category-chip">{langConfig?.nativeName || translation.langName}</span>
                    {article.category && <span className="article-category-chip">{article.category}</span>}
                  </div>
                  <h1 className="article-title">{translation.title}</h1>
                  <p className="article-summary">{translation.summary}</p>
                  <div className="article-byline">
                    <span>ThinkSuite AI</span><span>·</span>
                    <span>{timeAgo(article.publishedAt)}</span><span>·</span>
                    <a href={article.originalUrl} target="_blank" rel="noopener noreferrer">Source: {article.sourceName} ↗</a>
                  </div>
                </header>

                {article.heroImageUrl && (
                  <div className="article-hero-img">
                    <img src={article.heroImageUrl} alt={translation.title} />
                  </div>
                )}

                {translation.keyHighlights?.length > 0 && (
                  <div className="article-highlights">
                    <h3>{langConfig?.dir === 'rtl' ? 'أبرز النقاط' : 'Key Highlights'}</h3>
                    <ul>
                      {translation.keyHighlights.map((h, i) => <li key={i}><span>✓</span>{h}</li>)}
                    </ul>
                  </div>
                )}

                <TranslatedContent content={translation.content} />

                {translation.whyItMatters && (
                  <div className="article-highlights">
                    <h3>{translation.langName === 'Hindi' ? 'यह क्यों मायने रखता है' : 'Why It Matters'}</h3>
                    <p className="article-p">{translation.whyItMatters}</p>
                  </div>
                )}

                {translation.faqs?.length > 0 && (
                  <div className="article-faqs">
                    <h3>FAQ</h3>
                    {translation.faqs.map((faq, i) => (
                      <details key={i} className="article-faq-item">
                        <summary>{faq.question}</summary>
                        <p>{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                )}

                <div className="article-tags" style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)', marginRight: 6 }}>
                    {langConfig?.dir === 'rtl' ? 'اللغات المتاحة:' : 'Available in:'}
                  </span>
                  <Link href={`/ai-news/${article.slug}`} className="blog-tag">English</Link>
                  {(article.translations || []).filter(t => t.lang !== params.lang).map(t => (
                    <Link key={t.lang} href={`/ai-news/${article.slug}/${t.lang}`} className="blog-tag">
                      {LANGUAGE_CONFIG[t.lang]?.nativeName || t.langName}
                    </Link>
                  ))}
                </div>

                <div className="article-bottom-cta">
                  <div>
                    <h3>Want AI intelligence for your business?</h3>
                    <p>ThinkSuite builds AI-powered systems, automation, and custom tools for forward-thinking companies.</p>
                  </div>
                  <Link href="/contact" className="btn-primary">Talk to Us →</Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
