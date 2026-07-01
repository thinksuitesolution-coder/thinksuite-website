import type { Metadata } from 'next';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import './pulse.css';
import { BlogArticle } from '@/lib/news/types';
import { articlesCol } from '@/lib/firebase-admin';
import PulseShell, { PulseNavLink, PulseTopic, FilterItem } from '@/components/ai-news/PulseShell';
import FeaturedCarousel, { FeaturedSlide } from '@/components/ai-news/FeaturedCarousel';
import NewsletterForm from '@/components/ai-news/NewsletterForm';
import SafeImg from '@/components/ai-news/SafeImg';

export const metadata: Metadata = {
  title: 'AI Pulse — AI News & Intelligence | ThinkSuite',
  description: 'Real-time AI news from 100+ sources — OpenAI, Anthropic, Google DeepMind, Meta AI, NVIDIA and more. Auto-detected, fact-checked, analyzed by AI.',
  alternates: { canonical: 'https://thinksuite.in/ai-news' },
};

export const revalidate = 300;

// searchParams makes this route render dynamically on every request, which bypasses
// `revalidate` above — so the Firestore read is cached independently to avoid hitting
// the read quota on every page view.
const getAllArticles = unstable_cache(
  async (): Promise<BlogArticle[]> => {
    try {
      const snap = await articlesCol().orderBy('publishedAt', 'desc').limit(150).get();
      return snap.docs.map(d => d.data() as BlogArticle);
    } catch (e) {
      console.error('[AINews] getAllArticles error:', e);
      return [];
    }
  },
  ['ai-news-all-articles'],
  { revalidate: 300 }
);

const NAV_CATEGORIES: { label: string; icon: string; href: string }[] = [
  { label: 'Home',       icon: 'fa-house',               href: '/ai-news' },
  { label: 'Latest',     icon: 'fa-bolt',                href: '/ai-news?tab=latest' },
  { label: 'Trending',   icon: 'fa-fire',                href: '/ai-news?tab=popular' },
  { label: 'Research',   icon: 'fa-book-open',           href: '/ai-news?category=Research' },
  { label: 'Tools',      icon: 'fa-screwdriver-wrench',  href: '/ai-news?category=Tools' },
  { label: 'Funding',    icon: 'fa-sack-dollar',         href: '/ai-news?category=Funding' },
  { label: 'Newsletter', icon: 'fa-envelope',            href: '#pulse-newsletter' },
];

const TOPIC_COLORS = ['#1a237e', '#facc15', '#fb923c', '#f97316', '#ef4444', '#0288d1', '#06b6d4', '#22c55e'];

const EVENT_META: Record<string, { label: string; color: string }> = {
  model_release:  { label: 'Model Release', color: '#1a237e' },
  research_paper: { label: 'Research',      color: '#2563eb' },
  funding:        { label: 'Funding',        color: '#d97706' },
  acquisition:    { label: 'Acquisition',    color: '#dc2626' },
  open_source:    { label: 'Open Source',    color: '#059669' },
  api_release:    { label: 'API Release',    color: '#0891b2' },
  product_launch: { label: 'Launch',         color: '#2563eb' },
  github_release: { label: 'GitHub',         color: '#1f2937' },
  breaking_news:  { label: 'Breaking',       color: '#dc2626' },
  keynote:        { label: 'Keynote',        color: '#0288d1' },
  general:        { label: 'News',           color: '#64748b' },
};

