import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Intelligence Hub: Live AI News & Trends | ThinkSuite',
  description: 'Track AI industry news, funding rounds, model launches, and market trends in real time on ThinkSuite AI Intelligence Hub, free to use, no login required.',
  keywords: [
    'AI news intelligence platform',
    'AI industry trend tracker',
    'AI funding tracker',
    'AI knowledge graph',
    'AI company intelligence dashboard',
    'AI market intelligence India',
    'real time AI news feed',
    'AI leaders influence tracker',
    'AI research paper tracker',
    'AI trend predictions tool',
    'competitor AI monitoring',
    'AI industry timeline',
  ],
  alternates: { canonical: 'https://thinksuite.in/intelligence' },
};

export const revalidate = 600;

async function getDashboardData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const [articlesRes, trendsRes] = await Promise.all([
      fetch(`${baseUrl}/api/blog?limit=20`, { next: { revalidate: 600 } }),
      fetch(`${baseUrl}/api/intelligence/trends`, { next: { revalidate: 3600 } }),
    ]);

    const { articles = [] } = articlesRes.ok ? await articlesRes.json() : {};
    const trends = trendsRes.ok ? await trendsRes.json() : null;

    return { articles, trends };
  } catch {
    return { articles: [], trends: null };
  }
}

const INTEL_FAQS = [
  {
    q: 'What is the ThinkSuite AI Intelligence Hub?',
    a: 'The ThinkSuite AI Intelligence Hub is a free, real time command center that tracks AI industry news, funding rounds, model releases, research papers, and market trends across major AI companies including OpenAI, Anthropic, Google, Meta, Microsoft, NVIDIA, xAI, and Mistral AI.',
  },
  {
    q: 'Is the AI news feed free to use?',
    a: 'Yes. Every module in the Intelligence Hub, including the news feed, trend predictions, funding tracker, and knowledge graph, is free to explore and does not require a login.',
  },
  {
    q: 'How often is the intelligence data updated?',
    a: 'The dashboard refreshes automatically about every 10 minutes, pulling from 50+ monitored sources including RSS feeds, GitHub, ArXiv, and major news outlets.',
  },
  {
    q: 'What AI companies does ThinkSuite track?',
    a: 'ThinkSuite tracks activity from OpenAI, Anthropic, Google DeepMind, Meta AI, Microsoft, NVIDIA, xAI, and Mistral AI, along with emerging startups covered in the funding tracker and news feed.',
  },
  {
    q: 'Can I generate a custom AI industry report?',
    a: 'Yes. The Report Generator module lets you create a one click, analyst style AI industry report for daily, weekly, monthly, or quarterly periods and download it in a PDF ready format.',
  },
];

const AI_COMPANIES = [
  { name: 'OpenAI', slug: 'openai', color: '#10a37f', emoji: '🟢' },
  { name: 'Anthropic', slug: 'anthropic', color: '#d97706', emoji: '🟡' },
  { name: 'Google DeepMind', slug: 'google', color: '#4285f4', emoji: '🔵' },
  { name: 'Meta AI', slug: 'meta', color: '#0866ff', emoji: '🔵' },
  { name: 'Microsoft', slug: 'microsoft', color: '#00a4ef', emoji: '🔷' },
  { name: 'NVIDIA', slug: 'nvidia', color: '#76b900', emoji: '🟩' },
  { name: 'xAI', slug: 'xai', color: '#1d1d1f', emoji: '⚫' },
  { name: 'Mistral AI', slug: 'mistral', color: '#ff7000', emoji: '🟠' },
];

