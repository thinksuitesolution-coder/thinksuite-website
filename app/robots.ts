import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thinksuite.in';

// SEO/backlink-audit crawlers - they scan the whole site on a schedule for
// competitor research tools, not for search or LLM discovery, so blocking
// them costs nothing in Google/AI visibility while cutting real crawl volume.
// Only effective against compliant crawlers (these ones do honor robots.txt);
// bots that ignore robots.txt still need a Vercel WAF rule to actually stop.
const NO_VALUE_CRAWLERS = [
  'AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'BLEXBot',
  'PetalBot', 'SeekportBot', 'DataForSeoBot', 'Barkrowler', 'MegaIndex',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/intelligence/', '/admin/'],
      },
      {
        userAgent: NO_VALUE_CRAWLERS,
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
