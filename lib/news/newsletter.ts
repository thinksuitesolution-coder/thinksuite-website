import OpenAI from 'openai';
import { BlogArticle } from './types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'build-placeholder' });

export type NewsletterEdition = 'daily' | 'weekly';
export type NewsletterRole = 'general' | 'developer' | 'founder' | 'investor';

export interface Newsletter {
  subject: string;
  previewText: string;
  htmlContent: string;
  plainText: string;
  edition: NewsletterEdition;
  role: NewsletterRole;
  articleCount: number;
  generatedAt: string;
}

function buildNewsletterPrompt(
  articles: BlogArticle[],
  edition: NewsletterEdition,
  role: NewsletterRole
): string {
  const roleContext: Record<NewsletterRole, string> = {
    general: 'general AI enthusiasts and professionals',
    developer: 'software developers and engineers building with AI',
    founder: 'startup founders and entrepreneurs in the AI space',
    investor: 'venture capitalists and angel investors focused on AI',
  };

  const topArticles = articles
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, edition === 'daily' ? 5 : 10);

  const articleSummaries = topArticles.map((a, i) =>
    `${i + 1}. [${a.importanceScore}/100] ${a.title}\n   Company: ${a.company} | ${a.category}\n   ${a.summary}`
  ).join('\n\n');

  return `You are writing a ${edition} AI news newsletter for ${roleContext[role]}.

Top AI stories from the past ${edition === 'daily' ? '24 hours' : 'week'}:

${articleSummaries}

Write an engaging newsletter as JSON:
{
  "subject": "Compelling email subject line (under 60 chars)",
  "previewText": "Preview text shown in email client (under 100 chars)",
  "intro": "2-3 sentence opening that captures the week/day's AI narrative",
  "sections": [
    {
      "headline": "Section headline",
      "story": "2-3 paragraph section about this story",
      "whyItMatters": "One sentence on why ${role}s should care"
    }
  ],
  "quickBites": ["Short one-liner news item 1", "Short one-liner 2", "Short one-liner 3"],
  "trendOfThe${edition === 'daily' ? 'Day' : 'Week'}": "One emerging trend to watch",
  "closing": "Brief, inspiring closing paragraph"
}`;
}

