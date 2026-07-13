import { createClient, Client } from '@libsql/client';
import { BlogArticle } from './types';

let _client: Client | null = null;
let _initialized = false;

function getClient(): Client {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) throw new Error('TURSO_DATABASE_URL is not set');
  _client = createClient({ url, authToken });
  return _client;
}

async function ensureSchema(): Promise<void> {
  if (_initialized) return;
  const client = getClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS archived_articles (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      company TEXT,
      category TEXT,
      event_type TEXT,
      importance_score INTEGER,
      status TEXT,
      published_at TEXT NOT NULL,
      archived_at TEXT NOT NULL,
      data TEXT NOT NULL
    )
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_archived_published_at ON archived_articles(published_at)`);
  _initialized = true;
}

// Moves a batch of Firestore articles into the Turso archive. Full article
// (including seo/opportunities/competitorIntel/etc.) is kept as JSON in `data`;
// the other columns exist only so we can filter/sort without parsing JSON.
export async function archiveArticles(articles: Record<string, unknown>[]): Promise<number> {
  if (articles.length === 0) return 0;
  await ensureSchema();
  const client = getClient();
  const now = new Date().toISOString();

  const batch = articles.map(a => ({
    sql: `INSERT INTO archived_articles (id, slug, title, company, category, event_type, importance_score, status, published_at, archived_at, data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(slug) DO UPDATE SET data = excluded.data`,
    args: [
      String(a.id ?? ''),
      String(a.slug ?? ''),
      String(a.title ?? ''),
      (a.company as string) ?? null,
      (a.category as string) ?? null,
      (a.eventType as string) ?? null,
      (a.importanceScore as number) ?? 0,
      (a.status as string) ?? 'published',
      String(a.publishedAt ?? now),
      now,
      JSON.stringify(a),
    ],
  }));

  await client.batch(batch, 'write');
  return articles.length;
}

export async function getArchivedArticleBySlug(slug: string): Promise<BlogArticle | null> {
  await ensureSchema();
  const client = getClient();
  const result = await client.execute({
    sql: `SELECT data FROM archived_articles WHERE slug = ? LIMIT 1`,
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  return JSON.parse(result.rows[0].data as string) as BlogArticle;
}

// Deletes archived articles published before `cutoffIso`. Called by the daily
// cleanup cron to enforce the 3-month archive retention window.
export async function purgeArchivedOlderThan(cutoffIso: string): Promise<number> {
  await ensureSchema();
  const client = getClient();
  const result = await client.execute({
    sql: `DELETE FROM archived_articles WHERE published_at < ?`,
    args: [cutoffIso],
  });
  return Number(result.rowsAffected ?? 0);
}
