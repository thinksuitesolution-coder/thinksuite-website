const ELEVENLABS_VOICES = {
  // ElevenLabs premade voices
  "rachel":          "21m00Tcm4TlvDq8ikWAM",
  "bella":           "EXAVITQu4vr4xnSDxMaL",
  "elli":            "MF3mGyEYCl7XYWbV9V6O",
  "domi":            "AZnzlk1XvdvUeBnXmlld",
  "josh":            "TxGEqnHWrfWFTfGW9XjX",
  "adam":            "pNInz6obpgDQGcFmaJgB",
  "sam":             "yoZ06aMxZJJ28mfd3POQ",
  "arnold":          "VR6AewLTigWG4xSOukaG",
  "clyde":           "2EiwWnXFnvU5JabPnv8n",
  "fin":             "D38z5RcWu1voky8WS1ja",
  "dave":            "CYw3kZ02Hs0563khs1Fj",
  // Hindi/Hinglish
  "el-hindi-m":      "pqHfZKP75CvOlQylNhV4",
  "el-hinglish-m":   "VR6AewLTigWG4xSOukaG",
  "el-hinglish-f":   "MF3mGyEYCl7XYWbV9V6O",
  // Legacy keys
  "hindi-male":      "pqHfZKP75CvOlQylNhV4",
  "hindi-female":    "EXAVITQu4vr4xnSDxMaL",
  "english-male":    "TxGEqnHWrfWFTfGW9XjX",
  "english-female":  "21m00Tcm4TlvDq8ikWAM",
  "hinglish-male":   "VR6AewLTigWG4xSOukaG",
  "hinglish-female": "MF3mGyEYCl7XYWbV9V6O",
};

