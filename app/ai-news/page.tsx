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

// LLM / company filter chips
const LLM_FILTERS = [
  { label: 'OpenAI',       value: 'OpenAI' },
  { label: 'Anthropic',    value: 'Anthropic' },
  { label: 'Google',       value: 'Google' },
  { label: 'Meta',         value: 'Meta' },
  { label: 'Microsoft',    value: 'Microsoft' },
  { label: 'xAI',         value: 'xAI' },
  { label: 'Mistral AI',   value: 'Mistral AI' },
  { label: 'HuggingFace',  value: 'HuggingFace' },
  { label: 'NVIDIA',       value: 'NVIDIA' },
  { label: 'DeepSeek',     value: 'DeepSeek' },
  { label: 'Groq',         value: 'Groq' },
  { label: 'Amazon',       value: 'Amazon' },
];

// Industry filter chips
const INDUSTRY_FILTERS = [
  { label: '🏥 Healthcare',      value: 'Healthcare' },
  { label: '💰 Finance',         value: 'Finance' },
  { label: '🤖 Robotics',        value: 'Robotics' },
  { label: '⚖️ Legal',           value: 'Legal' },
  { label: '📚 Education',       value: 'Education' },
  { label: '🔒 Cybersecurity',   value: 'Cybersecurity' },
  { label: '🎮 Gaming & XR',     value: 'Gaming & XR' },
  { label: '🖥️ Hardware & Chips', value: 'Hardware & Chips' },
  { label: '🎨 Creative AI',     value: 'Creative AI' },
  { label: '🏢 Enterprise AI',   value: 'Enterprise AI' },
];

// Event type filter chips
const EVENT_TYPE_FILTERS = [
  { label: '🤖 Model Release',  value: 'model_release' },
  { label: '📄 Research',       value: 'research_paper' },
  { label: '💰 Funding',        value: 'funding' },
  { label: '🔓 Open Source',    value: 'open_source' },
  { label: '⚡ API Release',    value: 'api_release' },
  { label: '🚀 Product Launch', value: 'product_launch' },
  { label: '🔴 Breaking',       value: 'breaking_news' },
];

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

function buildFilterHref(current: Record<string, string | undefined>, key: string, value: string) {
  const params = new URLSearchParams();
  Object.entries({ ...current, [key]: value }).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  // Toggle off if same value
  if (current[key] === value) params.delete(key);
  const qs = params.toString();
  return `/ai-news${qs ? `?${qs}` : ''}`;
}

