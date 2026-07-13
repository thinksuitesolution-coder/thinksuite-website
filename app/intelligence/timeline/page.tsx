import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Industry Timeline: Milestones Since 2020 | ThinkSuite',
  description: 'A complete timeline of major AI model releases, funding rounds, acquisitions, and milestones from 2020 to the present, tracked by ThinkSuite.',
  keywords: [
    'AI industry timeline',
    'AI history timeline',
    'AI model release history',
    'ChatGPT launch timeline',
    'AI milestones since 2020',
    'AI company events tracker',
    'history of AI development',
  ],
};

export const revalidate = 3600;

const TIMELINE_DATA = [
  // 2020
  { year: 2020, month: 'Jun', company: 'OpenAI', event: 'GPT-3 released, 175B parameter model shocks the world', type: 'model_release', impact: 95 },
  // 2021
  { year: 2021, month: 'Jan', company: 'OpenAI', event: 'DALL-E 1 released, text-to-image AI goes mainstream', type: 'model_release', impact: 85 },
  { year: 2021, month: 'Aug', company: 'Anthropic', event: 'Anthropic founded by Dario Amodei and ex-OpenAI team', type: 'founding', impact: 90 },
  { year: 2021, month: 'Aug', company: 'Google', event: 'Google Brain and DeepMind merge discussions begin', type: 'acquisition', impact: 80 },
  // 2022
  { year: 2022, month: 'Apr', company: 'Google', event: 'PaLM 540B, Pathways Language Model released', type: 'model_release', impact: 80 },
  { year: 2022, month: 'Sep', company: 'Stability AI', event: 'Stable Diffusion open sourced, image AI democratized', type: 'open_source', impact: 92 },
  { year: 2022, month: 'Nov', company: 'OpenAI', event: 'ChatGPT launched, fastest product to 100M users ever', type: 'product_launch', impact: 100 },
  { year: 2022, month: 'Dec', company: 'Anthropic', event: 'Anthropic raises $704M Series B', type: 'funding', impact: 85 },
  // 2023
  { year: 2023, month: 'Feb', company: 'Microsoft', event: 'Microsoft integrates GPT-4 into Bing, invests $10B in OpenAI', type: 'funding', impact: 92 },
  { year: 2023, month: 'Mar', company: 'OpenAI', event: 'GPT-4 launched, multimodal reasoning model', type: 'model_release', impact: 97 },
  { year: 2023, month: 'Mar', company: 'Anthropic', event: 'Claude 1 released, Constitutional AI in production', type: 'model_release', impact: 82 },
  { year: 2023, month: 'Apr', company: 'Meta', event: 'LLaMA open-sourced, open source AI revolution begins', type: 'open_source', impact: 95 },
  { year: 2023, month: 'May', company: 'Google', event: 'Google I/O: PaLM 2, Bard upgrades, AI everywhere', type: 'keynote', impact: 85 },
  { year: 2023, month: 'Jul', company: 'xAI', event: 'xAI founded by Elon Musk with team of AI researchers', type: 'founding', impact: 88 },
  { year: 2023, month: 'Jul', company: 'Meta', event: 'Llama 2 open sourced, commercial use allowed', type: 'open_source', impact: 90 },
  { year: 2023, month: 'Sep', company: 'Anthropic', event: 'Amazon invests $4B in Anthropic, strategic partnership', type: 'funding', impact: 93 },
  { year: 2023, month: 'Oct', company: 'OpenAI', event: 'GPT-4V: Vision capabilities added to GPT-4', type: 'model_release', impact: 85 },
  { year: 2023, month: 'Nov', company: 'OpenAI', event: 'DevDay: GPT-4 Turbo, GPTs, Assistants API announced', type: 'keynote', impact: 90 },
  { year: 2023, month: 'Nov', company: 'OpenAI', event: 'Sam Altman fired and rehired within 5 days, board crisis', type: 'breaking_news', impact: 98 },
  { year: 2023, month: 'Dec', company: 'Google', event: 'Gemini 1.0 released, Ultra, Pro, Nano tiers', type: 'model_release', impact: 88 },
  // 2024
  { year: 2024, month: 'Jan', company: 'Mistral AI', event: 'Mixtral 8x7B released, MoE architecture open sourced', type: 'open_source', impact: 83 },
  { year: 2024, month: 'Feb', company: 'Google', event: 'Gemini 1.5 Pro: 1M context window announced', type: 'model_release', impact: 91 },
  { year: 2024, month: 'Mar', company: 'Anthropic', event: 'Claude 3 family: Haiku, Sonnet, Opus released', type: 'model_release', impact: 92 },
  { year: 2024, month: 'Apr', company: 'Meta', event: 'Llama 3 released, 8B and 70B parameter models', type: 'open_source', impact: 88 },
  { year: 2024, month: 'May', company: 'OpenAI', event: 'GPT-4o: Omni model with real-time voice and vision', type: 'model_release', impact: 95 },
  { year: 2024, month: 'Jun', company: 'xAI', event: 'xAI raises $6B, Grok 1.5 released', type: 'funding', impact: 87 },
  { year: 2024, month: 'Jun', company: 'Anthropic', event: 'Claude 3.5 Sonnet, beats GPT-4o on most benchmarks', type: 'model_release', impact: 93 },
  { year: 2024, month: 'Jun', company: 'Apple', event: 'Apple Intelligence announced, on-device AI with Claude', type: 'product_launch', impact: 90 },
  { year: 2024, month: 'Sep', company: 'OpenAI', event: 'o1 reasoning model released, PhD-level reasoning', type: 'model_release', impact: 94 },
  { year: 2024, month: 'Oct', company: 'Anthropic', event: 'Claude 3.5 Sonnet v2 + computer use capability', type: 'model_release', impact: 88 },
  { year: 2024, month: 'Dec', company: 'Google', event: 'Gemini 2.0 Flash released, fastest multimodal model', type: 'model_release', impact: 87 },
  // 2025
  { year: 2025, month: 'Jan', company: 'Anthropic', event: 'Anthropic raises $2B from Google, valuation $18.4B', type: 'funding', impact: 91 },
  { year: 2025, month: 'Feb', company: 'xAI', event: 'Grok 3 released, trained on 200K GPUs', type: 'model_release', impact: 88 },
  { year: 2025, month: 'Mar', company: 'OpenAI', event: 'GPT-4.5 released, largest pre-training run', type: 'model_release', impact: 89 },
  { year: 2025, month: 'Apr', company: 'OpenAI', event: 'o3 and o4-mini released, advanced reasoning models', type: 'model_release', impact: 92 },
  { year: 2025, month: 'May', company: 'Google', event: 'Google I/O 2025: Gemini 2.5 Pro, Project Astra announced', type: 'keynote', impact: 90 },
  { year: 2025, month: 'Jun', company: 'OpenAI', event: 'OpenAI raises $40B at $300B+ valuation, largest ever', type: 'funding', impact: 97 },
];

