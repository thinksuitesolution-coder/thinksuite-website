// Badge label and colour per event type. Shared because the listing page picks
// the featured slides' badges on the server while the feed renders row badges
// in the browser, and both must agree.
export const EVENT_META: Record<string, { label: string; color: string }> = {
  model_release:  { label: 'Model Release', color: '#1a237e' },
  research_paper: { label: 'Research',      color: '#2563eb' },
  funding:        { label: 'Funding',       color: '#d97706' },
  acquisition:    { label: 'Acquisition',   color: '#dc2626' },
  open_source:    { label: 'Open Source',   color: '#059669' },
  api_release:    { label: 'API Release',   color: '#0891b2' },
  product_launch: { label: 'Launch',        color: '#2563eb' },
  github_release: { label: 'GitHub',        color: '#1f2937' },
  breaking_news:  { label: 'Breaking',      color: '#dc2626' },
  keynote:        { label: 'Keynote',       color: '#0288d1' },
  general:        { label: 'News',          color: '#64748b' },
};

export function eventMeta(eventType: string) {
  return EVENT_META[eventType] || EVENT_META.general;
}
