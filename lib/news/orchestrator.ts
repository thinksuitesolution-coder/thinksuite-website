import { fetchAllRSSSources } from './collectors/rss';
import { fetchGitHubEvents } from './collectors/github';
import { fetchArxivPapers } from './collectors/arxiv';
import { fetchHuggingFaceReleases, fetchHuggingFaceSpaces } from './collectors/huggingface';
import { fetchDataForSEONews } from './collectors/dataforseo';
import { fetchSerperNews } from './collectors/serper';
import { fetchTwitterViaSearch } from './collectors/twitter';
import { scoreEvent, filterLowImportance } from './pipeline/detector';
import { deduplicateEvents, filterAlreadyProcessed } from './pipeline/deduplicator';
import { factCheckEvent, shouldPublish } from './pipeline/fact-checker';
import { generateBlogArticle } from './pipeline/writer';
import { generateSEOPackage } from './pipeline/seo';
import { detectOpportunities } from './pipeline/opportunities';
import { generateCompetitorIntelligence } from './pipeline/competitor-intel';
import { generatePersonalizedVersions } from './pipeline/personalized-versions';
import { generateImages } from './pipeline/image-generator';
import { translateArticleToAllLanguages } from './pipeline/multilang';
import { processAndPublishEvents, getProcessedUrls } from './pipeline/publisher';
import { postToTelegram } from '../integrations/telegram';
import { broadcastToAllChannels } from '../integrations/social';
import { NEWS_SOURCES } from './sources';
import { RSS_SOURCES as CRAWLER_RSS_SOURCES, SOURCE_STATS } from '../crawler/sources';
import { DedupEngine } from '../crawler/dedup-engine';
import { computeFreshness, detectTrends } from '../crawler/ranking-engine';
import { RawEvent, ScoredEvent, BlogArticle } from './types';

export interface PipelineResult {
  collected: number;
  afterScoring: number;
  afterDedup: number;
  afterFactCheck: number;
  afterProcessedFilter: number;
  published: number;
  failed: number;
  broadcasted: number;
  durationMs: number;
}

// ─── FIRECRAWL ENRICHMENT ────────────────────────────────────────────────────
// Only called for high-importance events (score >= 70) where RSS snippet is too short.
// This saves API cost — we don't crawl every URL, only the best ones.
async function enrichWithFirecrawl(event: ScoredEvent): Promise<string> {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key || !event.url) return event.content;

  // Skip if we already have enough content (>800 chars from RSS)
  if (event.content.length > 800) return event.content;

  try {
    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: event.url,
        formats: ['markdown'],
        onlyMainContent: true,
        excludeTags: ['nav', 'footer', 'header', 'aside', '.sidebar', '.ad', '.advertisement'],
        timeout: 15000,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) return event.content;
    const data = await res.json();
    const markdown = data?.data?.markdown || '';
    if (markdown.length > 200) {
      return markdown.slice(0, 4000); // cap to control writer token cost
    }
  } catch {
    // Firecrawl failed — use RSS content, no problem
  }
  return event.content;
}

// ─── PUBLISH ENRICHED ARTICLE ────────────────────────────────────────────────
async function enrichAndPublishArticle(article: BlogArticle, event: ScoredEvent): Promise<void> {
  const { articlesCol, processedUrlsCol } = await import('../firebase-admin');

  // SEO package
  const seoPackage = await generateSEOPackage(article).catch(() => null);
  if (seoPackage) {
    article.metaTitle = seoPackage.metaTitle;
    article.metaDescription = seoPackage.metaDescription;
  }

  // Tier-based enrichment to save API cost:
  // Score 80+ → full enrichment (opportunities + competitors + personalized + images + translations)
  // Score 65–79 → opportunities + images only
  // Score 50–64 → just images
  const score = event.importanceScore;

  const [opportunities, competitorIntel, personalizedVersions, images, translations] = await Promise.all([
    score >= 65 ? detectOpportunities(event).catch(() => null) : Promise.resolve(null),
    score >= 80 ? generateCompetitorIntelligence(event).catch(() => null) : Promise.resolve(null),
    score >= 80 ? generatePersonalizedVersions(article).catch(() => []) : Promise.resolve([]),
    score >= 55 ? generateImages(article, event).catch(() => null) : Promise.resolve(null),
    score >= 85 ? translateArticleToAllLanguages(article).catch(() => ({})) : Promise.resolve({}),
  ]);

  // Image priority: RSS original → DALL-E/Unsplash from image-generator
  // Only replace if the article doesn't already have a real source image
  const hasRealSourceImage = article.heroImageUrl && !article.heroImageUrl.includes('picsum')
    && !article.heroImageUrl.includes('unsplash') && article.heroImageCredit
    && !article.heroImageCredit.includes('Picsum');
  if (images?.heroImageUrl && !hasRealSourceImage) {
    article.heroImageUrl = images.heroImageUrl;
    article.heroImageCredit = images.heroImageCredit;
    article.heroImageSourceUrl = images.heroImageSourceUrl;
  }

  await articlesCol().doc(article.id).set({
    ...article,
    seo: seoPackage || {},
    opportunities: opportunities || null,
    competitorIntel: competitorIntel || null,
    personalizedVersions: personalizedVersions || [],
    images: images || null,
    translations: translations || {},
  });

  await processedUrlsCol()
    .doc(Buffer.from(article.originalUrl).toString('base64').slice(0, 100))
    .set({ url: article.originalUrl, articleId: article.id, processedAt: new Date().toISOString() });
}

