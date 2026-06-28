'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ClientInit() {
  const pathname = usePathname()

  // One-time setup: cursor, typed text, testimonials, magnetic cards
  useEffect(() => {
    // Custom cursor
    const dot = document.getElementById('tsDot')
    const ring = document.getElementById('tsRing')
    if (dot && ring) {
      let mx = 0, my = 0, rx = 0, ry = 0
      document.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY
        dot.style.left = mx + 'px'; dot.style.top = my + 'px'
      })
      const animRing = () => {
        rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px'
        requestAnimationFrame(animRing)
      }
      animRing()
      document.querySelectorAll('a,button,.btn,.service-card,.testi-card').forEach((el) => {
        el.addEventListener('mouseenter', () => { dot.classList.add('hov'); ring.classList.add('hov') })
        el.addEventListener('mouseleave', () => { dot.classList.remove('hov'); ring.classList.remove('hov') })
      })
    }

    // Typed text
    const typedEl = document.querySelector<HTMLElement>('.typed-text')
    if (typedEl) {
      const words = typedEl.dataset.words ? JSON.parse(typedEl.dataset.words) : []
      let wi = 0, ci = 0, deleting = false
      const type = () => {
        const word = words[wi] || ''
        typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++)
        if (!deleting && ci > word.length) { deleting = true; setTimeout(type, 1800); return }
        if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0 }
        setTimeout(type, deleting ? 55 : 95)
      }
      if (words.length) type()
    }

    // Testimonial carousel
    const track = document.querySelector<HTMLElement>('.testi-track')
    const dots = document.querySelectorAll<HTMLElement>('.testi-dot')
    if (track) {
      let current = 0
      const cards = track.querySelectorAll('.testi-card')
      const total = Math.ceil(cards.length / 2)

      const goTo = (idx: number) => {
        current = (idx + total) % total
        const cardWidth = (track.parentElement?.offsetWidth || 0) + 24
        track.style.transform = `translateX(-${current * cardWidth}px)`
        dots.forEach((d, i) => d.classList.toggle('active', i === current))
      }

      document.querySelector('.testi-prev')?.addEventListener('click', () => goTo(current - 1))
      document.querySelector('.testi-next')?.addEventListener('click', () => goTo(current + 1))
      dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)))

      let autoTimer = setInterval(() => goTo(current + 1), 5000)
      track.parentElement?.addEventListener('mouseenter', () => clearInterval(autoTimer))
      track.parentElement?.addEventListener('mouseleave', () => { autoTimer = setInterval(() => goTo(current + 1), 5000) })

      goTo(0)
    }
  }, [])

  // Re-run on every route change: reveals, counters, FAQ, magnetic cards
  useEffect(() => {
    // Scroll reveal, re-observe all .reveal on every page navigation
    const reveals = document.querySelectorAll<HTMLElement>('.reveal')
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target) }
        })
      },
      { threshold: 0.12 }
    )
    reveals.forEach((el) => revealObs.observe(el))

    // Counters
    const counters = document.querySelectorAll<HTMLElement>('.counter')
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          const target = parseFloat(el.dataset.target || '0')
          const suffix = el.dataset.suffix || ''
          const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0
          const duration = 2200
          const step = 16
          const increment = target / (duration / step)
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) { current = target; clearInterval(timer) }
            el.textContent = decimals > 0 ? current.toFixed(decimals) + suffix : Math.floor(current) + suffix
          }, step)
          counterObs.unobserve(el)
        })
      },
      { threshold: 0.5 }
    )
    counters.forEach((el) => counterObs.observe(el))

    // FAQ accordion (for pages using global .faq-item, not useState)
    document.querySelectorAll('.faq-item').forEach((item) => {
      const q = item.querySelector('.faq-q')
      q?.addEventListener('click', () => {
        const isOpen = item.classList.contains('open')
        document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'))
        if (!isOpen) item.classList.add('open')
      })
    })

    // Magnetic service cards
    document.querySelectorAll<HTMLElement>('.service-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14
        card.style.transform = `translateY(-14px) rotateX(${-y}deg) rotateY(${x}deg)`
      })
      card.addEventListener('mouseleave', () => {
        card.style.transform = ''
      })
    })

    return () => {
      revealObs.disconnect()
      counterObs.disconnect()
    }
  }, [pathname])

  return null
}