// Sidebar filter definitions — no emojis
const SIDEBAR_FILTERS: FilterItem[] = [
  // LLM / Company
  { label: 'OpenAI',      value: 'OpenAI',      param: 'company' },
  { label: 'Anthropic',   value: 'Anthropic',   param: 'company' },
  { label: 'Google',      value: 'Google',      param: 'company' },
  { label: 'Meta',        value: 'Meta',        param: 'company' },
  { label: 'Microsoft',   value: 'Microsoft',   param: 'company' },
  { label: 'xAI',         value: 'xAI',         param: 'company' },
  { label: 'Mistral AI',  value: 'Mistral AI',  param: 'company' },
  { label: 'HuggingFace', value: 'HuggingFace', param: 'company' },
  { label: 'NVIDIA',      value: 'NVIDIA',      param: 'company' },
  { label: 'DeepSeek',    value: 'DeepSeek',    param: 'company' },
  { label: 'Groq',        value: 'Groq',        param: 'company' },
  { label: 'Amazon',      value: 'Amazon',      param: 'company' },
  // Industry
  { label: 'Healthcare',      value: 'Healthcare',      param: 'industry' },
  { label: 'Finance',         value: 'Finance',         param: 'industry' },
  { label: 'Robotics',        value: 'Robotics',        param: 'industry' },
  { label: 'Legal',           value: 'Legal',           param: 'industry' },
  { label: 'Education',       value: 'Education',       param: 'industry' },
  { label: 'Cybersecurity',   value: 'Cybersecurity',   param: 'industry' },
  { label: 'Gaming & XR',     value: 'Gaming & XR',     param: 'industry' },
  { label: 'Hardware & Chips',value: 'Hardware & Chips',param: 'industry' },
  { label: 'Creative AI',     value: 'Creative AI',     param: 'industry' },
  { label: 'Enterprise AI',   value: 'Enterprise AI',   param: 'industry' },
  // Type
  { label: 'Model Release',  value: 'model_release',  param: 'eventType' },
  { label: 'Research',       value: 'research_paper', param: 'eventType' },
  { label: 'Funding',        value: 'funding',        param: 'eventType' },
  { label: 'Open Source',    value: 'open_source',    param: 'eventType' },
  { label: 'API Release',    value: 'api_release',    param: 'eventType' },
  { label: 'Product Launch', value: 'product_launch', param: 'eventType' },
  { label: 'Breaking',       value: 'breaking_news',  param: 'eventType' },
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
  if (companyFilter) filtered = filtered.filter(a =>
    a.company?.toLowerCase() === companyFilter.toLowerCase()
  );
  if (industryFilter) filtered = filtered.filter(a =>
    ((a as BlogArticle & { industry?: string }).industry ?? '').toLowerCase() === industryFilter.toLowerCase()
  );
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
  const byDate  = [...filtered].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  const important = byScore.filter(a => a.importanceScore >= 75);

  const feedList = tab === 'popular' ? byScore : tab === 'important' ? important : byDate;

  const featuredSlides: FeaturedSlide[] = byScore.slice(0, 5).map(a => ({
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    image: a.heroImageUrl || imageFor(a),
    fallback: `https://picsum.photos/seed/${a.id}/900/600`,
    badgeLabel: (EVENT_META[a.eventType] || EVENT_META.general).label,
    company: a.company,
    timeAgo: timeAgo(a.publishedAt),
  }));

  const trending = [...all].sort((a, b) => b.importanceScore - a.importanceScore).slice(0, 5);

  const companyCounts = new Map<string, number>();
  for (const a of all.slice(0, 60)) {
    if (!a.company) continue;
    companyCounts.set(a.company, (companyCounts.get(a.company) || 0) + 1);
  }
  const topCompanies = [...companyCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const tagCounts = new Map<string, number>();
  for (const a of all) for (const t of a.tags || []) tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);

  const hasActiveFilter = !!(companyFilter || industryFilter || eventTypeFilter || category || q);
  const activeLabel = companyFilter || industryFilter || (eventTypeFilter ? EVENT_META[eventTypeFilter]?.label : '') || category || '';

  const navLinks: PulseNavLink[] = NAV_CATEGORIES.map(n => ({
    label: n.label,
    href: n.href,
    icon: n.icon,
    active:
      n.label === 'Home'       ? !searchParams.tab && !category && !hasActiveFilter :
      n.label === 'Latest'     ? tab === 'latest' && !category :
      n.label === 'Trending'   ? tab === 'popular' :
      n.label === 'Research'   ? category === 'Research' :
      n.label === 'Tools'      ? category === 'Tools' :
      n.label === 'Funding'    ? category === 'Funding' :
      false,
  }));

  const sidebarTopics: PulseTopic[] = [
    { label: 'Large Language Models', href: '/ai-news?q=LLM' },
    { label: 'Generative AI',         href: '/ai-news?q=generative' },
    { label: 'AI Agents',             href: '/ai-news?q=agent' },
    { label: 'AI Tools',              href: '/ai-news?category=Tools' },
    { label: 'Robotics',              href: '/ai-news?industry=Robotics' },
    { label: 'AI Research',           href: '/ai-news?category=Research' },
    { label: 'AI Hardware',           href: '/ai-news?industry=Hardware+%26+Chips' },
  ].map((t, i) => ({ ...t, color: TOPIC_COLORS[i % TOPIC_COLORS.length] }));

  return (
    <PulseShell navLinks={navLinks} topics={sidebarTopics} filters={SIDEBAR_FILTERS}>
      <div className="pulse-content">
        <div className="pulse-feed">
          {featuredSlides.length > 0 && !hasActiveFilter && <FeaturedCarousel slides={featuredSlides} />}

          {/* Active filter bar */}
          {hasActiveFilter && (
            <div className="pulse-active-filter">
              <span>Filtering:</span>
              {companyFilter  && <span className="pulse-filter-tag">{companyFilter}</span>}
              {industryFilter && <span className="pulse-filter-tag">{industryFilter}</span>}
              {eventTypeFilter && <span className="pulse-filter-tag">{EVENT_META[eventTypeFilter]?.label ?? eventTypeFilter}</span>}
              {category && <span className="pulse-filter-tag">{category}</span>}
              {q && <span className="pulse-filter-tag">"{q}"</span>}
              <Link href="/ai-news" className="pulse-clear-filter">x Clear all</Link>
            </div>
          )}

          <div className="pulse-feed-head">
            <div className="pulse-feed-title">
              <i className="fa-solid fa-bolt" />
              {activeLabel ? `${activeLabel} News` : 'Latest AI News'}
            </div>
            <div className="pulse-tabs">
              <Link href="/ai-news?tab=latest"    className={`pulse-tab${tab === 'latest'    ? ' active' : ''}`}>Latest</Link>
              <Link href="/ai-news?tab=popular"   className={`pulse-tab${tab === 'popular'   ? ' active' : ''}`}>Popular</Link>
              <Link href="/ai-news?tab=important" className={`pulse-tab${tab === 'important' ? ' active' : ''}`}>Important</Link>
            </div>
          </div>

          {feedList.length === 0 ? (
            <div className="pulse-empty">
              <i className="fa-solid fa-satellite-dish" />
              {hasActiveFilter
                ? 'No articles found for this filter yet — pipeline runs every 2 hours.'
                : 'Pipeline is collecting latest news — check back soon.'}
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
                      {a.company && a.company !== 'AI Industry' && (
                        <span className="pulse-company-tag">{a.company}</span>
                      )}
                      <span>{a.sourceName}</span>
                      <span>·</span>
                      <span>{timeAgo(a.publishedAt)}</span>
                      <div className="pulse-row-actions">
                        <i className="fa-regular fa-bookmark" />
                        <i className="fa-solid fa-arrow-up-from-bracket" />
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
              <span className="pulse-card-title">Trending Now</span>
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
              <span className="pulse-card-title">Coverage Pulse</span>
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
              <span className="pulse-card-title">Daily AI Newsletter</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--pulse-text2)', marginBottom: 12, lineHeight: 1.5 }}>
              Join thousands of AI enthusiasts and get the top AI news daily.
            </p>
            <NewsletterForm />
          </div>

          {topTags.length > 0 && (
            <div className="pulse-card">
              <div className="pulse-card-head">
                <span className="pulse-card-title">Top Topics</span>
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
