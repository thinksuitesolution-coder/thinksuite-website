import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../pulse.css';
import { getCombinedArticles } from '@/lib/news/combined';
import { NEWS_CATEGORIES, categoryToSlug, slugToCategory, CATEGORY_SERVICE_LINK } from '@/lib/news/categories';
import PulseShell, { PulseNavLink, PulseTopic } from '@/components/ai-news/PulseShell';
import SafeImg from '@/components/ai-news/SafeImg';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thinksuite.in';
const PAGE_SIZE = 20;
const TOPIC_COLORS = ['#1a237e', '#facc15', '#fb923c', '#f97316', '#ef4444', '#0288d1', '#06b6d4', '#22c55e'];

const CATEGORY_INTRO: Record<string, string> = {
  'AI Models':     'The latest large language model and foundation model releases, benchmarks, and capability updates from OpenAI, Anthropic, Google, Meta, and the rest of the AI industry.',
  'Research':      'New AI research papers, breakthroughs, and findings from labs and universities worldwide, fact-checked and summarized as they publish.',
  'Funding':       'AI startup funding rounds, acquisitions, and investment news, tracked as deals are announced.',
  'Open Source':   'Open-source AI model releases, frameworks, and tools, as they land on GitHub and HuggingFace.',
  'Tools':         'New AI-powered developer tools, APIs, and platforms, as they launch.',
  'Policy':        'AI regulation, government policy, and industry governance news from around the world.',
  'Industry News': 'Broader AI industry news, product launches, and company announcements that don\'t fit a narrower category.',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function generateStaticParams() {
  return NEWS_CATEGORIES.map((c) => ({ category: categoryToSlug(c) }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = slugToCategory(params.category);
  if (!category) return {};
  const title = `${category} News — AI Pulse | ThinkSuite`;
  const description = CATEGORY_INTRO[category] || `Latest ${category} news, tracked and fact-checked by ThinkSuite AI Pulse.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/ai-news/category/${params.category}` },
    openGraph: { title, description, type: 'website', url: `${SITE_URL}/ai-news/category/${params.category}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { page?: string };
}) {
  const category = slugToCategory(params.category);
  if (!category) notFound();

  const all = await getCombinedArticles(500).catch(() => []);
  const filtered = all
    .filter((a) => a.category === category)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  const requestedPage = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const serviceLink = CATEGORY_SERVICE_LINK[category];

  const navLinks: PulseNavLink[] = NEWS_CATEGORIES.map((c) => ({
    label: c,
    href: `/ai-news/category/${categoryToSlug(c)}`,
    icon: 'fa-tag',
    active: c === category,
  }));

  const sidebarTopics: PulseTopic[] = NEWS_CATEGORIES
    .filter((c) => c !== category)
    .map((c, i) => ({ label: c, href: `/ai-news/category/${categoryToSlug(c)}`, color: TOPIC_COLORS[i % TOPIC_COLORS.length] }));

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category} News`,
    description: CATEGORY_INTRO[category],
    url: `${SITE_URL}/ai-news/category/${params.category}`,
    isPartOf: { '@type': 'WebSite', name: 'ThinkSuite AI Pulse', url: `${SITE_URL}/ai-news` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <PulseShell navLinks={navLinks} topics={sidebarTopics}>
        <div className="pulse-content">
          <div className="pulse-feed">
            <div className="pulse-feed-head" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <div className="pulse-feed-title">
                <i className="fa-solid fa-tag" />
                {category} News
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--pulse-text2)', lineHeight: 1.6, margin: 0 }}>
                {CATEGORY_INTRO[category]}
              </p>
            </div>

            {paged.length === 0 ? (
              <div className="pulse-empty">
                <i className="fa-solid fa-satellite-dish" />
                No {category.toLowerCase()} stories yet. New articles come in every couple of hours, check back soon.
              </div>
            ) : (
              paged.map((a) => (
                <Link key={a.id} href={`/ai-news/${a.slug}`} className="pulse-row">
                  <div className="pulse-row-thumb">
                    <SafeImg
                      src={a.heroImageUrl || `https://picsum.photos/seed/${a.id}/600/340`}
                      fallback={`https://picsum.photos/seed/${a.id}/600/340`}
                      alt={a.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="pulse-row-body">
                    <div className="pulse-row-top">
                      <span className="pulse-row-title">{a.title}</span>
                    </div>
                    <p className="pulse-row-desc">{a.summary}</p>
                    <div className="pulse-row-foot">
                      {a.company && a.company !== 'AI Industry' && (
                        <span className="pulse-company-tag">{a.company}</span>
                      )}
                      <span>{a.sourceName}</span>
                      <span>·</span>
                      <span>{timeAgo(a.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}

            {totalPages > 1 && (
              <div className="pulse-pagination" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
                {currentPage > 1 && (
                  <Link href={`/ai-news/category/${params.category}?page=${currentPage - 1}`} className="pulse-tab">← Prev</Link>
                )}
                <span className="pulse-tab active">{currentPage} / {totalPages}</span>
                {currentPage < totalPages && (
                  <Link href={`/ai-news/category/${params.category}?page=${currentPage + 1}`} className="pulse-tab">Next →</Link>
                )}
              </div>
            )}
          </div>

          <div className="pulse-rail">
            {serviceLink && (
              <div className="pulse-card">
                <div className="pulse-card-head">
                  <span className="pulse-card-title">Need This Built?</span>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--pulse-text2)', marginBottom: 12, lineHeight: 1.6 }}>
                  If {category.toLowerCase()} news like this is relevant to your business, ThinkSuite can help you act on it.
                </p>
                <Link href={serviceLink.href} className="pulse-card-link" style={{ fontWeight: 700 }}>
                  {serviceLink.label} →
                </Link>
              </div>
            )}

            <div className="pulse-card">
              <div className="pulse-card-head">
                <span className="pulse-card-title">Browse by Category</span>
              </div>
              {NEWS_CATEGORIES.map((c) => (
                <Link key={c} href={`/ai-news/category/${categoryToSlug(c)}`} className="pulse-trend-item">
                  <div>
                    <div className="pulse-trend-title" style={{ fontWeight: c === category ? 800 : 500 }}>{c}</div>
                  </div>
                </Link>
              ))}
              <Link href="/ai-news" className="pulse-card-link" style={{ display: 'block', marginTop: 8 }}>
                View all AI news →
              </Link>
            </div>
          </div>
        </div>
      </PulseShell>
    </>
  );
}
