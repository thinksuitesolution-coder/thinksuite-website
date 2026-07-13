import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogArticle } from '@/lib/news/types';

export const metadata: Metadata = {
  title: 'AI Funding Tracker: Startup Rounds & Deals | ThinkSuite',
  description: 'Track major AI startup funding rounds, valuations, and investors in real time, from seed deals to multi billion dollar raises, curated by ThinkSuite.',
  keywords: [
    'AI funding tracker',
    'AI startup funding news',
    'AI investment tracker',
    'venture capital AI deals',
    'AI valuation tracker',
    'startup funding rounds AI',
    'AI investor database',
    'live AI funding signals',
  ],
};
export const revalidate = 1800;

async function getFundingArticles(): Promise<BlogArticle[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/blog?limit=50`, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const { articles } = await res.json();
    return articles.filter((a: BlogArticle) =>
      a.eventType === 'funding' || a.category === 'Funding' ||
      a.title?.toLowerCase().includes('raises') || a.title?.toLowerCase().includes('funding') ||
      a.title?.toLowerCase().includes('billion') || a.title?.toLowerCase().includes('valuation')
    );
  } catch { return []; }
}

const NOTABLE_ROUNDS = [
  { company: 'OpenAI', amount: '$40B', round: 'Series F', valuation: '$300B+', investors: ['SoftBank', 'Microsoft', 'Others'], date: 'Jun 2025', color: '#10a37f' },
  { company: 'xAI', amount: '$6B', round: 'Series B', valuation: '$24B', investors: ['Andreessen Horowitz', 'Sequoia', 'Fidelity'], date: 'Jun 2024', color: '#374151' },
  { company: 'Anthropic', amount: '$4B', round: 'Strategic', valuation: '$18.4B', investors: ['Amazon', 'Google'], date: 'Sep 2023', color: '#d97706' },
  { company: 'Mistral AI', amount: '$1.08B', round: 'Series B', valuation: '$6.2B', investors: ['DST Global', 'General Catalyst'], date: 'Jun 2024', color: '#ff7000' },
  { company: 'Perplexity', amount: '$500M', round: 'Series D', valuation: '$9B', investors: ['IVP', 'NEA', 'NVIDIA'], date: 'Jan 2025', color: '#2563eb' },
  { company: 'Cohere', amount: '$500M', round: 'Series D', valuation: '$5.5B', investors: ['PSP Investments', 'Nvidia'], date: 'Jul 2024', color: '#7c3aed' },
  { company: 'Runway', amount: '$308M', round: 'Series C', valuation: '$1.5B', investors: ['Google', 'Salesforce'], date: 'Dec 2023', color: '#dc2626' },
  { company: 'Sakana AI', amount: '$200M', round: 'Series A', valuation: '$1B+', investors: ['David Sacks', 'Khosla'], date: 'Mar 2024', color: '#0891b2' },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 36e5);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function FundingPage() {
  const liveArticles = await getFundingArticles();
  const totalDetected = NOTABLE_ROUNDS.reduce((s, r) => {
    const n = parseFloat(r.amount.replace(/[$B]/g, '').replace('M', ''));
    return s + (r.amount.includes('B') ? n : n / 1000);
  }, 0);

  return (
    <main>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}>
        <div className="container">
          <div className="chip" style={{ marginBottom: 16 }}>💰 Live Funding Tracker</div>
          <h1 className="page-title" style={{ color: '#fff' }}>AI Funding Intelligence</h1>
          <p className="page-desc" style={{ color: 'rgba(255,255,255,0.75)' }}>ThinkSuite's Funding Tracker records every major AI funding round, investor, and valuation, updated automatically as new deals are announced.</p>
          <div className="funding-hero-stats">
            <div className="funding-stat"><strong>${totalDetected.toFixed(1)}B+</strong><span>Tracked This Year</span></div>
            <div className="funding-stat"><strong>{NOTABLE_ROUNDS.length}</strong><span>Major Rounds</span></div>
            <div className="funding-stat"><strong>{liveArticles.length}</strong><span>Live Signals</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">

          {/* Notable Rounds */}
          <h2 className="intel-section-header" style={{ marginBottom: 20 }}>
            <span>Notable Funding Rounds</span>
          </h2>
          <div className="funding-grid">
            {NOTABLE_ROUNDS.map((round, i) => (
              <div key={i} className="funding-card" style={{ '--card-color': round.color } as React.CSSProperties}>
                <div className="funding-card-header" style={{ borderBottomColor: round.color + '30' }}>
                  <div className="funding-company" style={{ color: round.color }}>{round.company}</div>
                  <div className="funding-amount">{round.amount}</div>
                </div>
                <div className="funding-card-body">
                  <div className="funding-meta">
                    <span className="funding-round">{round.round}</span>
                    <span className="funding-date">{round.date}</span>
                  </div>
                  <div className="funding-valuation">Valuation: <strong>{round.valuation}</strong></div>
                  <div className="funding-investors">
                    <span>Investors: </span>
                    {round.investors.map(inv => <span key={inv} className="funding-investor-chip">{inv}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Detected Articles */}
          {liveArticles.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2 className="intel-section-header" style={{ marginBottom: 20 }}>
                <span>🔴 Live Funding Signals ({liveArticles.length})</span>
                <Link href="/blog?category=Funding" className="intel-see-all">View All →</Link>
              </h2>
              <div className="intel-story-list">
                {liveArticles.slice(0, 10).map((a, i) => (
                  <Link key={a.id} href={`/blog/${a.slug}`} className="intel-story-row">
                    <div className="intel-story-rank">{i + 1}</div>
                    <div className="intel-story-body">
                      <div className="intel-story-meta">
                        <span className="intel-company-tag">{a.company}</span>
                        <span className="intel-time">{timeAgo(a.publishedAt)}</span>
                      </div>
                      <h3>{a.title}</h3>
                    </div>
                    <div className="intel-story-score">
                      <div className="score-ring med">{a.importanceScore}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
