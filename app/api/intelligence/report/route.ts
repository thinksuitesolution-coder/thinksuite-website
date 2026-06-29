import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { articlesCol } from '@/lib/firebase-admin';
import { generateTrendReport } from '@/lib/news/pipeline/trends';
import { BlogArticle } from '@/lib/news/types';

const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'build-placeholder' });

async function generateReportNarrative(articles: BlogArticle[], trends: unknown): Promise<string> {
  const topStories = articles
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 10)
    .map(a => `- ${a.title} (${a.company}, Score: ${a.importanceScore})`)
    .join('\n');

  const prompt = `You are writing a professional AI Industry Intelligence Report.

Top AI stories this period:
${topStories}

Write a comprehensive 600-word executive summary with sections:
1. Executive Summary (key trends this period)
2. Model & Product Landscape (what was released)
3. Funding & Investment (capital flows)
4. Research Breakthroughs (important papers)
5. Market Implications (what it means for businesses)
6. 90-Day Outlook (what's coming next)

Write in professional analyst style like Goldman Sachs or Gartner reports. Be specific with data.`;

  const completion = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1200,
  });

  return completion.choices[0].message.content || '';
}

function buildReportHTML(
  articles: BlogArticle[],
  narrative: string,
  trends: Record<string, unknown>,
  period: string
): string {
  const topArticles = articles.sort((a, b) => b.importanceScore - a.importanceScore).slice(0, 15);
  const byCategory: Record<string, BlogArticle[]> = {};
  articles.forEach(a => {
    if (!byCategory[a.category]) byCategory[a.category] = [];
    byCategory[a.category].push(a);
  });

  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>ThinkSuite AI Intelligence Report, ${period}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',sans-serif;color:#0f172a;background:#fff;font-size:14px;line-height:1.6}
  .cover{background:linear-gradient(135deg,#1d4ed8,#7c3aed);min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:80px 60px;color:#fff;page-break-after:always}
  .cover-label{font-size:12px;text-transform:uppercase;letter-spacing:2px;opacity:.7;margin-bottom:24px}
  .cover-title{font-size:52px;font-weight:800;line-height:1.1;margin-bottom:20px}
  .cover-sub{font-size:20px;opacity:.85;margin-bottom:40px}
  .cover-meta{display:flex;gap:40px;font-size:13px;border-top:1px solid rgba(255,255,255,0.2);padding-top:24px}
  .cover-meta div strong{display:block;font-size:18px;font-weight:700}
  .section{padding:48px 60px;border-bottom:1px solid #e2e8f0}
  .section-header{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#2563eb;font-weight:700;margin-bottom:12px}
  .section-title{font-size:28px;font-weight:800;color:#0f172a;margin-bottom:24px}
  .narrative{font-size:15px;line-height:1.8;color:#334155;white-space:pre-wrap}
  .stories-table{width:100%;border-collapse:collapse;margin-top:16px}
  .stories-table th{background:#f8faff;padding:10px 14px;text-align:left;font-size:12px;font-weight:700;color:#475569;border-bottom:2px solid #e2e8f0}
  .stories-table td{padding:10px 14px;border-bottom:1px solid #f1f5f9;vertical-align:top}
  .stories-table tr:hover td{background:#f8faff}
  .score-badge{display:inline-block;background:#2563eb;color:#fff;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:700;font-family:monospace}
  .score-high{background:#dc2626}
  .score-med{background:#d97706}
  .cat-section{margin-bottom:24px}
  .cat-title{font-size:16px;font-weight:700;color:#0f172a;margin-bottom:8px;padding-bottom:8px;border-bottom:2px solid #2563eb}
  .cat-count{font-size:12px;color:#64748b;font-weight:400;margin-left:8px}
  .trend-item{display:flex;align-items:center;gap:12px;padding:10px;background:#f8faff;border-radius:8px;margin-bottom:6px}
  .trend-name{flex:1;font-weight:600}
  .trend-growth{color:#059669;font-weight:700;font-size:16px;min-width:60px;text-align:right}
  .trend-rec{font-size:11px;padding:2px 8px;border-radius:100px;font-weight:600}
  .footer-section{padding:32px 60px;background:#f8faff;text-align:center}
  .footer-section p{font-size:12px;color:#94a3b8}
  @media print{.section{page-break-inside:avoid}.cover{min-height:auto}}
</style>
</head>
<body>

<div class="cover">
  <div class="cover-label">ThinkSuite AI Intelligence</div>
  <div class="cover-title">AI Industry<br>Intelligence Report</div>
  <div class="cover-sub">${period} Edition</div>
  <div class="cover-meta">
    <div><strong>${topArticles.length}</strong>Stories Analyzed</div>
    <div><strong>${Object.keys(byCategory).length}</strong>Categories</div>
    <div><strong>${(trends as { topTrends?: unknown[] })?.topTrends?.length || 0}</strong>Trends Tracked</div>
    <div><strong>${now}</strong>Generated</div>
  </div>
</div>

<div class="section">
  <div class="section-header">Executive Analysis</div>
  <div class="section-title">AI Industry Overview</div>
  <div class="narrative">${narrative}</div>
</div>

<div class="section">
  <div class="section-header">Top Stories</div>
  <div class="section-title">High-Impact Events (${topArticles.length})</div>
  <table class="stories-table">
    <thead>
      <tr><th>#</th><th>Story</th><th>Company</th><th>Category</th><th>Score</th></tr>
    </thead>
    <tbody>
      ${topArticles.map((a, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${a.title}</strong><br><span style="color:#64748b;font-size:12px">${a.summary?.slice(0, 80)}...</span></td>
        <td>${a.company}</td>
        <td>${a.category}</td>
        <td><span class="score-badge ${a.importanceScore >= 80 ? 'score-high' : a.importanceScore >= 65 ? 'score-med' : ''}">${a.importanceScore}</span></td>
      </tr>`).join('')}
    </tbody>
  </table>
</div>

<div class="section">
  <div class="section-header">Category Breakdown</div>
  <div class="section-title">Activity by Category</div>
  ${Object.entries(byCategory).sort((a, b) => b[1].length - a[1].length).map(([cat, arts]) => `
  <div class="cat-section">
    <div class="cat-title">${cat}<span class="cat-count">${arts.length} stories</span></div>
    ${arts.slice(0, 3).map(a => `<div style="font-size:13px;padding:4px 0;color:#475569">• ${a.title} <span style="color:#94a3b8">(${a.company})</span></div>`).join('')}
    ${arts.length > 3 ? `<div style="font-size:12px;color:#94a3b8;margin-top:4px">...and ${arts.length - 3} more</div>` : ''}
  </div>`).join('')}
</div>

${(trends as { topTrends?: Array<{ technology: string; predictedGrowth90d: number; investmentRecommendation: string }> })?.topTrends?.length ? `
<div class="section">
  <div class="section-header">Trend Analysis</div>
  <div class="section-title">90-Day Predictions</div>
  ${(trends as { topTrends: Array<{ technology: string; predictedGrowth90d: number; investmentRecommendation: string }> }).topTrends.map(t => `
  <div class="trend-item">
    <div class="trend-name">${t.technology}</div>
    <span class="trend-rec" style="background:#dbeafe;color:#1d4ed8">${t.investmentRecommendation.replace('_',' ')}</span>
    <div class="trend-growth">+${t.predictedGrowth90d}%</div>
  </div>`).join('')}
</div>` : ''}

<div class="footer-section">
  <p><strong>ThinkSuite AI Intelligence Report</strong>, Generated automatically by AI</p>
  <p>thinksuite.in/intelligence | Generated: ${now}</p>
  <p style="margin-top:8px">This report is for informational purposes only. Not investment advice.</p>
</div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const { period = 'Weekly', days = 7 } = await req.json();

  try {
    const cutoff = new Date(Date.now() - days * 864e5).toISOString();
    const snap = await articlesCol()
      .where('status', '==', 'published')
      .where('publishedAt', '>=', cutoff)
      .orderBy('publishedAt', 'desc')
      .limit(100)
      .get();

    const articles = snap.docs.map(d => d.data() as BlogArticle);
    if (articles.length === 0) {
      return NextResponse.json({ error: 'No articles found for this period' }, { status: 404 });
    }

    const titles = articles.map(a => a.title);
    const [narrative, trends] = await Promise.all([
      generateReportNarrative(articles, null),
      generateTrendReport(titles, '90d'),
    ]);

    const html = buildReportHTML(articles, narrative, trends as unknown as Record<string, unknown>, period);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="ThinkSuite-AI-Report-${period}-${Date.now()}.html"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