type Article = {
  id: string;
  slug: string;
  title: string;
  company: string;
  category: string;
  importanceScore: number;
  publishedAt: string;
  eventType: string;
  summary: string;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function IntelligenceDashboard() {
  const { articles, trends } = await getDashboardData();

  const companyActivity: Record<string, number> = {};
  articles.forEach((a: Article) => {
    companyActivity[a.company] = (companyActivity[a.company] || 0) + 1;
  });

  const categoryBreakdown: Record<string, number> = {};
  articles.forEach((a: Article) => {
    categoryBreakdown[a.category] = (categoryBreakdown[a.category] || 0) + 1;
  });

  const topStories = articles.filter((a: Article) => a.importanceScore >= 75).slice(0, 5);
  const recentBreaking = articles.filter((a: Article) => a.eventType === 'breaking_news').slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="intel-hero">
        <div className="container">
          <div className="intel-hero-top">
            <div>
              <div className="intel-live-badge"><span className="live-dot" />Live Intelligence Feed</div>
              <h1 className="intel-title">AI Intelligence<br /><span className="gradient-text">Command Center</span></h1>
              <p className="intel-desc">The ThinkSuite AI Intelligence Hub tracks every major move in the AI industry, model releases, funding rounds, research breakthroughs, and competitive shifts, updated automatically in real time.</p>
            </div>
            <div className="intel-stats-panel">
              <div className="intel-stat-card">
                <span className="intel-stat-num">{articles.length}</span>
                <span className="intel-stat-label">Stories Analyzed</span>
              </div>
              <div className="intel-stat-card">
                <span className="intel-stat-num">{Object.keys(companyActivity).length}</span>
                <span className="intel-stat-label">Companies Tracked</span>
              </div>
              <div className="intel-stat-card">
                <span className="intel-stat-num">50+</span>
                <span className="intel-stat-label">Sources Monitored</span>
              </div>
              <div className="intel-stat-card">
                <span className="intel-stat-num">10m</span>
                <span className="intel-stat-label">Update Interval</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="intel-layout">

          {/* LEFT: Main Feed */}
          <div className="intel-main">

            {/* Breaking News */}
            {recentBreaking.length > 0 && (
              <div className="intel-breaking">
                <div className="intel-breaking-label">🔴 Breaking</div>
                {recentBreaking.map((a: Article) => (
                  <Link key={a.id} href={`/blog/${a.slug}`} className="intel-breaking-item">
                    <span>{a.title}</span>
                    <span className="intel-breaking-time">{timeAgo(a.publishedAt)}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Top Stories */}
            <div className="intel-section">
              <div className="intel-section-header">
                <h2>High-Impact Stories</h2>
                <Link href="/blog" className="intel-see-all">View All →</Link>
              </div>
              <div className="intel-story-list">
                {topStories.map((a: Article, i: number) => (
                  <Link key={a.id} href={`/blog/${a.slug}`} className="intel-story-row">
                    <div className="intel-story-rank">{i + 1}</div>
                    <div className="intel-story-body">
                      <div className="intel-story-meta">
                        <span className="intel-company-tag">{a.company}</span>
                        <span className="intel-time">{timeAgo(a.publishedAt)}</span>
                      </div>
                      <h3>{a.title}</h3>
                      <p>{a.summary?.slice(0, 120)}...</p>
                    </div>
                    <div className="intel-story-score">
                      <div className={`score-ring ${a.importanceScore >= 80 ? 'high' : 'med'}`}>
                        {a.importanceScore}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Category Activity */}
            <div className="intel-section">
              <div className="intel-section-header"><h2>Activity by Category</h2></div>
              <div className="intel-category-bars">
                {Object.entries(categoryBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => (
                    <div key={cat} className="intel-cat-bar">
                      <span className="intel-cat-name">{cat}</span>
                      <div className="intel-bar-track">
                        <div
                          className="intel-bar-fill"
                          style={{ width: `${Math.min((count / Math.max(...Object.values(categoryBreakdown))) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="intel-cat-count">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Trend Predictions */}
            {trends?.topTrends?.length > 0 && (
              <div className="intel-section">
                <div className="intel-section-header">
                  <h2>📈 90-Day Trend Predictions</h2>
                  <Link href="/intelligence/trends" className="intel-see-all">Full Report →</Link>
                </div>
                <div className="intel-trends-grid">
                  {trends.topTrends.slice(0, 6).map((t: {
                    technology: string;
                    predictedGrowth90d: number;
                    currentMomentum: number;
                    investmentRecommendation: string;
                    category: string;
                  }) => (
                    <div key={t.technology} className="intel-trend-card">
                      <div className="intel-trend-top">
                        <span className="intel-trend-name">{t.technology}</span>
                        <span className={`intel-trend-rec ${t.investmentRecommendation}`}>
                          {t.investmentRecommendation.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="intel-trend-growth">+{t.predictedGrowth90d}%</div>
                      <div className="intel-trend-bar">
                        <div style={{ width: `${t.currentMomentum}%` }} />
                      </div>
                      <span className="intel-trend-cat">{t.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <aside className="intel-sidebar">

            {/* Company Monitor */}
            <div className="intel-widget">
              <h3>Company Activity Monitor</h3>
              <div className="intel-company-list">
                {AI_COMPANIES.map(c => {
                  const count = companyActivity[c.name] || companyActivity[c.name.split(' ')[0]] || 0;
                  return (
                    <Link key={c.slug} href={`/companies/${c.slug}`} className="intel-company-row">
                      <span className="intel-company-emoji">{c.emoji}</span>
                      <span className="intel-company-name">{c.name}</span>
                      <span className="intel-company-count" style={{ background: count > 0 ? c.color + '22' : 'transparent', color: count > 0 ? c.color : 'var(--text2)' }}>
                        {count > 0 ? `${count} stories` : 'No activity'}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Links, all modules */}
            <div className="intel-widget">
              <h3>All Intelligence Modules</h3>
              <div className="intel-quick-links">
                {[
                  { href: '/intelligence/chat',       icon: '💬', label: 'AI Chat' },
                  { href: '/intelligence/graph',      icon: '🧠', label: 'Knowledge Graph' },
                  { href: '/intelligence/timeline',   icon: '⏳', label: 'AI Timeline' },
                  { href: '/intelligence/funding',    icon: '💰', label: 'Funding Tracker' },
                  { href: '/intelligence/research',   icon: '🧪', label: 'Research Papers' },
                  { href: '/intelligence/leaders',    icon: '🎯', label: 'AI Leaders' },
                  { href: '/intelligence/heatmap',    icon: '🌍', label: 'Global Heatmap' },
                  { href: '/intelligence/report',     icon: '📊', label: 'Report Generator' },
                  { href: '/intelligence/agents',     icon: '🤖', label: 'AI Agents' },
                  { href: '/intelligence/enterprise', icon: '🏢', label: 'Enterprise' },
                  { href: '/blog',                    icon: '📰', label: 'AI News Feed' },
                  { href: '/companies/openai',        icon: '🧩', label: 'Company Profiles' },
                ].map(link => (
                  <Link key={link.href} href={link.href} className="intel-quick-link">
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                    <span>→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="intel-widget intel-widget-cta">
              <h3>🔔 Get AI Alerts</h3>
              <p>Get breaking AI news on Telegram before everyone else.</p>
              <a
                href="https://t.me/thinksuite_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'block', textAlign: 'center', marginTop: 12 }}
              >
                Join Telegram Channel
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* ── ALL MODULES GRID ── */}
      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="intel-modules-header">
            <h2>All Intelligence Modules</h2>
            <p>Everything free, no login required, explore any module below</p>
          </div>
          <div className="intel-modules-grid">
            {[
              {
                href: '/intelligence/chat',
                icon: '💬',
                title: 'AI Chat',
                desc: 'Ask anything about the AI industry. GPT-4o powered with source citations.',
                badge: 'Popular',
                color: '#2563eb',
              },
              {
                href: '/intelligence/graph',
                icon: '🧠',
                title: 'Knowledge Graph',
                desc: 'Interactive visual map of companies, models, people, and technologies, all interconnected.',
                badge: 'New',
                color: '#7c3aed',
              },
              {
                href: '/intelligence/timeline',
                icon: '⏳',
                title: 'AI Timeline',
                desc: '35+ milestone events from 2020,2025. GPT-3, ChatGPT, Gemini, every major launch.',
                badge: null,
                color: '#0891b2',
              },
              {
                href: '/intelligence/funding',
                icon: '💰',
                title: 'Funding Tracker',
                desc: 'Every major AI funding round, investors, valuations, series. Live signals detected.',
                badge: null,
                color: '#059669',
              },
              {
                href: '/intelligence/research',
                icon: '🧪',
                title: 'Research Papers',
                desc: 'Landmark AI papers explained in plain English with business implications.',
                badge: null,
                color: '#7c3aed',
              },
              {
                href: '/intelligence/leaders',
                icon: '🎯',
                title: 'AI Leaders',
                desc: 'Track Sam Altman, Dario Amodei, Jensen Huang and 5 more, predictions, influence scores.',
                badge: null,
                color: '#16a34a',
              },
              {
                href: '/intelligence/heatmap',
                icon: '🌍',
                title: 'Global Heatmap',
                desc: 'Where AI is growing fastest, 10 countries, 4 regions, investment scores.',
                badge: null,
                color: '#d97706',
              },
              {
                href: '/intelligence/report',
                icon: '📊',
                title: 'Report Generator',
                desc: 'One-click AI industry report, GPT-4o written, Gartner style. Download as PDF.',
                badge: 'New',
                color: '#dc2626',
              },
              {
                href: '/intelligence/agents',
                icon: '🤖',
                title: 'AI Agents',
                desc: '8 ready-to-use agents for monitoring, research, publishing, and briefings.',
                badge: 'New',
                color: '#374151',
              },
              {
                href: '/blog',
                icon: '📰',
                title: 'AI News Feed',
                desc: 'Live AI news from 50+ sources, auto-scored, fact-checked, written by AI journalist.',
                badge: 'Live',
                color: '#2563eb',
              },
              {
                href: '/companies/openai',
                icon: '🏢',
                title: 'Company Profiles',
                desc: 'Deep profiles of OpenAI, Anthropic, Google, Meta, Microsoft, NVIDIA, xAI, Mistral.',
                badge: null,
                color: '#0891b2',
              },
              {
                href: '/intelligence/enterprise',
                icon: '🏆',
                title: 'Enterprise',
                desc: 'Custom monitoring, white-label reports, and API access for teams and companies.',
                badge: null,
                color: '#7c3aed',
              },
            ].map(m => (
              <Link key={m.href} href={m.href} className="intel-module-card" style={{ '--mc': m.color } as React.CSSProperties}>
                <div className="intel-module-top">
                  <div className="intel-module-icon" style={{ background: m.color + '15', color: m.color }}>{m.icon}</div>
                  {m.badge && <span className="intel-module-badge" style={{ background: m.color + '18', color: m.color }}>{m.badge}</span>}
                </div>
                <h3 className="intel-module-title">{m.title}</h3>
                <p className="intel-module-desc">{m.desc}</p>
                <span className="intel-module-cta">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: INTEL_FAQS.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">FAQ</span>
            <h2 style={{ marginTop: 12 }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {INTEL_FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '28px 32px',
                  marginBottom: 14,
                }}
              >
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, lineHeight: 1.45 }}>{faq.q}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
