import { BlogArticle } from '../news/types';

const TELEGRAM_API = 'https://api.telegram.org';

function formatTelegramMessage(article: BlogArticle): string {
  const emoji: Record<string, string> = {
    model_release:  '🚀',
    research_paper: '🧪',
    funding:        '💰',
    acquisition:    '🤝',
    open_source:    '📂',
    api_release:    '⚡',
    product_launch: '🎯',
    breaking_news:  '🔴',
    keynote:        '🎤',
    github_release: '💻',
    general:        '📰',
  };

  const icon = emoji[article.eventType] || '📰';
  const score = article.importanceScore >= 80 ? '🔥' : article.importanceScore >= 65 ? '⭐' : '';
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`;

  return `${icon} <b>${article.title}</b>

${score} <i>Impact Score: ${article.importanceScore}/100</i>

${article.summary}

🏢 <b>${article.company}</b> | 📂 ${article.category}

${article.keyHighlights?.slice(0, 3).map(h => `• ${h}`).join('\n')}

🔗 <a href="${url}">Read Full Analysis →</a>

<i>ThinkSuite AI Intelligence</i>`;
}

export async function postToTelegram(article: BlogArticle): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  if (!botToken || !channelId) return false;

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channelId,
        text: formatTelegramMessage(article),
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    return res.ok;
  } catch {
    return false;
  }
}

export async function sendTelegramAlert(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;
  if (!botToken || !channelId) return false;

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: channelId, text: message, parse_mode: 'HTML' }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
