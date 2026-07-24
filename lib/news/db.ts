import { createClient, Client } from '@libsql/client';
import { BlogArticle } from './types';

// Turso (libSQL) is the sole store for the AI-news feature. It used to be a
// mirror of the news project's Firestore; Firestore was dropped entirely
// after that isolated project racked up a large surprise bill (Blaze plan
// pay-as-you-go, no ceiling). Turso's free tier has no such auto-upgrade —
// it just stops working past the cap instead of silently billing.
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

  // Article storage predates the Firestore cutover as an `archived_articles`
  // mirror table; rename it in place so existing data (every article
  // published since the real-time-mirror fix, plus the one-time backfill)
  // carries over with zero data movement.
  await client.execute(`ALTER TABLE archived_articles RENAME TO articles`).catch(() => {});

  await client.execute(`
    CREATE TABLE IF NOT EXISTS articles (
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
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at)`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status)`);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS processed_urls (
      url TEXT PRIMARY KEY,
      article_id TEXT,
      processed_at TEXT NOT NULL
    )
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_processed_urls_processed_at ON processed_urls(processed_at)`);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      email TEXT PRIMARY KEY,
      role TEXT,
      edition TEXT,
      subscribed_at TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1
    )
  `);

  _initialized = true;
}

// ─── ARTICLES ─────────────────────────────────────────────────────────────

export async function upsertArticle(article: Record<string, unknown>): Promise<void> {
  await ensureSchema();
  const client = getClient();
  const now = new Date().toISOString();

  await client.execute({
    sql: `INSERT INTO articles (id, slug, title, company, category, event_type, importance_score, status, published_at, archived_at, data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(slug) DO UPDATE SET data = excluded.data, status = excluded.status, archived_at = excluded.archived_at`,
    args: [
      String(article.id ?? ''),
      String(article.slug ?? ''),
      String(article.title ?? ''),
      (article.company as string) ?? null,
      (article.category as string) ?? null,
      (article.eventType as string) ?? null,
      (article.importanceScore as number) ?? 0,
      (article.status as string) ?? 'published',
      String(article.publishedAt ?? now),
      now,
      JSON.stringify(article),
    ],
  });
}

// Kept for the one bulk caller (cleanup purge path doesn't need this, but
// batch upserts are useful for one-off backfill/migration scripts).
export async function upsertArticles(articles: Record<string, unknown>[]): Promise<number> {
  if (articles.length === 0) return 0;
  await ensureSchema();
  const client = getClient();
  const now = new Date().toISOString();

  const batch = articles.map(a => ({
    sql: `INSERT INTO articles (id, slug, title, company, category, event_type, importance_score, status, published_at, archived_at, data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(slug) DO UPDATE SET data = excluded.data, status = excluded.status, archived_at = excluded.archived_at`,
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

export interface GetPublishedArticlesOpts {
  limit?: number;
  category?: string;
  company?: string;
}

// Single source of truth for the "give me published articles, newest first"
// query every read-side route used to build by hand-merging Firestore +
// Turso results in JS. Pushes status/category/company filtering into SQL.
export async function getPublishedArticles(opts: GetPublishedArticlesOpts = {}): Promise<BlogArticle[]> {
  await ensureSchema();
  const client = getClient();
  const { limit = 500, category, company } = opts;

  const clauses = [`status = 'published'`];
  const args: (string | number)[] = [];
  if (category) { clauses.push('category = ?'); args.push(category); }
  if (company)  { clauses.push('company = ?');  args.push(company); }
  args.push(limit);

  const result = await client.execute({
    sql: `SELECT data FROM articles WHERE ${clauses.join(' AND ')} ORDER BY published_at DESC LIMIT ?`,
    args,
  });
  return result.rows.map(row => JSON.parse(row.data as string) as BlogArticle);
}

export interface GetArticleBySlugOpts {
  publishedOnly?: boolean;
}

export async function getArticleBySlug(slug: string, opts: GetArticleBySlugOpts = {}): Promise<BlogArticle | null> {
  await ensureSchema();
  const client = getClient();
  const sql = opts.publishedOnly
    ? `SELECT data FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`
    : `SELECT data FROM articles WHERE slug = ? LIMIT 1`;
  const result = await client.execute({ sql, args: [slug] });
  if (result.rows.length === 0) return null;
  return JSON.parse(result.rows[0].data as string) as BlogArticle;
}

export async function purgeArticlesOlderThan(cutoffIso: string): Promise<number> {
  await ensureSchema();
  const client = getClient();
  const result = await client.execute({
    sql: `DELETE FROM articles WHERE published_at < ?`,
    args: [cutoffIso],
  });
  return Number(result.rowsAffected ?? 0);
}

// ─── PROCESSED URLS (pipeline dedup) ───────────────────────────────────────

export async function checkProcessedUrls(urls: string[]): Promise<Set<string>> {
  await ensureSchema();
  if (urls.length === 0) return new Set();
  const client = getClient();

  // SQLite comfortably handles hundreds of bind params per statement — chunk
  // at 500 as a safety margin rather than Firestore's old 30-item `in` cap.
  const existing = new Set<string>();
  for (let i = 0; i < urls.length; i += 500) {
    const chunk = urls.slice(i, i + 500);
    const placeholders = chunk.map(() => '?').join(',');
    const result = await client.execute({
      sql: `SELECT url FROM processed_urls WHERE url IN (${placeholders})`,
      args: chunk,
    });
    for (const row of result.rows) existing.add(row.url as string);
  }
  return existing;
}

export async function markUrlProcessed(url: string, articleId: string): Promise<void> {
  await ensureSchema();
  const client = getClient();
  await client.execute({
    sql: `INSERT INTO processed_urls (url, article_id, processed_at)
          VALUES (?, ?, ?)
          ON CONFLICT(url) DO UPDATE SET article_id = excluded.article_id, processed_at = excluded.processed_at`,
    args: [url, articleId, new Date().toISOString()],
  });
}

export async function purgeProcessedUrlsOlderThan(cutoffIso: string): Promise<number> {
  await ensureSchema();
  const client = getClient();
  const result = await client.execute({
    sql: `DELETE FROM processed_urls WHERE processed_at < ?`,
    args: [cutoffIso],
  });
  return Number(result.rowsAffected ?? 0);
}

// ─── NEWSLETTER SUBSCRIBERS ─────────────────────────────────────────────────

export interface Subscriber {
  email: string;
  role?: string;
  edition?: string;
  subscribedAt: string;
  active: boolean;
}

export async function getSubscriber(email: string): Promise<Subscriber | null> {
  await ensureSchema();
  const client = getClient();
  const result = await client.execute({
    sql: `SELECT email, role, edition, subscribed_at, active FROM newsletter_subscribers WHERE email = ? LIMIT 1`,
    args: [email],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    email: row.email as string,
    role: (row.role as string) ?? undefined,
    edition: (row.edition as string) ?? undefined,
    subscribedAt: row.subscribed_at as string,
    active: Number(row.active) === 1,
  };
}

export async function addSubscriber(email: string, role: string, edition: string): Promise<void> {
  await ensureSchema();
  const client = getClient();
  await client.execute({
    sql: `INSERT INTO newsletter_subscribers (email, role, edition, subscribed_at, active)
          VALUES (?, ?, ?, ?, 1)
          ON CONFLICT(email) DO UPDATE SET role = excluded.role, edition = excluded.edition, active = 1`,
    args: [email, role, edition, new Date().toISOString()],
  });
}

export async function deactivateSubscriber(email: string): Promise<void> {
  await ensureSchema();
  const client = getClient();
  await client.execute({
    sql: `UPDATE newsletter_subscribers SET active = 0 WHERE email = ?`,
    args: [email],
  });
}

export async function getActiveSubscribers(edition?: string): Promise<Subscriber[]> {
  await ensureSchema();
  const client = getClient();
  const sql = edition
    ? `SELECT email, role, edition, subscribed_at, active FROM newsletter_subscribers WHERE active = 1 AND edition = ?`
    : `SELECT email, role, edition, subscribed_at, active FROM newsletter_subscribers WHERE active = 1`;
  const result = await client.execute({ sql, args: edition ? [edition] : [] });
  return result.rows.map(row => ({
    email: row.email as string,
    role: (row.role as string) ?? undefined,
    edition: (row.edition as string) ?? undefined,
    subscribedAt: row.subscribed_at as string,
    active: Number(row.active) === 1,
  }));
}
