// Lead gen seen-IDs tracking — prevents duplicate leads across paginated searches

export function lsKey(feature, niche, state, city) {
  const norm = s => (s || "").toLowerCase().replace(/\s+/g, "_").slice(0, 40);
  return `ts_seen_${feature}_${norm(niche)}_${norm(state)}_${norm(city)}`;
}

export function getSeenIds(feature, niche, state, city) {
  try { return JSON.parse(localStorage.getItem(lsKey(feature, niche, state, city)) || "[]"); }
  catch { return []; }
}

export function saveSeenIds(feature, niche, state, city, ids) {
  try {
    const cur    = getSeenIds(feature, niche, state, city);
    const merged = [...new Set([...cur, ...ids])].slice(-500);
    localStorage.setItem(lsKey(feature, niche, state, city), JSON.stringify(merged));
  } catch {}
}
