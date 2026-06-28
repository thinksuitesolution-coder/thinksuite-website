import type { Metadata, Viewport } from 'next'
import { Outfit, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import './animations.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ClientInit from '@/components/effects/ClientInit'
import ChatWidget from '@/components/ui/ChatWidget'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-h',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-b',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-m',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'ThinkSuite: B2B Business Automation and Custom SaaS Development',
    template: '%s | ThinkSuite Digital Agency',
  },
  description: 'Accelerate your market growth with ThinkSuite. We deliver enterprise AI integration, high performance custom web platforms, and Generative Engine Optimization solutions.',
  keywords: [
    'B2B business automation solutions', 'custom SaaS application development', 'enterprise AI tool integration',
    'custom workflow automation microservices', 'Generative Engine Optimization agency', 'high performance software engineering',
    'digital agency India', 'AI development company India', 'web development company India',
    'digital marketing agency India', 'custom software development', 'SEO services India',
    'AI automation India', 'GEO optimization agency', 'cloud native web platforms',
  ],
  authors: [{ name: 'ThinkSuite', url: 'https://thinksuite.in' }],
  creator: 'ThinkSuite',
  publisher: 'ThinkSuite',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://thinksuite.in',
    siteName: 'ThinkSuite',
    title: 'ThinkSuite, Full-Stack Digital Agency | AI, Software & Marketing',
    description: "India's leading full-stack digital agency. We build AI-powered software, craft compelling brands, and run data-driven marketing campaigns that deliver measurable ROI.",
    images: [{ url: '/assets/img/og-image.jpg', width: 1200, height: 630, alt: 'ThinkSuite Digital Agency India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThinkSuite, Full-Stack Digital Agency India',
    description: 'AI-powered software, digital marketing & branding agency. 200+ projects, 80+ happy clients across India.',
    images: ['/assets/img/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: { icon: '/assets/img/fevicon.svg' },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ThinkSuite',
  url: 'https://thinksuite.in',
  logo: 'https://thinksuite.in/assets/img/fevicon.svg',
  description: 'Full-stack digital agency in India offering AI software development, digital marketing, branding & design, and business consulting.',
  foundingDate: '2020',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'info@thinksuite.in',
    availableLanguage: ['English', 'Hindi'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Gurgaon',
    addressRegion: 'Delhi',
    addressCountry: 'IN',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Software Development', url: 'https://thinksuite.in/software-development' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Digital Marketing', url: 'https://thinksuite.in/digital-marketing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Branding & Design', url: 'https://thinksuite.in/branding-design' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI & Automation', url: 'https://thinksuite.in/ai-automation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Media & Advertising', url: 'https://thinksuite.in/media-advertising' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Consulting & Growth', url: 'https://thinksuite.in/consulting-growth' } },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Preconnect so FA CDN resolves faster */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
        <ClientInit />
      </body>
    </html>
  )
}

