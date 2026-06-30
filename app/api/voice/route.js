export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider") || "elevenlabs";

  try {
    if (provider === "google") {
      const res = await fetch(
        `https://texttospeech.googleapis.com/v1/voices?key=${process.env.GOOGLE_TTS_KEY}`
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return Response.json({ error: err.error?.message || "Google TTS error" }, { status: 500 });
      }
      const data = await res.json();

      const voices = (data.voices || [])
        .filter(v => {
          const codes = v.languageCodes || [];
          return codes.some(lc =>
            lc === "hi-IN" ||
            lc === "en-IN" ||
            lc === "en-US" ||
            lc === "en-GB" ||
            lc === "en-AU"
          );
        })
        .map(v => {
          const lang    = v.languageCodes?.[0] || "en-IN";
          const gender  = (v.ssmlGender || "NEUTRAL").toLowerCase();
          const isHindi = lang.startsWith("hi");
          const type    = v.name.includes("Wavenet") ? "WaveNet"
                        : v.name.includes("Neural2")  ? "Neural2"
                        : v.name.includes("Studio")   ? "Studio"
                        : v.name.includes("Polyglot")  ? "Polyglot"
                        : "Standard";
          const shortName = v.name.split("-").slice(2).join("-") || v.name;
          return {
            id:     v.name,
            name:   shortName,
            fullId: v.name,
            gender,
            lang,
            type,
            category: isHindi ? "hindi" : "english",
            desc:   `${lang} · ${type} · ${gender}`,
          };
        })
        .sort((a, b) => {
          const order = { Studio: 0, Neural2: 1, WaveNet: 2, Polyglot: 3, Standard: 4 };
          return (order[a.type] ?? 5) - (order[b.type] ?? 5);
        });

      return Response.json({ voices });
    }

    if (provider === "openai") {
      const voices = [
        { id: "alloy",   name: "Alloy",   gender: "neutral", accent: "american" },
        { id: "echo",    name: "Echo",    gender: "male",    accent: "american" },
        { id: "fable",   name: "Fable",   gender: "male",    accent: "british"  },
        { id: "onyx",    name: "Onyx",    gender: "male",    accent: "american" },
        { id: "nova",    name: "Nova",    gender: "female",  accent: "american" },
        { id: "shimmer", name: "Shimmer", gender: "female",  accent: "american" },
      ];
      return Response.json({ voices });
    }

    // ElevenLabs (default)
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY },
    });
    const data = await res.json();

    const voices = (data.voices || []).map(v => {
      const accentRaw = (v.labels?.accent || v.labels?.language || "").toLowerCase();
      const isHindi = accentRaw.includes("hindi") || accentRaw.includes("indian") || accentRaw.includes("india");
      return {
        id: v.voice_id,
        name: v.name,
        gender: v.labels?.gender || "-",
        accent: v.labels?.accent || v.labels?.language || "english",
        age: v.labels?.age || "",
        useCase: v.labels?.use_case || "",
        desc: v.description?.slice(0, 60) || v.labels?.description || "",
        previewUrl: v.preview_url || null,
        category: isHindi ? "hindi" : "english",
      };
    });

    return Response.json({ voices });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { provider = "elevenlabs", text } = body;

    if (!text) return Response.json({ error: "Text is required" }, { status: 400 });

    /* ── Google TTS ── */
    if (provider === "google") {
      if (!process.env.GOOGLE_TTS_KEY) {
        return Response.json({ error: "GOOGLE_TTS_KEY is not set in environment variables" }, { status: 500 });
      }
      const { voiceId, speed = 1.0, lang = "hi-IN" } = body;

      const res = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text },
            voice: { languageCode: lang, name: voiceId },
            audioConfig: { audioEncoding: "MP3", speakingRate: speed },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return Response.json({ error: err.error?.message || "Google TTS error" }, { status: 500 });
      }

      const data = await res.json();
      return Response.json({ audioData: data.audioContent, mimeType: "audio/mpeg", outputFormat: "mp3" });
    }

    /* ── OpenAI TTS ── */
    if (provider === "openai") {
      if (!process.env.OPENAI_API_KEY) {
        return Response.json({ error: "OPENAI_API_KEY is not set in environment variables" }, { status: 500 });
      }
      const { voiceId = "alloy", speed = 1.0, model = "tts-1" } = body;

      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          input: text,
          voice: voiceId,
          response_format: "mp3",
          speed: Math.min(4.0, Math.max(0.25, speed)),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return Response.json({ error: err.error?.message || "OpenAI TTS error" }, { status: 500 });
      }

      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      return Response.json({ audioData: base64, mimeType: "audio/mpeg", outputFormat: "mp3" });
    }

    /* ── ElevenLabs (default) ── */
    const {
      voiceId,
      stability       = 0.5,
      similarityBoost = 0.75,
      style           = 0,
      speakerBoost    = true,
      speed           = 1.0,
      outputFormat    = "mp3_44100_128",
    } = body;

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || "21m00Tcm4TlvDq8ikWAM"}?output_format=${outputFormat}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style,
          use_speaker_boost: speakerBoost,
          speed,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json({ error: err.detail?.message || "ElevenLabs error" }, { status: 500 });
    }

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const mime = outputFormat.startsWith("mp3") ? "audio/mpeg"
               : outputFormat.startsWith("pcm") ? "audio/wav"
               : "audio/basic";

    return Response.json({ audioData: base64, mimeType: mime, outputFormat });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