const GOOGLE_VOICES = {
  // Hindi Standard
  "g-hi-std-a": { languageCode: "hi-IN", name: "hi-IN-Standard-A", ssmlGender: "FEMALE" },
  "g-hi-std-b": { languageCode: "hi-IN", name: "hi-IN-Standard-B", ssmlGender: "MALE" },
  "g-hi-std-c": { languageCode: "hi-IN", name: "hi-IN-Standard-C", ssmlGender: "FEMALE" },
  "g-hi-std-d": { languageCode: "hi-IN", name: "hi-IN-Standard-D", ssmlGender: "MALE" },
  // Hindi WaveNet
  "g-hi-wn-a":  { languageCode: "hi-IN", name: "hi-IN-Wavenet-A",  ssmlGender: "FEMALE" },
  "g-hi-wn-b":  { languageCode: "hi-IN", name: "hi-IN-Wavenet-B",  ssmlGender: "MALE" },
  "g-hi-wn-c":  { languageCode: "hi-IN", name: "hi-IN-Wavenet-C",  ssmlGender: "MALE" },
  "g-hi-wn-d":  { languageCode: "hi-IN", name: "hi-IN-Wavenet-D",  ssmlGender: "FEMALE" },
  // Hindi Neural2
  "g-hi-n2-a":  { languageCode: "hi-IN", name: "hi-IN-Neural2-A",  ssmlGender: "FEMALE" },
  "g-hi-n2-b":  { languageCode: "hi-IN", name: "hi-IN-Neural2-B",  ssmlGender: "MALE" },
  "g-hi-n2-c":  { languageCode: "hi-IN", name: "hi-IN-Neural2-C",  ssmlGender: "MALE" },
  "g-hi-n2-d":  { languageCode: "hi-IN", name: "hi-IN-Neural2-D",  ssmlGender: "FEMALE" },
  // English India Standard
  "g-en-std-a": { languageCode: "en-IN", name: "en-IN-Standard-A", ssmlGender: "FEMALE" },
  "g-en-std-b": { languageCode: "en-IN", name: "en-IN-Standard-B", ssmlGender: "MALE" },
  "g-en-std-c": { languageCode: "en-IN", name: "en-IN-Standard-C", ssmlGender: "MALE" },
  "g-en-std-d": { languageCode: "en-IN", name: "en-IN-Standard-D", ssmlGender: "FEMALE" },
  // English India WaveNet
  "g-en-wn-a":  { languageCode: "en-IN", name: "en-IN-Wavenet-A",  ssmlGender: "FEMALE" },
  "g-en-wn-b":  { languageCode: "en-IN", name: "en-IN-Wavenet-B",  ssmlGender: "MALE" },
  "g-en-wn-c":  { languageCode: "en-IN", name: "en-IN-Wavenet-C",  ssmlGender: "MALE" },
  "g-en-wn-d":  { languageCode: "en-IN", name: "en-IN-Wavenet-D",  ssmlGender: "FEMALE" },
  // English India Neural2
  "g-en-n2-a":  { languageCode: "en-IN", name: "en-IN-Neural2-A",  ssmlGender: "FEMALE" },
  "g-en-n2-b":  { languageCode: "en-IN", name: "en-IN-Neural2-B",  ssmlGender: "MALE" },
  "g-en-n2-c":  { languageCode: "en-IN", name: "en-IN-Neural2-C",  ssmlGender: "MALE" },
  "g-en-n2-d":  { languageCode: "en-IN", name: "en-IN-Neural2-D",  ssmlGender: "FEMALE" },
  // Bengali
  "g-bn-std-a": { languageCode: "bn-IN", name: "bn-IN-Standard-A", ssmlGender: "FEMALE" },
  "g-bn-std-b": { languageCode: "bn-IN", name: "bn-IN-Standard-B", ssmlGender: "MALE" },
  "g-bn-wn-a":  { languageCode: "bn-IN", name: "bn-IN-Wavenet-A",  ssmlGender: "FEMALE" },
  "g-bn-wn-b":  { languageCode: "bn-IN", name: "bn-IN-Wavenet-B",  ssmlGender: "MALE" },
  // Gujarati
  "g-gu-std-a": { languageCode: "gu-IN", name: "gu-IN-Standard-A", ssmlGender: "FEMALE" },
  "g-gu-std-b": { languageCode: "gu-IN", name: "gu-IN-Standard-B", ssmlGender: "MALE" },
  "g-gu-wn-a":  { languageCode: "gu-IN", name: "gu-IN-Wavenet-A",  ssmlGender: "FEMALE" },
  "g-gu-wn-b":  { languageCode: "gu-IN", name: "gu-IN-Wavenet-B",  ssmlGender: "MALE" },
  // Kannada
  "g-kn-std-a": { languageCode: "kn-IN", name: "kn-IN-Standard-A", ssmlGender: "FEMALE" },
  "g-kn-std-b": { languageCode: "kn-IN", name: "kn-IN-Standard-B", ssmlGender: "MALE" },
  "g-kn-wn-a":  { languageCode: "kn-IN", name: "kn-IN-Wavenet-A",  ssmlGender: "FEMALE" },
  "g-kn-wn-b":  { languageCode: "kn-IN", name: "kn-IN-Wavenet-B",  ssmlGender: "MALE" },
  // Malayalam
  "g-ml-std-a": { languageCode: "ml-IN", name: "ml-IN-Standard-A", ssmlGender: "FEMALE" },
  "g-ml-std-b": { languageCode: "ml-IN", name: "ml-IN-Standard-B", ssmlGender: "MALE" },
  "g-ml-wn-a":  { languageCode: "ml-IN", name: "ml-IN-Wavenet-A",  ssmlGender: "FEMALE" },
  "g-ml-wn-b":  { languageCode: "ml-IN", name: "ml-IN-Wavenet-B",  ssmlGender: "MALE" },
  "g-ml-wn-c":  { languageCode: "ml-IN", name: "ml-IN-Wavenet-C",  ssmlGender: "MALE" },
  "g-ml-wn-d":  { languageCode: "ml-IN", name: "ml-IN-Wavenet-D",  ssmlGender: "FEMALE" },
  // Marathi
  "g-mr-std-a": { languageCode: "mr-IN", name: "mr-IN-Standard-A", ssmlGender: "FEMALE" },
  "g-mr-std-b": { languageCode: "mr-IN", name: "mr-IN-Standard-B", ssmlGender: "MALE" },
  "g-mr-wn-a":  { languageCode: "mr-IN", name: "mr-IN-Wavenet-A",  ssmlGender: "FEMALE" },
  "g-mr-wn-b":  { languageCode: "mr-IN", name: "mr-IN-Wavenet-B",  ssmlGender: "MALE" },
  // Tamil
  "g-ta-std-a": { languageCode: "ta-IN", name: "ta-IN-Standard-A", ssmlGender: "FEMALE" },
  "g-ta-std-b": { languageCode: "ta-IN", name: "ta-IN-Standard-B", ssmlGender: "MALE" },
  "g-ta-wn-a":  { languageCode: "ta-IN", name: "ta-IN-Wavenet-A",  ssmlGender: "FEMALE" },
  "g-ta-wn-b":  { languageCode: "ta-IN", name: "ta-IN-Wavenet-B",  ssmlGender: "MALE" },
  // Telugu
  "g-te-std-a": { languageCode: "te-IN", name: "te-IN-Standard-A", ssmlGender: "FEMALE" },
  "g-te-std-b": { languageCode: "te-IN", name: "te-IN-Standard-B", ssmlGender: "MALE" },
  "g-te-wn-a":  { languageCode: "te-IN", name: "te-IN-Wavenet-A",  ssmlGender: "FEMALE" },
  "g-te-wn-b":  { languageCode: "te-IN", name: "te-IN-Wavenet-B",  ssmlGender: "MALE" },
  // Punjabi
  "g-pa-std-a": { languageCode: "pa-IN", name: "pa-IN-Standard-A", ssmlGender: "FEMALE" },
  "g-pa-wn-a":  { languageCode: "pa-IN", name: "pa-IN-Wavenet-A",  ssmlGender: "FEMALE" },
  "g-pa-wn-b":  { languageCode: "pa-IN", name: "pa-IN-Wavenet-B",  ssmlGender: "MALE" },
  // Legacy keys
  "hindi-male":     { languageCode: "hi-IN", name: "hi-IN-Standard-B", ssmlGender: "MALE" },
  "hindi-female":   { languageCode: "hi-IN", name: "hi-IN-Standard-A", ssmlGender: "FEMALE" },
  "english-male":   { languageCode: "en-IN", name: "en-IN-Standard-B", ssmlGender: "MALE" },
  "english-female": { languageCode: "en-IN", name: "en-IN-Standard-A", ssmlGender: "FEMALE" },
  "hinglish-male":  { languageCode: "hi-IN", name: "hi-IN-Standard-D", ssmlGender: "MALE" },
  "hinglish-female":{ languageCode: "hi-IN", name: "hi-IN-Standard-C", ssmlGender: "FEMALE" },
};

