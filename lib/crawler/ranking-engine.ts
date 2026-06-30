// Multi-factor ranking engine for AI news articles

export interface RankingFactors {
  freshness: number;        // 0-100 (how recent)
  sourceTrust: number;      // 0-100 (source authority)
  sourcePriority: number;   // 0-100 (source priority score)
  isOfficialSource: boolean;
  isFounderAnnouncement: boolean;
  isResearchPaper: boolean;
  hasGitHubStars?: number;  // stars count
  communityMentions?: number; // HN/Reddit mentions
  contentQuality: number;   // 0-100 (length, structure)
  titleQuality: number;     // 0-100
  hasImage: boolean;
  wordCount: number;
  importanceScore: number;  // existing AI-assigned score
  category: string;
}

// Weight configuration (must sum to 100)
const WEIGHTS = {
  importanceScore:       0.30,  // AI-assigned importance (highest weight)
  sourcePriority:        0.20,  // Source authority
  freshness:             0.20,  // Recency
  communitySignal:       0.10,  // HN/Reddit engagement
  contentQuality:        0.10,  // Content depth
  officialBonus:         0.05,  // Official company source
  researchBonus:         0.05,  // Research paper
};

export function computeFreshness(publishedAt: string | Date): number {
  const now = Date.now();
  const pub = new Date(publishedAt).getTime();
  const ageHours = (now - pub) / (1000 * 60 * 60);

  if (ageHours < 1)   return 100;
  if (ageHours < 6)   return 95;
  if (ageHours < 12)  return 88;
  if (ageHours < 24)  return 78;
  if (ageHours < 48)  return 65;
  if (ageHours < 72)  return 52;
  if (ageHours < 168) return 38; // 1 week
  if (ageHours < 720) return 20; // 1 month
  return 10;
}

export function computeContentQuality(content: string, wordCount: number): number {
  let score = 0;
  if (wordCount >= 800)  score += 40;
  else if (wordCount >= 400) score += 25;
  else if (wordCount >= 150) score += 15;

  if (content.includes('##')) score += 10; // Has headers
  if (content.match(/\d+%|\$\d+|\d+B|\d+M/)) score += 10; // Has numbers/stats
  if (content.includes('http')) score += 5; // Has links/references
  if (wordCount < 50) score = Math.min(score, 20); // Penalty for too short

  return Math.min(score + 20, 100); // Base 20
}

export function computeCommunitySignal(hnPoints?: number, redditScore?: number): number {
  const hn = Math.min((hnPoints || 0) / 5, 50);  // 250 points = 50 score
  const rd = Math.min((redditScore || 0) / 10, 50); // 500 score = 50
  return Math.min(hn + rd, 100);
}

export function rankArticle(factors: RankingFactors): number {
  const freshness = computeFreshness(new Date());
  const communitySignal = computeCommunitySignal(factors.communityMentions);

  let score = 0;
  score += factors.importanceScore * WEIGHTS.importanceScore;
  score += factors.sourcePriority * WEIGHTS.sourcePriority;
  score += factors.freshness * WEIGHTS.freshness;
  score += communitySignal * WEIGHTS.communitySignal;
  score += factors.contentQuality * WEIGHTS.contentQuality;
  score += (factors.isOfficialSource ? 100 : 0) * WEIGHTS.officialBonus;
  score += (factors.isResearchPaper ? 100 : 0) * WEIGHTS.researchBonus;

  // Boost modifiers
  if (factors.isFounderAnnouncement) score *= 1.15;
  if (factors.hasGitHubStars && factors.hasGitHubStars > 1000) score *= 1.1;
  if (!factors.hasImage) score *= 0.95; // Small penalty for no image
  if (factors.wordCount < 100) score *= 0.8; // Penalty for stub articles

  return Math.round(Math.min(score, 100));
}

// Trend detection: find rising topics in a batch of articles
export function detectTrends(articles: Array<{ tags?: string[]; company?: string; publishedAt: string }>): Record<string, number> {
  const counts: Record<string, number> = {};
  const recentCutoff = Date.now() - 24 * 60 * 60 * 1000; // last 24h

  for (const a of articles) {
    const isRecent = new Date(a.publishedAt).getTime() > recentCutoff;
    const boost = isRecent ? 2 : 1;

    for (const tag of (a.tags || [])) {
      counts[tag] = (counts[tag] || 0) + boost;
    }
    if (a.company) {
      counts[`company:${a.company}`] = (counts[`company:${a.company}`] || 0) + boost;
    }
  }

  return Object.fromEntries(
    Object.entries(counts).sort(([,a],[,b]) => b - a).slice(0, 30)
  );
}
