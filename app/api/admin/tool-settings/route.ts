import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const doc = await adminDb.collection('adminSettings').doc('toolSettings').get()
    const settings = doc.exists ? doc.data() : {}
    return NextResponse.json({ settings })
  } catch {
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { settings } = body
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings' }, { status: 400 })
    }
    await adminDb.collection('adminSettings').doc('toolSettings').set(settings, { merge: true })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
