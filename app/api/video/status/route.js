export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const opName = searchParams.get("op");
    if (!opName) return Response.json({ error: "op parameter required" }, { status: 400 });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${opName}?key=${process.env.GEMINI_API_KEY}`
    );

    if (!res.ok) {
      const errText = await res.text();
      let errMsg = "Status check failed";
      try { errMsg = JSON.parse(errText)?.error?.message || errMsg; } catch {}
      return Response.json({ error: errMsg }, { status: res.status });
    }

    const data = await res.json();

    if (data.done && data.response?.videos?.[0]) {
      const b64 = data.response.videos[0].bytesBase64Encoded;
      return Response.json({ done: true, videoUrl: `data:video/mp4;base64,${b64}` });
    }

    if (data.done && data.error) {
      return Response.json({ done: true, error: data.error.message || "Veo 2 generation failed" });
    }

    return Response.json({ done: false });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
