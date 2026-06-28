'use client';
import dynamic from 'next/dynamic';
import { AI_KNOWLEDGE_GRAPH } from '@/lib/graph/knowledge-graph-data';

// D3 manipulates DOM directly, must be client-only, no SSR
const KnowledgeGraph = dynamic(
  () => import('@/components/graph/KnowledgeGraph'),
  { ssr: false, loading: () => <div className="kg-loading">Loading knowledge graph...</div> }
);

const STATS = [
  { label: 'AI Companies', value: AI_KNOWLEDGE_GRAPH.nodes.filter(n => n.type === 'company').length },
  { label: 'Models Tracked', value: AI_KNOWLEDGE_GRAPH.nodes.filter(n => n.type === 'model').length },
  { label: 'Technologies', value: AI_KNOWLEDGE_GRAPH.nodes.filter(n => n.type === 'technology').length },
  { label: 'Relationships', value: AI_KNOWLEDGE_GRAPH.edges.length },
];

export default function GraphPageClient() {
  return (
    <main>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #050518, #0c1445, #160833)', paddingBottom: 32 }}>
        <div className="container">
          <div className="chip" style={{ marginBottom: 16 }}>🧠 AI Knowledge Graph</div>
          <h1 className="page-title" style={{ color: '#fff' }}>AI Industry Knowledge Graph</h1>
          <p className="page-desc" style={{ color: 'rgba(255,255,255,0.72)', maxWidth: 620 }}>
            Every company, model, technology, person, and funding relationship in the AI industry, mapped and interconnected. Click any node to explore.
          </p>

          <div className="kg-hero-stats">
            {STATS.map(s => (
              <div key={s.label} className="kg-hero-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '32px 0 0', background: 'var(--bg2)' }}>
        <div className="container" style={{ maxWidth: '100%', padding: '0 24px' }}>
          <KnowledgeGraph data={AI_KNOWLEDGE_GRAPH} height={680} />
        </div>
      </section>

      {/* Legend + How to use */}
      <section className="section">
        <div className="container">
          <div className="kg-guide-grid">
            <div className="kg-guide-card">
              <h3>🖱️ How to navigate</h3>
              <ul>
                <li><strong>Scroll</strong>, zoom in / out</li>
                <li><strong>Drag background</strong>, pan the graph</li>
                <li><strong>Drag node</strong>, reposition it</li>
                <li><strong>Click node</strong>, see details panel</li>
                <li><strong>Hover node</strong>, highlight connections</li>
                <li><strong>Filter buttons</strong>, show/hide categories</li>
              </ul>
            </div>
            <div className="kg-guide-card">
              <h3>🎨 Node types</h3>
              <div className="kg-legend-list">
                {[
                  { color: '#2563eb', icon: '🏢', label: 'Company' },
                  { color: '#7c3aed', icon: '🤖', label: 'AI Model' },
                  { color: '#0891b2', icon: '⚙️', label: 'Technology' },
                  { color: '#16a34a', icon: '👤', label: 'Person' },
                  { color: '#d97706', icon: '💡', label: 'Concept' },
                  { color: '#dc2626', icon: '💰', label: 'Funding' },
                ].map(l => (
                  <div key={l.label} className="kg-legend-row">
                    <div className="kg-legend-dot" style={{ background: l.color }} />
                    <span>{l.icon}</span>
                    <span>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="kg-guide-card">
              <h3>📊 Graph insights</h3>
              <ul>
                <li>OpenAI is the most connected company node</li>
                <li>Transformer architecture connects all major models</li>
                <li>CUDA underlies every major training run</li>
                <li>Safety tension exists across OpenAI, Anthropic, xAI</li>
                <li>MoE is the dominant architecture for efficient models</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