const TYPE_CONFIG: Record<string, { color: string; icon: string }> = {
  model_release:  { color: '#2563eb', icon: '🚀' },
  product_launch: { color: '#2563eb', icon: '🎯' },
  open_source:    { color: '#059669', icon: '📂' },
  funding:        { color: '#d97706', icon: '💰' },
  acquisition:    { color: '#7c3aed', icon: '🤝' },
  keynote:        { color: '#0891b2', icon: '🎤' },
  breaking_news:  { color: '#dc2626', icon: '🔴' },
  founding:       { color: '#64748b', icon: '🏢' },
};

const COMPANY_COLORS: Record<string, string> = {
  'OpenAI': '#10a37f', 'Anthropic': '#d97706', 'Google': '#4285f4',
  'Meta': '#0866ff', 'Microsoft': '#00a4ef', 'NVIDIA': '#76b900',
  'xAI': '#374151', 'Mistral AI': '#ff7000', 'Apple': '#555', 'Stability AI': '#7c3aed',
};

export default async function TimelinePage() {
  const years = [...new Set(TIMELINE_DATA.map(e => e.year))].sort((a, b) => b - a);

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="chip" style={{ marginBottom: 16 }}>📅 AI Industry History</div>
          <h1 className="page-title">AI Timeline</h1>
          <p className="page-desc">ThinkSuite's AI Timeline tracks every major model release, funding round, acquisition, and breakthrough in the AI industry since 2020.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20 }}>
            {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
              <span key={type} className="timeline-legend-chip" style={{ borderColor: cfg.color + '44', color: cfg.color, background: cfg.color + '0d' }}>
                {cfg.icon} {type.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          {years.map(year => (
            <div key={year} className="timeline-year-block">
              <div className="timeline-year-label">{year}</div>
              <div className="timeline-events">
                {TIMELINE_DATA
                  .filter(e => e.year === year)
                  .sort((a, b) => {
                    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    return months.indexOf(b.month) - months.indexOf(a.month);
                  })
                  .map((event, i) => {
                    const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.model_release;
                    const companyColor = COMPANY_COLORS[event.company] || '#2563eb';
                    return (
                      <div key={i} className="timeline-event-card">
                        <div className="timeline-event-left">
                          <div className="timeline-month">{event.month}</div>
                          <div className="timeline-line" />
                          <div className="timeline-dot" style={{ background: cfg.color }} />
                        </div>
                        <div className="timeline-event-body">
                          <div className="timeline-event-meta">
                            <span className="timeline-company-badge" style={{ background: companyColor + '18', color: companyColor }}>{event.company}</span>
                            <span className="timeline-type-badge" style={{ background: cfg.color + '18', color: cfg.color }}>{cfg.icon} {event.type.replace('_', ' ')}</span>
                            <span className="timeline-impact">Impact {event.impact}/100</span>
                          </div>
                          <p className="timeline-event-text">{event.event}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          <div className="timeline-future">
            <div className="timeline-year-label">2026 →</div>
            <div className="timeline-future-card">
              <p>🔮 Tracking live...</p>
              <p>New events are automatically detected and added by the AI Intelligence Pipeline.</p>
              <Link href="/blog" className="btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>See Latest News →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
