import { getAIClient } from "@/lib/aiClient";
import { NextResponse } from "next/server";
import { getAdminDb, firebaseAdmin } from "@/lib/firebaseAdmin";
import { checkLeadQuota, incrementLeadQuota, saveLeadHistory } from "@/lib/leadGenQuota";
import { scraperFetch, extractEmailFromHtml, extractPhoneFromHtml } from "@/lib/scraperUtils";
import { verifyUser } from "@/lib/authUtils";

export const maxDuration = 60;

const client = getAIClient();

const NICHE_QUERY_MAP = {
  "real-estate": "real estate agency",
  edtech: "coaching institute",
  healthcare: "hospital clinic",
  restaurant: "restaurant",
  retail: "retail shop",
  it: "IT company software",
  finance: "finance company CA firm",
  hotel: "hotel",
  gym: "gym fitness center",
  salon: "salon beauty parlour",
  other: "business",
};

// Maps UI category labels → specific Google Places search queries
const GM_CATEGORY_MAP = {
  "IT / Software":      "software company",
  "Real Estate":        "real estate agency",
  "EdTech / Coaching":  "coaching center education institute",
  "Healthcare":         "hospital clinic diagnostic center",
  "Restaurant":         "restaurant",
  "Retail":             "retail store",
  "Finance / CA Firm":  "CA firm chartered accountant",
  "Hotel":              "hotel",
  "Gym / Fitness":      "gym fitness center",
  "Salon / Beauty":     "salon beauty parlour",
};

// City name aliases for address-based post-filtering
const CITY_ADDR_ALIASES = {
  "bangalore":  ["bangalore", "bengaluru"],
  "delhi":      ["delhi", "new delhi"],
  "chennai":    ["chennai", "madras"],
  "kolkata":    ["kolkata", "calcutta"],
  "mumbai":     ["mumbai", "bombay"],
};

const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.primaryTypeDisplayName,places.googleMapsUri,nextPageToken";

/* ── Geocode a location string → { lat, lng } ─────────────────────────────── */
async function geocodeLocation(q) {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  const data = await res.json();
  return data.results?.[0] || null;
}

/* ── Get city bounding box (sw/ne corners) ─────────────────────────────────── */
async function getCityBounds(city, country = "India") {
  const result = await geocodeLocation(`${city}, ${country}`);
  if (!result) return null;
  const bounds = result.geometry.bounds || result.geometry.viewport;
  if (!bounds) return null;
  return { sw: bounds.southwest, ne: bounds.northeast };
}

/* ── Divide bounding box into rows×cols grid cells ─────────────────────────── */
function buildCityGrid(sw, ne, rows = 2, cols = 3) {
  const latStep = (ne.lat - sw.lat) / rows;
  const lngStep = (ne.lng - sw.lng) / cols;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        low:  { latitude: sw.lat + r * latStep,       longitude: sw.lng + c * lngStep },
        high: { latitude: sw.lat + (r + 1) * latStep, longitude: sw.lng + (c + 1) * lngStep },
      });
    }
  }
  return cells;
}

/* ── Fetch one Places API page with optional locationRestriction ────────────── */
async function fetchPlacesPage(textQuery, { pageToken, locationRestriction } = {}) {
  const body = { textQuery, pageSize: 20 };
  if (pageToken) body.pageToken = pageToken;
  if (locationRestriction) body.locationRestriction = locationRestriction;

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { places: [] };
  return res.json();
}

/* ── Fetch up to maxResults for a query + optional rectangle ────────────────── */
async function fetchPlacesForZone(textQuery, cell = null, maxResults = 20) {
  const locationRestriction = cell ? { rectangle: cell } : undefined;
  const seen = new Set();
  const places = [];
  let pageToken;

  for (let page = 0; page < Math.ceil(maxResults / 20); page++) {
    if (page > 0) await new Promise(r => setTimeout(r, 200));
    const data = await fetchPlacesPage(textQuery, { pageToken, locationRestriction });
    for (const p of data.places || []) {
      const key = p.id || p.displayName?.text;
      if (key && !seen.has(key)) { seen.add(key); places.push(p); }
    }
    pageToken = data.nextPageToken;
    if (!pageToken || places.length >= maxResults) break;
  }
  return places;
}

/* ── Merge multiple place arrays, deduplicating by id ──────────────────────── */
function mergePlaces(arrays) {
  const seen = new Set();
  const out = [];
  for (const arr of arrays) {
    for (const p of arr) {
      const key = p.id || p.displayName?.text;
      if (key && !seen.has(key)) { seen.add(key); out.push(p); }
    }
  }
  return out;
}

