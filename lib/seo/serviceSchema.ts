// Shared Service schema.org builder for every service/product page — gives
// Google (rich results) and AI answer engines (GEO/AEO) a clean, structured
// fact about what the service is, who offers it, and where it's available.
// Usage: render `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildServiceSchema({...})) }} />`
// alongside the page's existing FAQPage schema (don't replace it — both can coexist as separate <script> tags).

export interface ServiceSchemaInput {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  keywords?: string[];
}

const SITE_URL = 'https://thinksuite.in';

export function buildServiceSchema(input: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    url: input.url,
    provider: {
      '@type': 'Organization',
      name: 'ThinkSuite',
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide',
    },
    ...(input.keywords?.length ? { keywords: input.keywords.join(', ') } : {}),
  };
}
