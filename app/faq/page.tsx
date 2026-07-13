import type { Metadata } from 'next'
import Link from 'next/link'
import FAQSection from '@/components/sections/FAQSection'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | ThinkSuite Digital Agency',
  description: 'Answers to common questions about ThinkSuite\'s services, pricing, timelines, and process, straight from our Gurgaon-based digital agency and AI product team.',
  keywords: [
    'ThinkSuite FAQ', 'digital agency questions India', 'how much does a website cost India',
    'digital agency pricing Gurgaon', 'how long does app development take', 'AI development company questions',
    'digital marketing agency FAQ', 'ThinkSuite services explained',
  ],
}

export default function FaqPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>FAQ</span>
          </div>
          <span className="label">Got Questions?</span>
          <h1 className="mt-16">Frequently Asked <span className="grad-text">Questions</span></h1>
          <p className="mt-16" style={{ maxWidth: 560, color: 'var(--text2)', fontSize: 18 }}>
            Straight answers about what we do, how we price it, and how long it takes, from
            the same team that will actually be working on your project.
          </p>
        </div>
      </section>

      <FAQSection />
    </>
  )
}