function buildHTML(
  data: Record<string, unknown>,
  articles: BlogArticle[],
  edition: NewsletterEdition,
  role: NewsletterRole
): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thinksuite.in';
  const sections = (data.sections as { headline: string; story: string; whyItMatters: string }[]) || [];
  const quickBites = (data.quickBites as string[]) || [];
  const topArticles = articles.slice(0, edition === 'daily' ? 5 : 10);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{font-family:'Segoe UI',Arial,sans-serif;background:#f6f8ff;margin:0;padding:0}
  .wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(37,99,235,0.08)}
  .header{background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:32px 32px 24px;color:#fff;text-align:center}
  .header h1{font-size:22px;margin:0 0 6px;font-weight:800}
  .header p{font-size:13px;opacity:.8;margin:0}
  .badge{display:inline-block;background:rgba(255,255,255,0.2);border-radius:100px;padding:4px 12px;font-size:11px;font-weight:700;text-transform:uppercase;margin-bottom:12px}
  .content{padding:28px 32px}
  .intro{font-size:16px;line-height:1.7;color:#334155;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #e2e8f0}
  .story-card{background:#f6f8ff;border-radius:10px;padding:20px;margin-bottom:16px;border-left:4px solid #2563eb}
  .story-card h3{font-size:16px;font-weight:700;color:#0f172a;margin:0 0 10px}
  .story-card p{font-size:14px;line-height:1.6;color:#475569;margin:0 0 10px}
  .why-matters{font-size:12px;color:#2563eb;font-weight:600;border-top:1px solid #e2e8f0;padding-top:8px;margin-top:10px}
  .articles-grid{margin:24px 0}
  .article-row{display:flex;gap:12px;margin-bottom:12px;padding:14px;background:#f8faff;border-radius:8px;border:1px solid #e2e8f0}
  .article-score{background:#2563eb;color:#fff;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:700;white-space:nowrap;height:fit-content;font-family:monospace}
  .article-info h4{font-size:14px;font-weight:600;color:#0f172a;margin:0 0 4px}
  .article-info p{font-size:12px;color:#64748b;margin:0}
  .article-link{color:#2563eb;font-size:12px;font-weight:600;text-decoration:none}
  .quick-bites{background:#fef3c7;border-radius:10px;padding:20px;margin:24px 0}
  .quick-bites h3{font-size:14px;font-weight:700;color:#92400e;margin:0 0 12px}
  .quick-bites ul{margin:0;padding-left:18px}
  .quick-bites li{font-size:13px;color:#78350f;margin-bottom:6px;line-height:1.5}
  .trend-box{background:linear-gradient(135deg,#7c3aed11,#2563eb11);border:1px solid #7c3aed33;border-radius:10px;padding:20px;margin:24px 0;text-align:center}
  .trend-box h3{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#7c3aed;margin:0 0 8px}
  .trend-box p{font-size:15px;font-weight:600;color:#0f172a;margin:0}
  .cta{background:#1d4ed8;border-radius:10px;padding:24px;text-align:center;margin:24px 0}
  .cta p{color:rgba(255,255,255,0.85);font-size:14px;margin:0 0 14px}
  .cta a{background:#fff;color:#1d4ed8;border-radius:8px;padding:10px 24px;font-weight:700;font-size:14px;text-decoration:none;display:inline-block}
  .footer{padding:24px 32px;border-top:1px solid #e2e8f0;text-align:center}
  .footer p{font-size:11px;color:#94a3b8;margin:4px 0}
  .footer a{color:#2563eb}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="badge">${edition === 'daily' ? 'Daily' : 'Weekly'} ${role !== 'general' ? role.charAt(0).toUpperCase() + role.slice(1) + ' ' : ''}Edition</div>
    <h1>ThinkSuite AI Intelligence</h1>
    <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
  <div class="content">
    <p class="intro">${data.intro || ''}</p>

    ${sections.map(s => `
    <div class="story-card">
      <h3>${s.headline}</h3>
      <p>${s.story}</p>
      <div class="why-matters">💡 Why it matters: ${s.whyItMatters}</div>
    </div>`).join('')}

    <div class="articles-grid">
      <h3 style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:12px;">🔗 Top Stories</h3>
      ${topArticles.map(a => `
      <div class="article-row">
        <div class="article-score">${a.importanceScore}</div>
        <div class="article-info">
          <h4>${a.title}</h4>
          <p>${a.company} · ${a.category}</p>
          <a href="${siteUrl}/blog/${a.slug}" class="article-link">Read Analysis →</a>
        </div>
      </div>`).join('')}
    </div>

    ${quickBites.length > 0 ? `
    <div class="quick-bites">
      <h3>⚡ Quick Bites</h3>
      <ul>${quickBites.map(b => `<li>${b}</li>`).join('')}</ul>
    </div>` : ''}

    ${data[`trendOfThe${edition === 'daily' ? 'Day' : 'Week'}`] ? `
    <div class="trend-box">
      <h3>📈 Trend of the ${edition === 'daily' ? 'Day' : 'Week'}</h3>
      <p>${data[`trendOfThe${edition === 'daily' ? 'Day' : 'Week'}`]}</p>
    </div>` : ''}

    <p style="font-size:15px;line-height:1.7;color:#475569">${data.closing || ''}</p>

    <div class="cta">
      <p>Read all analysis, explore company profiles, and track AI trends in real-time.</p>
      <a href="${siteUrl}/blog">Open Intelligence Dashboard →</a>
    </div>
  </div>
  <div class="footer">
    <p><strong>ThinkSuite AI Intelligence</strong></p>
    <p>Automatically generated by AI | <a href="${siteUrl}/blog">Visit Platform</a></p>
    <p style="margin-top:8px;font-size:10px">You're receiving this because you subscribed to ThinkSuite AI updates.</p>
  </div>
</div>
</body>
</html>`;
}

export async function generateNewsletter(
  articles: BlogArticle[],
  edition: NewsletterEdition = 'daily',
  role: NewsletterRole = 'general'
): Promise<Newsletter> {
  if (articles.length === 0) {
    return {
      subject: 'Your AI News Digest',
      previewText: 'No new stories today',
      htmlContent: '<p>No new articles today.</p>',
      plainText: 'No new articles today.',
      edition,
      role,
      articleCount: 0,
      generatedAt: new Date().toISOString(),
    };
  }

  try {
    const prompt = buildNewsletterPrompt(articles, edition, role);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content || '{}';
    const data = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());

    const htmlContent = buildHTML(data, articles, edition, role);
    const plainText = `${data.subject}\n\n${data.intro}\n\n${(data.sections || []).map((s: { headline: string; story: string }) => `${s.headline}\n${s.story}`).join('\n\n')}`;

    return {
      subject: data.subject || 'Your AI News Digest',
      previewText: data.previewText || '',
      htmlContent,
      plainText,
      edition,
      role,
      articleCount: articles.length,
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Newsletter generation failed:', (err as Error).message);
    return {
      subject: `AI News Digest, ${new Date().toLocaleDateString()}`,
      previewText: `${articles.length} AI stories from today`,
      htmlContent: buildHTML({}, articles, edition, role),
      plainText: articles.map(a => `${a.title}\n${a.summary}`).join('\n\n'),
      edition,
      role,
      articleCount: articles.length,
      generatedAt: new Date().toISOString(),
    };
  }
}
