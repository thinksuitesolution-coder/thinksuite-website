'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import ToolAuthModal from '@/components/tools/ToolAuthModal'

const aiTools = [
  { label: 'Lead Generation', href: '/tools/lead-generation', desc: 'Google Maps, IndiaMart, JustDial & LinkedIn', icon: 'fa-crosshairs', iconBg: 'rgba(26,35,126,0.10)', color: '#1a237e', live: true },
  { label: 'Content Marketing', href: '/tools/content', desc: 'AI blogs, social posts & ad copies', icon: 'fa-pen-nib', iconBg: 'rgba(124,58,237,0.10)', color: '#7c3aed', live: true },
  { label: 'Video Studio', href: '/tools/video', desc: 'Text-to-video with AI avatars & voice sync', icon: 'fa-film', iconBg: 'rgba(26,35,126,0.10)', color: '#1a237e', live: false },
  { label: 'Voice AI', href: '/tools/voice', desc: '500+ voices, 30+ languages, voice clone', icon: 'fa-microphone', iconBg: 'rgba(5,150,105,0.10)', color: '#059669', live: false },
  { label: 'Image Studio', href: '/tools/imagestudio', desc: 'BG removal, 4x upscale, AI inpainting', icon: 'fa-wand-magic-sparkles', iconBg: 'rgba(217,119,6,0.10)', color: '#d97706', live: false },
]

const products = [
  { label: 'ThinkVirtual', href: '/ecosystem/thinkvirtual', desc: 'Network connecting & project platform', icon: 'fa-diagram-project', color: '#0891b2', iconBg: 'rgba(8,145,178,0.12)' },
  { label: 'WavCart', href: '/ecosystem/wavcart', desc: 'eStore & automation for local vendors', icon: 'fa-cart-shopping', color: '#059669', iconBg: 'rgba(5,150,105,0.12)' },
  { label: 'Visibility', href: '/ecosystem/visibility', desc: 'Rank through GEO & AI search', icon: 'fa-eye', color: '#7c3aed', iconBg: 'rgba(124,58,237,0.12)' },
  { label: 'Thinksuite', href: '/ecosystem/Thinksuite', desc: 'Targeted leads by occupation & location', icon: 'fa-crosshairs', color: '#d97706', iconBg: 'rgba(217,119,6,0.12)' },
]

const services = [
  { cat: 'Software Development', href: '/software-development', links: [{ label: 'Web Development', href: '/web-development' }, { label: 'Mobile App Development', href: '/mobile-app-development' }, { label: 'Custom Software', href: '/custom-software' }, { label: 'SaaS Products', href: '/saas-products' }] },
  { cat: 'Digital Marketing', href: '/digital-marketing', links: [{ label: 'SEO & GEO Optimization', href: '/seo-optimization' }, { label: 'Social Media Marketing', href: '/social-media-marketing' }, { label: 'Google & Meta Ads', href: '/google-meta-ads' }, { label: 'Content Marketing', href: '/content-marketing' }] },
  { cat: 'Branding & Design', href: '/branding-design', links: [{ label: 'UI/UX Design', href: '/ui-ux-design' }, { label: 'Brand Identity', href: '/brand-identity' }, { label: 'Graphic Design', href: '/graphic-design' }, { label: 'Product Design', href: '/product-design' }] },
  { cat: 'AI & Automation', href: '/ai-automation', links: [{ label: 'AI Tools Development', href: '/ai-tools-development' }, { label: 'Chatbot Solutions', href: '/chatbot-solutions' }, { label: 'Workflow Automation', href: '/workflow-automation' }, { label: 'AI Marketing Systems', href: '/ai-marketing-systems' }] },
  { cat: 'Media & Advertising', href: '/media-advertising', links: [{ label: 'Indoor Advertising', href: '/indoor-advertising' }, { label: 'Outdoor Advertising', href: '/outdoor-advertising' }, { label: 'Influencer Marketing', href: '/influencer-marketing' }, { label: 'PR Campaigns', href: '/pr-campaigns' }] },
  { cat: 'Consulting & Growth', href: '/consulting-growth', links: [{ label: 'Startup Consulting', href: '/startup-consulting' }, { label: 'Business Strategy', href: '/business-strategy' }, { label: 'Growth Planning', href: '/growth-planning' }, { label: 'Market Research', href: '/market-research' }] },
]

const mobileLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'AI News', href: '/ai-news' },
  { label: 'AI Tools', href: '/tools', hasChildren: 'tools' },
  { label: 'Services', href: '/services', hasChildren: 'services' },
  { label: 'Products', href: '/ecosystem', hasChildren: 'products' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('signup')
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()
  const isToolPage = pathname?.startsWith('/tools/')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const openLogin = () => { setAuthTab('login'); setAuthOpen(true) }
  const openSignup = () => { setAuthTab('signup'); setAuthOpen(true) }

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0].toUpperCase() ?? '?'

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link href="/" className="logo" onClick={() => setMenuOpen(false)}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.55rem', letterSpacing: '-0.025em', lineHeight: 1 }}>
              <span style={{ color: '#0f172a' }}>Think</span>
              <span style={{ background: 'linear-gradient(135deg, #1a237e 0%, #00bcd4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Suite</span>
            </span>
          </Link>

          <ul className="nav-links">
            <li className="nav-item"><Link href="/" className="nav-link">Home</Link></li>
            <li className="nav-item"><Link href="/about" className="nav-link">About</Link></li>
            <li className="nav-item"><Link href="/projects" className="nav-link">Projects</Link></li>
            <li className="nav-item"><Link href="/ai-news" className="nav-link">AI News</Link></li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: 'default' }}>
                AI Tools <i className="fa-solid fa-chevron-down" style={{ fontSize: 10, marginLeft: 4 }} />
              </span>
              <div className="mega-dropdown" style={{ width: 400, left: -80 }}>
                <div style={{ paddingBottom: 10, borderBottom: '1px solid var(--border)', marginBottom: 10 }}>
                  <Link href="/tools" className="mega-link" style={{ fontWeight: 700, color: 'var(--cyan)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
                    <i className="fa-solid fa-bolt" style={{ fontSize: 11 }} />All AI Tools
                  </Link>
                </div>
                {aiTools.map((t) =>
                  t.live ? (
                    <Link key={t.href} href={t.href} className="prod-nav-card">
                      <span className="prod-nav-icon" style={{ background: t.iconBg, color: t.color }}>
                        <i className={`fa-solid ${t.icon}`} />
                      </span>
                      <span style={{ flex: 1 }}>
                        <span className="prod-nav-name">{t.label}</span>
                        <span className="prod-nav-desc">{t.desc}</span>
                      </span>
                    </Link>
                  ) : (
                    <div key={t.href} className="prod-nav-card" style={{ opacity: 0.65, cursor: 'default' }}>
                      <span className="prod-nav-icon" style={{ background: t.iconBg, color: t.color }}>
                        <i className={`fa-solid ${t.icon}`} />
                      </span>
                      <span style={{ flex: 1 }}>
                        <span className="prod-nav-name">{t.label}</span>
                        <span className="prod-nav-desc">{t.desc}</span>
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: '#64748b', borderRadius: 4, padding: '2px 7px', flexShrink: 0, letterSpacing: 0.3 }}>
                        Coming Soon
                      </span>
                    </div>
                  )
                )}
              </div>
            </li>
            <li className="nav-item">
              <Link href="/services" className="nav-link">
                Services <i className="fa-solid fa-chevron-down" style={{ fontSize: 10, marginLeft: 4 }} />
              </Link>
              <div className="mega-dropdown" style={{ left: 'auto', right: 0 }}>
                <div style={{ padding: '8px 20px 4px', borderBottom: '1px solid rgba(37,99,235,0.1)', marginBottom: 8 }}>
                  <Link href="/services" className="mega-link" style={{ fontWeight: 700, color: 'var(--cyan)', fontSize: 13 }}>
                    <i className="fa-solid fa-th-large" style={{ marginRight: 7, fontSize: 11 }} />All Services
                  </Link>
                </div>
                <div className="mega-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                  {services.map((col) => (
                    <div key={col.cat}>
                      <Link href={col.href} className="mega-col-title" style={{ display: 'block', textDecoration: 'none' }}>{col.cat}</Link>
                      {col.links.map((l) => (
                        <Link key={l.href} href={l.href} className="mega-link">{l.label}</Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: 'default' }}>
                Products <i className="fa-solid fa-chevron-down" style={{ fontSize: 10, marginLeft: 4 }} />
              </span>
              <div className="mega-dropdown" style={{ width: 460, left: -120 }}>
                <div style={{ paddingBottom: 10, borderBottom: '1px solid rgba(37,99,235,0.1)', marginBottom: 10 }}>
                  <Link href="/ecosystem" className="mega-link" style={{ fontWeight: 700, color: 'var(--cyan)', fontSize: 13 }}>
                    <i className="fa-solid fa-th-large" style={{ marginRight: 7, fontSize: 11 }} />All Products
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {products.map((p) => (
                    <Link key={p.href} href={p.href} className="prod-nav-card">
                      <span className="prod-nav-icon" style={{ background: p.iconBg, color: p.color }}>
                        <i className={`fa-solid ${p.icon}`} />
                      </span>
                      <span>
                        <span className="prod-nav-name">{p.label}</span>
                        <span className="prod-nav-desc">{p.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          </ul>

          {/* Right side: conditional based on page */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {!loading && (
              isToolPage ? (
                /* Tool pages: show Login/Sign Up or avatar */
                user ? (
                  <div ref={userMenuRef} style={{ position: 'relative' }}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1.5px solid rgba(26,35,126,0.18)', borderRadius: 100, padding: '5px 12px 5px 5px', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="avatar" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                      ) : (
                        <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#1a237e,#00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>{initials}</span>
                      )}
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', maxWidth: 90, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {user.displayName?.split(' ')[0] ?? 'Account'}
                      </span>
                      <i className="fa-solid fa-chevron-down" style={{ fontSize: 9, color: '#64748b' }} />
                    </button>
                    {userMenuOpen && (
                      <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1px solid rgba(26,35,126,0.12)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '6px', minWidth: 180, zIndex: 1000 }}>
                        <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid rgba(26,35,126,0.07)', marginBottom: 4 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{user.displayName ?? 'User'}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{user.email}</div>
                        </div>
                        <Link href="/tools" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, textDecoration: 'none', color: '#334155', fontSize: 13, fontWeight: 500 }} onClick={() => setUserMenuOpen(false)}>
                          <i className="fa-solid fa-bolt" style={{ fontSize: 11, color: '#1a237e' }} /> My Tools
                        </Link>
                        <button onClick={async () => { await signOut(); setUserMenuOpen(false) }}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13, fontWeight: 500, width: '100%', fontFamily: 'inherit', textAlign: 'left' }}>
                          <i className="fa-solid fa-right-from-bracket" style={{ fontSize: 11 }} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button onClick={openLogin} className="btn btn-sm" style={{ background: 'transparent', border: '1.5px solid rgba(26,35,126,0.22)', color: '#1a237e', borderRadius: 8, padding: '7px 16px', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Sign In
                    </button>
                    <button onClick={openSignup} className="btn btn-primary btn-sm nav-cta">
                      Sign Up &rarr;
                    </button>
                  </>
                )
              ) : (
                /* All other pages: Let's Talk */
                <Link href="/contact" className="btn btn-primary btn-sm nav-cta">
                  Let&apos;s Talk &rarr;
                </Link>
              )
            )}
            <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <i className="fa-solid fa-xmark" />
        </button>
        <Link href="/" style={{ display: 'block', marginBottom: 32 }} onClick={() => setMenuOpen(false)}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.65rem', letterSpacing: '-0.025em', lineHeight: 1 }}>
            <span style={{ color: '#0f172a' }}>Think</span>
            <span style={{ background: 'linear-gradient(135deg, #1a237e 0%, #00bcd4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Suite</span>
          </span>
        </Link>

        {/* Mobile user info */}
        {!loading && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', marginBottom: 12, borderBottom: '1px solid rgba(26,35,126,0.08)' }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%' }} referrerPolicy="no-referrer" />
            ) : (
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a237e,#00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{initials}</span>
            )}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{user.displayName ?? 'User'}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{user.email}</div>
            </div>
          </div>
        )}

        {mobileLinks.map((item) =>
          item.hasChildren === 'services' ? (
            <div key={item.label}>
              <div className={`mobile-nav-link mobile-toggle${servicesOpen ? ' open' : ''}`} onClick={() => setServicesOpen(!servicesOpen)}>
                Services <i className="fa-solid fa-plus" />
              </div>
              <div className={`mobile-sub${servicesOpen ? ' open' : ''}`}>
                <div><Link href="/services" className="mobile-sub-link" style={{ fontWeight: 700, color: 'var(--cyan)' }} onClick={() => setMenuOpen(false)}>All Services →</Link></div>
                {services.map((col) => (
                  <div key={col.cat}>
                    <Link href={col.href} className="mobile-sub-cat" style={{ display: 'block', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>{col.cat}</Link>
                    {col.links.map((l) => (
                      <Link key={l.href} href={l.href} className="mobile-sub-link" onClick={() => setMenuOpen(false)}>{l.label}</Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : item.hasChildren === 'tools' ? (
            <div key={item.label}>
              <div className={`mobile-nav-link mobile-toggle${toolsOpen ? ' open' : ''}`} onClick={() => setToolsOpen(!toolsOpen)}>
                AI Tools <i className="fa-solid fa-plus" />
              </div>
              <div className={`mobile-sub${toolsOpen ? ' open' : ''}`}>
                <div><Link href="/tools" className="mobile-sub-link" style={{ fontWeight: 700, color: 'var(--cyan)' }} onClick={() => setMenuOpen(false)}>All AI Tools →</Link></div>
                {aiTools.map((t) => (
                  <div key={t.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {t.live ? (
                      <Link href={t.href} className="mobile-sub-link" onClick={() => setMenuOpen(false)} style={{ flex: 1 }}>
                        <i className={`fa-solid ${t.icon}`} style={{ color: t.color, marginRight: 8, fontSize: 12 }} />{t.label}
                      </Link>
                    ) : (
                      <span className="mobile-sub-link" style={{ flex: 1, opacity: 0.6 }}>
                        <i className={`fa-solid ${t.icon}`} style={{ color: t.color, marginRight: 8, fontSize: 12 }} />{t.label}
                      </span>
                    )}
                    {!t.live && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: '#64748b', borderRadius: 4, padding: '2px 6px', flexShrink: 0 }}>Soon</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : item.hasChildren === 'products' ? (
            <div key={item.label}>
              <div className={`mobile-nav-link mobile-toggle${productsOpen ? ' open' : ''}`} onClick={() => setProductsOpen(!productsOpen)}>
                Products <i className="fa-solid fa-plus" />
              </div>
              <div className={`mobile-sub${productsOpen ? ' open' : ''}`}>
                <div><Link href="/ecosystem" className="mobile-sub-link" style={{ fontWeight: 700, color: 'var(--cyan)' }} onClick={() => setMenuOpen(false)}>All Products →</Link></div>
                {products.map((p) => (
                  <Link key={p.href} href={p.href} className="mobile-sub-link" onClick={() => setMenuOpen(false)}>
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={item.label} href={item.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          )
        )}

        {/* Mobile bottom buttons */}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!loading && (
            isToolPage ? (
              user ? (
                <button onClick={async () => { await signOut(); setMenuOpen(false) }}
                  className="btn btn-lg" style={{ width: '100%', justifyContent: 'center', background: 'transparent', border: '1.5px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
                  <i className="fa-solid fa-right-from-bracket" style={{ marginRight: 8 }} /> Sign Out
                </button>
              ) : (
                <>
                  <button onClick={() => { openLogin(); setMenuOpen(false) }}
                    className="btn btn-lg" style={{ width: '100%', justifyContent: 'center', background: 'transparent', border: '1.5px solid rgba(26,35,126,0.22)', color: '#1a237e' }}>
                    Sign In
                  </button>
                  <button onClick={() => { openSignup(); setMenuOpen(false) }}
                    className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                    Sign Up Free <i className="fa-solid fa-arrow-right" />
                  </button>
                </>
              )
            ) : (
              <Link href="/contact" onClick={() => setMenuOpen(false)}
                className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                Let&apos;s Talk <i className="fa-solid fa-arrow-right" style={{ marginLeft: 8 }} />
              </Link>
            )
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <ToolAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        toolName="ThinkSuite AI Tools"
        defaultTab={authTab}
      />
    </>
  )
}
