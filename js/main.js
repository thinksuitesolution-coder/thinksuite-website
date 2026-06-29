/* ============================================================
   THINKSUITE — MAIN JAVASCRIPT
   ============================================================ */

const API = '/api';

/* ============================================================
   NAVIGATION
   ============================================================ */
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navMobile = document.querySelector('.nav-mobile');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMobile.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  });
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMobile.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  });
}

// Set active nav link
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.getAttribute('href') === window.location.pathname ||
      (window.location.pathname === '/' && link.getAttribute('href') === '/index.html')) {
    link.classList.add('active');
  }
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   CURSOR GLOW
   ============================================================ */
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  }, { passive: true });
}

/* ============================================================
   HERO TITLE WORD REVEAL
   ============================================================ */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  heroTitle.querySelectorAll('.line-plain, .line-grad').forEach((line, lineIdx) => {
    const words = line.textContent.trim().split(/\s+/);
    line.innerHTML = words.map((word, i) =>
      `<span class="word"><span class="word-inner" style="animation-delay:${(.3 + lineIdx * .22 + i * .09).toFixed(3)}s">${word}</span></span> `
    ).join('').trimEnd();
  });
}

/* ============================================================
   HERO PARTICLE SYSTEM (lightweight)
   ============================================================ */
const heroCanvas = document.getElementById('hero-particles');
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  let particles = [], animId;
  const resize = () => {
    heroCanvas.width = heroCanvas.offsetWidth;
    heroCanvas.height = heroCanvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * heroCanvas.width;
      this.y = Math.random() * heroCanvas.height;
      this.vx = (Math.random() - .5) * .4;
      this.vy = (Math.random() - .5) * .4;
      this.size = Math.random() * 1.5 + .5;
      this.alpha = Math.random() * .4 + .1;
      this.color = Math.random() > .5 ? '108,99,255' : '0,209,255';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > heroCanvas.width || this.y < 0 || this.y > heroCanvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  const animate = () => {
    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${.12 * (1 - dist/100)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(animate);
  };

  // Only animate when visible
  const heroObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { animate(); }
    else { cancelAnimationFrame(animId); }
  });
  heroObs.observe(heroCanvas);
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1800;
        const start = performance.now();
        const isDecimal = target % 1 !== 0;

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObs.unobserve(el);
      }
    });
  }, { threshold: .5 });
  counters.forEach(c => countObs.observe(c));
}

/* ============================================================
   BLOG LOADER (homepage + blog page)
   ============================================================ */
async function loadBlogs(containerId, limit = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch(`${API}/blogs?limit=${limit}&status=published`);
    const { data } = await res.json();

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="text-muted" style="text-align:center;padding:40px">No posts published yet.</p>';
      return;
    }

    container.innerHTML = data.map(post => `
      <article class="blog-card reveal">
        <div class="blog-thumb">
          ${post.image
            ? `<img src="${post.image}" alt="${post.title}" loading="lazy">`
            : `<span>📝</span>`
          }
        </div>
        <div class="blog-body">
          <div class="blog-meta">
            <span class="blog-cat">${post.category || 'Insights'}</span>
            <span class="blog-sep"></span>
            <span class="blog-date">${formatDate(post.published_at)}</span>
          </div>
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt || ''}</p>
          <a href="/blog/${post.slug}" class="blog-more">
            Read Article
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </a>
        </div>
      </article>
    `).join('');

    // Re-observe new elements
    container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } catch (err) {
    console.error('Failed to load blogs:', err);
  }
}

/* ============================================================
   PROJECTS LOADER (homepage + projects page)
   ============================================================ */
