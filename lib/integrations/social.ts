import { BlogArticle } from '../news/types';

// LinkedIn via official API
export async function postToLinkedIn(article: BlogArticle): Promise<boolean> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const orgId = process.env.LINKEDIN_ORG_ID;
  if (!token || !orgId) return false;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`;
  const text = `${article.title}\n\n${article.summary}\n\n🔗 ${url}\n\n#AI #ArtificialIntelligence #${article.company?.replace(/\s/g, '')} #${article.category?.replace(/\s/g, '')}`;

  try {
    const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: `urn:li:organization:${orgId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text },
            shareMediaCategory: 'ARTICLE',
            media: [{
              status: 'READY',
              description: { text: article.summary },
              originalUrl: url,
              title: { text: article.title },
            }],
          },
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// WhatsApp Business Cloud API
export async function postToWhatsApp(article: BlogArticle): Promise<boolean> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const groupId = process.env.WHATSAPP_GROUP_ID;
  if (!token || !phoneId || !groupId) return false;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`;
  const text = `🤖 *AI News Alert*\n\n*${article.title}*\n\n${article.summary}\n\n🏢 ${article.company} | Impact: ${article.importanceScore}/100\n\n🔗 ${url}`;

  try {
    const res = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: groupId,
        type: 'text',
        text: { body: text },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Discord Webhook
export async function postToDiscord(article: BlogArticle): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`;
  const colorMap: Record<string, number> = {
    model_release: 0x2563EB,
    research_paper: 0x7C3AED,
    funding: 0xD97706,
    breaking_news: 0xDC2626,
    open_source: 0x059669,
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'ThinkSuite AI News',
        avatar_url: 'https://thinksuite.in/assets/img/favicon.svg',
        embeds: [{
          title: article.title,
          description: article.summary,
          url,
          color: colorMap[article.eventType] || 0x2563EB,
          fields: [
            { name: 'Company', value: article.company, inline: true },
            { name: 'Category', value: article.category, inline: true },
            { name: 'Impact Score', value: `${article.importanceScore}/100`, inline: true },
          ],
          footer: { text: 'ThinkSuite AI Intelligence' },
          timestamp: article.publishedAt,
        }],
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Slack Webhook
export async function postToSlack(article: BlogArticle): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`;

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: `🤖 AI News: ${article.company}` } },
          { type: 'section', text: { type: 'mrkdwn', text: `*<${url}|${article.title}>*\n${article.summary}` } },
          {
            type: 'context',
            elements: [
              { type: 'mrkdwn', text: `📂 ${article.category} | 🏢 ${article.company} | ⭐ ${article.importanceScore}/100` },
            ],
          },
        ],
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function broadcastToAllChannels(article: BlogArticle): Promise<void> {
  // Only broadcast high-importance articles
  if (article.importanceScore < 70) return;

  await Promise.allSettled([
    postToLinkedIn(article),
    postToWhatsApp(article),
    postToDiscord(article),
    postToSlack(article),
  ]);
}
