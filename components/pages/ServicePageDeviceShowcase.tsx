'use client'

import Link from 'next/link'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'
import s from './ServicePageDeviceShowcase.module.css'

interface StatItem { number: string; label: string }
interface HighlightItem { icon: string; title: string; desc: string }
interface IndustryItem { icon: string; name: string; useCase: string; tags: string[] }
interface ProcessItem { title: string; desc: string }
interface FaqItem { q: string; a: string }

interface Props {
  breadcrumb: string
  breadcrumbHref: string
  label: string
  title: string
  titleHighlight: string
  tagline: string
  deviceType?: 'browser' | 'phone'
  designType?: 'ui-ux' | 'brand-identity' | 'graphic-design' | 'product-design'
  stats: StatItem[]
  highlights: HighlightItem[]
  industries?: IndustryItem[]
  process: ProcessItem[]
  faqs: FaqItem[]
  sidebarLinks: { label: string; href: string }[]
  ctaTitle: string
  ctaTitleHighlight: string
  ctaDesc: string
}

function BrowserMockup() {
  return (
    <div className={s.mockupWrap}>
      <div className={`${s.floatBadge} ${s.floatBadge1}`}>
        <i className="fa-solid fa-code" />
        <span>Next.js 14</span>
      </div>
      <div className={`${s.floatBadge} ${s.floatBadge2}`}>
        <i className="fa-solid fa-gauge-high" />
        <span>98 / 100</span>
      </div>

      <div className={s.browserFrame}>
        {/* Browser chrome */}
        <div className={s.browserBar}>
          <div className={s.browserDots}>
            <span style={{ background: '#FF5F57' }} />
            <span style={{ background: '#FEBC2E' }} />
            <span style={{ background: '#28C840' }} />
          </div>
          <div className={s.browserAddress}>
            <i className="fa-solid fa-lock" />
            thinksuite.in
          </div>
        </div>

        {/* Fake website */}
        <div className={s.browserContent}>
          <div className={s.siteNav}>
            <span className={s.siteLogo}>ThinkSuite</span>
            <div className={s.siteNavLinks}>
              <span>Services</span>
              <span>Work</span>
              <span className={s.siteNavBtn}>Contact</span>
            </div>
          </div>

          <div className={s.siteHero}>
            <div className={s.siteHeroLeft}>
              <div className={s.sitePill}>Web Development</div>
              <div className={s.siteHeadline}>
                <span>Beautiful, Fast</span>
                <span className={s.siteHeadlineAccent}>Websites</span>
              </div>
              <div className={s.siteSub}>Next.js Â· TypeScript Â· Modern Stack</div>
              <div className={s.siteHeroCta}>Get Started â†’</div>
            </div>
            <div className={s.siteHeroVisual}>
              <div className={s.sitePreviewCard}>
                <div className={s.sitePreviewDot} />
                <div className={s.sitePreviewLines}>
                  <div />
                  <div />
                  <div />
                </div>
                <div className={s.sitePreviewBtn} />
              </div>
            </div>
          </div>

          <div className={s.siteMiniStats}>
            {[['50+', 'Sites'], ['<2s', 'Load'], ['98%', 'Score'], ['Next.js', 'Tech']].map(([n, l]) => (
              <div key={l} className={s.siteMiniStat}>
                <strong>{n}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PhoneMockup() {
  return (
    <div className={s.mockupWrap}>
      <div className={`${s.floatBadge} ${s.floatBadge1}`}>
        <i className="fa-solid fa-mobile-screen" />
        <span>iOS &amp; Android</span>
      </div>
      <div className={`${s.floatBadge} ${s.floatBadge2}`}>
        <i className="fa-solid fa-star" />
        <span>4.9 App Rating</span>
      </div>

      <div className={s.phoneFrame}>
        <div className={s.phoneCutout}>
          <div className={s.phoneCam} />
          <div className={s.phoneSpeaker} />
        </div>

        <div className={s.phoneContent}>
          <div className={s.appHeader}>
            <span className={s.appLogo}>ThinkSuite</span>
            <i className="fa-solid fa-bell" style={{ fontSize: 13, color: '#64748b' }} />
          </div>

          <div className={s.appHero}>
            <div className={s.appGreeting}>Welcome Back!</div>
            <div className={s.appSub}>Your app is live &amp; growing</div>
          </div>

          <div className={s.appGrid}>
            {[
              { icon: 'fa-users', label: 'Users', val: '12.4k' },
              { icon: 'fa-chart-line', label: 'Revenue', val: 'â‚¹2.8L' },
            ].map((c) => (
              <div key={c.label} className={s.appCard}>
                <div className={s.appCardIcon}>
                  <i className={`fa-solid ${c.icon}`} />
                </div>
                <div className={s.appCardVal}>{c.val}</div>
                <div className={s.appCardLabel}>{c.label}</div>
              </div>
            ))}
          </div>

          <div className={s.appNav}>
            {['fa-house', 'fa-magnifying-glass', 'fa-layer-group', 'fa-user'].map((ic) => (
              <div key={ic} className={`${s.appNavItem}${ic === 'fa-house' ? ` ${s.appNavActive}` : ''}`}>
                <i className={`fa-solid ${ic}`} />
              </div>
            ))}
          </div>
        </div>

        <div className={s.phoneHomeBar} />
      </div>
    </div>
  )
}

function UiUxMockup() {
  return (
    <div className={s.mockupWrap}>
      <div className={`${s.floatBadge} ${s.floatBadge1}`}>
        <i className="fa-solid fa-pen-nib" />
        <span>Figma Handoff</span>
      </div>
      <div className={`${s.floatBadge} ${s.floatBadge2}`}>
        <i className="fa-solid fa-flask" />
        <span>User Tested</span>
      </div>
      <div className={s.dtFrame}>
        <div className={s.dtHeader}>
          <div className={s.dtDots}>
            <span style={{ background: '#FF5F57' }} />
            <span style={{ background: '#FEBC2E' }} />
            <span style={{ background: '#28C840' }} />
          </div>
          <span className={s.dtTitle}>Design | ThinkSuite App</span>
          <div className={s.dtHeaderTools}>
            <div className={s.dtTool} /><div className={s.dtTool} /><div className={s.dtTool} />
          </div>
        </div>
        <div className={s.dtBody}>
          <div className={s.dtLeftPanel}>
            <div className={s.dtLayerTitle}>Layers</div>
            {['Frame 1', '  Header', '  Hero', '  Card A', '  Footer'].map((l, i) => (
              <div key={i} className={`${s.dtLayer}${i === 0 ? ` ${s.dtLayerActive}` : ''}`}>{l}</div>
            ))}
          </div>
          <div className={s.dtCanvas}>
            <div className={s.dtCanvasGrid}>
              <div className={s.dtWfHeader} />
              <div className={s.dtWfHero}>
                <div className={s.dtWfHeroText} />
                <div className={s.dtWfHeroText} style={{ width: '60%', opacity: 0.5 }} />
                <div className={s.dtWfBtn} />
              </div>
              <div className={s.dtWfCards}>
                <div className={s.dtWfCard} />
                <div className={s.dtWfCard} />
                <div className={s.dtWfCard} />
              </div>
            </div>
          </div>
          <div className={s.dtRightPanel}>
            <div className={s.dtLayerTitle}>Properties</div>
            <div className={s.dtPropRow}><span>W</span><div className={s.dtPropVal}>320px</div></div>
            <div className={s.dtPropRow}><span>H</span><div className={s.dtPropVal}>Auto</div></div>
            <div className={s.dtPropRow}><span>Fill</span><div className={s.dtColorSwatch} style={{ background: '#1a237e' }} /></div>
            <div className={s.dtPropRow}><span>R</span><div className={s.dtPropVal}>12</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BrandBoardMockup() {
  return (
    <div className={s.mockupWrap}>
      <div className={`${s.floatBadge} ${s.floatBadge1}`}>
        <i className="fa-solid fa-certificate" />
        <span>100% IP Yours</span>
      </div>
      <div className={`${s.floatBadge} ${s.floatBadge2}`}>
        <i className="fa-solid fa-book-open" />
        <span>Brand Guidelines</span>
      </div>
      <div className={s.bbFrame}>
        <div className={s.bbHeader}>
          <div className={s.browserDots}>
            <span style={{ background: '#FF5F57' }} />
            <span style={{ background: '#FEBC2E' }} />
            <span style={{ background: '#28C840' }} />
          </div>
          <span className={s.bbHeaderTitle}>Brand Identity System</span>
        </div>
        <div className={s.bbLogoArea}>
          <div className={s.bbLogoMark}>TS</div>
          <div>
            <div className={s.bbBrandName}>ThinkSuite</div>
            <div className={s.bbBrandTagline}>Strategy &amp; Design</div>
          </div>
        </div>
        <div className={s.bbSection}>
          <div className={s.bbSectionLabel}>Color System</div>
          <div className={s.bbColorRow}>
            {['#1a237e','#00bcd4','#7c3aed','#0f172a','#f8fafc'].map((c, i) => (
              <div key={i} className={s.bbSwatch} style={{ background: c, border: c === '#f8fafc' ? '1px solid #e2e8f0' : 'none' }} />
            ))}
          </div>
        </div>
        <div className={s.bbSection}>
          <div className={s.bbSectionLabel}>Typography</div>
          <div className={s.bbTypoRow}>
            <div className={s.bbTypoAa}>Aa</div>
            <div>
              <div className={s.bbTypoFont}>Plus Jakarta Sans</div>
              <div className={s.bbTypoWeights}>400 · 600 · 800</div>
            </div>
          </div>
        </div>
        <div className={s.bbFooter}>
          <div className={s.bbRule} />
          <div className={s.bbRule} style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  )
}

function GraphicDesignMockup() {
  return (
    <div className={s.mockupWrap}>
      <div className={`${s.floatBadge} ${s.floatBadge1}`}>
        <i className="fa-solid fa-print" />
        <span>Print Ready</span>
      </div>
      <div className={`${s.floatBadge} ${s.floatBadge2}`}>
        <i className="fa-solid fa-bolt" />
        <span>48hr Delivery</span>
      </div>
      <div className={s.gcFrame}>
        <div className={s.gcToolbar}>
          <div className={s.gcDots}>
            <span style={{ background: '#FF5F57' }} />
            <span style={{ background: '#FEBC2E' }} />
            <span style={{ background: '#28C840' }} />
          </div>
          <div className={s.gcTools}>
            {['fa-arrow-pointer','fa-pen','fa-shapes','fa-font','fa-image'].map((t, i) => (
              <div key={i} className={`${s.gcTool}${i === 0 ? ` ${s.gcToolActive}` : ''}`}>
                <i className={`fa-solid ${t}`} />
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div className={s.gcExport}>Export</div>
        </div>
        <div className={s.gcCanvasArea}>
          <div className={s.gcPost}>
            <div className={s.gcPostBg}>
              <div className={s.gcPostTag}>New Launch</div>
              <div className={s.gcPostHeading}>Bold Design,<br />Real Impact</div>
              <div className={s.gcPostSub}>ThinkSuite Creative Studio</div>
              <div className={s.gcPostCta}>Explore</div>
            </div>
          </div>
          <div className={s.gcHandle} style={{ top: 'calc(50% - 82px)', left: 'calc(50% - 82px)' }} />
          <div className={s.gcHandle} style={{ top: 'calc(50% - 82px)', right: 'calc(50% - 82px)' }} />
          <div className={s.gcHandle} style={{ bottom: 'calc(50% - 82px)', left: 'calc(50% - 82px)' }} />
          <div className={s.gcHandle} style={{ bottom: 'calc(50% - 82px)', right: 'calc(50% - 82px)' }} />
        </div>
        <div className={s.gcPalette}>
          {['#1a237e','#00bcd4','#7c3aed','#f59e0b','#ef4444','#10b981','#f8fafc'].map((c, i) => (
            <div key={i} className={s.gcPaletteColor} style={{ background: c, border: c === '#f8fafc' ? '1px solid #334155' : 'none' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductDesignMockup() {
  return (
    <div className={s.mockupWrap}>
      <div className={`${s.floatBadge} ${s.floatBadge1}`}>
        <i className="fa-solid fa-file-code" />
        <span>Dev-Ready Specs</span>
      </div>
      <div className={`${s.floatBadge} ${s.floatBadge2}`}>
        <i className="fa-solid fa-rotate" />
        <span>Iterative Design</span>
      </div>
      <div className={s.pdFrame}>
        <div className={s.pdHeader}>
          <div className={s.pdHeaderDots}>
            <span style={{ background: '#FF5F57' }} />
            <span style={{ background: '#FEBC2E' }} />
            <span style={{ background: '#28C840' }} />
          </div>
          <span className={s.pdTitle}>Product Prototype v2.4</span>
          <div className={s.pdBadge}>Preview</div>
        </div>
        <div className={s.pdBody}>
          <div className={s.pdScreen}>
            <div className={s.pdScreenBar}>
              <div className={s.pdDot} /><div className={s.pdDot} /><div className={s.pdDot} />
            </div>
            <div className={s.pdScreenContent}>
              <div className={s.pdScreenHero} />
              <div className={s.pdScreenCard}>
                <div className={s.pdCardLine} />
                <div className={s.pdCardLine} style={{ width: '65%' }} />
                <div className={s.pdCardBtn} />
              </div>
            </div>
          </div>
          <div className={s.pdArrow}><i className="fa-solid fa-arrow-right" /></div>
          <div className={`${s.pdScreen} ${s.pdScreenAlt}`}>
            <div className={s.pdScreenBar}>
              <div className={s.pdDot} /><div className={s.pdDot} /><div className={s.pdDot} />
            </div>
            <div className={s.pdScreenContent}>
              <div className={s.pdScreenList}>
                {[1,2,3].map(i => (
                  <div key={i} className={s.pdListItem}>
                    <div className={s.pdListIcon} />
                    <div className={s.pdListLine} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={s.pdAnnotation}>
          <i className="fa-solid fa-comment-dots" />
          <span>Approved, ready for dev handoff</span>
        </div>
      </div>
    </div>
  )
}

export default function ServicePageDeviceShowcase({
  breadcrumb, breadcrumbHref, label, title, titleHighlight, tagline,
  deviceType = 'browser',
  designType,
  stats, highlights, industries, process: steps, faqs, sidebarLinks,
  ctaTitle, ctaTitleHighlight, ctaDesc,
}: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={s.heroGrid}>
            <div className={s.heroLeft}>
              <div className="breadcrumb mb-16">
                <Link href="/">Home</Link>
                <span>/</span>
                <Link href={breadcrumbHref}>{breadcrumb}</Link>
                <span>/</span>
                <span style={{ color: 'var(--text)' }}>{title} {titleHighlight}</span>
              </div>
              <span className="label">{label}</span>
              <h1 className="mt-16">
                {title} <span className="grad-text">{titleHighlight}</span>
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text2)', marginTop: 18, maxWidth: 480, lineHeight: 1.78 }}>
                {tagline}
              </p>
              <div className={s.heroCtas}>
                <Link href="/contact" className="btn btn-primary">
                  Start Your Project <i className="fa-solid fa-arrow-right" />
                </Link>
                <Link href="#capabilities" className="btn btn-outline">
                  See Capabilities <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} />
                </Link>
              </div>
            </div>

            <div className={s.heroRight}>
              {designType === 'ui-ux' ? <UiUxMockup /> :
               designType === 'brand-identity' ? <BrandBoardMockup /> :
               designType === 'graphic-design' ? <GraphicDesignMockup /> :
               designType === 'product-design' ? <ProductDesignMockup /> :
               deviceType === 'phone' ? <PhoneMockup /> : <BrowserMockup />}
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ STATS STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className={s.statsRow}>
        {stats.map((stat, i) => (
          <div key={i} className={s.statItem}>
            <span className={s.statNum}>{stat.number}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* â”€â”€ HIGHLIGHTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="capabilities" className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">What We Build</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">{title} {titleHighlight}</span> Capabilities
            </h2>
          </div>
          <div className={s.hlGrid}>
            {highlights.map((item, i) => (
              <div
                key={i}
                className={`${s.hlCard}${i % 2 !== 0 ? ` ${s.hlCardRev}` : ''} reveal`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className={s.hlIcon}>
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <div className={s.hlText}>
                  <h3 className={s.hlTitle}>{item.title}</h3>
                  <p className={s.hlDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- ANY BUSINESS SECTION -------------------------------------------- */}
      <section className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">Built for Any Business</span>
            <h2 style={{ marginTop: 12 }}>
              Whatever You Do,{' '}
              <span className="grad-text">We Build It Right</span>
            </h2>
            <p style={{ marginTop: 14, color: 'var(--text2)', maxWidth: 600, margin: '14px auto 0', fontSize: 16, lineHeight: 1.75 }}>
              We don&apos;t limit ourselves to specific industries. Share your business, your city, and your goal, and we create something completely custom for you.
            </p>
          </div>

          <div className={s.ticker}>
            <div className={s.tickerRow}>
              <div className={s.tickerTrack}>
                {[
                  'Salon Branding Delhi', 'Clothing eCommerce NCR', 'Dental Clinic Logo', 'Restaurant Identity', 'Coaching Institute Brand', 'D2C Fashion Label', 'Interior Design Studio', 'Gym & Fitness Brand', 'Hotel Brand Identity', 'IT Startup Logo', 'Photography Studio Brand', 'Event Company Design',
                  'Salon Branding Delhi', 'Clothing eCommerce NCR', 'Dental Clinic Logo', 'Restaurant Identity', 'Coaching Institute Brand', 'D2C Fashion Label', 'Interior Design Studio', 'Gym & Fitness Brand', 'Hotel Brand Identity', 'IT Startup Logo', 'Photography Studio Brand', 'Event Company Design',
                ].map((kw, i) => <span key={i} className={s.tickerChip}>{kw}</span>)}
              </div>
            </div>
            <div className={s.tickerRow}>
              <div className={`${s.tickerTrack} ${s.tickerTrackRtl}`}>
                {[
                  'Bakery Packaging Design', 'Real Estate Builder Brand', 'Beauty Parlour Logo', 'Online Tutoring Platform', 'Yoga Studio Identity', 'Boutique Fashion Brand', 'Ayurveda Clinic Design', 'Travel Agency Branding', 'Cafe Visual Identity', 'Architect Studio Brand', 'Skincare Brand Packaging', 'Gaming Startup Identity',
                  'Bakery Packaging Design', 'Real Estate Builder Brand', 'Beauty Parlour Logo', 'Online Tutoring Platform', 'Yoga Studio Identity', 'Boutique Fashion Brand', 'Ayurveda Clinic Design', 'Travel Agency Branding', 'Cafe Visual Identity', 'Architect Studio Brand', 'Skincare Brand Packaging', 'Gaming Startup Identity',
                ].map((kw, i) => <span key={i} className={s.tickerChip}>{kw}</span>)}
              </div>
            </div>
          </div>

          <div className={s.promiseGrid}>
            <div className={`${s.promiseCard} reveal`}>
              <div className={s.promiseIcon}><i className="fa-solid fa-wand-magic-sparkles" /></div>
              <h4>Fully Custom</h4>
              <p>No templates. No copy-paste. Every design is built from scratch around your business, your audience, and your market.</p>
            </div>
            <div className={`${s.promiseCard} reveal`} style={{ transitionDelay: '0.08s' }}>
              <div className={s.promiseIcon}><i className="fa-solid fa-shuffle" /></div>
              <h4>Any Combination</h4>
              <p>Salon in Delhi. Clothing brand shipping pan-India. SaaS startup in Austin. D2C label going global. We adapt to you, not the other way around.</p>
            </div>
            <div className={`${s.promiseCard} reveal`} style={{ transitionDelay: '0.16s' }}>
              <div className={s.promiseIcon}><i className="fa-solid fa-hand-holding-heart" /></div>
              <h4>Handled With Care</h4>
              <p>From first concept to final file, we stay involved and treat your brand like our own. Your visual presence, in safe hands.</p>
            </div>
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 40 }}>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7 }}>
              Tell us what you do: any business, any city, any size,{' '}
              <a href="/contact" style={{ color: 'var(--cyan)', fontWeight: 700 }}>
                and we&apos;ll build something great for it.
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* â”€â”€ PROCESS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="section section-tinted">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">How We Work</span>
            <h2 style={{ marginTop: 12 }}>
              Our <span className="grad-text">4-Step Process</span>
            </h2>
          </div>
          <div className={s.processRow}>
            {steps.map((step, i) => (
              <div
                key={i}
                className={`${s.processItem} reveal`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className={s.processCircle}>{i + 1}</div>
                <div className={s.processTitle}>{step.title}</div>
                <p className={s.processDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="section">
        <div className="container">
          <div className="title-block center reveal">
            <span className="label">Common Questions</span>
            <h2 style={{ marginTop: 12 }}>
              Frequently Asked <span className="grad-text">Questions</span>
            </h2>
          </div>
          <div className={s.faqInner}>
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <div
                  className="faq-q"
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  onKeyDown={(e) => e.key === 'Enter' && setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <i className="fa-solid fa-chevron-down" />
                </div>
                <div className="faq-a">
                  <div className="faq-a-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, fontFamily: 'var(--font-m)', letterSpacing: 1 }}>
              EXPLORE RELATED SERVICES
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {sidebarLinks.map((l) => (
                <Link key={l.href} href={l.href} className="btn btn-outline btn-sm">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's Build Together"
        title={ctaTitle}
        titleHighlight={ctaTitleHighlight}
        subtitle={ctaDesc}
      />
    </>
  )
}