async function loadProjects(containerId, featured = false, limit = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const emptyEl = document.getElementById('cases-empty-state');

  try {
    const url = featured ? `${API}/projects?featured=true&limit=${limit}` : `${API}/projects?limit=${limit}`;
    const res = await fetch(url);
    const { data } = await res.json();

    if (!data || data.length === 0) {
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    container.innerHTML = data.map((proj, idx) => {
      let results = {};
      try { results = JSON.parse(proj.results || '{}'); } catch (e) {}
      const metrics = results.metrics || [];
      const isReverse = idx % 2 !== 0;
      const tags = (proj.system_built || '').split(',').slice(0, 4).filter(Boolean);

      return `
        <div class="fw-card${isReverse ? ' fw-reverse' : ''} reveal">
          <div class="fw-visual">
            ${proj.image
              ? `<img src="${proj.image}" alt="${proj.title}" loading="lazy">`
              : `<div class="fw-visual-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=".8" width="150" height="150" style="color:rgba(108,99,255,.5)">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"/>
                  </svg>
                </div>`
            }
            <div class="fw-visual-overlay"></div>
            ${metrics.length >= 3 ? `
              <div class="fw-metrics">
                ${metrics.slice(0, 3).map(m => `
                  <div class="fw-metric">
                    <span class="fw-metric-val">${m.value || '—'}</span>
                    <span class="fw-metric-lbl">${m.label || ''}</span>
                  </div>`).join('')}
              </div>` : ''}
          </div>
          <div class="fw-body">
            <span class="fw-industry"><span class="fw-industry-line"></span>${proj.industry || 'Systems'}</span>
            <h3 class="fw-title">${proj.title}</h3>
            ${proj.problem ? `<p class="fw-problem">${truncate(proj.problem, 160)}</p>` : ''}
            ${tags.length ? `
              <div class="fw-tags">
                ${tags.map(t => `<span class="fw-tag">${t.trim()}</span>`).join('')}
              </div>` : ''}
            ${proj.outcome ? `
              <div class="fw-outcome">
                <div class="fw-outcome-label">Outcome</div>
                <p>${truncate(proj.outcome, 130)}</p>
              </div>` : ''}
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } catch (err) {
    console.error('Failed to load projects:', err);
    if (emptyEl) emptyEl.style.display = 'block';
  }
}

/* ============================================================
   BLOG POST LOADER (blog-post.html)
   ============================================================ */
async function loadBlogPost() {
  const slug = window.location.pathname.split('/blog/')[1];
  if (!slug) return;

  try {
    const res = await fetch(`${API}/blogs/${slug}`);
    if (!res.ok) { window.location.href = '/blog.html'; return; }
    const { data: post } = await res.json();

    document.title = post.meta_title || post.title + ' | ThinkSuite';

    const titleEl = document.getElementById('post-title');
    const categoryEl = document.getElementById('post-category');
    const dateEl = document.getElementById('post-date');
    const readEl = document.getElementById('post-read-time');
    const contentEl = document.getElementById('post-content');
    const heroImgEl = document.getElementById('post-hero-image');

    if (titleEl) titleEl.textContent = post.title;
    if (categoryEl) categoryEl.textContent = post.category || 'Insights';
    if (dateEl) dateEl.textContent = formatDate(post.published_at);
    if (readEl) readEl.textContent = `${post.read_time || 5} min read`;
    if (contentEl) contentEl.innerHTML = post.content;
    if (heroImgEl && post.image) {
      heroImgEl.src = post.image;
      heroImgEl.style.display = 'block';
    }
  } catch (err) {
    console.error('Failed to load post:', err);
  }
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const msgEl = document.getElementById('form-message');
    const data = Object.fromEntries(new FormData(contactForm));

    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();

      if (json.success) {
        contactForm.reset();
        if (msgEl) { msgEl.textContent = json.message; msgEl.className = 'form-msg success'; }
      } else {
        if (msgEl) { msgEl.textContent = json.message; msgEl.className = 'form-msg error'; }
      }
    } catch (err) {
      if (msgEl) { msgEl.textContent = 'Something went wrong. Please try again.'; msgEl.className = 'form-msg error'; }
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });
}

/* ============================================================
   UTILITIES
   ============================================================ */
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function truncate(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

/* ============================================================
   STORY NAV — section tracking
   ============================================================ */
const storyNav = document.getElementById('story-nav');
if (storyNav) {
  const navItems = storyNav.querySelectorAll('[data-target]');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const el = document.getElementById(item.dataset.target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(i => i.classList.toggle('active', i.dataset.target === entry.target.id));
      }
    });
  }, { threshold: 0.38 });

  navItems.forEach(item => {
    const el = document.getElementById(item.dataset.target);
    if (el) sectionObs.observe(el);
  });
}

/* ============================================================
   INIT PAGE
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Homepage
  if (document.getElementById('blog-grid-home')) loadBlogs('blog-grid-home', 3);
  if (document.getElementById('cases-grid-home')) loadProjects('cases-grid-home', true, 3);

  // Blog page
  if (document.getElementById('blog-grid-all')) loadBlogs('blog-grid-all', 20);

  // Projects page
  if (document.getElementById('projects-grid-all')) loadProjects('projects-grid-all', false, 20);

  // Blog post page
  if (document.getElementById('post-content')) loadBlogPost();
});
