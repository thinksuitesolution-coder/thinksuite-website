'use client';
import { useState } from 'react';

const PERIODS = [
  { label: 'Daily', days: 1 },
  { label: 'Weekly', days: 7 },
  { label: 'Monthly', days: 30 },
  { label: 'Quarterly', days: 90 },
];

export default function ReportPage() {
  const [generating, setGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[1]);
  const [error, setError] = useState('');

  async function generateReport() {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/intelligence/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: selectedPeriod.label, days: selectedPeriod.days }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        setError(msg || 'Failed to generate report');
        return;
      }
      const html = await res.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ThinkSuite-AI-Report-${selectedPeriod.label}-${Date.now()}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #0c1445, #1a237e)' }}>
        <div className="container">
          <div className="chip" style={{ marginBottom: 16 }}>📊 AI Intelligence Reports</div>
          <h1 className="page-title" style={{ color: '#fff' }}>AI Industry Report Generator</h1>
          <p className="page-desc" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Generate comprehensive, analyst-grade AI industry reports powered by GPT-4o, covering top stories, trends, funding, research, and 90-day predictions.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="report-layout">
            <div className="report-generator-card">
              <h2>Generate Your Report</h2>
              <p className="report-desc">
                AI scans the latest articles, scores importance, detects trends, and writes a professional intelligence report in Gartner/Goldman Sachs style.
              </p>

              <div className="report-period-selector">
                <label>Report Period</label>
                <div className="report-period-options">
                  {PERIODS.map(p => (
                    <button
                      key={p.label}
                      className={`report-period-btn ${selectedPeriod.label === p.label ? 'active' : ''}`}
                      onClick={() => setSelectedPeriod(p)}
                    >
                      {p.label}
                      <span>{p.days} day{p.days > 1 ? 's' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="report-includes">
                <h3>Report includes:</h3>
                <ul>
                  <li>✅ Executive Summary (GPT-4o analyst narrative)</li>
                  <li>✅ Top {selectedPeriod.days <= 1 ? 15 : selectedPeriod.days <= 7 ? 30 : 50} high-impact stories ranked by AI score</li>
                  <li>✅ Category breakdown (Models, Funding, Research, Policy…)</li>
                  <li>✅ 90-day technology trend predictions</li>
                  <li>✅ Company activity analysis</li>
                  <li>✅ Professional PDF-ready HTML format</li>
                </ul>
              </div>

              {error && <div className="report-error">{error}</div>}

              <button
                className="report-generate-btn"
                onClick={generateReport}
                disabled={generating}
              >
                {generating ? (
                  <><span className="report-spinner" />Generating Report...</>
                ) : (
                  <>📊 Generate {selectedPeriod.label} Report</>
                )}
              </button>

              <p className="report-note">
                Report downloads as HTML, open in Chrome and use Print → Save as PDF for a polished PDF export.
              </p>
            </div>

            <div className="report-sidebar">
              <div className="report-feature-card">
                <div className="report-feature-icon">🤖</div>
                <h3>AI-Written Analysis</h3>
                <p>GPT-4o writes an executive summary in professional analyst style, not just bullet points.</p>
              </div>
              <div className="report-feature-card">
                <div className="report-feature-icon">📈</div>
                <h3>Trend Predictions</h3>
                <p>30/90/180-day growth predictions for emerging AI technologies based on signal frequency.</p>
              </div>
              <div className="report-feature-card">
                <div className="report-feature-icon">🎯</div>
                <h3>Importance Scoring</h3>
                <p>Every story is scored 0-100 for business impact, so you see what actually matters.</p>
              </div>
              <div className="report-feature-card">
                <div className="report-feature-icon">🌍</div>
                <h3>100+ Sources</h3>
                <p>RSS feeds, GitHub, ArXiv, HuggingFace, Google News, all aggregated automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 40 }}>What's in each edition?</h2>
          <div className="report-editions-grid">
            {PERIODS.map(p => (
              <div key={p.label} className="report-edition-card">
                <div className="report-edition-badge">{p.label}</div>
                <h3>{p.label} AI Intelligence Report</h3>
                <p>
                  {p.label === 'Daily' && 'Covering the last 24 hours of AI news. Best for staying on top of breaking developments.'}
                  {p.label === 'Weekly' && 'A 7-day comprehensive overview. The most popular edition, covers everything without overwhelm.'}
                  {p.label === 'Monthly' && '30 days of AI trends, funding, and research. Great for executive briefings and investor updates.'}
                  {p.label === 'Quarterly' && '90-day strategic intelligence with long-term trend predictions. Ideal for board presentations.'}
                </p>
                <div className="report-edition-meta">~{p.days <= 1 ? '10' : p.days <= 7 ? '20' : p.days <= 30 ? '40' : '80'}+ stories analyzed</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
