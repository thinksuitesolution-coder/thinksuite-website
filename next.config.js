/** @type {import('next').NextConfig} */
const nextConfig = {
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
