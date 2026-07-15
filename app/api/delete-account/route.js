import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, reason, userId } = await req.json();
    if (!email && !userId) {
      return NextResponse.json({ error: "Email or userId required" }, { status: 400 });
    }

    // Log deletion request to Firestore
    try {
      const adminModule = await import("@/lib/firebaseAdmin");
      const adminApp = adminModule.default();
      if (adminApp) {
        const db = adminApp.firestore();
        await db.collection("deletion_requests").add({
          email: email || null,
          userId: userId || null,
          reason: reason || "Not provided",
          requestedAt: Date.now(),
          status: "pending",
        });
      }
    } catch (firestoreErr) {
      console.warn("Firestore write failed:", firestoreErr.message);
      // Continue -at minimum we want to return success so user knows request was received
    }

    // Send notification email to admin
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || "Thinksuite <info@Thinksuite.in>",
        to: "info@Thinksuite.in",
        subject: `[Account Deletion Request] ${email || userId}`,
        text: `User ${email || userId} has requested account deletion.\n\nReason: ${reason || "Not provided"}\nTimestamp: ${new Date().toISOString()}`,
      });
    } catch (mailErr) {
      console.warn("Email send failed:", mailErr.message);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
