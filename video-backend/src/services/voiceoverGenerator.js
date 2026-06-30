const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

/* â”€â”€ ElevenLabs voice IDs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ELEVENLABS_VOICES = {
  // Premade voices
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
  "el hindi m":      "pqHfZKP75CvOlQylNhV4",
  "el hinglish m":   "VR6AewLTigWG4xSOukaG",
  "el hinglish f":   "MF3mGyEYCl7XYWbV9V6O",
  // Legacy keys
  "hindi male":      "pqHfZKP75CvOlQylNhV4",
  "hindi female":    "EXAVITQu4vr4xnSDxMaL",
  "english male":    "TxGEqnHWrfWFTfGW9XjX",
  "english female":  "21m00Tcm4TlvDq8ikWAM",
  "hinglish male":   "VR6AewLTigWG4xSOukaG",
  "hinglish female": "MF3mGyEYCl7XYWbV9V6O",
};

/* â”€â”€ Google TTS language codes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const GOOGLE_LANGUAGE_MAP = {
  // Hindi Standard
  "g hi std a": { languageCode: "hi IN", name: "hi IN Standard A", ssmlGender: "FEMALE" },
  "g hi std b": { languageCode: "hi IN", name: "hi IN Standard B", ssmlGender: "MALE" },
  "g hi std c": { languageCode: "hi IN", name: "hi IN Standard C", ssmlGender: "FEMALE" },
  "g hi std d": { languageCode: "hi IN", name: "hi IN Standard D", ssmlGender: "MALE" },
  // Hindi WaveNet
  "g hi wn a":  { languageCode: "hi IN", name: "hi IN Wavenet A",  ssmlGender: "FEMALE" },
  "g hi wn b":  { languageCode: "hi IN", name: "hi IN Wavenet B",  ssmlGender: "MALE" },
  "g hi wn c":  { languageCode: "hi IN", name: "hi IN Wavenet C",  ssmlGender: "MALE" },
  "g hi wn d":  { languageCode: "hi IN", name: "hi IN Wavenet D",  ssmlGender: "FEMALE" },
  // Hindi Neural2
  "g hi n2 a":  { languageCode: "hi IN", name: "hi IN Neural2 A",  ssmlGender: "FEMALE" },
  "g hi n2 b":  { languageCode: "hi IN", name: "hi IN Neural2 B",  ssmlGender: "MALE" },
  "g hi n2 c":  { languageCode: "hi IN", name: "hi IN Neural2 C",  ssmlGender: "MALE" },
  "g hi n2 d":  { languageCode: "hi IN", name: "hi IN Neural2 D",  ssmlGender: "FEMALE" },
  // English India Standard
  "g en std a": { languageCode: "en IN", name: "en IN Standard A", ssmlGender: "FEMALE" },
  "g en std b": { languageCode: "en IN", name: "en IN Standard B", ssmlGender: "MALE" },
  "g en std c": { languageCode: "en IN", name: "en IN Standard C", ssmlGender: "MALE" },
  "g en std d": { languageCode: "en IN", name: "en IN Standard D", ssmlGender: "FEMALE" },
  // English India WaveNet
  "g en wn a":  { languageCode: "en IN", name: "en IN Wavenet A",  ssmlGender: "FEMALE" },
  "g en wn b":  { languageCode: "en IN", name: "en IN Wavenet B",  ssmlGender: "MALE" },
  "g en wn c":  { languageCode: "en IN", name: "en IN Wavenet C",  ssmlGender: "MALE" },
  "g en wn d":  { languageCode: "en IN", name: "en IN Wavenet D",  ssmlGender: "FEMALE" },
  // English India Neural2
  "g en n2 a":  { languageCode: "en IN", name: "en IN Neural2 A",  ssmlGender: "FEMALE" },
  "g en n2 b":  { languageCode: "en IN", name: "en IN Neural2 B",  ssmlGender: "MALE" },
  "g en n2 c":  { languageCode: "en IN", name: "en IN Neural2 C",  ssmlGender: "MALE" },
  "g en n2 d":  { languageCode: "en IN", name: "en IN Neural2 D",  ssmlGender: "FEMALE" },
  // Bengali
  "g bn std a": { languageCode: "bn IN", name: "bn IN Standard A", ssmlGender: "FEMALE" },
  "g bn std b": { languageCode: "bn IN", name: "bn IN Standard B", ssmlGender: "MALE" },
  "g bn wn a":  { languageCode: "bn IN", name: "bn IN Wavenet A",  ssmlGender: "FEMALE" },
  "g bn wn b":  { languageCode: "bn IN", name: "bn IN Wavenet B",  ssmlGender: "MALE" },
  // Gujarati
  "g gu std a": { languageCode: "gu IN", name: "gu IN Standard A", ssmlGender: "FEMALE" },
  "g gu std b": { languageCode: "gu IN", name: "gu IN Standard B", ssmlGender: "MALE" },
  "g gu wn a":  { languageCode: "gu IN", name: "gu IN Wavenet A",  ssmlGender: "FEMALE" },
  "g gu wn b":  { languageCode: "gu IN", name: "gu IN Wavenet B",  ssmlGender: "MALE" },
  // Kannada
  "g kn std a": { languageCode: "kn IN", name: "kn IN Standard A", ssmlGender: "FEMALE" },
  "g kn std b": { languageCode: "kn IN", name: "kn IN Standard B", ssmlGender: "MALE" },
  "g kn wn a":  { languageCode: "kn IN", name: "kn IN Wavenet A",  ssmlGender: "FEMALE" },
  "g kn wn b":  { languageCode: "kn IN", name: "kn IN Wavenet B",  ssmlGender: "MALE" },
  // Malayalam
  "g ml std a": { languageCode: "ml IN", name: "ml IN Standard A", ssmlGender: "FEMALE" },
  "g ml std b": { languageCode: "ml IN", name: "ml IN Standard B", ssmlGender: "MALE" },
  "g ml wn a":  { languageCode: "ml IN", name: "ml IN Wavenet A",  ssmlGender: "FEMALE" },
  "g ml wn b":  { languageCode: "ml IN", name: "ml IN Wavenet B",  ssmlGender: "MALE" },
  "g ml wn c":  { languageCode: "ml IN", name: "ml IN Wavenet C",  ssmlGender: "MALE" },
  "g ml wn d":  { languageCode: "ml IN", name: "ml IN Wavenet D",  ssmlGender: "FEMALE" },
  // Marathi
  "g mr std a": { languageCode: "mr IN", name: "mr IN Standard A", ssmlGender: "FEMALE" },
  "g mr std b": { languageCode: "mr IN", name: "mr IN Standard B", ssmlGender: "MALE" },
  "g mr wn a":  { languageCode: "mr IN", name: "mr IN Wavenet A",  ssmlGender: "FEMALE" },
  "g mr wn b":  { languageCode: "mr IN", name: "mr IN Wavenet B",  ssmlGender: "MALE" },
  // Tamil
  "g ta std a": { languageCode: "ta IN", name: "ta IN Standard A", ssmlGender: "FEMALE" },
  "g ta std b": { languageCode: "ta IN", name: "ta IN Standard B", ssmlGender: "MALE" },
  "g ta wn a":  { languageCode: "ta IN", name: "ta IN Wavenet A",  ssmlGender: "FEMALE" },
  "g ta wn b":  { languageCode: "ta IN", name: "ta IN Wavenet B",  ssmlGender: "MALE" },
  // Telugu
  "g te std a": { languageCode: "te IN", name: "te IN Standard A", ssmlGender: "FEMALE" },
  "g te std b": { languageCode: "te IN", name: "te IN Standard B", ssmlGender: "MALE" },
  "g te wn a":  { languageCode: "te IN", name: "te IN Wavenet A",  ssmlGender: "FEMALE" },
  "g te wn b":  { languageCode: "te IN", name: "te IN Wavenet B",  ssmlGender: "MALE" },
  // Punjabi
  "g pa std a": { languageCode: "pa IN", name: "pa IN Standard A", ssmlGender: "FEMALE" },
  "g pa wn a":  { languageCode: "pa IN", name: "pa IN Wavenet A",  ssmlGender: "FEMALE" },
  "g pa wn b":  { languageCode: "pa IN", name: "pa IN Wavenet B",  ssmlGender: "MALE" },
  // Legacy keys
  "hindi male":      { languageCode: "hi IN", name: "hi IN Standard B", ssmlGender: "MALE" },
  "hindi female":    { languageCode: "hi IN", name: "hi IN Standard A", ssmlGender: "FEMALE" },
  "english male":    { languageCode: "en IN", name: "en IN Standard B", ssmlGender: "MALE" },
  "english female":  { languageCode: "en IN", name: "en IN Standard A", ssmlGender: "FEMALE" },
  "hinglish male":   { languageCode: "hi IN", name: "hi IN Standard D", ssmlGender: "MALE" },
  "hinglish female": { languageCode: "hi IN", name: "hi IN Standard C", ssmlGender: "FEMALE" },
};

/* â”€â”€ ElevenLabs TTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function generateWithElevenLabs(text, voiceKey, outputPath) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");

  const voiceId = ELEVENLABS_VOICES[voiceKey] || ELEVENLABS_VOICES["rachel"];

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text to speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi api key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${err}`);
  }

  const buffer = await res.buffer();
  fs.writeFileSync(outputPath, buffer);
  logger.info(`ElevenLabs voiceover saved: ${path.basename(outputPath)}`);
  return outputPath;
}

/* â”€â”€ Google Cloud TTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function generateWithGoogleTTS(text, voiceKey, outputPath) {
  const apiKey = process.env.GOOGLE_TTS_KEY;
  if (!apiKey) throw new Error("GOOGLE_TTS_KEY not configured");

  const voice = GOOGLE_LANGUAGE_MAP[voiceKey] || GOOGLE_LANGUAGE_MAP["g en std a"];

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: voice.languageCode, name: voice.name, ssmlGender: voice.ssmlGender },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: 0.95,
          pitch: 0,
          volumeGainDb: 2.0,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google TTS error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const audioBuffer = Buffer.from(data.audioContent, "base64");
  fs.writeFileSync(outputPath, audioBuffer);
  logger.info(`Google TTS voiceover saved: ${path.basename(outputPath)}`);
  return outputPath;
}

/* â”€â”€ Main voiceover generator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function generateVoiceover(script, voiceKey, outputPath, provider = "elevenlabs") {
  logger.info(`Generating voiceover: voice=${voiceKey}, provider=${provider}, chars=${script.length}`);

  if (provider === "google") {
    try {
      return await generateWithGoogleTTS(script, voiceKey, outputPath);
    } catch (gErr) {
      logger.warn(`Google TTS failed: ${gErr.message}. Falling back to ElevenLabs...`);
      return await generateWithElevenLabs(script, voiceKey, outputPath);
    }
  }

  // Default: ElevenLabs with Google TTS fallback
  try {
    return await generateWithElevenLabs(script, voiceKey, outputPath);
  } catch (elErr) {
    logger.warn(`ElevenLabs failed: ${elErr.message}. Falling back to Google TTS...`);
    try {
      return await generateWithGoogleTTS(script, voiceKey, outputPath);
    } catch (gErr) {
      throw new Error(`Both TTS providers failed. ElevenLabs: ${elErr.message}. Google: ${gErr.message}`);
    }
  }
}

module.exports = { generateVoiceover, ELEVENLABS_VOICES, GOOGLE_LANGUAGE_MAP };
