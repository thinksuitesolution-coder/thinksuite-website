import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact ThinkSuite | Get a Free Consultation',
  description: 'Get in touch with ThinkSuite. Book a free discovery call, share your project requirements, and get a custom proposal for your business goals and budget.',
  keywords: ['contact ThinkSuite', 'hire digital agency India', 'get website quote India', 'book digital marketing consultation', 'ThinkSuite Gurgaon contact', 'digital agency inquiry India'],
}

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumb mb-16">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>Contact</span>
          </div>
          <span className="label">Get In Touch</span>
          <h1 className="mt-16">Let&apos;s <span className="grad-text">Talk</span></h1>
          <p className="mt-16" style={{ maxWidth: 560, color: 'var(--text2)', fontSize: 18 }}>
            Have a project in mind? We&apos;d love to hear about it. Send us a message and
            we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="contact-grid">
            <div className="reveal">
              <span className="label">Contact Info</span>
              <h2 className="mt-16">We&apos;re Here to <span className="text-cyan">Help</span></h2>
              <p className="mt-16" style={{ color: 'var(--text2)', lineHeight: 1.85 }}>
                Whether you&apos;re ready to start a project, have questions about our services,
                or just want to explore possibilities, we&apos;re all ears. Let&apos;s create
                something amazing together.
              </p>
              <div className="contact-info-items">
                <div className="contact-info-item">
                  <div className="ci-icon"><i className="fa-solid fa-location-dot" /></div>
                  <div>
                    <div className="ci-label">Location</div>
                    <div className="ci-value">Gurgaon, India</div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="ci-icon"><i className="fa-solid fa-phone" /></div>
                  <div>
                    <div className="ci-label">Phone</div>
                    <div className="ci-value"><a href="tel:+919311821726">+91 93118 21726</a></div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="ci-icon"><i className="fa-solid fa-envelope" /></div>
                  <div>
                    <div className="ci-label">Email</div>
                    <div className="ci-value"><a href="mailto:info@thinksuite.in">info@thinksuite.in</a></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-wrap reveal">
              <span className="label mb-24" style={{ display: 'block' }}>Send a Message</span>
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" className="form-input" placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" className="form-input" placeholder="your@email.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" className="form-input" placeholder="+91 00000 00000" />
                </div>
                <div className="form-group">
                  <label htmlFor="service">Service Interested In</label>
                  <select id="service" name="service" className="form-input">
                    <option value="">Select a service...</option>
                    <option value="software">Software Development</option>
                    <option value="marketing">Digital Marketing</option>
                    <option value="design">Branding & Design</option>
                    <option value="ai">AI & Automation</option>
                    <option value="media">Media & Advertising</option>
                    <option value="consulting">Consulting & Growth</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" className="form-input" rows={5} placeholder="Tell us about your project..." required />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  Send Message <i className="fa-solid fa-paper-plane" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div style={{ width: '100%', height: 420, position: 'relative' }}>
          <iframe
            src="https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sThinkSuite+Solutions,+Gurgaon,+Haryana,+India!6i15"
            width="100%"
            height="420"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="ThinkSuite Location"
          />
        </div>
      </section>
    </>
  )
}


