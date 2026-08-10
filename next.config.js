/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // firebase-admin (via jwks-rsa -> jose) ships an ESM-only build that Next's
    // webpack bundler mis-resolves as CJS in serverless functions, causing
    // "ERR_REQUIRE_ESM" at runtime. Excluding it from bundling lets Node load
    // it natively at runtime, where the ESM/CJS interop works correctly.
    serverComponentsExternalPackages: ["firebase-admin"],
  },
  // The news pages read `searchParams`, which makes them render per request —
  // every visitor costs a function invocation even though the HTML is identical
  // for everyone (nothing here reads cookies or auth on the server). Letting the
  // CDN hold each URL for a few minutes collapses repeat traffic into cache hits.
  // The underlying article query is already cached for 300s, so this serves no
  // staler than the page did before.
  async headers() {
    return [
      {
        source: '/ai-news',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
      {
        source: '/blog/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=600, stale-while-revalidate=1800' },
        ],
      },
    ]
  },
  async redirects() {
    const htmlPages = [
      'home', 'about', 'contact', 'service', 'faq', 'team-details',
      'privacy-policy', 'terms-and-conditions', 'error',
      'software-development', 'web-development', 'mobile-app-development',
      'custom-software', 'saas-products', 'digital-marketing',
      'seo-optimization', 'social-media-marketing', 'google-meta-ads',
      'content-marketing', 'branding-design', 'ui-ux-design', 'brand-identity',
      'graphic-design', 'product-design', 'ai-automation', 'ai-tools-development',
      'chatbot-solutions', 'workflow-automation', 'ai-marketing-systems',
      'media-advertising', 'indoor-advertising', 'outdoor-advertising',
      'influencer-marketing', 'pr-campaigns', 'consulting-growth',
      'startup-consulting', 'business-strategy', 'growth-planning', 'market-research',
    ]
    const urlMap = {
      'service': '/services',
      'team-details': '/team',
      'home': '/',
      'error': '/404',
    }
    return htmlPages.map((page) => ({
      source: `/${page}.html`,
      destination: urlMap[page] || `/${page}`,
      permanent: true,
    }))
  },
}

module.exports = nextConfig
