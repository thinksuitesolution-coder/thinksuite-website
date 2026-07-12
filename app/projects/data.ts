export const CATS = ['All', 'Website', 'Social Media', 'Branding']

export interface SocialHandle {
  platform: string
  url: string
  icon: string
  color: string
}

export interface SocialPost {
  type: 'post' | 'reel'
  image: string
  video?: string
  caption: string
  likes?: string
  views?: string
  postUrl?: string
}

export interface Project {
  id: string
  cat: string[]
  title: string
  industry: string
  industryIcon: string
  tagline: string
  desc: string
  contribution?: string
  services: string[]
  tech?: string[]
  colors?: { hex: string; name: string }[]
  animations?: string[]
  metrics?: { val: string; key: string }[]
  liveUrl?: string
  socialHandles?: SocialHandle[]
  socialPosts?: SocialPost[]
  logo?: string
  screenshot?: string
  coverGradient: string
  coverIcon: string
}

export const projects: Project[] = [
  {
    id: 'laghima-jewelry',
    cat: ['Website', 'Social Media', 'Branding'],
    title: 'Laghima Jewelry',
    industry: 'Jewelry & Accessories',
    industryIcon: 'fa-gem',
    tagline: 'Premium gold and silver rings and bracelets, from brand identity to full digital presence.',
    desc: 'Complete brand presence built for Laghima Jewelry, a luxury jewelry brand specializing in handcrafted gold and silver rings and bracelets. We developed the full brand identity including logo, typography, and color palette, then designed and built an elegant catalog website, and grew their Instagram presence with premium curated content.',
    contribution: 'We built Laghima Jewelry from the ground up: the brand identity (logo, typography, gold-and-onyx color system), a full e-commerce catalog website with category browsing and wishlist, and an Instagram content and growth strategy that took their following from zero to an engaged premium audience.',
    services: [
      'Brand Identity & Logo Design',
      'Website Design & Development',
      'Social Media Management',
      'Content Creation & Photography Direction',
      'Instagram Growth Strategy',
    ],
    tech: ['Next.js', 'Tailwind CSS', 'Figma'],
    colors: [
      { hex: '#C9A84C', name: 'Gold' },
      { hex: '#1A1A1A', name: 'Onyx' },
      { hex: '#F5F0E8', name: 'Ivory' },
      { hex: '#8B6914', name: 'Burnished Gold' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    animations: [
      'Fade-in on scroll for all product sections',
      'Hover zoom on jewelry product cards',
      'Gold shimmer text effect on brand name',
      'Smooth page transition animations',
    ],
    metrics: [
      { val: '3x', key: 'Instagram Growth' },
      { val: '5K+', key: 'Followers' },
      { val: '40%', key: 'Engagement Rate' },
    ],
    liveUrl: '#',
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
    ],
    logo: '/assets/img/logos/laghima_logo.jpeg',
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #1a237e 100%)',
    coverIcon: 'fa-gem',
  },
  {
    id: 'aklr-foundation',
    cat: ['Website', 'Social Media'],
    title: 'AKLR Foundation',
    industry: 'NGO & Event Services',
    industryIcon: 'fa-leaf',
    tagline: 'Nature conservation NGO and premium furniture rental for corporate events and weddings.',
    desc: 'AKLR Foundation operates on two fronts: environmental conservation work focused on air, water, and earth wellness, and a premium furniture rental service for corporate events, SPX setups, and weddings. We built a dual-purpose website that clearly presents both verticals and manages their growing social media community.',
    contribution: 'We designed and built a dual-purpose site that keeps AKLR Foundation\'s conservation mission and their events/furniture-rental business each clearly presented without confusing visitors, and we run their ongoing social media content and community management.',
    services: [
      'Website Design & Development',
      'Social Media Management',
      'Content Strategy & Creation',
      'Brand Positioning',
      'Event Inquiry System Integration',
    ],
    tech: ['WordPress', 'PHP', 'Figma', 'HTML/CSS'],
    colors: [
      { hex: '#2D5016', name: 'Forest Green' },
      { hex: '#6B8F3A', name: 'Leaf Green' },
      { hex: '#F4F1E8', name: 'Natural Cream' },
      { hex: '#8B7355', name: 'Earth Brown' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    animations: [
      'Nature-inspired parallax scroll',
      'Leaf floating particle effect',
      'Section fade-in on scroll',
      'Hover lift on service cards',
    ],
    metrics: [
      { val: '2K+', key: 'Social Followers' },
      { val: '85%', key: 'Web Inquiries' },
      { val: '12+', key: 'Events Supported' },
    ],
    liveUrl: 'https://aklrfoundation.com',
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
      { platform: 'Facebook', url: '#', icon: 'fa-facebook', color: '#1877f2' },
    ],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #071c28 50%, #005f6b 100%)',
    coverIcon: 'fa-leaf',
  },
  {
    id: 'blessings-foundation',
    cat: ['Website'],
    title: 'Blessings Foundation',
    industry: 'Healthcare & Wellness',
    industryIcon: 'fa-user-doctor',
    tagline: 'Clean, trust-building static website for a doctor-led healthcare initiative.',
    desc: 'Designed and developed a professional static website for Blessings Foundation, a doctor-led healthcare and wellness initiative based in Gurgaon. The site presents the doctor\'s credentials, specializations, consultation process, and contact details with a calm, trustworthy aesthetic that patients immediately connect with.',
    contribution: 'We designed and built the full static site for Blessings Foundation, including the service pages, credentials presentation, and on-page SEO setup, focused on giving patients a fast, trustworthy first impression.',
    services: [
      'Website Design',
      'Static Website Development',
      'On-page SEO Setup',
      'Content Writing',
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Figma'],
    colors: [
      { hex: '#1565C0', name: 'Medical Blue' },
      { hex: '#FFFFFF', name: 'White' },
      { hex: '#E3F2FD', name: 'Sky Blue' },
      { hex: '#0D47A1', name: 'Deep Blue' },
      { hex: '#F5F5F5', name: 'Light Grey' },
    ],
    animations: [
      'Smooth scroll behavior',
      'Counter animations on stat numbers',
      'Fade-in on section scroll',
      'Subtle button hover effects',
    ],
    metrics: [
      { val: '<1s', key: 'Page Load Time' },
      { val: 'A+', key: 'Performance Score' },
      { val: '100%', key: 'Mobile Responsive' },
    ],
    liveUrl: 'https://blessingsfoundation.in',
    socialHandles: [],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0d2040 50%, #0d47a1 100%)',
    coverIcon: 'fa-user-doctor',
  },
  {
    id: 'thinkvirtual',
    cat: ['Social Media'],
    title: 'ThinkVirtual',
    industry: 'Technology & Digital',
    industryIcon: 'fa-vr-cardboard',
    tagline: 'Social media identity and community built from scratch for a digital-first brand.',
    desc: 'Built and managed the complete social media presence for ThinkVirtual, setting up the account identity, defining a consistent brand voice, creating a content calendar, and growing an engaged audience through creative, platform-optimized content.',
    contribution: 'We set up ThinkVirtual\'s social accounts from zero, defined its brand voice, and have run the ongoing content calendar and community management that grew it to an engaged, active following.',
    services: [
      'Social Media Account Setup',
      'Brand Voice & Tone Definition',
      'Content Creation',
      'Content Calendar Management',
      'Community Management',
    ],
    colors: [
      { hex: '#7C3AED', name: 'Electric Violet' },
      { hex: '#1E1B4B', name: 'Deep Indigo' },
      { hex: '#A78BFA', name: 'Lavender' },
      { hex: '#4C1D95', name: 'Dark Violet' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    metrics: [
      { val: '3.5K+', key: 'Followers' },
      { val: '6.8%', key: 'Engagement Rate' },
      { val: '60+', key: 'Posts Created' },
    ],
    liveUrl: 'https://thinkvirtual.in',
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
    ],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0f0d2e 50%, #312e81 100%)',
    coverIcon: 'fa-vr-cardboard',
  },
  {
    id: 'wavcart',
    cat: ['Social Media'],
    title: 'WavCart',
    industry: 'E-Commerce',
    industryIcon: 'fa-cart-shopping',
    tagline: 'Social media growth and conversion-focused content for an emerging e-commerce brand.',
    desc: 'Managed end-to-end social media for WavCart, including platform setup, content strategy, creative production, and audience building. Helped position WavCart as a trusted shopping platform through engaging, conversion-driven posts and consistent brand storytelling.',
    contribution: 'We own WavCart\'s social media end-to-end: platform setup, content strategy, creative production, and audience growth, positioning it as a trusted local-shop WhatsApp ordering platform through consistent, conversion-focused storytelling.',
    services: [
      'Social Media Management',
      'Content Creation & Design',
      'Meta Ads Strategy',
      'Reels & Video Production',
      'Audience Growth',
    ],
    colors: [
      { hex: '#00BCD4', name: 'Cyan' },
      { hex: '#0A1628', name: 'Deep Navy' },
      { hex: '#E0F7FA', name: 'Light Cyan' },
      { hex: '#006064', name: 'Teal Dark' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    metrics: [
      { val: '8K+', key: 'Followers Gained' },
      { val: '4.2%', key: 'Engagement Rate' },
      { val: '2x', key: 'Reach Growth' },
    ],
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
    ],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #071e28 50%, #006e7f 100%)',
    coverIcon: 'fa-cart-shopping',
  },
  {
    id: 'rewa-education',
    cat: ['Social Media'],
    title: 'Rewa Education',
    industry: 'K–5 Education',
    industryIcon: 'fa-book-open',
    tagline: 'Warm social media for a kids learning centre covering Grades 1–5 academics and moral values.',
    desc: 'Created and managed the social media presence for Rewa Education, a learning centre providing academic classes for children from Grades 1 to 5, combined with a strong focus on moral values and character development. Content is warm, colorful, and parent-focused to build trust and grow community.',
    contribution: 'We set up and manage Rewa Education\'s social accounts, producing warm, parent-focused content that builds trust in the centre\'s academic and values-based teaching approach.',
    services: [
      'Social Media Handle Setup',
      'Content Creation for Parents and Kids',
      'Educational Content Strategy',
      'Parent Community Building',
    ],
    colors: [
      { hex: '#F59E0B', name: 'Sunshine Yellow' },
      { hex: '#FEF3C7', name: 'Light Yellow' },
      { hex: '#D97706', name: 'Amber' },
      { hex: '#1A1A1A', name: 'Dark' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    metrics: [
      { val: '1.2K+', key: 'Followers' },
      { val: '7%', key: 'Engagement Rate' },
      { val: '45+', key: 'Posts Published' },
    ],
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
    ],
    logo: '/assets/img/logos/rewa education.png',
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0d1435 50%, #1565c0 100%)',
    coverIcon: 'fa-book-open',
  },
  {
    id: 'aklr-academy',
    cat: ['Social Media'],
    title: 'AKLR Academy',
    industry: 'AI Education & Online Courses',
    industryIcon: 'fa-robot',
    tagline: 'Social media for an AI-focused online education platform offering courses and live classes.',
    desc: 'Built and managed the social media identity for AKLR Academy, an online education platform specializing in AI learning through structured courses and live classes. Content focuses on making AI accessible to beginners, showcasing learning outcomes, and building a community of motivated learners.',
    contribution: 'We built AKLR Academy\'s social identity and run its content strategy, focused on making AI learning approachable for beginners and showcasing real learner outcomes to build a motivated community.',
    services: [
      'Social Media Handle Setup',
      'AI Education Content Creation',
      'Course Promotion Strategy',
      'Community Building',
    ],
    colors: [
      { hex: '#4F46E5', name: 'Indigo' },
      { hex: '#0F0C29', name: 'Deep Dark' },
      { hex: '#818CF8', name: 'Soft Indigo' },
      { hex: '#312E81', name: 'Dark Indigo' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    metrics: [
      { val: '2K+', key: 'Followers' },
      { val: '5.5%', key: 'Engagement Rate' },
      { val: '80+', key: 'Educational Posts' },
    ],
    liveUrl: 'https://aklracademy.com',
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
    ],
    logo: '/assets/img/logos/aklr academy.png',
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0f0d2e 50%, #283593 100%)',
    coverIcon: 'fa-robot',
  },
  {
    id: 'aklr-tech',
    cat: ['Social Media'],
    title: 'AKLR Tech',
    industry: 'IT Services & Technology',
    industryIcon: 'fa-microchip',
    tagline: 'Professional social media for an IT services and technology news brand.',
    desc: 'Managed the social media presence for AKLR Tech, an IT services company that also covers technology news and industry updates. We developed a professional, authoritative content strategy covering tech news, service highlights, and insights to establish credibility and attract business clients.',
    contribution: 'We manage AKLR Tech\'s social presence with a professional, authoritative content strategy mixing tech news, service highlights, and insights, built to attract and convert business clients.',
    services: [
      'Social Media Management',
      'Tech News Content Curation',
      'Service Highlight Campaigns',
      'Brand Positioning',
      'Audience Growth',
    ],
    colors: [
      { hex: '#00BCD4', name: 'Tech Cyan' },
      { hex: '#0D1117', name: 'Code Black' },
      { hex: '#00E5FF', name: 'Electric Blue' },
      { hex: '#006064', name: 'Dark Teal' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    metrics: [
      { val: '1.8K+', key: 'Followers' },
      { val: '4.8%', key: 'Engagement Rate' },
      { val: '100+', key: 'Posts Published' },
    ],
    liveUrl: 'https://aklrtech.com',
    socialHandles: [
      { platform: 'Instagram', url: '#', icon: 'fa-instagram', color: '#e1306c' },
    ],
    logo: '/assets/img/logos/AKLR Tech.png',
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #071828 50%, #01579b 100%)',
    coverIcon: 'fa-microchip',
  },
  {
    id: 'vibestyl',
    cat: ['Website', 'Branding'],
    title: 'VibéStyl',
    industry: 'Fashion & Clothing',
    industryIcon: 'fa-shirt',
    tagline: 'Trendy clothing store with a full e-commerce website. Browse, pick, and order online.',
    desc: 'Designed and developed a full e-commerce website for VibéStyl, a fashion-forward clothing brand. The site features a product catalog with category filters, size and color selection, a smooth cart experience, and a clean checkout flow. The brand identity was built to match the vibe: bold, modern, and unapologetically stylish.',
    contribution: 'We built VibéStyl\'s full e-commerce experience and brand identity from scratch, including the product catalog, cart and checkout flow, and an AI-powered virtual try-on feature that sets it apart from typical fashion storefronts.',
    services: [
      'E-commerce Website Design & Development',
      'Brand Identity & Logo',
      'Product Catalog Setup',
      'Mobile-first UI Design',
      'Checkout & Order Flow',
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Figma'],
    colors: [
      { hex: '#0D0D0D', name: 'Jet Black' },
      { hex: '#C9184A', name: 'Fashion Red' },
      { hex: '#F8F8F8', name: 'Off White' },
      { hex: '#FFD6E0', name: 'Blush Pink' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    animations: [
      'Product image hover zoom',
      'Smooth cart slide-in drawer',
      'Color and size selector transitions',
      'Scroll-reveal on product grid',
    ],
    metrics: [
      { val: '100%', key: 'Mobile Responsive' },
      { val: '<1.2s', key: 'Page Load' },
      { val: '50+', key: 'Products Listed' },
    ],
    liveUrl: '#',
    socialHandles: [],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0c1030 50%, #1a237e 100%)',
    coverIcon: 'fa-shirt',
  },
  {
    id: 'shrisurbhikripa',
    cat: ['Website'],
    title: 'Shri Surbhi Kripa',
    industry: 'Organic & Natural Products',
    industryIcon: 'fa-seedling',
    tagline: 'Static product website for an organic goods brand. Browse the catalog and order via WhatsApp.',
    desc: 'Designed and built a clean static product showcase website for Shri Surbhi Kripa, a brand dealing in pure, natural A2 desi cow products, organic foods, and Ayurvedic essentials. Customers browse the full product catalog on the website and place orders directly through WhatsApp, making the buying process simple and personal. The design reflects the brand\'s natural, trustworthy character.',
    contribution: 'We designed and built the full catalog site for Shri Surbhi Kripa and set up its WhatsApp order flow, so "Add to Cart" sends the order straight into a WhatsApp chat instead of a traditional checkout, matching how the brand\'s customers actually prefer to buy.',
    services: [
      'Static Website Design & Development',
      'Product Catalog Design',
      'WhatsApp Order Integration',
      'SEO Setup',
      'Content Writing',
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Figma'],
    colors: [
      { hex: '#1B5E20', name: 'Deep Green' },
      { hex: '#4CAF50', name: 'Leaf Green' },
      { hex: '#F1F8E9', name: 'Natural Cream' },
      { hex: '#8D6E63', name: 'Earthy Brown' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    animations: [
      'Fade-in on scroll for product cards',
      'Hover lift on product images',
      'WhatsApp button pulse effect',
      'Smooth scroll navigation',
    ],
    metrics: [
      { val: 'WhatsApp', key: 'Order Channel' },
      { val: '<1s', key: 'Page Load' },
      { val: '100%', key: 'Mobile Friendly' },
    ],
    liveUrl: 'https://shrisurbhikripa.com',
    socialHandles: [],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #071c30 50%, #00607a 100%)',
    coverIcon: 'fa-seedling',
  },
  {
    id: 'a2z-graphics',
    cat: ['Website'],
    title: 'A2Z Graphics & Computer',
    industry: 'Printing & Design Services',
    industryIcon: 'fa-print',
    tagline: 'Static showcase website for a full-service printing and graphic design studio.',
    desc: 'Designed and developed a static product and service showcase website for A2Z Graphics and Computer, a studio offering comprehensive printing and graphic design services since 2015. The site presents their service offerings, past work samples, and contact details in a bold, professional layout that mirrors their creative expertise, with inquiries routed through WhatsApp.',
    contribution: 'We designed and built A2Z Graphics\' full service and portfolio showcase site, including their WhatsApp-based inquiry setup, giving a 9-year-old print and design studio a digital presence that matches their creative quality.',
    services: [
      'Website Design & Development',
      'Service Portfolio Showcase',
      'Work Gallery Integration',
      'Contact & Inquiry Setup',
      'SEO Setup',
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Figma'],
    colors: [
      { hex: '#E65100', name: 'Print Orange' },
      { hex: '#0D0D0D', name: 'Ink Black' },
      { hex: '#FFF3E0', name: 'Warm White' },
      { hex: '#BF360C', name: 'Deep Red' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    animations: [
      'Gallery image hover zoom',
      'Scroll-reveal on service cards',
      'Fade-in section transitions',
      'Smooth anchor link scroll',
    ],
    metrics: [
      { val: '500+', key: 'Happy Clients' },
      { val: '19+', key: 'Services Showcased' },
      { val: '2015', key: 'Since' },
    ],
    liveUrl: '#',
    socialHandles: [],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0e0d30 50%, #4527a0 100%)',
    coverIcon: 'fa-print',
  },
  {
    id: 'amw-solar',
    cat: ['Website'],
    title: 'AMW Solar',
    industry: 'Renewable Energy & Solar Products',
    industryIcon: 'fa-solar-panel',
    tagline: 'Enquiry-driven catalog website for a solar flood-light seller. Get a quote, not a cart checkout.',
    desc: 'Designed and developed a product catalog website for AMW Solar, a business selling eco-friendly, cost-effective solar flood lights. Instead of a traditional e-commerce checkout, the site is built around a "Get Quote" enquiry flow suited to bulk and B2B solar-lighting purchases, presenting the product range with specs and letting buyers request pricing directly.',
    contribution: 'We built AMW Solar\'s full catalog site end-to-end, including the spec-sheet presentation for each flood-light model and a quote-request flow in place of a cart, matching how solar-lighting buyers actually purchase: bulk orders, price on request.',
    services: [
      'Website Design & Development',
      'Product Catalog Design',
      'Quote/Enquiry Flow Setup',
      'On-page SEO Setup',
      'Content Writing',
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Figma'],
    colors: [
      { hex: '#0D47A1', name: 'Solar Blue' },
      { hex: '#1976D2', name: 'Bright Blue' },
      { hex: '#E3F2FD', name: 'Sky Blue' },
      { hex: '#FFC107', name: 'Solar Yellow' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    animations: [
      'Fade-in on scroll for product sections',
      'Hover lift on product cards',
      'Smooth anchor link scroll',
    ],
    metrics: [
      { val: '<1s', key: 'Page Load Time' },
      { val: '100%', key: 'Mobile Responsive' },
    ],
    liveUrl: 'https://amwsolar.com',
    socialHandles: [],
    coverGradient: 'linear-gradient(135deg, #07091a 0%, #0d2040 50%, #0d47a1 100%)',
    coverIcon: 'fa-solar-panel',
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.id === slug)
}
