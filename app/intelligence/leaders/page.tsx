import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogArticle } from '@/lib/news/types';

export const metadata: Metadata = {
  title: 'AI Industry Leaders: Profiles & Influence | ThinkSuite',
  description: 'Track statements, predictions, and influence scores for AI industry leaders including Sam Altman, Dario Amodei, Sundar Pichai, and Jensen Huang.',
  keywords: [
    'AI industry leaders',
    'Sam Altman predictions tracker',
    'AI CEO influence tracker',
    'Dario Amodei Anthropic news',
    'AI leader profiles',
    'tech CEO AI statements tracker',
    'AI thought leaders database',
  ],
};
export const revalidate = 3600;

const AI_LEADERS = [
  {
    name: 'Sam Altman', role: 'CEO, OpenAI', company: 'OpenAI', companyColor: '#10a37f',
    twitter: 'sama', influence: 98,
    known_for: 'ChatGPT launch, AGI acceleration, OpenAI governance crisis',
    key_predictions: ['AGI within 4-10 years', '$7T chip initiative', 'AI will automate most jobs'],
    recent_focus: 'Scaling laws, governance, hardware independence',
    avatar: '🧑‍💼',
  },
  {
    name: 'Dario Amodei', role: 'CEO, Anthropic', company: 'Anthropic', companyColor: '#d97706',
    twitter: 'DarioAmodei', influence: 90,
    known_for: 'Constitutional AI, safety-first approach, Claude models',
    key_predictions: ['Powerful AI by 2026-2027', 'AI will compress decades of progress', 'Biology will be transformed by AI'],
    recent_focus: 'AI safety, interpretability, Claude capabilities',
    avatar: '👨‍🔬',
  },
  {
    name: 'Sundar Pichai', role: 'CEO, Alphabet/Google', company: 'Google', companyColor: '#4285f4',
    twitter: 'sundarpichai', influence: 92,
    known_for: 'Gemini launch, Google AI integration, Google Cloud AI',
    key_predictions: ['AI is most transformative technology in history', 'Responsible AI is business imperative'],
    recent_focus: 'Gemini ecosystem, AI Overviews, Google Cloud AI',
    avatar: '👨‍💻',
  },
  {
    name: 'Elon Musk', role: 'CEO, xAI / Tesla / SpaceX', company: 'xAI', companyColor: '#374151',
    twitter: 'elonmusk', influence: 95,
    known_for: 'Grok AI, xAI founding, OpenAI lawsuit, Tesla FSD',
    key_predictions: ['AI more dangerous than nukes (2017)', 'Now bullish on AI acceleration'],
    recent_focus: 'Grok 3, xAI compute, X platform AI integration',
    avatar: '🚀',
  },
  {
    name: 'Satya Nadella', role: 'CEO, Microsoft', company: 'Microsoft', companyColor: '#00a4ef',
    twitter: 'satyanadella', influence: 89,
    known_for: '$13B OpenAI investment, Copilot integration, Azure AI',
    key_predictions: ['Every company will be AI-powered', 'Copilot will be new UI for software'],
    recent_focus: 'Copilot+ PCs, Azure AI Foundry, enterprise AI',
    avatar: '💼',
  },
  {
    name: 'Demis Hassabis', role: 'CEO, Google DeepMind', company: 'Google DeepMind', companyColor: '#4285f4',
    twitter: 'demishassabis', influence: 91,
    known_for: 'AlphaFold, AlphaGo, Gemini development, Nobel Prize 2024',
    key_predictions: ['AI will solve biology within decade', 'AGI possible in 5-10 years'],
    recent_focus: 'Gemini 2.0, AlphaFold 3, scientific AI',
    avatar: '🏆',
  },
  {
    name: 'Yann LeCun', role: 'Chief AI Scientist, Meta', company: 'Meta', companyColor: '#0866ff',
    twitter: 'ylecun', influence: 88,
    known_for: 'Turing Award, CNNs, LLaMA open source push, AGI skeptic',
    key_predictions: ['Current LLMs will not lead to AGI', 'World model approach needed', 'Open source is safer'],
    recent_focus: 'JEPA architecture, open source AI advocacy',
    avatar: '🎓',
  },
  {
    name: 'Jensen Huang', role: 'CEO, NVIDIA', company: 'NVIDIA', companyColor: '#76b900',
    twitter: 'jensenhuang', influence: 94,
    known_for: 'CUDA, GPU AI infrastructure, $3T market cap milestone',
    key_predictions: ['AI factories are the new power plants', 'Physical AI is next frontier'],
    recent_focus: 'Blackwell GPUs, AI factories, robotics',
    avatar: '⚡',
  },
];

async function getLeaderArticles(leaderName: string): Promise<number> {
  // Returns mention count from our article database
  return 0; // Will be populated from Firestore
}

export default async function LeadersPage() {
  return (
    <main>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #0c0a1e, #1a1235)' }}>
        <div className="container">
          <div className="chip" style={{ marginBottom: 16 }}>🎯 AI Leader Intelligence</div>
          <h1 className="page-title" style={{ color: '#fff' }}>AI Industry Leaders</h1>
          <p className="page-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>ThinkSuite's AI Leader Tracker follows statements, predictions, and influence scores from the people shaping the AI industry, from OpenAI's Sam Altman to NVIDIA's Jensen Huang.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="leaders-grid">
            {AI_LEADERS.map((leader) => (
              <div key={leader.name} className="leader-card">
                <div className="leader-card-top" style={{ borderBottomColor: leader.companyColor + '30' }}>
                  <div className="leader-avatar" style={{ background: leader.companyColor + '18', borderColor: leader.companyColor + '40' }}>
                    {leader.avatar}
                  </div>
                  <div>
                    <h3 className="leader-name">{leader.name}</h3>
                    <p className="leader-role">{leader.role}</p>
                    <span className="leader-company" style={{ color: leader.companyColor, background: leader.companyColor + '12' }}>
                      {leader.company}
                    </span>
                  </div>
                  <div className="leader-influence">
                    <div className="leader-influence-score" style={{ color: leader.companyColor }}>{leader.influence}</div>
                    <div className="leader-influence-label">Influence</div>
                  </div>
                </div>

                <div className="leader-card-body">
                  <div className="leader-section">
                    <span className="leader-section-label">Known For</span>
                    <p>{leader.known_for}</p>
                  </div>

                  <div className="leader-section">
                    <span className="leader-section-label">Key Predictions</span>
                    <ul>
                      {leader.key_predictions.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>

                  <div className="leader-section">
                    <span className="leader-section-label">Current Focus</span>
                    <p>{leader.recent_focus}</p>
                  </div>
                </div>

                <div className="leader-card-footer">
                  <Link href={`/blog?company=${encodeURIComponent(leader.company)}`} className="leader-news-btn">
                    View News →
                  </Link>
                  <a href={`https://twitter.com/${leader.twitter}`} target="_blank" rel="noopener noreferrer" className="leader-twitter-btn">
                    @{leader.twitter}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
