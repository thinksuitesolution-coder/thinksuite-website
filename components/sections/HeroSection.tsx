'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import s from './HeroSection.module.css'

const SEARCHES = [
  {
    query: 'best interior designer in Delhi',
    count: '2,34,000',
    results: [
      { title: 'Livspace | Award-Winning Interiors', url: 'livspace.com › delhi', desc: 'Top-rated interior designers. 500+ projects delivered. Book free consultation today.' },
      { title: 'Urban Company: Home Interior Services', url: 'urbancompany.com › interiors', desc: 'Verified interior designers near you. Full home packages from ₹1.29L.' },
    ],
  },
  {
    query: 'CA firm for GST filing near me',
    count: '1,87,000',
    results: [
      { title: 'ClearTax | GST Filing and CA Services', url: 'cleartax.in › ca-services', desc: 'Expert CA assistance for GST returns, ITR filing. Trusted by 6M+ Indians.' },
      { title: 'Tax2Win: Online CA Consultation', url: 'tax2win.in › ca', desc: 'Connect with top CAs for GST, income tax, audit. Starting ₹499/month.' },
    ],
  },
  {
    query: 'wedding photographer South Delhi',
    count: '3,12,000',
    results: [
      { title: 'WeddingNama | Candid Photography', url: 'weddingnama.com', desc: 'Award-winning candid photography. Capturing your moments beautifully since 2012.' },
      { title: 'Shutterdown Studios Delhi', url: 'shutterdown.in', desc: 'Cinematic wedding films & candid photography. Covering Delhi NCR & beyond.' },
    ],
  },
  {
    query: 'digital marketing agency Gurugram',
    count: '1,45,000',
    results: [
      { title: 'Social Panga | Digital Marketing', url: 'socialpanga.com', desc: 'Creative digital campaigns that drive real results. Meta, Google Ads & SEO.' },
      { title: 'iProspect India | Performance Agency', url: 'iprospect.com › india', desc: 'Data-driven marketing. ROI-focused strategies for growing brands.' },
    ],
  },
  {
    query: 'gym with personal trainer near CP Delhi',
    count: '98,400',
    results: [
      { title: 'Cult.fit | Connaught Place Branch', url: 'cult.fit › delhi › cp', desc: 'Group workouts, yoga & personal training. Join for ₹999/month. First class free.' },
      { title: "Gold's Gym Connaught Place", url: 'goldsgym.in › delhi-cp', desc: 'State-of-the-art equipment and certified personal trainers. Join today.' },
    ],
  },
]

const BUBBLE_QUERIES = [
  { text: 'best CA firm near me', delay: '0s' },
  { text: 'interior designer Delhi NCR', delay: '0.8s' },
  { text: 'event planner South Delhi', delay: '1.6s' },
  { text: 'digital marketing Gurugram', delay: '0.4s' },
  { text: 'dentist Vasant Kunj', delay: '1.2s' },
  { text: 'wedding photographer Delhi', delay: '2s' },
]

const MARQUEE_KEYWORDS = [
  'Website Design', 'Brand Identity', 'AI Automation', 'Google & Meta Ads',
  'Social Media Marketing', 'Chatbot Development', 'SaaS Products', 'Growth Strategy',
  'PR Campaigns', 'Outdoor Advertising', 'Market Research', 'Influencer Marketing',
  'Content Marketing', 'SEO Optimization', 'Workflow Automation', 'Startup Consulting',
]