// ─── MAIN PIPELINE ────────────────────────────────────────────────────────────
export async function runNewsPipeline(): Promise<PipelineResult> {
  const start = Date.now();
  console.log('🚀 Starting AI Intelligence Pipeline...');

  // STEP 1: Collect from all RSS + GitHub + ArXiv + HuggingFace + DataForSEO + Serper + Twitter in parallel
  const [rssEvents, githubEvents, arxivPapers, hfModels, hfSpaces, dfsNews, serperNews, twitterPosts] = await Promise.all([
    fetchAllRSSSources(NEWS_SOURCES),
    fetchGitHubEvents(),
    fetchArxivPapers(),
    fetchHuggingFaceReleases(),
    fetchHuggingFaceSpaces(),
    fetchDataForSEONews().catch(() => []),
    fetchSerperNews().catch(() => []),
    fetchTwitterViaSearch().catch(() => []),
  ]);

  const allRaw: RawEvent[] = [
    ...rssEvents, ...githubEvents, ...arxivPapers, ...hfModels, ...hfSpaces, ...dfsNews, ...serperNews, ...twitterPosts,
  ];
  console.log(`📦 Collected: ${allRaw.length} raw events`);

  // STEP 1.5: Keep only real-time news — last 48 hours. Items with no parseable
  // date are kept (some feeds omit it) rather than dropped.
  const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
  const cutoff = Date.now() - FORTY_EIGHT_HOURS_MS;
  const fresh = allRaw.filter(e => {
    const t = new Date(e.publishedAt).getTime();
    return Number.isNaN(t) || t >= cutoff;
  });
  console.log(`🕐 After 48h freshness filter: ${fresh.length} (dropped ${allRaw.length - fresh.length} stale)`);

  // STEP 2: Score every event (no API cost — pure keyword scoring)
  const scored: ScoredEvent[] = fresh.map(e => scoreEvent(e));
  const filtered = filterLowImportance(scored, 40); // drop anything below 40
  console.log(`📊 After scoring: ${filtered.length} pass threshold`);

  // STEP 3: Deduplicate using Jaccard similarity + URL matching (no API cost)
  const deduplicated = deduplicateEvents(filtered);
  console.log(`🔁 After dedup: ${deduplicated.length} unique`);

  // STEP 4: Filter URLs already processed in Firebase (no API cost)
  const processedUrls = await getProcessedUrls();
  const newEvents = filterAlreadyProcessed(deduplicated, processedUrls);
  console.log(`✨ New events to process: ${newEvents.length}`);

  if (newEvents.length === 0) {
    return {
      collected: allRaw.length, afterScoring: filtered.length,
      afterDedup: deduplicated.length, afterFactCheck: 0,
      afterProcessedFilter: 0, published: 0, failed: 0, broadcasted: 0,
      durationMs: Date.now() - start,
    };
  }

  // STEP 5: Take only top 15 by importance score (save fact-check API calls)
  const topEvents = newEvents
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 15);

  // STEP 6: Fact-check (light LLM call, only for these top 15)
  const factCheckedEvents: ScoredEvent[] = [];
  for (const event of topEvents) {
    const factCheck = await factCheckEvent(event).catch(() => null);
    if (!factCheck || shouldPublish(factCheck)) {
      factCheckedEvents.push(event);
    } else {
      console.log(`❌ Fact-check rejected: "${event.title}"`);
    }
  }
  console.log(`✅ Fact-check passed: ${factCheckedEvents.length}/${topEvents.length}`);

  // STEP 7: For top-scoring articles, enrich content via Firecrawl BEFORE writing.
  // Only for score >= 70 AND content < 800 chars — avoids wasting Firecrawl credits.
  const toProcess = factCheckedEvents.slice(0, 8); // max 8 full articles per run

  for (const event of toProcess) {
    if (event.importanceScore >= 70) {
      event.content = await enrichWithFirecrawl(event);
    }
  }

  // STEP 8: Write + enrich + publish (max 8 per run to control cost)
  let published = 0;
  let failed = 0;
  let broadcasted = 0;

  for (const event of toProcess) {
    try {
      const article = await generateBlogArticle(event);
      if (!article) { failed++; continue; }

      await enrichAndPublishArticle(article, event);
      published++;

      if (article.importanceScore >= 75) {
        await postToTelegram(article).catch(() => false);
        await broadcastToAllChannels(article).catch(() => {});
        broadcasted++;
      }

      // Pause between articles to stay within Groq TPM limits
      await new Promise(r => setTimeout(r, 8000));
    } catch (err) {
      console.error(`Pipeline error for "${event.title}":`, (err as Error).message);
      failed++;
    }
  }

  const result: PipelineResult = {
    collected: allRaw.length,
    afterScoring: filtered.length,
    afterDedup: deduplicated.length,
    afterFactCheck: factCheckedEvents.length,
    afterProcessedFilter: newEvents.length,
    published,
    failed,
    broadcasted,
    durationMs: Date.now() - start,
  };

  console.log(`🏁 Done in ${result.durationMs}ms | Published: ${published} | Broadcasted: ${broadcasted} | Failed: ${failed}`);
  return result;
}
