const fetch = require("node-fetch");

/* â”€â”€ Indian context keyword enhancer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const INDIAN_PREFIX_MAP = {
  "businessman": "Indian businessman",
  "woman":       "Indian woman",
  "man":         "Indian man",
  "office":      "modern Indian office",
  "city":        "Indian city",
  "street":      "Indian street",
  "market":      "Indian market bazaar",
  "food":        "Indian food",
  "technology":  "India technology startup",
  "nature":      "Indian nature landscape",
  "people":      "Indian people",
  "team":        "Indian business team",
  "meeting":     "Indian corporate meeting",
  "laptop":      "person laptop India",
  "phone":       "person smartphone India",
  "startup":     "India startup office",
  "coding":      "India software developer",
  "student":     "Indian student",
  "doctor":      "Indian doctor",
  "shop":        "Indian shop",
};

function enhanceKeywordsForIndia(keywords) {
  return keywords.map(kw => {
    const lower = kw.toLowerCase();
    for (const [key, replacement] of Object.entries(INDIAN_PREFIX_MAP)) {
      if (lower.includes(key)) return replacement;
    }
    return `${kw} India`;
  });
}

/* â”€â”€ Score a clip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function scoreClip(clip, targetDuration) {
  let score = 0;
  const clipDuration = clip.duration || 0;
  const durationDiff = Math.abs(clipDuration - (targetDuration + 2));
  if (durationDiff <= 2)  score += 40;
  else if (durationDiff <= 5)  score += 20;
  else if (durationDiff <= 10) score += 10;
  else score -= 10;
  if (clip.width >= 1920) score += 20;
  else if (clip.width >= 1280) score += 10;
  if (clipDuration < targetDuration) score -= 50;
  return score;
}

/* â”€â”€ Pexels API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function searchPexels(query, orientation = "landscape", perPage = 10) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) throw new Error("PEXELS_API_KEY not set");

  const params = new URLSearchParams({ query, orientation, per_page: String(perPage), size: "medium" });
  const res = await fetch(`https://api.pexels.com/videos/search?${params}`, {
    headers: { Authorization: key },
    timeout: 15_000,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Pexels API error ${res.status}: ${txt}`);
  }

  const data = await res.json();
  return (data.videos || []).flatMap(v => {
    const files = (v.video_files || [])
      .filter(f => (f.quality === "hd" || f.quality === "sd") && f.link && /^https?:\/\//.test(f.link))
      .sort((a, b) => (b.width || 0) - (a.width || 0));
    const bestFile = files[0];
    if (!bestFile?.link) return [];
    return [{
      id:          `pexels_${v.id}`,
      source:      "pexels",
      url:         bestFile.link,
      width:       bestFile.width || v.width,
      height:      bestFile.height || v.height,
      duration:    v.duration,
      thumbnail:   v.image,
      attribution: `Video by ${v.user?.name || "Pexels"} on Pexels`,
    }];
  });
}

/* â”€â”€ Pixabay API (fallback) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function searchPixabay(query, orientation = "horizontal", perPage = 10) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return [];

  const params = new URLSearchParams({ key, q: query, video_type: "film", orientation, per_page: String(perPage), safesearch: "true" });
  const res = await fetch(`https://pixabay.com/api/videos/?${params}`, { timeout: 15_000 });
  if (!res.ok) return [];

  const data = await res.json();
  return (data.hits || []).flatMap(v => {
    const med = v.videos?.medium;
    if (!med?.url || !/^https?:\/\//.test(med.url)) return [];
    return [{
      id:          `pixabay_${v.id}`,
      source:      "pixabay",
      url:         med.url,
      width:       med.width || 1280,
      height:      med.height || 720,
      duration:    v.duration,
      thumbnail:   v.picture_id ? `https://i.vimeocdn.com/video/${v.picture_id}_295x166.jpg` : "",
      attribution: `Video by ${v.user || "Pixabay"} on Pixabay`,
    }];
  });
}

/* â”€â”€ Best clip for a segment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function fetchBestClip(keywords, segmentDuration, orientation = "landscape") {
  const enhanced = enhanceKeywordsForIndia(keywords);
  // Also try plain keywords without India suffix as extra fallback
  const plain = keywords.map(k => k);
  const orientParam = orientation === "vertical" ? "portrait" : "landscape";

  let bestOverall = null;
  let bestScore = -Infinity;

  // Try all enhanced queries on Pexels   keep best scoring clip across all queries
  for (const query of enhanced) {
    try {
      const clips = await searchPexels(query, orientParam, 15);
      if (clips.length > 0) {
        const scored = clips
          .map(c => ({ ...c, score: scoreClip(c, segmentDuration) }))
          .sort((a, b) => b.score - a.score);
        if (scored[0].score > bestScore) {
          bestScore = scored[0].score;
          bestOverall = { clip: scored[0], source: "pexels", query };
        }
        // Return immediately if excellent match
        if (scored[0].score >= 40) {
          logger.info(`Pexels [enhanced] "${query}"   score ${scored[0].score} (excellent)`);
          return bestOverall;
        }
      }
    } catch (e) {
      logger.warn(`Pexels search failed for "${query}": ${e.message}`);
    }
  }

  // Try plain keywords on Pexels as additional options
  for (const query of plain) {
    if (enhanced.includes(query)) continue;
    try {
      const clips = await searchPexels(query, orientParam, 10);
      if (clips.length > 0) {
        const scored = clips
          .map(c => ({ ...c, score: scoreClip(c, segmentDuration) }))
          .sort((a, b) => b.score - a.score);
        if (scored[0].score > bestScore) {
          bestScore = scored[0].score;
          bestOverall = { clip: scored[0], source: "pexels", query };
        }
      }
    } catch (e) {
      logger.warn(`Pexels plain search failed for "${query}": ${e.message}`);
    }
  }

  // If we have any Pexels result, return the best one
  if (bestOverall) {
    logger.info(`Pexels best "${bestOverall.query}"   score ${bestScore}`);
    return bestOverall;
  }

  // Fallback: Pixabay
  for (const query of enhanced) {
    try {
      const clips = await searchPixabay(query, orientParam === "portrait" ? "vertical" : "horizontal", 10);
      if (clips.length > 0) {
        const scored = clips
          .map(c => ({ ...c, score: scoreClip(c, segmentDuration) }))
          .sort((a, b) => b.score - a.score);
        logger.info(`Pixabay "${query}"   score ${scored[0].score}`);
        return { clip: scored[0], source: "pixabay", query };
      }
    } catch (e) {
      logger.warn(`Pixabay search failed for "${query}": ${e.message}`);
    }
  }

  return null;
}

/* â”€â”€ Fetch clips for all segments (parallel, max 3 at a time) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function fetchClipsForSegments(segments, orientation = "landscape") {
  logger.info(`Fetching clips for ${segments.length} segments (orientation: ${orientation})`);

  // Limit concurrency to 3 to avoid rate limiting
  const results = [];
  for (let i = 0; i < segments.length; i += 3) {
    const batch = segments.slice(i, i + 3);
    const batchResults = await Promise.allSettled(
      batch.map(async (seg, batchIdx) => {
        const idx = i + batchIdx;
        const result = await fetchBestClip(seg.keywords, seg.duration, orientation);
        if (!result) {
          logger.warn(`No clip found for segment ${idx + 1}: ${seg.keywords.join(", ")}`);
          return { segment: idx, clip: null, useFallback: true };
        }
        return { segment: idx, clip: result.clip, useFallback: false, query: result.query };
      })
    );
    results.push(...batchResults);
  }

  return results.map(r => (r.status === "fulfilled" ? r.value : { clip: null, useFallback: true }));
}

module.exports = { fetchClipsForSegments, fetchBestClip, searchPexels };