export default function HeroSection() {
  const [searchIdx, setSearchIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<'typing' | 'results' | 'clearing'>('typing')
  const [visibleResults, setVisibleResults] = useState<number[]>([])

  useEffect(() => {
    const current = SEARCHES[searchIdx]
    let charIdx = 0
    setTyped('')
    setPhase('typing')
    setVisibleResults([])

    const typeTimer = setInterval(() => {
      charIdx++
      setTyped(current.query.slice(0, charIdx))

      if (charIdx >= current.query.length) {
        clearInterval(typeTimer)

        setTimeout(() => {
          setPhase('results')
          current.results.forEach((_, i) => {
            setTimeout(() => {
              setVisibleResults(prev => [...prev, i])
            }, i * 220)
          })
        }, 350)

        setTimeout(() => {
          setPhase('clearing')
          setTimeout(() => {
            setSearchIdx(prev => (prev + 1) % SEARCHES.length)
          }, 500)
        }, 4200)
      }
    }, 48)

    return () => clearInterval(typeTimer)
  }, [searchIdx])

  const current = SEARCHES[searchIdx]

  return (
    <section className={s.hero}>

      <div className={s.heroBg} aria-hidden="true">
        <div className={s.blob1} />
        <div className={s.blob2} />
        <div className={s.blob3} />
      </div>

      <div className={`container ${s.contentLayer}`}>

        {/* ── Centered headline ── */}
        <div className={s.headlineWrap}>
          <p className={s.line1}>Your Clients Are Searching.</p>
          <h1 className={`grad-text ${s.line2}`}>Are You There?</h1>
        </div>

        {/* ── Full-width search universe ── */}
        <div className={s.searchUniverse}>

          {/* Live indicator */}
          <div className={s.liveIndicator}>
            <span className={s.liveDotSm} />
            <span>{47 + (searchIdx * 3)} searches / min</span>
          </div>

          {/* Floating query bubbles, hidden on mobile */}
          {BUBBLE_QUERIES.map((b, i) => (
            <div
              key={i}
              className={`${s.queryBubble} ${s[`bPos${i}`]} ${searchIdx % BUBBLE_QUERIES.length === i ? s.bubbleActive : ''}`}
              style={{ animationDelay: b.delay }}
            >
              <i className="fa-solid fa-magnifying-glass" />
              <span>{b.text}</span>
            </div>
          ))}

          {/* Central Google search card */}
          <div className={s.searchCard} data-phase={phase}>

            <div className={s.gLogo}>
              <span style={{ color: '#4285F4' }}>G</span>
              <span style={{ color: '#EA4335' }}>o</span>
              <span style={{ color: '#FBBC05' }}>o</span>
              <span style={{ color: '#4285F4' }}>g</span>
              <span style={{ color: '#34A853' }}>l</span>
              <span style={{ color: '#EA4335' }}>e</span>
            </div>

            <div className={s.searchBar}>
              <i className={`fa-solid fa-magnifying-glass ${s.searchIcon}`} />
              <div className={s.searchInput}>
                <span>{typed}</span>
                <span className={s.cursor} />
              </div>
              <i className={`fa-solid fa-microphone ${s.micIcon}`} />
            </div>

            <div className={s.resultsArea}>
              <p className={s.resultCount}>
                {phase !== 'typing'
                  ? <>About <strong>{current.count}</strong> results</>
                  : <>&nbsp;</>
                }
              </p>

              <div className={s.resultsList}>
                {current.results.map((r, i) => (
                  <div
                    key={`${searchIdx}-${i}`}
                    className={`${s.resultItem} ${visibleResults.includes(i) ? s.resultVisible : ''}`}
                  >
                    <span className={s.resultFavicon}>
                      <i className="fa-solid fa-globe" />
                    </span>
                    <div className={s.resultBody}>
                      <div className={s.resultTitle}>{r.title}</div>
                      <div className={s.resultUrl}>{r.url}</div>
                      <div className={s.resultDesc}>{r.desc}</div>
                    </div>
                  </div>
                ))}

                <div className={s.missingSlot}>
                  <span className={s.missingFavicon}>
                    <i className="fa-regular fa-circle-question" />
                  </span>
                  <div className={s.missingBody}>
                    <div className={s.missingTitle}>Your Business?</div>
                    <div className={s.missingUrl}>yourbusiness.com</div>
                    <div className={s.missingDesc}>Your clients are searching right now…</div>
                  </div>
                  <span className={s.notFoundBadge}>Not Visible</span>
                </div>
              </div>
            </div>

            <div className={s.searchCallout}>
              <i className="fa-solid fa-triangle-exclamation" />
              Clients are finding your competitors.{' '}
              <strong>Are you there?</strong>
            </div>

          </div>
        </div>

        {/* ── Sub copy ── */}
        <p className={s.sub}>
          Every day, crores of people search for businesses like yours, on Google and on AI.
          ThinkSuite makes sure they find <strong>you</strong>, not your competitor.
          We handle <strong>SEO, ads, brand &amp; web</strong> under one roof.
        </p>

        {/* ── CTAs ── */}
        <div className={s.ctaRow}>
          <Link href="/contact" className="btn btn-primary btn-lg">
            <i className="fa-solid fa-calendar-check" />
            Get Free Strategy Call
          </Link>
          <Link href="/services" className="btn btn-outline btn-lg">
            Explore Our Work
            <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>

        {/* ── Platform stats strip ── */}
        <div className={s.platformStrip}>
          <div className={s.platformItem}>
            <div className={s.platformIconWrap} style={{ background: 'rgba(66,133,244,0.1)' }}>
              <i className="fa-brands fa-google" style={{ color: '#4285F4' }} />
            </div>
            <div className={s.platformText}>
              <strong>8.5 Billion</strong>
              <span>Google searches every single day</span>
            </div>
          </div>

          <div className={s.platformDivider} />

          <div className={s.platformItem}>
            <div className={s.platformIconWrap} style={{ background: 'rgba(16,163,127,0.1)' }}>
              <i className="fa-solid fa-robot" style={{ color: '#10a37f' }} />
            </div>
            <div className={s.platformText}>
              <strong>100M+ users</strong>
              <span>ask AI for business recommendations daily</span>
            </div>
          </div>

          <div className={s.platformDivider} />

          <div className={s.platformItem}>
            <div className={s.platformIconWrap} style={{ background: 'rgba(249,115,22,0.1)' }}>
              <i className="fa-solid fa-circle-question" style={{ color: '#f97316' }} />
            </div>
            <div className={s.platformText}>
              <strong className={s.platformQ}>Do both recommend you?</strong>
              <span>Most local businesses are invisible on both</span>
            </div>
          </div>
        </div>

        {/* ── Trust bar ── */}
        <div className={s.trustBar}>
          {[
            { num: '120+', label: 'Projects' },
            { num: '50+',  label: 'Clients'  },
            { num: '24',   label: 'Services'  },
            { num: '4',    label: 'AI Products' },
          ].map(t => (
            <div key={t.label} className={s.trustStat}>
              <span className={s.trustNum}>{t.num}</span>
              <span className={s.trustLabel}>{t.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ── Scrolling service keywords marquee ── */}
      <div className={s.marqueeWrap}>
        <div className={s.marqueeTrack}>
          {[...MARQUEE_KEYWORDS, ...MARQUEE_KEYWORDS].map((k, i) => (
            <span key={i} className={s.marqueeItem}>
              <span className={s.marqueeDot}>·</span>
              {k}
            </span>
          ))}
        </div>
      </div>

      <i className={`fa-solid fa-chevron-down ${s.scrollHint}`} />
    </section>
  )
}
