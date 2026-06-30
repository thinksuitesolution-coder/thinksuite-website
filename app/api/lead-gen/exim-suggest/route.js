import { getAIClient } from "@/lib/aiClient";

export const maxDuration = 30;

const client = getAIClient();

// Static fast-path for the most common products - no AI call needed
const PRODUCT_HUBS = {
  "pharmaceuticals": {
    topStates: ["Gujarat","Maharashtra","Telangana","Karnataka","Himachal Pradesh"],
    ports: ["JNPT Mumbai","Mundra (Gujarat)","Chennai Sea"],
    whyNote: "Kerala mein kuch pharma companies hain, lekin India ka 40%+ pharma export Gujarat (Ahmedabad, Vadodara, Ankleshwar) aur Maharashtra (Pune, Mumbai) se hota hai. Hyderabad ko 'Bulk Drug Capital of India' bhi kehte hain.",
    tip: "Use simpler terms like 'Pharma', 'API', or 'Generic Medicines' - 'Pharmaceuticals' is sometimes too broad for directory matching.",
    keywords: ["Pharma","API","Bulk Drugs","Generic Medicines","Formulations","Active Pharmaceutical Ingredients"],
    hsHint: "HS Code 3004 = Pharmaceutical formulations, HS Code 2941 = Antibiotics, HS Code 3002 = Vaccines/Biologics",
  },
  "pharma": {
    topStates: ["Gujarat","Maharashtra","Telangana","Karnataka","Himachal Pradesh"],
    ports: ["JNPT Mumbai","Mundra","Chennai Sea"],
    whyNote: "Gujarat, Maharashtra aur Telangana India ke top pharma export states hain.",
    tip: "Search 'Bulk Drugs' or 'API' for raw material exporters, 'Formulations' for finished medicines.",
    keywords: ["Bulk Drugs","API","Formulations","Generic Medicines","OTC Medicines"],
    hsHint: "HS Code 3004 for finished medicines, 2941 for antibiotics",
  },
  "rice": {
    topStates: ["Punjab","Haryana","Uttar Pradesh","Andhra Pradesh","West Bengal"],
    ports: ["Kandla","JNPT","Kakinada","Kolkata"],
    whyNote: "Punjab aur Haryana India ke 70%+ Basmati Rice exports karte hain. Non-basmati ke liye Andhra Pradesh aur West Bengal best hain.",
    tip: "Try 'Basmati Rice' or 'Non-Basmati Rice' with specific states like Punjab for best results.",
    keywords: ["Basmati Rice","Non-Basmati Rice","Parboiled Rice","Raw Rice","Brown Rice"],
    hsHint: "HS Code 1006 for Rice",
  },
  "cotton": {
    topStates: ["Gujarat","Maharashtra","Telangana","Andhra Pradesh","Rajasthan"],
    ports: ["Mundra","JNPT","Kandla"],
    whyNote: "Gujarat India ka sabse bada cotton producing state hai. Maharashtra (Vidarbha) aur Telangana bhi major producers hain.",
    tip: "Search 'Raw Cotton', 'Cotton Yarn', or 'Cotton Bales' for more specific results.",
    keywords: ["Raw Cotton","Cotton Yarn","Cotton Bales","Cotton Fiber","Cotton Waste"],
    hsHint: "HS Code 5201 for raw cotton, 5205 for cotton yarn",
  },
  "spices": {
    topStates: ["Kerala","Karnataka","Andhra Pradesh","Rajasthan","Gujarat"],
    ports: ["Cochin","Chennai Sea","JNPT","Mundra"],
    whyNote: "Kerala India ka spice capital hai - cardamom, pepper, cloves ke liye Kerala best state hai. Rajasthan chilli aur cumin mein top hai.",
    tip: "Be specific - search 'Black Pepper', 'Cardamom', 'Cumin', 'Turmeric' etc. instead of just 'Spices'.",
    keywords: ["Black Pepper","Cardamom","Cumin","Turmeric","Chilli","Ginger","Nutmeg","Cloves"],
    hsHint: "HS Code 0904 = Pepper, 0905 = Vanilla, 0906 = Cinnamon",
  },
  "tea": {
    topStates: ["Assam","West Bengal","Kerala","Tamil Nadu","Himachal Pradesh"],
    ports: ["Kolkata","Cochin","Chennai"],
    whyNote: "Assam aur West Bengal (Darjeeling) India ke sabse bade tea exporters hain. Kerala mein bhi tea plantations hain par volume kam hai.",
    tip: "Search 'CTC Tea', 'Orthodox Tea', or 'Green Tea' for more specific results.",
    keywords: ["CTC Tea","Orthodox Tea","Green Tea","Darjeeling Tea","Assam Tea","Black Tea"],
    hsHint: "HS Code 0902 for Tea",
  },
  "cashew": {
    topStates: ["Kerala","Goa","Karnataka","Maharashtra","Andhra Pradesh"],
    ports: ["Cochin","Mumbai","Mangalore","Chennai"],
    whyNote: "Kerala India ka #1 cashew processing state hai. Goa aur Karnataka bhi major cashew exporters hain.",
    tip: "Search 'Raw Cashew Nuts', 'Processed Cashew', or 'Cashew Kernels' for specific results.",
    keywords: ["Raw Cashew Nuts","Processed Cashew","Cashew Kernels","W320","W240","Cashew Shell Liquid"],
    hsHint: "HS Code 0801 for Cashew Nuts",
  },
  "textile": {
    topStates: ["Gujarat","Maharashtra","Tamil Nadu","Karnataka","Rajasthan"],
    ports: ["JNPT","Mundra","Chennai","Cochin"],
    whyNote: "Surat (Gujarat) India ka textile capital hai - synthetic fabrics mein #1. Tamil Nadu (Tiruppur) cotton knitwear mein top hai.",
    tip: "Be specific: 'Cotton Fabric', 'Synthetic Fabric', 'Readymade Garments', 'Denim' etc.",
    keywords: ["Cotton Fabric","Synthetic Fabric","Readymade Garments","Denim","Silk","Wool","Jute"],
    hsHint: "HS Code 52 = Cotton, 54 = Man-made filaments, 62 = Readymade garments",
  },
  "steel": {
    topStates: ["Jharkhand","Odisha","Chhattisgarh","Gujarat","West Bengal"],
    ports: ["Paradip","Vishakhapatnam","Mundra","JNPT","Kolkata"],
    whyNote: "Jharkhand (Jamshedpur - Tata Steel), Odisha (Rourkela) aur Chhattisgarh India ke steel hubs hain. Gujarat mein bhi major steel producers hain.",
    tip: "Search 'Steel Billets', 'Hot Rolled Steel', 'Stainless Steel', or 'TMT Bars' for specific products.",
    keywords: ["Steel Billets","Hot Rolled Coils","Stainless Steel","TMT Bars","Steel Plates","Iron Ore"],
    hsHint: "HS Code 7206-7229 for Steel products",
  },
  "chemicals": {
    topStates: ["Gujarat","Maharashtra","Rajasthan","Andhra Pradesh","Tamil Nadu"],
    ports: ["Mundra","JNPT","Kandla","Hazira"],
    whyNote: "Gujarat India ka #1 chemical exporting state hai - Ankleshwar, Vapi, Vadodara mein major chemical clusters hain.",
    tip: "Be specific: 'Dyes', 'Pigments', 'Agrochemicals', 'Industrial Chemicals', 'Specialty Chemicals' etc.",
    keywords: ["Dyes","Pigments","Agrochemicals","Specialty Chemicals","Industrial Chemicals","Solvents","Resins"],
    hsHint: "HS Code 28 = Inorganic Chemicals, 29 = Organic Chemicals, 32 = Dyes & Pigments",
  },
  "seafood": {
    topStates: ["Gujarat","Andhra Pradesh","Kerala","Tamil Nadu","Maharashtra"],
    ports: ["Mundra","Vishakhapatnam","Cochin","Chennai","Mumbai"],
    whyNote: "Gujarat aur Andhra Pradesh India ke top seafood exporters hain. Kerala shrimp aur fish mein strong hai.",
    tip: "Search 'Shrimp', 'Prawns', 'Fish Meal', or 'Frozen Fish' for specific results.",
    keywords: ["Shrimp","Prawns","Frozen Fish","Fish Meal","Crab","Lobster","Squid","Tuna"],
    hsHint: "HS Code 0302-0307 for seafood products",
  },
  "leather": {
    topStates: ["Tamil Nadu","Uttar Pradesh","West Bengal","Punjab","Maharashtra"],
    ports: ["Chennai Sea","Kolkata","JNPT"],
    whyNote: "Tamil Nadu (Chennai, Ambur, Ranipet) India ka leather capital hai - 40%+ leather exports Tamil Nadu se hote hain.",
    tip: "Search 'Finished Leather', 'Leather Shoes', 'Leather Goods', or 'Tanned Leather'.",
    keywords: ["Finished Leather","Leather Shoes","Leather Goods","Tanned Leather","Leather Garments","Footwear"],
    hsHint: "HS Code 41 = Raw hides & skins, 42 = Leather goods, 64 = Footwear",
  },
};