const DEFAULT_SAMPLE = "Hello! Welcome to Thinksuite, your AI-powered platform.";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const voiceKey = searchParams.get("voice") || "rachel";
  const provider  = searchParams.get("provider") || "elevenlabs";
  // Frontend passes the per-voice sample text; fall back to default
  const text = searchParams.get("sample") || DEFAULT_SAMPLE;

  try {
    if (provider === "elevenlabs") {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) return Response.json({ error: "ElevenLabs not configured" }, { status: 503 });

      const voiceId = ELEVENLABS_VOICES[voiceKey] || ELEVENLABS_VOICES["rachel"];
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        }
      );
      if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);
      const buf = await res.arrayBuffer();
      return new Response(buf, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=3600" } });

    } else {
      const apiKey = process.env.GOOGLE_TTS_KEY;
      if (!apiKey) return Response.json({ error: "Google TTS not configured" }, { status: 503 });

      const voice = GOOGLE_VOICES[voiceKey] || GOOGLE_VOICES["g-en-std-a"];
      const res = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text },
            voice,
            audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
          }),
        }
      );
      const data = await res.json();
      if (!data.audioContent) throw new Error("Google TTS returned no audio");
      const buf = Buffer.from(data.audioContent, "base64");
      return new Response(buf, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=3600" } });
    }
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
