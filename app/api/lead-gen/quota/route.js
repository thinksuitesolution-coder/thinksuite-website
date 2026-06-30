import { NextResponse } from "next/server";
import { checkLeadQuota } from "@/lib/leadGenQuota";
import { verifyUser } from "@/lib/authUtils";

export async function POST(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const quota = await checkLeadQuota(userId);
    return NextResponse.json(quota);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
