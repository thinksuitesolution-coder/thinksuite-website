import { fetchAllRSSSources } from './collectors/rss';
import { fetchGitHubEvents } from './collectors/github';
import { fetchArxivPapers } from './collectors/arxiv';
import { fetchHuggingFaceReleases, fetchHuggingFaceSpaces } from './collectors/huggingface';
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

async function enrichAndPublishArticle(
  article: BlogArticle,
  event: ScoredEvent
): Promise<void> {
  const { adminDb, articlesCol } = await import('../firebase-admin');

  // 1. Generate advanced SEO package
  const seoPackage = await generateSEOPackage(article).catch(() => null);
  if (seoPackage) {
    article.metaTitle = seoPackage.metaTitle;
    article.metaDescription = seoPackage.metaDescription;
  }

  // 2. Generate startup opportunities (async, high-importance only)
  const opportunitiesPromise = event.importanceScore >= 65
    ? detectOpportunities(event).catch(() => null)
    : Promise.resolve(null);

  // 3. Generate competitor intel (async, high-importance only)
  const competitorPromise = event.importanceScore >= 70
    ? generateCompetitorIntelligence(event).catch(() => null)
    : Promise.resolve(null);

  // 4. Generate personalized versions (async)
  const personalizedPromise = generatePersonalizedVersions(article).catch(() => []);

  // 5. Generate images (hero image + infographic), only for high-importance articles
  const imagesPromise = event.importanceScore >= 65
    ? generateImages(article, event).catch(() => null)
    : Promise.resolve(null);

  // 6. Translate to all languages (only for top articles score >= 80)
  const translationsPromise = event.importanceScore >= 80
    ? translateArticleToAllLanguages(article).catch(() => ({}))
    : Promise.resolve({});

  const [opportunities, competitorIntel, personalizedVersions, images, translations] = await Promise.all([
    opportunitiesPromise,
    competitorPromise,
    personalizedPromise,
    imagesPromise,
    translationsPromise,
  ]);

  // Attach generated images to article
  if (images?.heroImageUrl) article.heroImageUrl = images.heroImageUrl;

  // 7. Save enriched article to Firestore
  const enrichedData = {
    ...article,
    seo: seoPackage || {},
    opportunities: opportunities || null,
    competitorIntel: competitorIntel || null,
    personalizedVersions: personalizedVersions || [],
    images: images || null,
    translations: translations || {},
  };

  await articlesCol().doc(article.id).set(enrichedData);

  // 6. Mark URL as processed
  const { processedUrlsCol } = await import('../firebase-admin');
  await processedUrlsCol()
    .doc(Buffer.from(article.originalUrl).toString('base64').slice(0, 100))
    .set({ url: article.originalUrl, articleId: article.id, processedAt: new Date().toISOString() });
}

export async function runNewsPipeline(): Promise<PipelineResult> {
  const start = Date.now();
  console.log('🚀 Starting Full AI Intelligence Pipeline...');

  // STEP 1: Collect from all sources in parallel
  const [rssEvents, githubEvents, arxivPapers, hfModels, hfSpaces] = await Promise.all([
    fetchAllRSSSources(NEWS_SOURCES),
    fetchGitHubEvents(),
    fetchArxivPapers(),
    fetchHuggingFaceReleases(),
    fetchHuggingFaceSpaces(),
  ]);

  const allRaw: RawEvent[] = [
    ...rssEvents, ...githubEvents, ...arxivPapers, ...hfModels, ...hfSpaces,
  ];
  console.log(`📦 Collected: ${allRaw.length} raw events`);

  // STEP 2: Score every event
  const scored: ScoredEvent[] = allRaw.map(e => scoreEvent(e));
  const filtered = filterLowImportance(scored, 50);
  console.log(`📊 After scoring: ${filtered.length} pass threshold`);

  // STEP 3: Deduplicate
  const deduplicated = deduplicateEvents(filtered);
  console.log(`🔁 After dedup: ${deduplicated.length} unique`);

  // STEP 4: Filter already-published
  const processedUrls = await getProcessedUrls();
  const newEvents = filterAlreadyProcessed(deduplicated, processedUrls);
  console.log(`✨ New events to process: ${newEvents.length}`);

  if (newEvents.length === 0) {
    return { collected: allRaw.length, afterScoring: filtered.length, afterDedup: deduplicated.length, afterFactCheck: 0, afterProcessedFilter: 0, published: 0, failed: 0, broadcasted: 0, durationMs: Date.now() - start };
  }

  // STEP 5: Fact check (run on top-scoring events only to save API calls)
  const topEvents = newEvents.sort((a, b) => b.importanceScore - a.importanceScore).slice(0, 15);
  const factCheckedEvents: ScoredEvent[] = [];

  for (const event of topEvents) {
    const factCheck = await factCheckEvent(event).catch(() => null);
    if (!factCheck || shouldPublish(factCheck)) {
      factCheckedEvents.push(event);
    } else {
      console.log(`❌ Rejected by fact-check: "${event.title}" (confidence: ${factCheck?.confidenceScore})`);
    }
  }
  console.log(`✅ Fact-check passed: ${factCheckedEvents.length}/${topEvents.length}`);

  // STEP 6: Write articles with AI + enrich (images, translations) + publish (max 8 per run)
  const toProcess = factCheckedEvents.slice(0, 8);
  let published = 0;
  let failed = 0;
  let broadcasted = 0;

  for (const event of toProcess) {
    try {
      const article = await generateBlogArticle(event);
      if (!article) { failed++; continue; }

      await enrichAndPublishArticle(article, event);
      published++;

      // STEP 7: Broadcast high-importance articles to social channels
      if (article.importanceScore >= 75) {
        await postToTelegram(article).catch(() => false);
        await broadcastToAllChannels(article).catch(() => {});
        broadcasted++;
      }

      await new Promise(r => setTimeout(r, 2000));
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

  console.log(`🏁 Pipeline done in ${result.durationMs}ms, Published: ${published} | Broadcasted: ${broadcasted} | Failed: ${failed}`);
  return result;
}
