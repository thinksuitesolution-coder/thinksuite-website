import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Trend Predictions: 30/90/180 Day Outlook | ThinkSuite',
  description: 'ThinkSuite AI Trend Predictions forecast which AI models, tools, and companies will grow fastest over the next 30, 90, and 180 days, based on live signals.',
  keywords: [
    'AI trend predictions',
    'AI technology growth forecast',
    '90 day AI trend forecast',
    'AI investment recommendation tool',
    'emerging AI technology tracker',
    'AI momentum tracker',
    'AI market trend analysis',
  ],
};
export const revalidate = 3600;

async function getTrends() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/intelligence/trends?horizon=90d`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

const HORIZONS = [
  { label: '30-Day', key: 'topTrends', desc: 'Immediate momentum, what\'s spiking right now' },
  { label: '90-Day', key: 'topTrends', desc: 'Quarter view, emerging leaders of next season' },
  { label: '180-Day', key: 'topTrends', desc: 'Half-year outlook, structural shifts forming' },
];

const REC_COLORS: Record<string, string> = {
  strong_buy: '#059669',
  buy: '#16a34a',
  watch: '#d97706',
  neutral: '#64748b',
  avoid: '#dc2626',
};

export default async function TrendsPage() {
  const data = await getTrends();
  const trends = data?.topTrends ?? [];

  return (
    <main>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)' }}>
        <div className="container">
          <div className="chip" style={{ marginBottom: 16 }}>📈 Trend Predictions</div>
          <h1 className="page-title" style={{ color: '#fff' }}>AI Trend Predictions</h1>
          <p className="page-desc" style={{ color: 'rgba(255,255,255,0.75)' }}>
            ThinkSuite's Trend Predictions engine analyzes signal frequency, funding flow, GitHub activity, and paper citations to forecast which technologies will grow in the next 30,180 days.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {HORIZONS.map(h => (
              <div key={h.label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 16px', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                {h.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {trends.length === 0 ? (
            <div className="trends-empty">
              <div style={{ fontSize: 48, marginBottom: 16 }}>📈</div>
              <h3>Trend predictions will appear here once AI news starts flowing</h3>
              <p>Connect Firebase and run the news pipeline to generate live trend predictions.</p>
              <Link href="/intelligence" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>← Back to Dashboard</Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Top Trends, 90-Day Outlook</h2>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{trends.length} technologies tracked</span>
              </div>
              <div className="trends-grid">
                {trends.map((t: {
                  technology: string;
                  predictedGrowth90d: number;
                  currentMomentum: number;
                  investmentRecommendation: string;
                  category: string;
                  reasoning?: string;
                }, i: number) => (
                  <div key={t.technology} className="trend-card">
                    <div className="trend-card-header">
                      <div className="trend-rank">#{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <h3 className="trend-name">{t.technology}</h3>
                        <span className="trend-category">{t.category}</span>
                      </div>
                      <div className="trend-growth">+{t.predictedGrowth90d}%</div>
                    </div>
                    <div className="trend-bar-track">
                      <div className="trend-bar-fill" style={{ width: `${Math.min(t.currentMomentum, 100)}%` }} />
                    </div>
                    <div className="trend-card-footer">
                      <span className="trend-momentum">Momentum: {t.currentMomentum}/100</span>
                      <span className="trend-rec-badge" style={{ background: (REC_COLORS[t.investmentRecommendation] || '#64748b') + '18', color: REC_COLORS[t.investmentRecommendation] || '#64748b' }}>
                        {t.investmentRecommendation.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {t.reasoning && <p className="trend-reasoning">{t.reasoning}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
