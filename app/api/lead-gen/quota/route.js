import { NextResponse } from "next/server";
import { checkLeadQuota } from "@/lib/leadGenQuota";
import { verifyUser } from "@/lib/authUtils";

// verifyUser() reads the Authorization header — force-dynamic so Next's own
// dynamic-usage bailout can't get caught by this route's try/catch and
// returned to the client as a bogus 500.
export const dynamic = 'force-dynamic';

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
