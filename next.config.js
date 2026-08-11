/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // firebase-admin (via jwks-rsa -> jose) ships an ESM-only build that Next's
    // webpack bundler mis-resolves as CJS in serverless functions, causing
    // "ERR_REQUIRE_ESM" at runtime. Excluding it from bundling lets Node load
    // it natively at runtime, where the ESM/CJS interop works correctly.
    serverComponentsExternalPackages: ["firebase-admin"],
  },
  async redirects() {
    // /blog and /blog/<slug> are pure aliases for the AI-news pages. They used
    // to be page.tsx files whose only job was to call redirect() - a full
    // serverless function invocation, and Fluid Active CPU, per hit just to
    // emit a Location header. Declaring them here serves the redirect from
    // Vercel's edge with no function invoked at all.
    //
    // This is the hot path, not an obscure one: /blog/<slug> is the URL the
    // public API returns for every article, and the one every Telegram and
    // social broadcast links to, so it is what the outside world actually
    // clicks.
    const blogAliases = [
      { source: '/blog', destination: '/ai-news', permanent: true },
      { source: '/blog/:slug', destination: '/ai-news/:slug', permanent: true },
    ]

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
    return [
      ...blogAliases,
      ...htmlPages.map((page) => ({
        source: `/${page}.html`,
        destination: urlMap[page] || `/${page}`,
        permanent: true,
      })),
    ]
  },
}

module.exports = nextConfig
