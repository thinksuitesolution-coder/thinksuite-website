# About Page — Change Log

Running log of decisions/changes discussed for `app/about/page.tsx` and `app/about/about.css`.
Newest entries at the top.

---

## 2026-07-20
- Started working on About page. First target: Hero section (`HeroSection()` in page.tsx, `.ab-hero` in about.css) — currently plain light background with dot-grid pattern, centered text, no motion/visual element.
- Discussed hero background treatment: video vs animated canvas background. Went with animated canvas (avoids video weight/LCP hit + no need to recolor text for a dark overlay).
- **Implemented:** new client component `app/about/HeroParticles.tsx` — canvas-based particle network (dots in brand navy `#1a237e` / cyan `#00bcd4`, drifting slowly, connecting lines fade with distance). Respects `prefers-reduced-motion` (renders static, no animation). Pauses via `visibilitychange` when tab is hidden. Resizes with the hero section.
  - Wired into `HeroSection()` in `page.tsx` as first child of `.ab-hero`.
  - `about.css`: removed the old static dot-grid `background-image` on `.ab-hero` (superseded by canvas), added `.ab-hero-canvas` (absolute, `z-index:0`, `pointer-events:none`), bumped `.ab-hero-inner` to `z-index:2` and the `::before` glow to `z-index:1` so stacking stays: canvas → soft radial glow → content.
  - Verified: dev server compiles clean, `/about` returns 200, `ab-hero-canvas` present in rendered HTML. Could not visually screenshot (no browser/screenshot tool in this environment) — user to eyeball at `http://localhost:3000/about`.
- User feedback: hero still didn't look good enough, asked for a complete redesign for stronger first impression.
- **Complete hero redesign (v2):**
  - Layout changed from centered single-column to a 2-column grid (`.ab-hero-grid`): left = eyebrow badge, headline, subtext, CTAs, and a new "trust row" (4 gradient avatar chips + "50+ businesses trust ThinkSuite" line); right = a floating "Growth Snapshot" visual composition.
  - Right visual: a glassmorphic main card (`.ab-hero-card-main`) with an inline SVG upward trend chart (gradient stroke/fill, brand colors) + live counters (120+ Projects, 50+ Clients), plus 3 smaller floating chip cards orbiting it (AI-First, 24 Services, 2020 Founded) — all with a slow CSS `heroFloat` bob animation, staggered delays, disabled under `prefers-reduced-motion`.
  - Removed the old horizontal `.ab-stat-strip` box entirely (all 5 stats now live inside the visual composition instead) — deleted its now-unused CSS.
  - Updated responsive rules: grid collapses to 1 column ≤900px (visual moves below, centered, shrinks), 2 of the 3 floating chips hidden ≤640px to avoid clutter on small screens.
  - Verified: dev server hot-reloaded clean, `/about` still 200, no compile errors, new hero classes (`ab-hero-grid`, `ab-hero-card-main`, `ab-hero-chip-1`) present in rendered HTML. Visual appearance not screenshotted (no browser tool available) — user to review at `http://localhost:3000/about`.
