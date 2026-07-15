// Matches the category list the writer prompt asks the LLM to pick from
// (lib/news/pipeline/writer.ts). Kept here so the category hub pages and
// internal-linking map both use the same source of truth.
export const NEWS_CATEGORIES = [
  'AI Models',
  'Research',
  'Funding',
  'Open Source',
  'Tools',
  'Policy',
  'Industry News',
] as const;

export type NewsCategory = typeof NEWS_CATEGORIES[number];

export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function slugToCategory(slug: string): NewsCategory | null {
  return NEWS_CATEGORIES.find((c) => categoryToSlug(c) === slug) ?? null;
}

// Maps each news category to the most relevant ThinkSuite service page, for
// contextual internal linking from AI-news articles to service pages.
export const CATEGORY_SERVICE_LINK: Record<NewsCategory, { href: string; label: string }> = {
  'AI Models':      { href: '/ai-tools-development', label: 'Custom AI Tools Development' },
  'Research':       { href: '/ai-tools-development', label: 'Custom AI Tools Development' },
  'Funding':        { href: '/startup-consulting',   label: 'Startup Consulting' },
  'Open Source':    { href: '/custom-software',       label: 'Custom Software Development' },
  'Tools':          { href: '/ai-automation',         label: 'AI Automation & Workflows' },
  'Policy':         { href: '/business-strategy',      label: 'Business Strategy Consulting' },
  'Industry News':  { href: '/ai-automation',          label: 'AI Automation & Workflows' },
};
