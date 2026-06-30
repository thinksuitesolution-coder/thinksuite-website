import type { Metadata } from 'next';
import Link from 'next/link';
import './pulse.css';
import { BlogArticle } from '@/lib/news/types';
import { articlesCol } from '@/lib/firebase-admin';
import PulseShell, { PulseNavLink, PulseTopic } from '@/components/ai-news/PulseShell';
import FeaturedCarousel, { FeaturedSlide } from '@/components/ai-news/FeaturedCarousel';
import NewsletterForm from '@/components/ai-news/NewsletterForm';
import SafeImg from '@/components/ai-news/SafeImg';

export const metadata: Metadata = {
  title: 'AI Pulse — AI News & Intelligence | ThinkSuite',
  description: 'Real-time AI news from 100+ sources — OpenAI, Anthropic, Google DeepMind, Meta AI, NVIDIA and more. Auto-detected, fact-checked, analyzed by AI.',
  alternates: { canonical: 'https://thinksuite.in/ai-news' },
};

export const revalidate = 300;

async function getAllArticles(): Promise<BlogArticle[]> {
  try {
    const snap = await articlesCol().orderBy('publishedAt', 'desc').limit(150).get();
    return snap.docs.map(d => d.data() as BlogArticle);
  } catch (e) {
    console.error('[AINews] getAllArticles error:', e);
    return [];
  }
}

const NAV_CATEGORIES: { label: string; icon: string; href: string }[] = [
  { label: 'Home', icon: 'fa-house', href: '/ai-news' },
  { label: 'Latest', icon: 'fa-bolt', href: '/ai-news?tab=latest' },
  { label: 'Trending', icon: 'fa-fire', href: '/ai-news?tab=popular' },
  { label: 'Research', icon: 'fa-book-open', href: '/ai-news?category=Research' },
  { label: 'Tools', icon: 'fa-screwdriver-wrench', href: '/ai-news?category=Tools' },
  { label: 'Funding', icon: 'fa-sack-dollar', href: '/ai-news?category=Funding' },
  { label: 'Newsletter', icon: 'fa-envelope', href: '#pulse-newsletter' },
];

const TOPIC_COLORS = ['#1a237e', '#facc15', '#fb923c', '#f97316', '#ef4444', '#0288d1', '#06b6d4', '#22c55e'];

