import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/authUtils";

// Neutralize CSV/formula injection: if a cell starts with =, +, -, @, tab or CR,
// Excel/Sheets can interpret it as a formula when the file is opened. Prefixing
// with a leading apostrophe forces it to be read as plain text.
function csvSafe(v) {
  const s = String(v ?? "");
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
}

export async function POST(request) {
  try {
    const userId = await verifyUser(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { leads, dataset_name } = await request.json();

    if (!leads || leads.length === 0) {
      return NextResponse.json({ error: "No leads provided" }, { status: 400 });
    }

    const headers = [
      "Company Name", "Website", "Location", "Size", "Revenue",
      "Industry", "Has Email", "Has Phone", "Email", "Phone",
      "LinkedIn", "Description", "Business ID",
    ];

    const rows = leads.map((l) =>
      [
        l.company_name || "",
        l.website || "",
        l.location || "",
        l.size || "",
        l.revenue || "",
        l.industry || "",
        l.has_email ? "Yes" : "No",
        l.has_phone ? "Yes" : "No",
        l.email || "",
        l.phone || "",
        l.linkedin || "",
        (l.description || "").replace(/,/g, ";"),
        l.business_id || "",
      ]
        .map((v) => `"${csvSafe(v).replace(/"/g, '""')}"`)
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const safeName = (dataset_name || "leads").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
    const filename = `${safeName}_${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[export-csv]", err);
    return NextResponse.json({ error: err.message || "CSV export failed" }, { status: 500 });
  }
}
