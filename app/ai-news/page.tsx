import type { Metadata } from 'next';
import Link from 'next/link';
import './pulse.css';
import { getArticleCards, countPublishedArticles } from '@/lib/news/db';
import { eventMeta } from '@/lib/news/event-meta';
import PulseShell, { PulseNavLink, PulseTopic, FilterItem } from '@/components/ai-news/PulseShell';
import PulseFeed, { FeedItem } from '@/components/ai-news/PulseFeed';
import { PulseQueryProvider, PulseLink } from '@/components/ai-news/pulse-query';
import { FeaturedSlide } from '@/components/ai-news/FeaturedCarousel';
import NewsletterForm from '@/components/ai-news/NewsletterForm';

export const metadata: Metadata = {
  title: 'AI Pulse: Latest AI News & Intelligence | ThinkSuite',
  description: 'Real-time AI news from 100+ sources, including OpenAI, Anthropic, Google DeepMind, Meta AI, and NVIDIA, auto-detected, fact-checked, and analyzed by AI.',
  keywords: [
    'AI news India',
    'latest AI updates',
    'AI news today',
    'artificial intelligence news',
    'AI industry news',
    'OpenAI news',
    'Anthropic news',
    'AI research updates',
    'AI funding news',
    'AI product launches',
    'AI news aggregator',
    'real-time AI news',
  ],
  alternates: { canonical: 'https://thinksuite.in/ai-news' },
};

// This page takes no searchParams, so Next prerenders it once and revalidates
// it on this interval. Every visitor is then served the same static HTML from
// the edge with no function invocation — reading searchParams here is what used
// to make it render per request, and what made the Cache-Control headers in
// 8217163 useless (Next overrides them with no-store on dynamic routes).
// Filtering, tabs and pagination all run in the browser instead; see
// components/ai-news/pulse-query.tsx.
export const revalidate = 300;

// Rows are now a card's worth of each article rather than its full JSON blob,
// so the whole listing is ~1MB instead of the ~15MB that came back as
// SQLITE_NOMEM from the free-tier database.
const LISTING_LIMIT = 500;

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

// Sidebar filter definitions, no emojis
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

const AI_NEWS_FAQS: { question: string; answer: string }[] = [
  {
    question: 'How often is AI Pulse updated?',
    answer: 'New stories are added every couple of hours as they break, so the feed stays current throughout the day.',
  },
  {
    question: 'Where does ThinkSuite source its AI news from?',
    answer: 'We pull from 100+ sources, including company blogs, research labs, and established tech publications, then fact check and summarize each story before it goes live.',
  },
  {
    question: 'Can I filter the news by company or topic?',
    answer: 'Yes. Use the sidebar filters to narrow stories down by company (OpenAI, Anthropic, Google, and more), industry, or event type like funding and research.',
  },
  {
    question: 'Is AI Pulse free to use?',
    answer: 'Yes. AI Pulse is free for anyone who wants to keep up with AI news, no sign up required. The daily newsletter is optional if you want updates in your inbox.',
  },
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

export default async function AINewsPage() {
  // Deliberately uncaught. On a prerendered page a swallowed database error
  // becomes a "successful" empty build output — the failure mode 155add9 ran
  // into. Letting it throw fails a revalidation loudly while Next keeps serving
  // the last good copy of the page.
  const [cards, totalTracked] = await Promise.all([
    getArticleCards({ limit: LISTING_LIMIT }),
    countPublishedArticles(),
  ]);

  const items: FeedItem[] = cards.map(a => ({ ...a, timeAgo: timeAgo(a.publishedAt) }));

  const byScore = [...items].sort((a, b) => b.importanceScore - a.importanceScore);

  // The carousel is hidden whenever a filter is on, so its slides are always
  // the top of the unfiltered set and can be picked here rather than shipped.
  const featuredSlides: FeaturedSlide[] = byScore.slice(0, 5).map(a => ({
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    image: a.heroImageUrl || `https://picsum.photos/seed/${a.id}/900/600`,
    fallback: `https://picsum.photos/seed/${a.id}/900/600`,
    badgeLabel: eventMeta(a.eventType).label,
    company: a.company,
    timeAgo: a.timeAgo,
  }));

  const trending = byScore.slice(0, 5);

  const companyCounts = new Map<string, number>();
  for (const a of items.slice(0, 60)) {
    if (!a.company) continue;
    companyCounts.set(a.company, (companyCounts.get(a.company) || 0) + 1);
  }
  const topCompanies = [...companyCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const tagCounts = new Map<string, number>();
  for (const a of items) for (const t of a.tags || []) tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);

  const navLinks: PulseNavLink[] = NAV_CATEGORIES.map(n => ({
    label: n.label,
    href: n.href,
    icon: n.icon,
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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: AI_NEWS_FAQS.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <PulseQueryProvider>
      <PulseShell navLinks={navLinks} topics={sidebarTopics} filters={SIDEBAR_FILTERS} queryDriven>
        <div className="pulse-content">
          <PulseFeed items={items} featured={featuredSlides} />

          <div className="pulse-rail">
            <div className="pulse-card">
              <div className="pulse-card-head">
                <span className="pulse-card-title">Trending Now</span>
                <PulseLink href="/ai-news?tab=popular" className="pulse-card-link">View all</PulseLink>
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
                <PulseLink href="/ai-news" className="pulse-card-link">View full</PulseLink>
              </div>
              {/* The published total, counted in SQL. This used to print the
                  length of whatever the listing happened to fetch, so capping
                  the listing silently changed the headline number. */}
              <div className="pulse-market-cap">{totalTracked.toLocaleString()}</div>
              <div className="pulse-market-sub">Articles tracked · <span className="pulse-market-up">100+ sources</span></div>
              <div className="pulse-leaders-label">Most covered companies</div>
              {topCompanies.map(([name, count]) => (
                <PulseLink key={name} href={`/ai-news?company=${encodeURIComponent(name)}`} className="pulse-leader">
                  <span className="pulse-leader-name">
                    <span className="pulse-leader-dot" style={{ background: '#1a237e' }} />
                    {name}
                  </span>
                  <span className="pulse-leader-val">{count} stories</span>
                </PulseLink>
              ))}
            </div>

            <div className="pulse-card" id="pulse-newsletter">
              <div className="pulse-card-head">
                <span className="pulse-card-title">Daily AI Newsletter</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--pulse-text2)', marginBottom: 12, lineHeight: 1.5 }}>
                Get the top AI stories in your inbox once a day, no spam.
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
                    <PulseLink key={t} href={`/ai-news?q=${encodeURIComponent(t)}`} className="pulse-topic-pill">{t}</PulseLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PulseShell>
    </PulseQueryProvider>

    <section className="container" style={{ padding: '40px 0 70px', maxWidth: 820, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 24, fontWeight: 700, color: 'var(--white)', marginBottom: 18 }}>
        Frequently Asked Questions
      </h2>
      <div className="article-faqs" style={{ marginBottom: 0 }}>
        {AI_NEWS_FAQS.map((faq, i) => (
          <details key={i} className="article-faq-item">
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
    </>
  );
}
