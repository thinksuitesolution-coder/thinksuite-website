import { load } from "cheerio";
import { getAIClient } from "@/lib/aiClient";

const client = getAIClient();

export async function POST(request) {
  try {
    const { url, selectedChips } = await request.json();

    if (!url?.trim()) {
      return Response.json({ error: "Please enter a valid URL." }, { status: 400 });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url.trim());
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return Response.json({ error: "Please enter a valid URL starting with https://" }, { status: 400 });
    }

    // Fetch the target website - Firecrawl primary → ScraperAPI → direct fetch
    let html = "";

    // 1. Firecrawl (best quality: returns clean HTML with JS rendered)
    if (!html && process.env.FIRECRAWL_API_KEY) {
      try {
        const fcRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: parsedUrl.toString(), formats: ["html"] }),
          signal: AbortSignal.timeout(25000),
        });
        if (fcRes.ok) {
          const fcData = await fcRes.json();
          if (fcData?.success && fcData?.data?.html) {
            html = fcData.data.html;
          }
        }
      } catch {
        // fall through
      }
    }

    // 2. ScraperAPI (JS rendering via headless Chrome)
    if (!html && process.env.SCRAPER_API_KEY) {
      try {
        const scraperUrl = `http://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=${encodeURIComponent(parsedUrl.toString())}&render=true`;
        const scraperRes = await fetch(scraperUrl, { signal: AbortSignal.timeout(20000) });
        if (scraperRes.ok && scraperRes.status !== 429) {
          html = await scraperRes.text();
        }
      } catch {
        // fall through
      }
    }

    // 3. Direct fetch (last resort)
    if (!html) {
      try {
        const directRes = await fetch(parsedUrl.toString(), {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
          },
          signal: AbortSignal.timeout(15000),
        });
        if (!directRes.ok) throw new Error(`HTTP ${directRes.status}`);
        html = await directRes.text();
      } catch {
        return Response.json({
          error: "Could not fetch website. The site may be blocking scrapers or unavailable. Try a different URL.",
        }, { status: 422 });
      }
    }

    const $ = load(html);

    // Title
    const title = $("title").first().text().trim() || "";

    // Meta description
    const metaDescription =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";

    // Headings
    const headings = [];
    $("h1, h2, h3").each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, " ");
      if (text) headings.push({ tag: el.tagName, text: text.slice(0, 120) });
    });

    // Sections - id/class names
    const sections = [];
    const seenSections = new Set();
    $("section, main, header, footer, [id], div[class]").each((_, el) => {
      const id = $(el).attr("id") || "";
      const cls = ($(el).attr("class") || "").split(/\s+/).filter(Boolean).slice(0, 5).join(" ");
      const key = `${el.tagName}#${id}.${cls}`.slice(0, 80);
      if (key.length > 3 && !seenSections.has(key)) {
        seenSections.add(key);
        sections.push({ tag: el.tagName, id, class: cls });
        if (sections.length >= 40) return false;
      }
    });

    // Color classes (Tailwind bg-, text-, border- and inline styles)
    const colorSet = new Set();
    $("[class]").each((_, el) => {
      const classes = $(el).attr("class") || "";
      const matches = classes.match(/\b(bg|text|border|from|to|via)-[a-z]+-[0-9]+\b/g) || [];
      matches.forEach((c) => colorSet.add(c));
    });
    // Also check inline style colors
    $("[style]").each((_, el) => {
      const style = $(el).attr("style") || "";
      const hexMatches = style.match(/#[0-9a-fA-F]{3,8}/g) || [];
      const rgbMatches = style.match(/rgb[a]?\([^)]+\)/g) || [];
      hexMatches.forEach((c) => colorSet.add(c));
      rgbMatches.forEach((c) => colorSet.add(c));
    });
    const colorClasses = [...colorSet].slice(0, 30);

    // Font links
    const fontLinks = [];
    $('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"], link[href*="typekit"], link[href*="typography"]').each((_, el) => {
      const href = $(el).attr("href") || "";
      if (href) fontLinks.push(href.slice(0, 200));
    });
    $("style").each((_, el) => {
      const text = $(el).html() || "";
      const matches = text.match(/@import\s+url\(['"](https?:\/\/fonts[^'"]+)['"]\)/g) || [];
      matches.forEach((m) => fontLinks.push(m.slice(0, 200)));
    });

    // Animation classes
    const animationSet = new Set();
    $("[class]").each((_, el) => {
      const classes = ($(el).attr("class") || "").split(/\s+/);
      classes.forEach((c) => {
        if (/animate-|transition|duration-|ease-|motion|scroll|data-aos|gsap|framer|hover:|group-hover:/i.test(c)) {
          animationSet.add(c);
        }
      });
    });
    const animationClasses = [...animationSet].slice(0, 30);

    // Nav links
    const navLinks = [];
    $("nav a, header a").each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, " ");
      const href = $(el).attr("href") || "";
      if (text && navLinks.length < 20) navLinks.push({ text: text.slice(0, 60), href: href.slice(0, 100) });
    });

    // Images
    const images = [];
    $("img").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src") || "";
      const alt = $(el).attr("alt") || "";
      if (src && images.length < 6) images.push({ src: src.slice(0, 200), alt: alt.slice(0, 100) });
    });

    // Button texts
    const buttonSet = new Set();
    $('button, a[class*="btn"], a[class*="button"], a[class*="cta"], [role="button"]').each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, " ");
      if (text && text.length < 80) buttonSet.add(text);
      if (buttonSet.size >= 20) return false;
    });
    const buttonTexts = [...buttonSet];

    // Raw HTML - first 8000 chars
    const rawHTML = html.slice(0, 8000);

    // Build scraped data object
    const scraped = {
      title,
      metaDescription,
      headings: headings.slice(0, 20),
      sections: sections.slice(0, 30),
      colorClasses,
      fontLinks,
      animationClasses,
      navLinks,
      images,
      buttonTexts,
      rawHTML,
    };

    // Build Thinksuite prompt
    const chips = selectedChips || ["Layout & Structure", "Colors & Typography", "Animations & Transitions", "Sections & Content"];

    const sectionsText = scraped.sections
      .map((s) => `  <${s.tag}${s.id ? ` id="${s.id}"` : ""}${s.class ? ` class="${s.class}"` : ""}>`)
      .join("\n");

    const headingsText = scraped.headings.map((h) => `  ${h.tag.toUpperCase()}: ${h.text}`).join("\n");

    const userMessage = `Analyse this website data and generate a complete recreation prompt:

PAGE TITLE: ${scraped.title || "(none detected)"}
META DESCRIPTION: ${scraped.metaDescription || "(none detected)"}
NAVIGATION: ${scraped.navLinks.map((n) => n.text).join(" | ") || "(none detected)"}

PAGE SECTIONS DETECTED:
${sectionsText || "  (none detected)"}

HEADINGS FOUND:
${headingsText || "  (none detected)"}

BUTTON TEXTS: ${scraped.buttonTexts.join(", ") || "(none detected)"}
COLORS DETECTED: ${scraped.colorClasses.join(", ") || "(none detected)"}
FONTS: ${scraped.fontLinks.join(", ") || "(none detected)"}
ANIMATION CLASSES: ${scraped.animationClasses.join(", ") || "(none detected)"}

RAW HTML SAMPLE (first 8000 chars):
${scraped.rawHTML}

USER SELECTED ANALYSIS FOCUS:
${chips.join(", ")}

Generate a single detailed prompt (minimum 400 words) that covers:
1. Overall layout structure and page sections
2. Color palette and typography choices
3. Animations, transitions, hover effects, and scroll effects
4. Section-by-section content structure
5. Navigation and footer layout
6. Responsive design notes
7. Tech stack recommendation (Next.js + Tailwind preferred)
8. Any unique design patterns observed

The prompt should be detailed enough that an AI can build a visually similar website without seeing the original.`;

    const systemMessage = `You are an expert frontend developer and UI/UX analyst. Your job is to analyse a website's design and structure, then generate a detailed, actionable prompt that a developer can use with AI (like Thinksuite or ChatGPT) to recreate a visually similar website from scratch.
Your output must be ONLY the prompt text - no explanations, no preamble, no markdown headers. Just the raw prompt starting with "Build a..." or "Create a..."`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: systemMessage,
      messages: [{ role: "user", content: userMessage }],
    });

    const generatedPrompt = message.content[0]?.text?.trim() || "";

    return Response.json({
      success: true,
      scraped,
      generatedPrompt,
    });
  } catch (err) {
    console.error("analyze-website error:", err);
    return Response.json(
      { error: err.message || "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
