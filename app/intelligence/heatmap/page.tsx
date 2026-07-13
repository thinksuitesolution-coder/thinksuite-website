import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Market Heatmap | Global AI Activity | ThinkSuite',
  description: 'Interactive global heatmap showing AI investment, research activity, and company presence by country and region, from the United States to India.',
  keywords: [
    'global AI heatmap',
    'AI investment by country',
    'AI market activity map',
    'AI industry growth by region',
    'AI research hubs worldwide',
    'country AI ranking',
    'global AI ecosystem map',
  ],
};

const REGIONS = [
  {
    region: 'North America',
    countries: [
      { name: 'United States', flag: '🇺🇸', score: 98, companies: ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Microsoft', 'NVIDIA'], funding: '$200B+', researchers: '50K+', highlight: 'Global AI leader, dominates LLMs, chips, infrastructure' },
      { name: 'Canada', flag: '🇨🇦', score: 72, companies: ['Cohere', 'Vector Institute', 'Element AI'], funding: '$5B+', researchers: '8K+', highlight: 'Strong academic AI hub, Geoffrey Hinton\'s home country' },
    ],
    totalScore: 96,
    color: '#2563eb',
  },
  {
    region: 'Europe',
    countries: [
      { name: 'France', flag: '🇫🇷', score: 82, companies: ['Mistral AI', 'Hugging Face', 'LightOn'], funding: '$10B+', researchers: '12K+', highlight: 'Emerging AI powerhouse, Mistral challenging US dominance' },
      { name: 'United Kingdom', flag: '🇬🇧', score: 80, companies: ['Google DeepMind', 'Wayve', 'Graphcore'], funding: '$8B+', researchers: '15K+', highlight: 'DeepMind HQ, strong academic-industry collaboration' },
      { name: 'Germany', flag: '🇩🇪', score: 70, companies: ['Aleph Alpha', 'DeepL', 'SAP AI'], funding: '$4B+', researchers: '10K+', highlight: 'Industrial AI focus, EU AI Act compliance leader' },
    ],
    totalScore: 78,
    color: '#7c3aed',
  },
  {
    region: 'Asia',
    countries: [
      { name: 'China', flag: '🇨🇳', score: 91, companies: ['Baidu', 'Alibaba DAMO', 'ByteDance', 'SenseTime', 'Moonshot AI'], funding: '$100B+', researchers: '80K+', highlight: 'Largest AI researcher population, strong in vision AI' },
      { name: 'India', flag: '🇮🇳', score: 75, companies: ['ThinkSuite', 'Krutrim AI', 'Sarvam AI', 'CoRover', 'Gan.AI'], funding: '$5B+', researchers: '20K+', highlight: 'Fastest growing AI market, INDUS LLMs emerging' },
      { name: 'Japan', flag: '🇯🇵', score: 73, companies: ['Sakana AI', 'SoftBank', 'Preferred Networks'], funding: '$8B+', researchers: '10K+', highlight: 'Robotics AI leader, Sakana AI breakthrough in 2024' },
      { name: 'South Korea', flag: '🇰🇷', score: 71, companies: ['Naver', 'Kakao', 'Samsung AI', 'LG AI Research'], funding: '$6B+', researchers: '9K+', highlight: 'HyperCLOVA X, strong semiconductor + AI combo' },
    ],
    totalScore: 84,
    color: '#d97706',
  },
  {
    region: 'Middle East',
    countries: [
      { name: 'UAE', flag: '🇦🇪', score: 78, companies: ['G42', 'Technology Innovation Institute', 'Falcon AI'], funding: '$20B+', researchers: '3K+', highlight: 'Falcon LLM, massive AI investment push from government' },
      { name: 'Saudi Arabia', flag: '🇸🇦', score: 69, companies: ['SDAIA', 'Saudi ARAMCO AI'], funding: '$15B+', researchers: '2K+', highlight: 'NEOM AI city, government-led AI transformation' },
    ],
    totalScore: 74,
    color: '#059669',
  },
];

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', marginTop: 4 }}>
      <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3 }} />
    </div>
  );
}

export default function HeatmapPage() {
  return (
    <main>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' }}>
        <div className="container">
          <div className="chip" style={{ marginBottom: 16 }}>🌍 Geographic Intelligence</div>
          <h1 className="page-title" style={{ color: '#fff' }}>AI Market Heatmap</h1>
          <p className="page-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>ThinkSuite's AI Market Heatmap shows where AI is growing fastest, tracking investment, research activity, companies, and policy by country and region.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">

          {/* Global Score Overview */}
          <div className="heatmap-overview">
            {REGIONS.map(region => (
              <div key={region.region} className="heatmap-region-summary" style={{ borderTopColor: region.color }}>
                <div className="heatmap-region-name">{region.region}</div>
                <div className="heatmap-region-score" style={{ color: region.color }}>{region.totalScore}</div>
                <ScoreBar score={region.totalScore} color={region.color} />
                <div className="heatmap-region-count">{region.countries.length} countries tracked</div>
              </div>
            ))}
          </div>

          {/* Region Detail Cards */}
          {REGIONS.map(region => (
            <div key={region.region} className="heatmap-region-block">
              <h2 className="heatmap-region-heading" style={{ color: region.color }}>
                {region.region}
                <span className="heatmap-score-pill" style={{ background: region.color + '18', color: region.color }}>
                  AI Score: {region.totalScore}/100
                </span>
              </h2>
              <div className="heatmap-country-grid">
                {region.countries.map(country => (
                  <div key={country.name} className="heatmap-country-card">
                    <div className="heatmap-country-header">
                      <span className="heatmap-flag">{country.flag}</span>
                      <div>
                        <h3 className="heatmap-country-name">{country.name}</h3>
                        <div className="heatmap-country-score-row">
                          <span style={{ color: region.color, fontWeight: 700 }}>{country.score}/100</span>
                        </div>
                      </div>
                    </div>
                    <ScoreBar score={country.score} color={region.color} />
                    <p className="heatmap-highlight">{country.highlight}</p>
                    <div className="heatmap-stats">
                      <div><strong>{country.funding}</strong><span>Invested</span></div>
                      <div><strong>{country.researchers}</strong><span>AI Researchers</span></div>
                    </div>
                    <div className="heatmap-companies">
                      {country.companies.slice(0, 4).map(c => (
                        <span key={c} className="heatmap-company-chip">{c}</span>
                      ))}
                      {country.companies.length > 4 && <span className="heatmap-company-chip">+{country.companies.length - 4} more</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
