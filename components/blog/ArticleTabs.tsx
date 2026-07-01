'use client';

import { useState } from 'react';
import { BlogArticle } from '@/lib/news/types';
import { StartupOpportunity } from '@/lib/news/pipeline/opportunities';
import { CompetitorAnalysis } from '@/lib/news/pipeline/competitor-intel';
import { PersonalizedVersion } from '@/lib/news/pipeline/personalized-versions';
import TranslateWidget from './TranslateWidget';

interface Props {
  article: Partial<BlogArticle>;
  opportunities?: { opportunities: StartupOpportunity[]; topOpportunity: StartupOpportunity; investmentAngles: string[]; threatenedStartups: string[]; emergingJobRoles: string[]; summary: string } | null;
  competitorIntel?: CompetitorAnalysis | null;
  personalizedVersions?: PersonalizedVersion[];
}

type Tab = 'article' | 'opportunities' | 'competitor' | 'personalized';

const COMPETITION_COLORS = { low: '#059669', medium: '#d97706', high: '#dc2626' };
const IMPACT_COLORS = { positive: '#059669', negative: '#dc2626', neutral: '#64748b' };
const ROLE_ICONS = { developer: '💻', founder: '🚀', investor: '💰', marketer: '📣' };
const REC_COLORS: Record<string, string> = {
  strong_buy: '#059669', buy: '#2563eb', hold: '#d97706', watch: '#64748b', avoid: '#dc2626',
};

function ArticleSection({ article }: { article: Partial<BlogArticle> }) {
  const lines = (article.content || '').split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="article-h2">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="article-h3">{line.slice(4)}</h3>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="article-ul">
          {items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: fmtInline(item) }} />)}
        </ul>
      );
      continue;
    } else if (line.trim()) {
      elements.push(<p key={i} className="article-p" dangerouslySetInnerHTML={{ __html: fmtInline(line) }} />);
    }
    i++;
  }

  return (
    <>
      <div className="article-content">{elements}</div>

      {article.whyItMatters && (
        <div className="article-section-card">
          <h3>Why It Matters</h3>
          <p>{toStr(article.whyItMatters)}</p>
        </div>
      )}

      <div className="article-analysis-grid">
        {article.marketImpact && (
          <div className="article-analysis-card">
            <div className="article-analysis-icon">📈</div>
            <h4>Market Impact</h4>
            <p>{toStr(article.marketImpact)}</p>
          </div>
        )}
        {article.developerImpact && (
          <div className="article-analysis-card">
            <div className="article-analysis-icon">💻</div>
            <h4>Developer Impact</h4>
            <p>{toStr(article.developerImpact)}</p>
          </div>
        )}
        {article.futurePrediction && (
          <div className="article-analysis-card">
            <div className="article-analysis-icon">🔮</div>
            <h4>Future Prediction</h4>
            <p>{toStr(article.futurePrediction)}</p>
          </div>
        )}
      </div>

      {article.expertAnalysis && (
        <blockquote className="article-expert">
          <p>{toStr(article.expertAnalysis)}</p>
          <cite>ThinkSuite AI Analysis</cite>
        </blockquote>
      )}
    </>
  );
}

