import { NextRequest, NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';
import { getPublishedArticles, getActiveSubscribers } from '@/lib/news/db';
import { generateNewsletter, NewsletterEdition, NewsletterRole } from '@/lib/news/newsletter';
import { sendNewsletterEmail } from '@/lib/newsletterMailer';
import { BlogArticle } from '@/lib/news/types';

export const runtime = 'nodejs';
export const maxDuration = 300;

async function getRecentArticles(edition: NewsletterEdition): Promise<BlogArticle[]> {
  const cutoff = new Date(Date.now() - (edition === 'daily' ? 864e5 : 864e5 * 7)).toISOString();
  return (await getPublishedArticles({ limit: 300 }))
    .filter((a) => a.publishedAt >= cutoff)
    .slice(0, 30);
}

async function sendAllNewsletters() {
  // Weekly edition only goes out once a week (Monday); daily runs every day this
  // cron fires. Both share one cron trigger to stay within a single daily job.
  const editions: NewsletterEdition[] = new Date().getUTCDay() === 1 ? ['daily', 'weekly'] : ['daily'];

  const subscribers = (await getActiveSubscribers()) as { email: string; role?: NewsletterRole; edition?: NewsletterEdition }[];

  let sent = 0;
  let failed = 0;

  for (const edition of editions) {
    const articles = await getRecentArticles(edition).catch(() => []);
    if (articles.length === 0) continue;

    const group = subscribers.filter((s) => (s.edition || 'daily') === edition);
    const byRole = new Map<NewsletterRole, typeof group>();
    for (const s of group) {
      const role = s.role || 'general';
      if (!byRole.has(role)) byRole.set(role, []);
      byRole.get(role)!.push(s);
    }

    for (const [role, roleSubs] of byRole) {
      const newsletter = await generateNewsletter(articles, edition, role).catch(() => null);
      if (!newsletter) continue;

      for (const sub of roleSubs) {
        try {
          await sendNewsletterEmail(sub.email, newsletter.subject, newsletter.htmlContent, newsletter.plainText);
          sent++;
        } catch (err) {
          console.error(`[send-newsletter] Failed for ${sub.email}:`, (err as Error).message);
          failed++;
        }
      }
    }
  }

  console.log(`[send-newsletter] Done. Sent: ${sent}, Failed: ${failed}`);
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const querySecret = req.nextUrl.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;
  const provided = querySecret ?? authHeader?.replace('Bearer ', '') ?? '';

  if (cronSecret && provided !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  waitUntil(sendAllNewsletters().catch((e) => console.error('[send-newsletter] Error:', e.message)));

  return NextResponse.json({ status: 'started' });
}