/* ── Geocode an area to lat/lng for radius search ──────────────────────────── */
async function geocodeArea(area, city, country = "India") {
  const result = await geocodeLocation(`${area}, ${city}, ${country}`);
  return result?.geometry?.location || null;
}

/* ── Radius rectangle around a center point ────────────────────────────────── */
function radiusRect(lat, lng, radiusM) {
  const latD = radiusM / 111320;
  const lngD = radiusM / (111320 * Math.cos(lat * (Math.PI / 180)));
  return {
    low:  { latitude: lat - latD, longitude: lng - lngD },
    high: { latitude: lat + latD, longitude: lng + lngD },
  };
}

export async function POST(request) {
  try {
    const userId = await verifyUser(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const {
      niche, city: rawCity, state = "", category, quantity,
      area = "", previousPlaceIds = [],
      country = "India", isInternational = false,
      aiFilter = "", specialInstructions = "",
    } = await request.json();

    const city = rawCity || state || (isInternational ? country : "India");

    let searchQuery;
    if (niche === "google-map-leads") {
      if (!category) return NextResponse.json({ error: "category is required" }, { status: 400 });
      searchQuery = GM_CATEGORY_MAP[category] || category;
    } else {
      if (!niche) return NextResponse.json({ error: "niche is required" }, { status: 400 });
      searchQuery = NICHE_QUERY_MAP[niche] || niche;
    }

    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return NextResponse.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }

    // Build Firestore field key for per-user seen lead tracking
    const norm = s => (s||"").toLowerCase().replace(/\s+/g,"_").slice(0,40);
    const fsSeenKey = isInternational ? country : state;
    const fsFieldKey = `gml_${norm(category || niche)}_${norm(fsSeenKey)}_${norm(rawCity)}`;

    // Load seen IDs from Firestore (per-user, cross-device)
    let firestoreSeenIds = [];
    if (userId && niche === "google-map-leads") {
      try {
        const db = getAdminDb();
        const doc = await db.collection("userSeenLeads").doc(userId).get();
        if (doc.exists) firestoreSeenIds = doc.data()[fsFieldKey] || [];
      } catch (e) {
        console.warn("[fetch-leads] Firestore read error:", e.message);
      }
    }

    const seenSet = new Set([...previousPlaceIds, ...firestoreSeenIds]);
    const walletCap = quota.useWallet ? (quota.remaining || 1) : 999999;
    const wantedCount = Math.min(Math.max(Number(quantity) || 20, 1), 60, walletCap);

    const locationSuffix = isInternational
      ? (rawCity && state ? `${rawCity}, ${state}, ${country}` : rawCity ? `${rawCity}, ${country}` : state ? `${state}, ${country}` : country)
      : (rawCity && state ? `${rawCity}, ${state}, India` : rawCity ? `${rawCity}, India` : state ? `${state}, India` : "India");

    let rawPlaces = [];

    if (area) {
      /* ── Area specified: radius search around the area ─────────────────── */
      const coords = await geocodeArea(area, city, isInternational ? country : "India");
      if (coords) {
        const cell = radiusRect(coords.lat, coords.lng, 3000);
        rawPlaces = await fetchPlacesForZone(`${searchQuery} in ${area}, ${locationSuffix}`, { low: cell.low, high: cell.high }, 60);
        if (rawPlaces.length < 5) {
          const widerCell = radiusRect(coords.lat, coords.lng, 6000);
          rawPlaces = await fetchPlacesForZone(`${searchQuery} in ${area}, ${locationSuffix}`, { low: widerCell.low, high: widerCell.high }, 60);
        }
      } else {
        rawPlaces = await fetchPlacesForZone(`${searchQuery} in ${area}, ${locationSuffix}`, null, 60);
      }

    } else if (rawCity) {
      /* ── City selected: split into 2×3 grid and search each zone ──────── */
      const bounds = await getCityBounds(city, isInternational ? country : "India");

      if (bounds) {
        const grid = buildCityGrid(bounds.sw, bounds.ne, 2, 3); // 6 zones
        const zoneResults = await Promise.all(
          grid.map(cell => fetchPlacesForZone(searchQuery, cell, 20).catch(() => []))
        );
        rawPlaces = mergePlaces(zoneResults);
      } else {
        // Fallback: no bounds from geocoder
        rawPlaces = await fetchPlacesForZone(`${searchQuery} in ${locationSuffix}`, null, 60);
      }

    } else {
      /* ── No city: state/country level, single query ─────────────────── */
      rawPlaces = await fetchPlacesForZone(`${searchQuery} in ${locationSuffix}`, null, 60);
    }

    // Address-based city filter: drop results clearly outside the selected city
    if (rawCity && !isInternational && rawPlaces.length > 0) {
      const cityKey = rawCity.toLowerCase();
      const matchTerms = CITY_ADDR_ALIASES[cityKey] || [cityKey];
      const cityFiltered = rawPlaces.filter(p => {
        const addr = (p.formattedAddress || "").toLowerCase();
        return matchTerms.some(t => addr.includes(t));
      });
      // Only apply if filter keeps at least 30% - avoids over-filtering edge cases
      if (cityFiltered.length >= rawPlaces.length * 0.3) rawPlaces = cityFiltered;
    }

    // Remove previously seen places, shuffle, then cap
    if (seenSet.size > 0) rawPlaces = rawPlaces.filter(p => !seenSet.has(p.id));
    for (let i = rawPlaces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rawPlaces[i], rawPlaces[j]] = [rawPlaces[j], rawPlaces[i]];
    }
    // Keep full pool when AI filter needs to pick from it; otherwise cap at wantedCount
    rawPlaces = rawPlaces.slice(0, aiFilter ? rawPlaces.length : wantedCount);

    const leads = rawPlaces.map(place => ({
      place_id:      place.id || "",
      business_name: place.displayName?.text || "",
      address:       place.formattedAddress || "",
      phone:         place.nationalPhoneNumber || undefined,
      website:       place.websiteUri || undefined,
      rating:        place.rating || undefined,
      total_ratings: place.userRatingCount || undefined,
      category:      place.primaryTypeDisplayName?.text || undefined,
      city,
      maps_url:      place.googleMapsUri || (place.id ? `https://www.google.com/maps/place/?q=place_id:${place.id}` : undefined),
    }));

    // Scrape websites to extract missing emails/phones (parallel, max 6 leads)
    const needsEmail = leads.filter(l => l.website && !l.email).slice(0, 6);
    if (needsEmail.length > 0) {
      const scraped = await Promise.allSettled(
        needsEmail.map(async (lead) => {
          try {
            const html = await scraperFetch(lead.website, false, 6000);
            const email = extractEmailFromHtml(html);
            const phone = extractPhoneFromHtml(html);
            return { place_id: lead.place_id, email: email || null, phone: phone || null };
          } catch { return { place_id: lead.place_id }; }
        })
      );
      const contactMap = new Map();
      scraped.forEach(r => {
        if (r.status === "fulfilled" && (r.value.email || r.value.phone)) {
          contactMap.set(r.value.place_id, r.value);
        }
      });
      leads.forEach(l => {
        const found = contactMap.get(l.place_id);
        if (!found) return;
        if (!l.email && found.email) l.email = found.email;
        if (!l.phone && found.phone) l.phone = found.phone;
      });
    }

    // Keep leads that have a verified phone OR a website (both are actionable)
    const verifiedLeads = leads.filter(l => {
      const ph = (l.phone || "").replace(/\D/g, "");
      return ph.length >= 7 || !!l.website;
    });

    // Save seen place IDs to Firestore per-user (non-critical, fire-and-forget)
    if (userId && niche === "google-map-leads" && verifiedLeads.length > 0) {
      const newIds = verifiedLeads.map(l => l.place_id).filter(Boolean);
      if (newIds.length > 0) {
        getAdminDb().collection("userSeenLeads").doc(userId).set({
          [fsFieldKey]: firebaseAdmin.firestore.FieldValue.arrayUnion(...newIds)
        }, { merge: true }).catch(e => console.warn("[fetch-leads] Firestore write error:", e.message));
      }
    }

    // AI insight - category-specific pain point analysis + personalised cold email
    let ai_insight = "";
    let cold_email = "";
    if (verifiedLeads.length > 0) {
      const locationLabel = [area, city, isInternational ? country : "India"].filter(Boolean).join(", ");
      const catKey = (category || searchQuery || "").toLowerCase();

      const CATEGORY_ANGLES = {
        restaurant:    "pain_point: low review count, no online ordering, no delivery integration",
        cafe:          "pain_point: low review count, no loyalty program, weak social presence",
        clinic:        "pain_point: no online appointment booking, weak Google reviews",
        hospital:      "pain_point: no online appointment system, low digital visibility",
        salon:         "pain_point: no online booking, no Instagram presence, low reviews",
        gym:           "pain_point: no online membership signup, low review count",
        hotel:         "pain_point: low reviews, no direct booking link, weak online presence",
        school:        "pain_point: no enquiry form, no digital admissions process",
        "real estate": "pain_point: no property listing website, no WhatsApp broadcast",
        "ca firm":     "pain_point: no client portal, no professional website",
        "law firm":    "pain_point: no case enquiry form, no professional website",
        retail:        "pain_point: no WhatsApp catalog, no online store",
        shop:          "pain_point: no WhatsApp catalog, no online store",
        "it company":  "pain_point: outdated website, no LinkedIn presence, no portfolio",
        software:      "pain_point: outdated website, no case studies visible online",
      };

      const matchedAngle = Object.entries(CATEGORY_ANGLES).find(([k]) => catKey.includes(k))?.[1]
        || "pain_point: analyse from rating, review count, and website presence";

      const systemPrompt = isInternational
        ? `You are a B2B sales consultant specialising in digital growth for local businesses in ${country}. You write sharp, specific outreach based on real business data - never generic.
RULES:
1. insight must name specific businesses from the data and give a concrete reason why each is a lead.
2. Rating 4.0+ AND 50+ reviews AND website present = "high priority". Missing phone or website = flag it.
3. cold_email: professional English, under 100 words. Start with "Hello [actual business name],". Mention their city, their category, and ONE specific observation from their data (rating, review count, or website status). End with a clear CTA.
4. FORBIDDEN openers: "Hope this finds you well", "I came across your business", "I wanted to reach out".
5. best_contact_channel: "email" if email present, else "call", else "whatsapp".
6. pitch_angle: one of "visibility-growth" / "first-time-digital" / "upgrade-existing" - decide from data.
Return ONLY valid JSON, no markdown.`
        : `You are a B2B sales consultant helping local businesses grow digitally. You write professional English outreach that gets results.
RULES:
1. insight must name specific businesses from the data and give a concrete reason (rating, review count, contact completeness).
2. Rating 4.0+ AND 100+ reviews AND phone present = "hot lead". Low reviews + no website = "high potential, needs digital setup".
3. Identify ONE pain point per top lead using this guide: ${matchedAngle}
4. cold_email: Professional English, under 100 words. Start with "Hi [actual business name]!". Mention their city and specific weakness from data. End with a clear WhatsApp/call CTA.
5. FORBIDDEN openers: "Hope this email finds you well", "I came across your business", generic praise.
6. best_contact_channel: "whatsapp" if whatsapp_number present, else "call" if phone present, else "email".
7. pitch_angle: one of "visibility-growth" / "first-time-digital" / "upgrade-existing" - decide from data.
Return ONLY valid JSON, no markdown.`;

      try {
        const aiRes = await client.messages.create({
          model:      "claude-haiku-4-5-20251001",
          max_tokens: 900,
          system:     systemPrompt,
          messages: [{
            role:    "user",
            content: `${specialInstructions ? `SPECIAL INSTRUCTIONS: ${specialInstructions}\n\n` : ""}Leads (${verifiedLeads.length} verified with phone) from ${locationLabel} - category: "${category || searchQuery}":\n\n${JSON.stringify(verifiedLeads.slice(0, 10), null, 2)}\n\nReturn ONLY:\n{"insight":"...","cold_email":"...","best_contact_channel":"...","pitch_angle":"..."}`,
          }],
        });
        const block    = aiRes.content.find(b => b.type === "text");
        const jsonText = (block?.text?.trim() || "{}")
          .replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
        const parsed   = JSON.parse(jsonText);
        ai_insight = parsed.insight    || "";
        cold_email = parsed.cold_email || "";
      } catch (aiErr) {
        console.warn("[fetch-leads] AI insight failed (non-critical):", aiErr.message);
      }
    }

    const { granted, used: quotaUsed, remaining: quotaRemaining, limit: quotaLimit } = await incrementLeadQuota(userId, verifiedLeads.length);
    const finalLeads = verifiedLeads.slice(0, granted);
    await saveLeadHistory(userId, { type: "google-map", niche: searchQuery, location: city, leadCount: finalLeads.length, leads: finalLeads.slice(0, 50) });
    return NextResponse.json({ leads: finalLeads, total: finalLeads.length, ai_insight, cold_email, quotaUsed, quotaRemaining, quotaLimit });
  } catch (err) {
    console.error("[fetch-leads]", err);
    return NextResponse.json({ error: err.message || "Lead fetch failed" }, { status: 500 });
  }
}
