import type { Metadata, Viewport } from 'next'
import { Outfit, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import './animations.css'
import ConditionalNav from '@/components/layout/ConditionalNav'
import ClientInit from '@/components/effects/ClientInit'
import { AuthProvider } from '@/lib/auth-context'

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
    default: 'ThinkSuite: Digital Agency & AI Automation, Gurgaon',
    template: '%s | ThinkSuite Digital Agency',
  },
  description: 'ThinkSuite is a Gurgaon-based digital agency and AI product company. We build websites, run SEO campaigns, and create AI automation tools for businesses.',
  keywords: [
    'digital agency Gurgaon', 'AI automation company India', 'web development agency India',
    'digital marketing agency Gurgaon', 'custom software development company', 'SEO services India',
    'AI chatbot development India', 'full service digital agency', 'branding and design agency Gurgaon',
    'SaaS product development company', 'business consulting Gurgaon', 'GEO and AI search optimization agency',
    'custom SaaS platform development company India', 'AI powered marketing agency India', 'web and mobile app development Gurgaon',
  ],
  authors: [{ name: 'ThinkSuite', url: 'https://thinksuite.in' }],
  creator: 'ThinkSuite',
  publisher: 'ThinkSuite',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://thinksuite.in',
    siteName: 'ThinkSuite',
    title: 'ThinkSuite | Digital Agency for Web, Marketing & AI, India',
    description: 'ThinkSuite is a Gurgaon-based digital agency. We build websites and apps, run SEO and paid ad campaigns, and set up AI automation for businesses.',
    images: [{ url: '/assets/img/og-image.jpg', width: 1200, height: 630, alt: 'ThinkSuite Digital Agency India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThinkSuite, Full-Stack Digital Agency in Gurgaon',
    description: 'AI-powered software development, digital marketing, and branding agency based in Gurgaon, India, serving businesses across every industry.',
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
  description: 'Full-stack digital agency in Gurgaon, India offering AI software development, digital marketing, branding and design, and business consulting, delivered by one in-house team.',
  foundingDate: '2020',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: '+91-93118-21726',
    email: 'info@thinksuite.in',
    availableLanguage: ['English', 'Hindi'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Gurgaon',
    addressRegion: 'Haryana',
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
        <AuthProvider>
          <ConditionalNav>{children}</ConditionalNav>
          <ClientInit />
        </AuthProvider>
      </body>
    </html>
  )
}

