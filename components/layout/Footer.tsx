import Link from 'next/link'

const companyLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Careers', href: '/careers' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">Think<span>Suite</span></div>
            <p>
              ThinkSuite: Engineering the Future of Business Automation and Generative Search.
            </p>
            <div className="footer-socials">
              <a href="https://twitter.com/thinksuite" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Twitter">
                <i className="fa-brands fa-x-twitter" />
              </a>
              <a href="https://www.linkedin.com/in/thinksuite-solution-6a1b2437a/" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in" />
              </a>
              <a href="https://instagram.com/thinksuite" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Instagram">
                <i className="fa-brands fa-instagram" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Company</h5>
            <div className="footer-links">
              {companyLinks.map((l) => (
                <Link key={l.href} href={l.href} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h5>Legal</h5>
            <div className="footer-links">
              {legalLinks.map((l) => (
                <Link key={l.href} href={l.href} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h5>Contact</h5>
            <div className="footer-links" style={{ gap: 12 }}>
              <span style={{ fontSize: 14, color: 'var(--text2)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <i className="fa-solid fa-location-dot" style={{ color: 'var(--cyan)', marginTop: 3, flexShrink: 0 }} />
                Gurgaon, India
              </span>
              <a href="tel:+919311821726" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-solid fa-phone" style={{ color: 'var(--cyan)', flexShrink: 0 }} />
                +91 93118 21726
              </a>
              <a href="mailto:info@thinksuite.in" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-solid fa-envelope" style={{ color: 'var(--cyan)', flexShrink: 0 }} />
                info@thinksuite.in
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            Copyright 2026 ThinkSuite. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