function getStaticHub(product) {
  const key = (product || "").toLowerCase().trim();
  for (const [k, v] of Object.entries(PRODUCT_HUBS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
}

export async function POST(request) {
  try {
    const { product, state, tradeType = "both" } = await request.json();
    if (!product?.trim()) return Response.json({ error: "Product required" }, { status: 400 });

    const typeLabel = tradeType === "exporter" ? "exporters" : tradeType === "importer" ? "importers" : "exporters & importers";

    // Try static hub first (instant, no AI cost)
    const staticHub = getStaticHub(product);
    if (staticHub) {
      return Response.json({
        success: true,
        source: "static",
        whyNote: staticHub.whyNote,
        tip: staticHub.tip,
        topStates: staticHub.topStates,
        keywords: staticHub.keywords,
        ports: staticHub.ports,
        hsHint: staticHub.hsHint,
        product,
        state,
        tradeType,
      });
    }

    // AI fallback for uncommon products
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: `You are an India trade expert. When a user can't find ${typeLabel} for a product in a specific state, explain why and guide them to better options. Respond ONLY in valid JSON.`,
      messages: [{
        role: "user",
        content: `User searched for "${product}" ${typeLabel} in "${state || "India"}" and got no results.

Return JSON:
{
  "whyNote": "2-3 lines in Hinglish (Hindi + English mix) explaining why ${state || "this region"} may not be the best for ${product} ${typeLabel}",
  "tip": "1 specific actionable tip to find better results",
  "topStates": ["best Indian state 1", "best Indian state 2", "best Indian state 3", "best Indian state 4"],
  "keywords": ["alternative keyword 1", "alternative keyword 2", "alternative keyword 3"],
  "ports": ["main export port 1", "main export port 2"],
  "hsHint": "HS code hint for this product if known, else empty string"
}

ONLY return the JSON.`,
      }],
    });

    const raw = msg.content[0]?.text?.trim() || "{}";
    const start = raw.indexOf("{");
    const end   = raw.lastIndexOf("}");
    let result  = {};
    try { result = JSON.parse(start !== -1 ? raw.slice(start, end + 1) : raw); } catch { result = {}; }

    return Response.json({
      success: true,
      source: "ai",
      whyNote: result.whyNote || `${state} mein ${product} ke ${typeLabel} limited hain. India ke dusre states mein try karein.`,
      tip: result.tip || "Try a broader keyword or different state.",
      topStates: result.topStates || [],
      keywords: result.keywords || [],
      ports: result.ports || [],
      hsHint: result.hsHint || "",
      product,
      state,
      tradeType,
    });
  } catch (err) {
    console.error("[exim-suggest]", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
