import { getAdminStorage } from "@/lib/firebaseAdmin";

/* ── POST /api/video/upload-photo ────────────────────────────────────────── */
// Accepts multipart/form-data with field "photo" (file) and "uid" (string)
// Returns { photoUrl } public Firebase Storage URL

export async function POST(request) {
  try {
    const formData = await request.formData();
    const photo = formData.get("photo");
    const uid   = formData.get("uid");

    if (!photo || !uid) {
      return Response.json({ error: "Missing: photo file and uid" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(photo.type)) {
      return Response.json({ error: "Only JPEG, PNG, WEBP, GIF images are allowed" }, { status: 400 });
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (photo.size > MAX_SIZE) {
      return Response.json({ error: "Image must be under 10 MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await photo.arrayBuffer());
    const ext    = photo.type.split("/")[1] || "jpg";
    const storagePath = `avatar-photos/${uid}/${Date.now()}.${ext}`;

    const storage = getAdminStorage();
    const bucket  = storage.bucket();
    const file    = bucket.file(storagePath);

    await file.save(buffer, { contentType: photo.type, resumable: false });
    await file.makePublic();

    const [meta] = await file.getMetadata();
    const photoUrl = `https://storage.googleapis.com/${bucket.name}/${meta.name}`;

    return Response.json({ photoUrl });

  } catch (err) {
    console.error("[video/upload-photo]", err.message);
    return Response.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