export default async function AINewsPage({
  searchParams,
}: {
  searchParams: { tab?: string; category?: string; q?: string; company?: string; industry?: string; eventType?: string };
}) {
  const all = await getAllArticles();
  const tab = searchParams.tab === 'popular' || searchParams.tab === 'important' ? searchParams.tab : 'latest';
  const category = searchParams.category;
  const q = searchParams.q?.trim().toLowerCase();
  const companyFilter = searchParams.company;
  const industryFilter = searchParams.industry;
  const eventTypeFilter = searchParams.eventType;

  let filtered = all;
  if (category) filtered = filtered.filter(a => a.category === category);
  if (companyFilter) filtered = filtered.filter(a => a.company === companyFilter);
  if (industryFilter) filtered = filtered.filter(a => (a as BlogArticle & { industry?: string }).industry === industryFilter);
  if (eventTypeFilter) filtered = filtered.filter(a => a.eventType === eventTypeFilter);
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

  const companyCounts = new Map<string, number>();
  for (const a of all.slice(0, 60)) {
    if (!a.company) continue;
    companyCounts.set(a.company, (companyCounts.get(a.company) || 0) + 1);
  }
  const topCompanies = [...companyCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

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
    { label: 'Robotics', href: '/ai-news?industry=Robotics' },
    { label: 'AI Research', href: '/ai-news?category=Research' },
    { label: 'AI Hardware', href: '/ai-news?industry=Hardware+%26+Chips' },
  ].map((t, i) => ({ ...t, color: TOPIC_COLORS[i % TOPIC_COLORS.length] }));

  const currentParams = {
    tab: searchParams.tab,
    category,
    q: searchParams.q,
    company: companyFilter,
    industry: industryFilter,
    eventType: eventTypeFilter,
  };

  const hasActiveFilter = !!(companyFilter || industryFilter || eventTypeFilter || category || q);

  return (
    <PulseShell navLinks={navLinks} topics={sidebarTopics}>
      <div className="pulse-content">
        <div className="pulse-feed">
          {featuredSlides.length > 0 && !hasActiveFilter && <FeaturedCarousel slides={featuredSlides} />}

          {/* ── LLM / Company Filter ── */}
          <div className="pulse-filter-section">
            <div className="pulse-filter-label">🧠 By LLM / Company</div>
            <div className="pulse-filter-chips">
              {LLM_FILTERS.map(f => (
                <Link
                  key={f.value}
                  href={buildFilterHref(currentParams, 'company', f.value)}
                  className={`pulse-chip${companyFilter === f.value ? ' active' : ''}`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Industry Filter ── */}
          <div className="pulse-filter-section">
            <div className="pulse-filter-label">🏭 By Industry</div>
            <div className="pulse-filter-chips">
              {INDUSTRY_FILTERS.map(f => (
                <Link
                  key={f.value}
                  href={buildFilterHref(currentParams, 'industry', f.value)}
                  className={`pulse-chip${industryFilter === f.value ? ' active' : ''}`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Event Type Filter ── */}
          <div className="pulse-filter-section">
            <div className="pulse-filter-label">📌 By Type</div>
            <div className="pulse-filter-chips">
              {EVENT_TYPE_FILTERS.map(f => (
                <Link
                  key={f.value}
                  href={buildFilterHref(currentParams, 'eventType', f.value)}
                  className={`pulse-chip${eventTypeFilter === f.value ? ' active' : ''}`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Active filter badge */}
          {hasActiveFilter && (
            <div className="pulse-active-filter">
              <span>Filtering: </span>
              {companyFilter && <span className="pulse-filter-tag">🏢 {companyFilter}</span>}
              {industryFilter && <span className="pulse-filter-tag">🏭 {industryFilter}</span>}
              {eventTypeFilter && <span className="pulse-filter-tag">📌 {EVENT_META[eventTypeFilter]?.label || eventTypeFilter}</span>}
              {category && <span className="pulse-filter-tag">📂 {category}</span>}
              {q && <span className="pulse-filter-tag">🔍 "{q}"</span>}
              <Link href="/ai-news" className="pulse-clear-filter">✕ Clear all</Link>
            </div>
          )}

          <div className="pulse-feed-head">
            <div className="pulse-feed-title"><i className="fa-solid fa-bolt" />
              {companyFilter ? `${companyFilter} News` : industryFilter ? `${industryFilter} AI News` : 'Latest AI News'}
            </div>
            <div className="pulse-tabs">
              <Link href={`/ai-news?tab=latest${companyFilter ? `&company=${companyFilter}` : ''}${industryFilter ? `&industry=${encodeURIComponent(industryFilter)}` : ''}${eventTypeFilter ? `&eventType=${eventTypeFilter}` : ''}`} className={`pulse-tab${tab === 'latest' ? ' active' : ''}`}>Latest</Link>
              <Link href={`/ai-news?tab=popular${companyFilter ? `&company=${companyFilter}` : ''}${industryFilter ? `&industry=${encodeURIComponent(industryFilter)}` : ''}${eventTypeFilter ? `&eventType=${eventTypeFilter}` : ''}`} className={`pulse-tab${tab === 'popular' ? ' active' : ''}`}>Popular</Link>
              <Link href={`/ai-news?tab=important${companyFilter ? `&company=${companyFilter}` : ''}${industryFilter ? `&industry=${encodeURIComponent(industryFilter)}` : ''}${eventTypeFilter ? `&eventType=${eventTypeFilter}` : ''}`} className={`pulse-tab${tab === 'important' ? ' active' : ''}`}>Important</Link>
            </div>
          </div>

          {feedList.length === 0 ? (
            <div className="pulse-empty">
              <i className="fa-solid fa-satellite-dish" />
              {hasActiveFilter
                ? 'No articles found for this filter yet — the pipeline runs every 2 hours across 100+ sources.'
                : 'AI is collecting the latest news — the pipeline runs every 2 hours across 100+ sources.'}
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
                      <span className="pulse-row-badge" style={{ background: `${meta.color}26`, color: meta.color }}>{meta.icon} {meta.label}</span>
                    </div>
                    <p className="pulse-row-desc">{a.summary}</p>
                    <div className="pulse-row-foot">
                      {a.company && a.company !== 'AI Industry' && (
                        <Link
                          href={`/ai-news?company=${encodeURIComponent(a.company)}`}
                          className="pulse-company-tag"
                          onClick={e => e.stopPropagation()}
                        >
                          {a.company}
                        </Link>
                      )}
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
              <Link key={name} href={`/ai-news?company=${encodeURIComponent(name)}`} className="pulse-leader">
                <span className="pulse-leader-name">
                  <span className="pulse-leader-dot" style={{ background: '#1a237e' }} />
                  {name}
                </span>
                <span className="pulse-leader-val">{count} stories</span>
              </Link>
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
