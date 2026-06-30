import { NextResponse } from "next/server";
import { firecrawlScrape, extractEmails, extractWhatsAppNumber } from "@/lib/scraperUtils";
import { checkLeadQuota, incrementLeadQuota, saveLeadHistory } from "@/lib/leadGenQuota";
import { verifyUser } from "@/lib/authUtils";

export const maxDuration = 60;

const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.primaryTypeDisplayName,places.googleMapsUri,nextPageToken";


async function fetchPlacesPage(textQuery, pageToken) {
  const body = { textQuery, pageSize: 20 };
  if (pageToken) body.pageToken = pageToken;

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Places API error ${res.status}: ${errText}`);
  }
  return res.json();
}

export async function POST(request) {
  try {
    const userId = await verifyUser(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    // Support both old payload { query, city, state, isInternational }
    // and new payload { niche, category, city, country, isInternational }
    let searchQuery, city, country;

    if (body.query) {
      const inIdx = body.query.toLowerCase().indexOf(" in ");
      searchQuery = inIdx !== -1 ? body.query.slice(0, inIdx).trim() : body.query.trim();
      city    = body.city    || "";
      country = body.state   || body.country || "";
    } else {
      searchQuery = body.category || body.niche || "";
      city    = body.city    || "";
      country = body.country || body.state || "";
    }

    if (!searchQuery) {
      return NextResponse.json({ error: "niche is required" }, { status: 400 });
    }

    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return NextResponse.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }

    const locationStr = [city, country].filter(Boolean).join(", ");
    const textQuery   = locationStr
      ? `${searchQuery} in ${locationStr}`
      : searchQuery;

    // Fetch up to 3 pages (60 results max — Google Places API hard limit)
    const seen   = new Set((body.previousPlaceIds || body.previousLeadNames || []).map(String));
    const places = [];
    let   pageToken;

    for (let page = 0; page < 3; page++) {
      if (page > 0) await new Promise(r => setTimeout(r, 250));
      const data = await fetchPlacesPage(textQuery, pageToken);
      for (const place of data.places || []) {
        const key = place.id || place.displayName?.text;
        if (key && !seen.has(key)) { seen.add(key); places.push(place); }
      }
      pageToken = data.nextPageToken;
      if (!pageToken) break;
    }

    const leads = places.slice(0, 60).map(place => ({
      place_id:           place.id || "",
      business_name:      place.displayName?.text || "",
      name:               place.displayName?.text || "",
      address:            place.formattedAddress  || "",
      phone:              place.nationalPhoneNumber || undefined,
      international_phone: place.internationalPhoneNumber || undefined,
      website:            place.websiteUri          || undefined,
      rating:             place.rating              || undefined,
      total_ratings:      place.userRatingCount     || undefined,
      category:           place.primaryTypeDisplayName?.text || undefined,
      city,
      location:           locationStr,
      maps_url:           place.googleMapsUri || (place.id ? `https://www.google.com/maps/place/?q=place_id:${place.id}` : undefined),
    }));

    // Enrich leads that have a website  extract email via Firecrawl.
    // allSettled so one bad scrape doesn't fail the whole batch.
    const enrichedSettled = await Promise.allSettled(
      leads.map(async lead => {
        if (!lead.website) return { ...lead, email: "", whatsapp_number: "" };
        const content = await firecrawlScrape(lead.website, 8000);
        const emails  = extractEmails(content);
        const whatsapp = extractWhatsAppNumber(content);
        return { ...lead, email: emails[0] || "", whatsapp_number: whatsapp || "" };
      })
    );
    const enriched = enrichedSettled.map((r, i) =>
      r.status === "fulfilled" ? r.value : { ...leads[i], email: "", whatsapp_number: "" }
    );

    const { granted: gmGranted, used: quotaUsed, remaining: quotaRemaining, limit: quotaLimit } = await incrementLeadQuota(userId, enriched.length);
    const gmLeads = enriched.slice(0, gmGranted);
    await saveLeadHistory(userId, { type: "google-map", niche: searchQuery, location: locationStr, leadCount: gmLeads.length, leads: gmLeads.slice(0, 50) });
    return NextResponse.json({
      success:         true,
      leads:           gmLeads,
      total:           gmLeads.length,
      queryLabel:      `${searchQuery}  ${locationStr}`,
      sourcesSearched: 1,
      quotaUsed,
      quotaRemaining,
      quotaLimit,
    });
  } catch (err) {
    console.error("[google-map-leads]", err);
    return NextResponse.json({ error: err.message || "Lead fetch failed" }, { status: 500 });
  }
}
