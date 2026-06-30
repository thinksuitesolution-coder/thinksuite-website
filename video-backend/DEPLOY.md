# Railway Backend   Deployment Guide

## 1. Railway Setup

1. Go to railway.app → New Project → Deploy from GitHub
2. Select this `video backend` folder (or push as separate repo)
3. Railway auto detects Dockerfile

## 2. Environment Variables (set in Railway dashboard)

```
PORT=3001
BACKEND_SECRET=generate a random 32 char secret here

ANTHROPIC_API_KEY=sk ant ...         (from Anthropic Console)
PEXELS_API_KEY=                      (from pexels.com/api)
PIXABAY_API_KEY=                     (from pixabay.com/api/docs   optional)
ELEVENLABS_API_KEY=                  (from elevenlabs.io)
GOOGLE_TTS_API_KEY=                  (from Google Cloud Console)
REPLICATE_API_TOKEN=                 (from replicate.com   Phase 3)

FIREBASE_SERVICE_ACCOUNT_JSON=       (paste full JSON from Firebase console → Service Accounts)
FIREBASE_STORAGE_BUCKET=Thinksuite.firebasestorage.app
```

## 3. Vercel Environment Variables (add to Thinksuite project)

```
BACKEND_API_URL=https://your railway app.railway.app   (Railway gives you this URL)
BACKEND_SECRET=same 32 char secret as above
PEXELS_API_KEY=same key
```

## 4. Get API Keys

  **Pexels**: pexels.com/api → free, 200 req/hour
  **Pixabay**: pixabay.com/api/docs → free, 5000 req/day  
  **ElevenLabs**: elevenlabs.io → free tier = 10k chars/month
  **Railway**: railway.app → $5/month hobby plan (includes FFmpeg support)

## 5. Firebase Storage Setup

In Firebase Console:
1. Go to Storage → Get started
2. Set rules to allow authenticated reads:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /video studio/{userId}/{allPaths=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false;  // only backend writes
    }
  }
}
```

## 6. Firestore Rules

Add to your existing Firestore rules:
```
match /video jobs/{jobId} {
  allow read: if request.auth != null && resource.data.uid == request.auth.uid;
  allow write: if false;  // only backend (admin SDK) writes
}
```

## 7. Background Music (optional)

Place royalty free MP3 files in `video backend/assets/music/`:
  `cinematic.mp3`
  `corporate.mp3`  
  `upbeat.mp3`

Free sources: pixabay.com/music, freemusicarchive.org

## Architecture

```
User → Next.js (Vercel)
         ↓ POST /api/video studio/generate
         ↓ creates Firestore job doc
         ↓ calls Railway backend
Railway Backend
  → fetches Pexels clips
  → generates ElevenLabs voiceover
  → downloads clips to /tmp
  → FFmpeg: concat + voice + music
  → uploads to Firebase Storage
  → updates Firestore job doc
         ↑ Frontend polls /api/video studio/status
         ↑ reads Firestore job doc
         ↑ shows progress to user
```
