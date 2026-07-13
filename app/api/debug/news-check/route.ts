import { NextResponse } from 'next/server';
import { articlesCol } from '@/lib/firebase-admin';

// Temporary diagnostic endpoint — remove once the ai-news empty-state issue is resolved.
export async function GET() {
  try {
    const snap = await articlesCol().orderBy('publishedAt', 'desc').limit(150).get();
    return NextResponse.json({ ok: true, count: snap.size });
  } catch (err) {
    const e = err as { code?: unknown; message?: string; details?: unknown };
    return NextResponse.json({
      ok: false,
      code: e.code ?? null,
      message: e.message ?? String(err),
      details: e.details ?? null,
    }, { status: 500 });
  }
}
