import { NextResponse } from "next/server";

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC5sZX0f9xYYE-k0kO2LMU1n0ETAvgAqF0";

export async function POST(req) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return NextResponse.json({ error: "Missing refreshToken" }, { status: 400 });
    }

    /* 1 -Exchange refresh token → ID token + uid via Firebase REST API */
    const tokenRes = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grant_type: "refresh_token", refresh_token: refreshToken }),
      }
    );
    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      return NextResponse.json(
        { error: tokenData.error.message || "Token exchange failed" },
        { status: 401 }
      );
    }

    const uid = tokenData.user_id;
    if (!uid) {
      return NextResponse.json({ error: "Could not resolve uid" }, { status: 401 });
    }

    /* 2 -Create a Firebase custom token using Admin SDK */
    const admin = (await import("@/lib/firebase-admin")).default();
    if (!admin) {
      return NextResponse.json(
        { error: "Firebase Admin not configured -add FIREBASE_SERVICE_ACCOUNT_KEY" },
        { status: 500 }
      );
    }

    const customToken = await admin.auth().createCustomToken(uid);
    return NextResponse.json({ customToken });
  } catch (err) {
    console.error("[/api/auth/cross]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