const EVENT_META: Record<string, { label: string; color: string; icon: string }> = {
  model_release:  { label: 'Model Release',  color: '#1a237e', icon: '🤖' },
  research_paper: { label: 'Research',       color: '#2563eb', icon: '📄' },
  funding:        { label: 'Funding',         color: '#d97706', icon: '💰' },
  acquisition:    { label: 'Acquisition',     color: '#dc2626', icon: '🤝' },
  open_source:    { label: 'Open Source',     color: '#059669', icon: '🔓' },
  api_release:    { label: 'API Release',     color: '#0891b2', icon: '⚡' },
  product_launch: { label: 'Launch',          color: '#2563eb', icon: '🚀' },
  github_release: { label: 'GitHub',          color: '#1f2937', icon: '🐙' },
  breaking_news:  { label: 'Breaking',        color: '#dc2626', icon: '🔴' },
  keynote:        { label: 'Keynote',         color: '#0288d1', icon: '🎤' },
  general:        { label: 'News',            color: '#64748b', icon: '📰' },
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

function imageFor(a: BlogArticle) {
  return a.heroImageUrl || `https://picsum.photos/seed/${a.id}/900/600`;
}

export default async function AINewsPage({
  searchParams,
}: {
  searchParams: { tab?: string; category?: string; q?: string };
}) {
  const all = await getAllArticles();
  const tab = searchParams.tab === 'popular' || searchParams.tab === 'important' ? searchParams.tab : 'latest';
  const category = searchParams.category;
  const q = searchParams.q?.trim().toLowerCase();

  let filtered = all;
  if (category) filtered = filtered.filter(a => a.category === category);
  if (q) {
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.summary?.toLowerCase().includes(q) ||
      a.company?.toLowerCase().includes(q) ||
      (a.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  const byScore = [...filtered].sort((a, b) => b.importanceScore - a.importanceScore);
  const byDate = [...filtered].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  const important = byScore.filter(a => a.importanceScore >= 75);

  const feedList = tab === 'popular' ? byScore : tab === 'important' ? important : byDate;

  const featuredSlides: FeaturedSlide[] = byScore.slice(0, 5).map(a => ({
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    image: a.heroImageUrl || `https://picsum.photos/seed/${a.id}/900/600`,
    fallback: `https://picsum.photos/seed/${a.id}/900/600`,
    badgeLabel: (EVENT_META[a.eventType] || EVENT_META.general).label,
    company: a.company,
    timeAgo: timeAgo(a.publishedAt),
  }));

  const trending = byScore.slice(0, 5);

  // Company mention leaderboard — derived from real article data, stands in for the "market" widget
  const companyCounts = new Map<string, number>();
  for (const a of all.slice(0, 60)) {
    if (!a.company) continue;
    companyCounts.set(a.company, (companyCounts.get(a.company) || 0) + 1);
  }
  const topCompanies = [...companyCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Topic tag cloud — derived from real article tags
  const tagCounts = new Map<string, number>();
  for (const a of all) for (const t of a.tags || []) tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);

  const navLinks: PulseNavLink[] = NAV_CATEGORIES.map(n => ({
    label: n.label,
    href: n.href,
    icon: n.icon,
    active:
      n.label === 'Home' ? !searchParams.tab && !category :
      n.label === 'Latest' ? tab === 'latest' && !category :
      n.label === 'Trending' ? tab === 'popular' :
      n.label === 'Research' ? category === 'Research' :
      n.label === 'Tools' ? category === 'Tools' :
      n.label === 'Funding' ? category === 'Funding' :
      false,
  }));

  const sidebarTopics: PulseTopic[] = [
    { label: 'Large Language Models', href: '/ai-news?q=LLM' },
    { label: 'Generative AI', href: '/ai-news?q=generative' },
    { label: 'AI Agents', href: '/ai-news?q=agent' },
    { label: 'AI Tools', href: '/ai-news?category=Tools' },
    { label: 'Robotics', href: '/ai-news?q=robot' },
    { label: 'AI Research', href: '/ai-news?category=Research' },
    { label: 'AI Hardware', href: '/ai-news?q=chip' },
  ].map((t, i) => ({ ...t, color: TOPIC_COLORS[i % TOPIC_COLORS.length] }));

  return (
    <PulseShell navLinks={navLinks} topics={sidebarTopics}>
      <div className="pulse-content">
        <div className="pulse-feed">
          {featuredSlides.length > 0 && <FeaturedCarousel slides={featuredSlides} />}

          <div className="pulse-feed-head">
            <div className="pulse-feed-title"><i className="fa-solid fa-bolt" />Latest AI News</div>
            <div className="pulse-tabs">
              <Link href="/ai-news?tab=latest" className={`pulse-tab${tab === 'latest' ? ' active' : ''}`}>Latest</Link>
              <Link href="/ai-news?tab=popular" className={`pulse-tab${tab === 'popular' ? ' active' : ''}`}>Popular</Link>
              <Link href="/ai-news?tab=important" className={`pulse-tab${tab === 'important' ? ' active' : ''}`}>Important</Link>
            </div>
          </div>

          {feedList.length === 0 ? (
            <div className="pulse-empty">
              <i className="fa-solid fa-satellite-dish" />
              AI is collecting the latest news — the pipeline runs every 10 minutes across 100+ sources.
            </div>
          ) : (
            feedList.slice(0, 20).map(a => {
              const meta = EVENT_META[a.eventType] || EVENT_META.general;
              return (
                <Link key={a.id} href={`/ai-news/${a.slug}`} className="pulse-row">
                  <div className="pulse-row-thumb">
                    <SafeImg
                      src={a.heroImageUrl || imageFor(a)}
                      fallback={`https://picsum.photos/seed/${a.id}/600/340`}
                      alt={a.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="pulse-row-body">
                    <div className="pulse-row-top">
                      <span className="pulse-row-title">{a.title}</span>
                      <span className="pulse-row-badge" style={{ background: `${meta.color}26`, color: meta.color }}>{meta.label}</span>
                    </div>
                    <p className="pulse-row-desc">{a.summary}</p>
                    <div className="pulse-row-foot">
                      <span>{a.sourceName}</span>
                      <span>·</span>
                      <span>{timeAgo(a.publishedAt)}</span>
                      <div className="pulse-row-actions">
                        <i className="fa-regular fa-bookmark" />
                        <i className="fa-solid fa-arrow-up-from-bracket" />
                        <i className="fa-solid fa-ellipsis" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <div className="pulse-rail">
          <div className="pulse-card">
            <div className="pulse-card-head">
              <span className="pulse-card-title">🔥 Trending Now</span>
              <Link href="/ai-news?tab=popular" className="pulse-card-link">View all</Link>
            </div>
            {trending.map((a, i) => (
              <Link key={a.id} href={`/ai-news/${a.slug}`} className="pulse-trend-item">
                <span className="pulse-trend-rank">{i + 1}</span>
                <div>
                  <div className="pulse-trend-title">{a.title}</div>
                  <div className="pulse-trend-meta">{a.importanceScore}/100 impact</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="pulse-card">
            <div className="pulse-card-head">
              <span className="pulse-card-title">📊 Coverage Pulse</span>
              <Link href="/ai-news" className="pulse-card-link">View full</Link>
            </div>
            <div className="pulse-market-cap">{all.length.toLocaleString()}</div>
            <div className="pulse-market-sub">Articles tracked · <span className="pulse-market-up">100+ sources</span></div>
            <div className="pulse-leaders-label">Most covered companies</div>
            {topCompanies.map(([name, count]) => (
              <div key={name} className="pulse-leader">
                <span className="pulse-leader-name">
                  <span className="pulse-leader-dot" style={{ background: '#1a237e' }} />
                  {name}
                </span>
                <span className="pulse-leader-val">{count} stories</span>
              </div>
            ))}
          </div>

          <div className="pulse-card" id="pulse-newsletter">
            <div className="pulse-card-head">
              <span className="pulse-card-title">📨 Daily AI Newsletter</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--pulse-text2)', marginBottom: 12, lineHeight: 1.5 }}>
              Join thousands of AI enthusiasts and get the top AI news daily.
            </p>
            <NewsletterForm />
          </div>

          {topTags.length > 0 && (
            <div className="pulse-card">
              <div className="pulse-card-head">
                <span className="pulse-card-title">🏷️ Top Topics</span>
              </div>
              <div className="pulse-topic-pills">
                {topTags.map(t => (
                  <Link key={t} href={`/ai-news?q=${encodeURIComponent(t)}`} className="pulse-topic-pill">{t}</Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PulseShell>
  );
}
