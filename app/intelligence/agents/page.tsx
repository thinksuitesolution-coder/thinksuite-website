import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free AI Agents Marketplace | ThinkSuite Intelligence',
  description: 'Discover and deploy free AI agents that monitor competitors, track funding, summarize research, and auto publish AI industry updates, no code required.',
  keywords: [
    'AI agents marketplace',
    'AI agent for competitor monitoring',
    'AI funding alert agent',
    'AI research digest tool',
    'AI social media automation agent',
    'no code AI agents',
    'AI agent deployment platform',
    'AI industry monitoring agents',
    'free AI agents India',
    'custom AI agent builder',
  ],
};

const FEATURED_AGENTS = [
  {
    id: 'competitor-watcher',
    name: 'Competitor Watcher',
    description: 'Monitors any company you define and sends daily summaries of their product releases, hires, and announcements.',
    tags: ['Monitoring', 'Competitive Intelligence'],
    icon: '🎯',
    color: '#2563eb',
    runs: null,
    rating: 4.9,
    author: 'ThinkSuite',
    verified: true,
  },
  {
    id: 'funding-radar',
    name: 'Funding Radar',
    description: 'Automatically detects AI startup funding news, extracts investor names, amounts, and valuations.',
    tags: ['Funding', 'Startups', 'Finance'],
    icon: '💰',
    color: '#059669',
    runs: null,
    rating: 4.8,
    author: 'ThinkSuite',
    verified: true,
  },
  {
    id: 'research-digest',
    name: 'Research Digest',
    description: 'Finds the most important AI papers from ArXiv daily, summarizes them in plain English with business implications.',
    tags: ['Research', 'ArXiv', 'Papers'],
    icon: '📄',
    color: '#7c3aed',
    runs: null,
    rating: 4.7,
    author: 'ThinkSuite',
    verified: true,
  },
  {
    id: 'market-briefer',
    name: 'Market Briefer',
    description: 'Generates a 5-minute morning briefing on the AI industry tailored to your role: developer, founder, investor, or marketer.',
    tags: ['Briefing', 'Personalized', 'Daily'],
    icon: '☀️',
    color: '#d97706',
    runs: null,
    rating: 4.9,
    author: 'ThinkSuite',
    verified: true,
  },
  {
    id: 'trend-predictor',
    name: 'Trend Predictor',
    description: 'Analyzes patterns in recent AI news to generate 30/90/180-day growth predictions for emerging technologies.',
    tags: ['Trends', 'Predictions', 'Analytics'],
    icon: '📈',
    color: '#dc2626',
    runs: null,
    rating: 4.6,
    author: 'ThinkSuite',
    verified: true,
  },
  {
    id: 'linkedin-poster',
    name: 'LinkedIn Auto-Poster',
    description: 'Converts high-importance AI news into LinkedIn-ready posts optimized for engagement and thought leadership.',
    tags: ['Social Media', 'LinkedIn', 'Content'],
    icon: '💼',
    color: '#0a66c2',
    runs: null,
    rating: 4.5,
    author: 'ThinkSuite',
    verified: true,
  },
  {
    id: 'github-tracker',
    name: 'GitHub AI Tracker',
    description: 'Monitors AI repositories for new releases, trending projects, and significant commits from top AI organizations.',
    tags: ['GitHub', 'Open Source', 'Releases'],
    icon: '🐙',
    color: '#374151',
    runs: null,
    rating: 4.7,
    author: 'ThinkSuite',
    verified: true,
  },
  {
    id: 'newsletter-builder',
    name: 'Newsletter Builder',
    description: 'Automatically compiles the week\'s top AI stories into a formatted newsletter for your subscribers.',
    tags: ['Newsletter', 'Email', 'Weekly'],
    icon: '📧',
    color: '#be185d',
    runs: null,
    rating: 4.8,
    author: 'ThinkSuite',
    verified: true,
  },
];

const CATEGORIES = ['All', 'Monitoring', 'Research', 'Funding', 'Social Media', 'Content', 'Analytics', 'Daily Digest'];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="agent-stars">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      <span className="agent-rating-num">{rating}</span>
    </span>
  );
}

export default function AgentsPage() {
  return (
    <main>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)' }}>
        <div className="container">
          <div className="chip" style={{ marginBottom: 16 }}>🤖 AI Agents Marketplace</div>
          <h1 className="page-title" style={{ color: '#fff' }}>AI Agents for Intelligence Work</h1>
          <p className="page-desc" style={{ color: 'rgba(255,255,255,0.75)' }}>
            ThinkSuite's AI Agents Marketplace offers ready-to-deploy agents for monitoring competitors, tracking funding, summarizing research, and publishing AI industry content. Launch any agent in one click, no code required.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
            <div className="agents-hero-stat"><strong>{FEATURED_AGENTS.length}</strong> Active Agents</div>
            <div className="agents-hero-stat"><strong>Free</strong> to Deploy</div>
            <div className="agents-hero-stat"><strong>100%</strong> Free to Use</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">

          {/* Category Filter */}
          <div className="agents-filter-bar">
            {CATEGORIES.map(cat => (
              <button key={cat} className={`agents-filter-btn ${cat === 'All' ? 'active' : ''}`}>{cat}</button>
            ))}
          </div>

          {/* Agent Grid */}
          <div className="agents-grid">
            {FEATURED_AGENTS.map(agent => (
              <div key={agent.id} className="agent-card">
                <div className="agent-card-top">
                  <div className="agent-icon" style={{ background: agent.color + '18', color: agent.color }}>
                    {agent.icon}
                  </div>
                  <div className="agent-header">
                    <div className="agent-name-row">
                      <h3 className="agent-name">{agent.name}</h3>
                      {agent.verified && <span className="agent-verified">✓ Official</span>}
                    </div>
                    <div className="agent-author">by {agent.author}</div>
                  </div>
                </div>

                <p className="agent-desc">{agent.description}</p>

                <div className="agent-tags">
                  {agent.tags.map(t => (
                    <span key={t} className="agent-tag" style={{ background: agent.color + '12', color: agent.color }}>{t}</span>
                  ))}
                </div>

                <div className="agent-footer">
                  <div className="agent-meta">
                    <StarRating rating={agent.rating} />
                    {agent.runs && <span className="agent-runs">{agent.runs} runs</span>}
                  </div>
                  <Link href={`/intelligence/agents/${agent.id}`} className="agent-deploy-btn" style={{ background: agent.color }}>
                    Deploy →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Build Your Own */}
          <div className="agents-build-cta">
            <div className="agents-build-content">
              <div className="agents-build-icon">🛠️</div>
              <div>
                <h2>Build Your Own Agent</h2>
                <p>Have a custom monitoring or automation use case? Build and publish your own AI agent using our pipeline tools, and share it with the community.</p>
              </div>
            </div>
            <a href="mailto:info@thinksuite.in?subject=Custom AI Agent Request" className="agents-build-btn">
              Request Custom Agent →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