function OpportunitiesSection({ data }: { data: Props['opportunities'] }) {
  if (!data) return <div className="tab-empty">No startup opportunities detected for this event.</div>;
  return (
    <div className="tab-section">
      <div className="opp-summary-box">
        <p>{data.summary}</p>
      </div>

      {data.topOpportunity && (
        <div className="opp-featured">
          <div className="opp-featured-badge">⭐ Top Opportunity</div>
          <h3>{data.topOpportunity.name}</h3>
          <p>{data.topOpportunity.description}</p>
          <div className="opp-meta-grid">
            <div><strong>Target Market</strong><span>{data.topOpportunity.targetMarket}</span></div>
            <div><strong>Revenue Model</strong><span>{data.topOpportunity.revenueModel}</span></div>
            <div><strong>Time to Market</strong><span>{data.topOpportunity.timeToMarket}</span></div>
            <div><strong>Market Size</strong><span>{data.topOpportunity.estimatedMarketSize}</span></div>
          </div>
          <div className="opp-tech-stack">
            {data.topOpportunity.techRequired?.map(t => <span key={t} className="blog-tag">{t}</span>)}
          </div>
        </div>
      )}

      <h3 className="tab-sub-heading">All Opportunities ({data.opportunities?.length})</h3>
      <div className="opp-grid">
        {data.opportunities?.map((opp, i) => (
          <div key={i} className="opp-card">
            <div className="opp-card-header">
              <h4>{opp.name}</h4>
              <span className="opp-comp-badge" style={{ background: COMPETITION_COLORS[opp.competitionLevel] + '18', color: COMPETITION_COLORS[opp.competitionLevel] }}>
                {opp.competitionLevel} competition
              </span>
            </div>
            <p>{opp.description}</p>
            <div className="opp-card-footer">
              <span>🎯 {opp.targetMarket}</span>
              <span>⏱ {opp.timeToMarket}</span>
              <span>💰 {opp.estimatedMarketSize}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="opp-extras-grid">
        {data.investmentAngles?.length > 0 && (
          <div className="opp-extra-card">
            <h4>💰 Investment Angles</h4>
            <ul>{data.investmentAngles.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </div>
        )}
        {data.threatenedStartups?.length > 0 && (
          <div className="opp-extra-card">
            <h4>⚠️ Threatened Startups</h4>
            <ul>{data.threatenedStartups.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        )}
        {data.emergingJobRoles?.length > 0 && (
          <div className="opp-extra-card">
            <h4>👩‍💻 Emerging Job Roles</h4>
            <ul>{data.emergingJobRoles.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

function CompetitorSection({ data }: { data: Props['competitorIntel'] }) {
  if (!data) return <div className="tab-empty">No competitor intelligence for this event.</div>;
  return (
    <div className="tab-section">
      <div className="comp-summary">
        <p>{data.industryNarrative}</p>
      </div>

      <div className="comp-verdict-grid">
        {data.winnerAnalysis && (
          <div className="comp-verdict-card winner">
            <div className="comp-verdict-icon">🏆</div>
            <h4>Who Wins</h4>
            <p>{data.winnerAnalysis}</p>
          </div>
        )}
        {data.loserAnalysis && (
          <div className="comp-verdict-card loser">
            <div className="comp-verdict-icon">⚠️</div>
            <h4>Who Is Threatened</h4>
            <p>{data.loserAnalysis}</p>
          </div>
        )}
      </div>

      {data.marketShareShift && (
        <div className="article-section-card">
          <h3>Market Share Analysis</h3>
          <p>{data.marketShareShift}</p>
        </div>
      )}

      <h3 className="tab-sub-heading">Competitor Impact Analysis</h3>
      <div className="comp-grid">
        {data.affectedCompetitors?.map((c, i) => (
          <div key={i} className="comp-card">
            <div className="comp-card-header">
              <span className="comp-name">{c.company}</span>
              <span className="impact-badge" style={{ background: IMPACT_COLORS[c.impact] + '18', color: IMPACT_COLORS[c.impact] }}>
                {c.impact} impact
              </span>
            </div>
            <div className="comp-score-bar">
              <div style={{ width: `${c.impactScore}%`, background: IMPACT_COLORS[c.impact] }} />
            </div>
            <p className="comp-reasoning">{c.reasoning}</p>
            <p className="comp-response"><strong>Likely response:</strong> {c.likelyResponse}</p>
          </div>
        ))}
      </div>

      {data.technicalComparison?.length > 0 && (
        <div className="comp-table-wrap">
          <h3 className="tab-sub-heading">Technical Comparison</h3>
          <table className="comp-table">
            <thead>
              <tr>
                <th>Aspect</th>
                <th>{data.triggerCompany}</th>
                {data.technicalComparison[0]?.competitors &&
                  Object.keys(data.technicalComparison[0].competitors).map(k => <th key={k}>{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.technicalComparison.map((row, i) => (
                <tr key={i}>
                  <td><strong>{row.aspect}</strong></td>
                  <td className="comp-table-highlight">{row.triggerCompany}</td>
                  {Object.values(row.competitors).map((v, j) => <td key={j}>{v as string}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PersonalizedSection({ versions }: { versions?: PersonalizedVersion[] }) {
  const [activeRole, setActiveRole] = useState<string>(versions?.[0]?.role || 'developer');
  if (!versions?.length) return <div className="tab-empty">Personalized analysis not available.</div>;
  const active = versions.find(v => v.role === activeRole) || versions[0];

  return (
    <div className="tab-section">
      <p style={{ color: 'var(--text2)', marginBottom: 20 }}>Same news, different lens. Choose your perspective.</p>
      <div className="role-tabs">
        {versions.map(v => (
          <button
            key={v.role}
            className={`role-tab-btn ${v.role === activeRole ? 'active' : ''}`}
            onClick={() => setActiveRole(v.role)}
          >
            {ROLE_ICONS[v.role]} {v.role.charAt(0).toUpperCase() + v.role.slice(1)}
          </button>
        ))}
      </div>

      <div className="role-content">
        <h3>{active.headline}</h3>
        <p className="role-summary">{active.summary}</p>

        <div className="role-grid">
          <div>
            <h4>Key Takeaways</h4>
            <ul className="role-list">
              {active.keyTakeaways?.map((t, i) => <li key={i}>✓ {t}</li>)}
            </ul>
          </div>
          <div>
            <h4>Action Items</h4>
            <ul className="role-list action">
              {active.actionItems?.map((a, i) => <li key={i}>→ {a}</li>)}
            </ul>
          </div>
        </div>

        <div className="role-full-section">
          <p>{active.fullSection}</p>
        </div>
      </div>
    </div>
  );
}

function fmtInline(t: string) {
  return t
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

// LLM sometimes returns text fields as objects ({30_Day: ..., 90_Day: ...}) — convert safely
function toStr(val: unknown): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return Object.entries(val as Record<string, unknown>)
      .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${String(v)}`)
      .join(' | ');
  }
  return String(val);
}

interface TranslatedData {
  title: string; summary: string; content: string;
  keyHighlights: string[]; whyItMatters: string; futurePrediction: string;
}

export default function ArticleTabs({ article, opportunities, competitorIntel, personalizedVersions }: Props) {
  const [tab, setTab] = useState<Tab>('article');
  const [translated, setTranslated] = useState<TranslatedData | null>(null);

  const displayArticle = translated
    ? { ...article, ...translated }
    : article;

  const tabs = [
    { id: 'article' as Tab, label: '📄 Analysis', always: true },
    { id: 'opportunities' as Tab, label: `💡 Opportunities${opportunities?.opportunities?.length ? ` (${opportunities.opportunities.length})` : ''}`, always: false },
    { id: 'competitor' as Tab, label: `🧩 Competitors${competitorIntel?.affectedCompetitors?.length ? ` (${competitorIntel.affectedCompetitors.length})` : ''}`, always: false },
    { id: 'personalized' as Tab, label: '🎯 Your Lens', always: false },
  ];

  return (
    <div className="article-tabs-wrap">
      <div className="article-tabs-header">
        <div className="article-tabs-nav">
          {tabs.map(t => (
            <button key={t.id} className={`article-tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <TranslateWidget
          article={article}
          onTranslated={setTranslated}
          isTranslated={!!translated}
        />
      </div>

      <div className="article-tab-content">
        {tab === 'article' && <ArticleSection article={displayArticle} />}
        {tab === 'opportunities' && <OpportunitiesSection data={opportunities} />}
        {tab === 'competitor' && <CompetitorSection data={competitorIntel} />}
        {tab === 'personalized' && <PersonalizedSection versions={personalizedVersions} />}
      </div>
    </div>
  );
}
